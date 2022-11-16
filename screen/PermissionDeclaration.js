import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    Animated,
    ScrollView,
    SafeAreaView,
    Platform,
    BackHandler
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import _ from 'lodash';
import Colors from "../config/colors";
import Configs from "../config/Configs";
import firebase from "../config/firebase";
import { OverlayLoader } from "../component";
import * as Notifications from "expo-notifications";
import { writeDriverData } from "../utils/Util";
import { writeUserDataToFirebase } from '../utils/helper';
import { Ionicons } from '@expo/vector-icons';
import { loginEmail } from "../services/APIServices";
import AppContext from "../context/AppContext";

const windowheight = Dimensions.get("screen").height;
const windowwidth = Dimensions.get("window").width;

export default class MobileVerification extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            coverHeight: new Animated.Value(windowheight),
            formOpacity: new Animated.Value(0),
            welcomeOpacity: new Animated.Value(1),
            captainOpacity: new Animated.Value(0),
            bottonelavation: new Animated.Value(0),
            logoImageSize: new Animated.Value(windowwidth / 2),
            backImageHeight: new Animated.Value(windowheight / 6),
            email: "",
            password: '',
            emailValidationFailed: false,
            passwordValidationFailed: false,
            showLoader: false,
            passwordHidden: true,
            tokenData: '',
        };

        this.recaptchaVerifier = React.createRef();
    }

    componentDidMount() {
        Promise.all([Notifications.getExpoPushTokenAsync({ experienceId: '@ylocab/YloCabDriver' })])
            .then((res) => {
                let tokenData = res[0];
                this.setState({
                    tokenData: tokenData,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    startrAnimation = () => {
        Animated.timing(this.state.coverHeight, {
            toValue: windowheight / 3,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.logoImageSize, {
            toValue: windowwidth / 3,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.backImageHeight, {
            toValue: windowheight / 7,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.welcomeOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.captainOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.formOpacity, {
            delay: 1000,
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.bottonelavation, {
            delay: 1500,
            toValue: 5,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // onChangeEmail = (email) => {
    //     const emailCheck=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    //     if(emailCheck.test(email)){
    //         this.setState({ email });
    //     }else{
    //         alert("Wrong")
    //     }

    // };

    onChangeEmail = (email) => {
        this.setState({ email });
    };

    onChangePassword = (password) => {
        this.setState({ password: password, passwordValidationFailed: false });
    }

    handlePasswordVisibility = () => {
        this.setState({
            passwordHidden: !this.state.passwordHidden
        })
    }

    onPressContinue = _.throttle(
        () => {
            let { email, password, tokenData } = this.state;

            if (password.trim().length < 6) {
                this.setState({
                    passwordValidationFailed: true
                })
            }



            let reqObj = {
                email: email,
                password: password,
                device_token: tokenData.data,
                device_type: Platform.OS,
            };
            this.setState({ showLoader: true });
            loginEmail(reqObj)
                .then((response) => {
                    this.setState({ showLoader: false, })

                    if (response.check == 'Invalid') {
                        errorToast('Error', 'No user found with this email')
                    }

                    if (response.check == 'failure') {
                        errorToast('Error', 'Invalid email/password')
                    }

                    if (response.check === Configs.SUCCESS_TYPE) {
                        let data = response.data;
                        if (data.status === Configs.STATUS_ONBOARDING) {
                            if (data.first_name === null || data.last_name === null || data.owner_name === null || data.vehicle_number == null) {
                                this.props.navigation.navigate("SetupAccount", {
                                    id: data.id,
                                    mobile: data.mobile,
                                    accessToken: data.access_token,
                                });
                            } else {
                                this.props.navigation.navigate("OnboardingStatus", { id: data.id });
                            }
                        } else if (data.status === Configs.STATUS_BANNED) {
                            this.props.navigation.navigate("BannedStatus");
                        } else {
                            writeDriverData(data);
                            writeUserDataToFirebase(data, data.id)
                            this.context.setDriverData(data);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({
                        showLoader: false
                    }, () => { errorToast('Error', 'Sorry! There is some issue try again') })
                });
        },
        2000,
        { 'leading': true, 'trailing': false }
    )

    render = () => {
        const {
            coverHeight,
            formOpacity,
            bottonelavation,
            welcomeOpacity,
            captainOpacity,
            backImageHeight,
            logoImageSize,
        } = this.state;

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <View style={styles.container}>
                    <FirebaseRecaptchaVerifierModal
                        ref={this.recaptchaVerifier}
                        firebaseConfig={firebase.app().options}
                        attemptInvisibleVerification={true}
                    />
                    <Animated.View style={[styles.section, { height: coverHeight }]}>
                        <Animated.View
                            style={[
                                styles.profileImageContainer,
                                {
                                    height: logoImageSize,
                                    width: logoImageSize,
                                },
                            ]}
                        >
                            <Animated.Image
                                source={require("../assets/logo.png")}
                                resizeMode={"cover"}
                                style={{
                                    height: logoImageSize,
                                    width: logoImageSize,
                                }}
                            />
                        </Animated.View>
                        <View style={styles.backImageContainer}>
                            <Animated.Image
                                source={require("../assets/mobile_verification.png")}
                                resizeMode={"cover"}
                                style={{
                                    height: backImageHeight,
                                    width: windowwidth,
                                }}
                            />
                        </View>
                        <Animated.Text
                            style={{
                                opacity: 2,
                                fontSize: 20,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            Ylo Cabs collects location data so that user can get booking from nearest driver, also to track position of the car for user safety when riding and app in use.
                        </Animated.Text>


                        <View style={{ flexDirection: 'row', marginTop: 50, justifyContent: 'space-between', width: '100%', paddingHorizontal: 15 }}>
                            <TouchableOpacity style={{ backgroundColor: '#000', width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 8, borderRadius: 5 }}
                                activeOpacity={0.8}
                                onPress={() => { BackHandler.exitApp() }}
                            >
                                <Text style={{ fontSize: 20, color: '#fff' }}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#000', width: 120, justifyContent: 'center', alignItems: 'center', paddingVertical: 8, borderRadius: 5 }}
                                onPress={() => { this.props.navigation.navigate('MobileVerification') }}
                                activeOpacity={1}
                            >
                                <Text style={{ fontSize: 20, color: '#fff' }}>Accept</Text>
                            </TouchableOpacity>
                        </View>

                    </Animated.View>
                </View>
            </SafeAreaView>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    section: {
        position: "relative",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    heading: {
        fontSize: 36,
        color: Colors.white,
        textAlign: "center",
    },
    inputContainer: {
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        marginVertical: 10,
        paddingVertical: 5,
        width: "100%",
    },
    flagImageStyle: {
        marginHorizontal: 5,
        height: 25,
        width: 25,
        resizeMode: "cover",
        alignItems: "center",
    },
    textInput: {
        borderColor: Colors.textInputBorder,
        marginLeft: 10,
        paddingVertical: 5,
        fontSize: 17,
        width: "100%",
    },
    button: {
        marginTop: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        fontSize: 18,
        textAlign: "center",
    },
    profileImageContainer: {
        position: "absolute",
        top: 20,
        alignItems: "center",
    },
    backImageContainer: {
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        width: windowwidth,
    },
    backImageStyle: {
        height: windowheight / 6,
        width: windowwidth,
    },
    inputError: {
        borderWidth: 1,
        borderColor: Colors.danger,
    },
});
