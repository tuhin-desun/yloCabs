import React, { useState, useContext, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    Modal,
    Alert,
    Image,
    ImageBackground
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import colors from '../config/colors';
var { width, height } = Dimensions.get('window');
import { updateTempBookingDataFirebase } from "../utils/helper";
import AppContext from "../context/AppContext";
import Header from "../component/Header";
import { handlePaymentRequest } from "../services/APIServices";
import ProfilePic from "../assets/profilePic.png";
import backGroundImg from "../assets/bill-bg.png";

export default function PaymentDetails(props) {
    const context = useContext(AppContext);
    const booking = props.route.params.curBooking[0];

    const [promodalVisible, setPromodalVisible] = useState(false);
    const [useWalletCash, setUseWalletCash] = useState(false);

    const [payDetails, setPayDetails] = useState({
        amount: booking.estimate.estimateFare,
        payableAmount: booking.estimate.estimateFare
    });


    useEffect(() => {
        console.log("INCOICE SCREEN", booking.user_avatar)
    }, [])



    const doPayment = (payment_mode) => {
        let curBooking = { ...booking };
        let driverId = context.driverData.id;
        if (payment_mode == 'cash' || payment_mode == 'wallet') {
            curBooking.status = 'PAID';
            curBooking.payment_mode = payment_mode;

            // updateTempBookingDataFirebase(curBooking, driverId);
        }

        if (payment_mode == 'request') {
            curBooking.status = 'PAYMENT_REQUEST';
            curBooking.payment_mode = payment_mode;
            // updateTempBookingDataFirebase(curBooking, driverId);
        }


        handlePaymentRequest(curBooking)
            .then((response) => {
                console.log("Handle Payment request", response)
                if (response.type == "success") {
                    updateTempBookingDataFirebase(curBooking, driverId);
                } else {
                    alert(response.msg);
                }
            })
            .catch((err) => { console.log(err) })

        props.navigation.navigate('DashboardScreen');
    }


    return (
        <View style={styles.mainView}>
            <Header
                leftIconName={"ios-menu-sharp"}
                leftButtonFunc={() => props.navigation.toggleDrawer()}
                title={"INVOICE"}
                rightIconName={"name"}
                walletBalance={context.driverData.wallet}
            />
            <Image source={backGroundImg} resizeMode="cover" />
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 100, zIndex: 9 }}>
                <Image style={{
                    height: 100, width: 100, borderRadius: 50,
                    borderWidth: 2,
                    borderColor: colors.primary
                }} source={booking?.user_avatar ? { uri: booking.user_avatar } : ProfilePic} />
                <Text style={{
                    fontSize: 18,
                    marginTop: 10,
                }}>{booking?.user_name}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollStyle}>

                <View style={{ flex: 1, flexDirection: 'column' }}>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 20, marginBottom: 4 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 45, fontSize: 22, fontWeight: '500' }}>{"Bill Details"}</Text>

                    </View>

                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                        <View style={styles.location}>
                            {booking && booking.trip_start_time ?
                                <View>
                                    <Text style={styles.timeStyle}>{booking.trip_start_time}</Text>
                                </View>
                                : null}
                            {booking && booking.tripdata.pickup ?
                                <View style={styles.address}>
                                    <View style={styles.greenDot} />
                                    <Text style={styles.adressStyle}>{booking.tripdata.pickup.add}</Text>
                                </View>
                                : null}
                        </View>

                        <View style={styles.location}>
                            {booking && booking.trip_end_time ?
                                <View>
                                    <Text style={styles.timeStyle}>{booking.trip_end_time}</Text>
                                </View>
                                : null}
                            {booking && booking.tripdata.drop ?
                                <View style={styles.address}>
                                    <View style={styles.redDot} />
                                    <Text style={styles.adressStyle}>{booking.tripdata.drop.add}</Text>
                                </View>
                                : null}
                        </View>
                    </View>


                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Booking ID"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>
                            {booking && booking?.bookingID}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Distance Travelled"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>
                            {
                                (booking && booking.distance ? Math.round(booking.distance) : '0') + ' ' + "Km"
                            }
                        </Text>
                    </View>


                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Time Taken"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{booking.estimate.estimateTime ? parseFloat(booking.estimate.estimateTime).toFixed(1) > 59 ? `${parseFloat(booking.estimate.estimateTime / 60).toFixed(0)} hour` : `${parseFloat(booking.estimate.estimateTime).toFixed(0)} minutes` : `${0} minutes`}</Text>
                    </View>

                    {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
            <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Base Fare"}</Text>
            <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"₹ "}{booking && booking?.base_fare}</Text>
          </View> */}

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Distance Fare"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"₹ "}{booking && Math.round(booking?.estimate?.fare)}{'.00'}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"CGST (9%)"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"₹ "}{booking && Math.round(booking?.estimate?.cgst)}{'.00'}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"SGST (9%)"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"₹ "}{booking && Math.round(booking?.estimate?.sgst)}{'.00'}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Previous Cancel Charge"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"₹ "}{booking && Math.round(booking?.estimate?.previous_due ?? 0)}{'.00'}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Ylocab Service Charges"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"₹ "}{booking && Math.round(booking?.estimate?.ylocab_Service_charge ?? 0)}{'.00'}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"Waiting Charges"}</Text>
                        <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 35, fontSize: 16 }}>{"₹ "}{booking && Math.round(booking?.estimate?.waiting_charge ?? 0)}{'.00'}</Text>
                    </View>

                </View>
            </ScrollView>


            <View style={{ height: 110 }}>
                <View style={{
                    height: 3,
                    backgroundColor: colors.primary,
                    elevation: 3
                }}>
                </View>




                {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 25, paddingRight: 25 }}>
            <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 45, fontSize: 16 }}>{"Total Fare"}</Text>
            <Text style={{ color: colors.BLACK, textAlign: 'left', lineHeight: 45, fontSize: 16 }}>{ } {parseFloat(payDetails.amount).toFixed(2)}</Text>
          </View> */}




                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ color: colors.BLACK, textAlign: 'left', fontSize: 24, fontWeight: '500' }}>{"Total"}</Text>
                    <Text style={{ color: colors.BLACK, textAlign: 'left', fontSize: 24, fontWeight: 'bold' }}>{"₹ "}{payDetails.payableAmount ? parseFloat(payDetails.payableAmount).toFixed(2) : 0.00}</Text>
                </View>



                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.buttonWrapper, { flex: 1, backgroundColor: colors.black }]}
                        onPress={() => {
                            doPayment('cash');
                        }}>
                        <Text style={styles.buttonTitle}>{"PAY CASH"}</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
            style={styles.cardPayBtn}
            onPress={() => {
              doPayment('request');
            }}>
            <Text style={styles.buttonTitle}>{"Request Payment"}</Text>
          </TouchableOpacity> */}

                </View>
            </View>




        </View>
    );

}

