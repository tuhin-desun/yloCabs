import React, { Component } from 'react';
import { Button, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import RNPgReactNativeSdk from 'react-native-pg-react-native-sdk';
import styles from '../App.style';
import { startPayment } from '../WEBCHECKOUT';
import AppContext from '../context/AppContext';
import { tempBooking } from "../utils/helper";
import { Header } from "../component";
import { handlePaymentRequest } from "../services/APIServices";


const WEB = 'WEB';
const UPI = 'UPI';
const BASE_RESPONSE_TEXT = 'Please wait...';
const HEADER_TEXT = 'Don\'t close this page';

const apiKey = '12507327dab59a6312c7632b72370521'; // put your apiKey here
const apiSecret = '5d098510d96dba5016accb1eaee093efba728bae'; // put your apiSecret here

const env = 'TEST'; // use 'TEST or 'PROD'

export default class Payment extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);


        this.state = {
            responseText: BASE_RESPONSE_TEXT,
            upiAppArray: [],
            orderData: [],
            headerText: HEADER_TEXT,
            tryAgain: false,
        };
    }

    componentDidMount() {
        this.setState({
            orderData: this.context.bookingData
        }, () => {
            this._startCheckout(WEB, null);
        })
        // console.log("Context Text", this.context)
        // this._startCheckout(WEB, null);
    }

    changeResponseText = (message) => {
        this.setState({
            responseText: message,
        });
    };

    changeUPIArray = (array) => {
        this.setState({
            upiAppArray: array,
        });
    };

    getFormattedIcon(appName, icon, id) {
        return (
            <TouchableOpacity
                key={id}
                style={styles.round_icon_buttons}
                onPress={() => this._startCheckout(UPI, id)}>
                <Image style={styles.upi_image} source={{ uri: icon }} />
                <Text style={styles.upi_icons_text}> {appName} </Text>
            </TouchableOpacity>
        );
    }

    setApps(obj) {
        let array = [];
        obj.forEach(function (item) {
            console.log(item.id);
            let iconString = item.icon;
            let icon = RNPgReactNativeSdk.getIconString(iconString);
            let button = this.getFormattedIcon(item.displayName, icon, item.id);
            array.push(button);
        }, this);
        this.changeUPIArray(array);
    }

    _getApps() {
        RNPgReactNativeSdk.getUPIApps()
            .then((result) => {
                let obj = JSON.parse(result);
                this.setApps(obj);
            })
            .catch((error) => {
                this.changeUPIArray([
                    <Text key="no_upi_error" style={styles.upi_app_not_found}>
                        {' '}
                        {error.message}{' '}
                    </Text>,
                ]);
            });
    }

    async _createOrderWithToken() {
        let orderId;
        let tokenUrl;

        const { bookingID, user_mobile, user_name, estimate } = this.state.orderData;

        if (env === 'TEST') {
            tokenUrl = 'https://test.cashfree.com/api/v2/cftoken/order'; //for TEST
        } else {
            tokenUrl = 'https://api.cashfree.com/api/v2/cftoken/order'; //for PROD
        }

        orderId = bookingID;
        let orderApiMap = {
            orderId: orderId,
            orderAmount: estimate.estimateFare.toString(),
            orderCurrency: 'INR',
        };

        const postParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': apiKey,
                'x-client-secret': apiSecret,
            },
            body: JSON.stringify(orderApiMap),
        };
        return new Promise((resolve, reject) => {
            let cfToken;
            fetch(tokenUrl, postParams)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    // console.log("data" + data);
                    if (data.status === 'ERROR') {
                        console.log(
                            `Error (code: ${data.subCode}, message: ${data.message})`,
                        );
                        console.log(
                            'Please check the apiKey and apiSecret credentials and the environment',
                        );
                        return;
                    }
                    try {
                        cfToken = data.cftoken;
                        //console.log('Token is : ' + data.cftoken);
                        // console.log('data is : ' + JSON.stringify(data));
                        let map = {
                            orderId: orderId,
                            orderAmount: estimate.estimateFare.toString(),
                            tokenData: cfToken,
                            orderCurrency: 'INR',
                            customerName: user_name,
                            customerPhone: user_mobile,
                        };
                        return resolve(map);
                    } catch (error) {
                        console.log('THE ERROR IS ' + data);
                        return reject(data);
                    }
                });
        });
    }

    validateCreds() {
        if (apiKey.includes('app id here')) {
            console.log('please set the apiKey variable');
        }
        if (apiSecret.includes('app secret here')) {
            console.log('please set the apiSecret variable');
        }
    }

    async _startCheckout(mode, appId) {
        this.validateCreds();
        console.log('_startCheckout invoked ' + mode + '  ' + appId);

        let responseHandler = (result) => {
            this.changeResponseText(result);

            try {
                let output = '';
                let response = JSON.parse(result);

                //Handle cancel state
                if (response.txStatus == "CANCELLED") {
                    this.state.orderData.status = "PAYMENT_CANCELLED_USER";
                    tempBooking(this.state.orderData, 95);
                    this.changeResponseText("Transaction is cancelled.");
                    this.setState({
                        headerText: "You can close this page"
                    })
                }

                //Handle Success State
                if (response.txStatus == "SUCCESS") {
                    this.state.orderData.status = "PAID";
                    // tempBooking(this.state.orderData, 95);
                    let obj = {
                        "orderData": this.state.orderData,
                        "transaction": response
                    }
                    this.changeResponseText("Please wait we are processing your transaction..");
                    this.setState({
                        headerText: "Don\'t close this page"
                    })
                    handlePaymentRequest(obj)
                        .then((response) => {
                            if (response.type == 'success') {
                                this.changeResponseText("Your transaction is successfull");
                                this.setState({
                                    headerText: "You can close this page"
                                })
                            } else {
                                this.changeResponseText("Sorry but the transaction is failed. If amount is deducted from your account. Please contact us with booking id #" + this.state.orderData.bookingID);
                                this.setState({
                                    headerText: "You can close this page"
                                })
                            }
                        })
                        .catch((err) => { console.log(err) })
                }

                //Handle Failed state
                if (response.txStatus == "FAILED") {
                    this.changeResponseText("Your transaction is failed");
                    this.setState({
                        tryAgain: true,
                        headerText: "You can close this page"
                    })
                }


            } catch (error) {
                //
            }
        };

        try {
            this.changeResponseText(BASE_RESPONSE_TEXT);
            let map = await this._createOrderWithToken();
            startPayment(apiKey, map, mode, appId, env, responseHandler);
        } catch (error) {
            this.changeResponseText(error);
        }
    }



    navigate = () => {
        this.props.navigation.navigate('Dashboard');
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    leftIconName={"ios-menu-sharp"}
                    leftButtonFunc={this.navigate}
                    leftIconType="Entype"
                    title={this.state.headerText}
                />
                <View style={styles.body}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <View style={styles.upi_icon_containers}>{this.state.upiAppArray}</View>
                    <Text style={styles.response_text}> {this.state.responseText} </Text>
                    {this.state.tryAgain ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this._startCheckout.bind(this)}
                        >
                            <Text>Retry</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    }
}