const styles = StyleSheet.create({

    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight 
    },
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },

    scrollStyle: {
        marginTop: 70,
        height: height,
        backgroundColor: colors.WHITE
    },
    container: {
        flex: 1,
        marginTop: 5,
        backgroundColor: 'white',
    },
    buttonContainer: {
        width: '100%',
        //position: 'absolute',
        //bottom: 10
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonWrapper: {
        marginHorizontal: 6,
        //marginBottom: 15,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.default,
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 15

    },
    cardPayBtn: {
        marginHorizontal: 6,
        //marginBottom: 15,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.BLUE.greenish_blue,
        borderRadius: 8,
        marginTop: 10,
        paddingHorizontal: 15

    },
    buttonWrapper2: {
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 10,
        marginTop: 20,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.default,
        borderRadius: 8,
        width: '90%'
    },
    buttonTitle: {
        color: colors.WHITE,
        fontSize: 18,
    },
    newname: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailInputContainer: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingLeft: 10,
        backgroundColor: colors.WHITE,
        paddingRight: 10,
        paddingTop: 10,
        width: width - 80
    },
    errorMessageStyle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    inputTextStyle: {
        color: colors.BLACK,
        fontSize: 16
    },
    pinbuttonStyle: { elevation: 0, bottom: 15, width: '80%', alignSelf: "center", borderRadius: 20, borderColor: "transparent", backgroundColor: colors.GREY.btnPrimary, },
    pinbuttonContainer: { flex: 1, justifyContent: 'center' },
    inputContainer: { flex: 3, justifyContent: "center", marginTop: 40 },
    pinheaderContainer: { height: 250, backgroundColor: colors.WHITE, width: '80%', justifyContent: 'space-evenly' },
    pinheaderStyle: { flex: 1, flexDirection: 'column', backgroundColor: colors.GREY.default, justifyContent: "center" },
    forgotPassText: { textAlign: "center", color: colors.WHITE, fontSize: 20, width: "100%" },
    pinContainer: { flexDirection: "row", justifyContent: "space-between" },
    forgotStyle: { flex: 3, justifyContent: "center", alignItems: 'center' },
    crossIconContainer: { flex: 1, left: '40%' },
    forgot: { flex: 1 },
    pinbuttonTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        width: '100%',
        textAlign: 'center'
    },
    newname2: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    emailInputContainer2: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingLeft: 10,
        backgroundColor: colors.WHITE,
        paddingRight: 10,
        paddingTop: 10,
        width: width - 80,

    },

    inputTextStyle2: {
        color: colors.BLACK,
        fontSize: 14
    },
    buttonStyle2: { elevation: 0, bottom: 15, width: '80%', alignSelf: "center", borderRadius: 20, borderColor: "transparent", backgroundColor: colors.GREY.btnPrimary, },
    buttonContainer2: { flex: 1, justifyContent: 'center', marginTop: 5 },
    inputContainer2: { flex: 4, paddingBottom: 25 },
    headerContainer2: { height: 380, backgroundColor: colors.WHITE, width: '80%', justifyContent: 'center' },
    headerStyle2: { flex: 1, flexDirection: 'column', backgroundColor: colors.GREY.default, justifyContent: "center" },
    forgotPassText2: { textAlign: "center", color: colors.WHITE, fontSize: 16, width: "100%" },
    forgotContainer2: { flexDirection: "row", justifyContent: "space-between" },
    forgotStyle2: { flex: 3, justifyContent: "center" },
    crossIconContainer2: { flex: 1, left: '40%' },
    forgot2: { flex: 1 },
    buttonTitle2: {
        fontWeight: 'bold',
        fontSize: 16,
        width: '100%',
        textAlign: 'center'
    },

    containercvv: {
        flex: 1,
        width: "100%",
        height: "80%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingTop: 120
    },
    modalContainercvv: {
        height: 200,
        backgroundColor: colors.WHITE,
        width: "80%",
        borderRadius: 10,
        elevation: 15
    },
    crossIconContainercvv: {
        flex: 1,
        left: "40%"
    },
    blankViewStylecvv: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'flex-end',
        marginTop: 15,
        marginRight: 15
    },
    blankViewStyleOTP: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'flex-end',

    },
    modalHeaderStylecvv: {
        textAlign: "center",
        fontSize: 20,
        paddingTop: 10
    },
    modalContainerViewStylecvv: {
        flex: 9,
        alignItems: "center",
        justifyContent: "center"
    },
    itemsViewStylecvv: {
        flexDirection: "column",
        // justifyContent: "space-between"
    },
    textStylecvv: {
        fontSize: 20
    },
    inputcvv: {
        fontSize: 20,
        marginBottom: 20,
        borderColor: colors.GREY.Smoke_Grey,
        borderWidth: 1,
        borderRadius: 8,
        width: "80%",
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 10,
        paddingLeft: 10,
        textAlign: 'center'
    },
    location: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 6
    },
    timeStyle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        marginTop: 1
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    address: {
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 0,
        marginLeft: 6
    },
    adressStyle: {
        marginLeft: 6,
        fontSize: 15,
        lineHeight: 20
    },
});