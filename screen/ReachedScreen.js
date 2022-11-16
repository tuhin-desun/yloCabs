import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
    Platform,
    Modal,
    TouchableWithoutFeedback,
    Linking,
    Alert,
    Share
} from 'react-native';
import { TouchableOpacity as OldTouch } from 'react-native';
import { Icon, Button, Header } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import RadioForm from 'react-native-simple-radio-button';
import colors from '../config/colors';
var { width, height } = Dimensions.get('window');
import carImageIcon from '../assets/microYllowCar.png';
import moment from 'moment';
import { tempBooking, getTravelDistanceandTime } from "../utils/helper";
import AppContext from "../context/AppContext";
import { cancelBooking } from "../services/APIServices";
import firebase from "../config/firebase";

export default function ReachedScreen(props) {
    const context = useContext(AppContext);
    const bookingId = props.route.params.curBooking.bookingId;
    const latitudeDelta = 0.0922;
    const longitudeDelta = 0.0421;

    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [curBooking, setCurBooking] = useState(props.route.params.curBooking);
    const [cancelReasonSelected, setCancelReasonSelected] = useState(0);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [liveRouteCoords, setLiveRouteCoords] = useState(null);
    const [driverLat, setDriverLat] = useState(null);
    const [driverLong, setDriverLong] = useState(curBooking.tripdata.drop.lng);
    const mapRef = useRef();
    const pageActive = useRef(false);
    const [lastCoords, setlastCoords] = useState();
    const [arrivalTime, setArrivalTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reachDistance, setReachDistance] = useState(0);
    const [reachTime, setReachTime] = useState(0);
    const [purchaseInfoModalStatus, setPurchaseInfoModalStatus] = useState(false);
    const [userInfoModalStatus, setUserInfoModalStatus] = useState(false);
    const cancelReasons = context.cancelReasons;

    // useEffect(() => {
    //     //Point 1 will be driver last location
    //     let point2 = { lat: curBooking.tripdata.pickup.lat, lng: curBooking.tripdata.pickup.lng };
    //     let point1 = { lat: driverLat, lng: driverLong };
    //     fitMap(point1, point2);
    // }, [driverLat.length > 0]);

    const fitMap = (point1, point2) => {
        let startLoc = '"' + point1.lat + ',' + point1.lng + '"';
        let destLoc = '"' + point2.lat + ',' + point2.lng + '"';
        setTimeout(() => {
            mapRef.current.fitToCoordinates([{ latitude: point1.lat, longitude: point1.lng }, { latitude: point2.lat, longitude: point2.lng }], {
                edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                animated: true,
            })
        }, 1000)
    }

    useEffect(() => {
        let isSubscribed = true
        if (isSubscribed) {
            getDriverUpdatedLocation();
        }
        return () => isSubscribed = false
    }, [])


    useEffect(() => {
        let point2 = { lat: curBooking.tripdata.pickup.lat, lng: curBooking.tripdata.pickup.lng };
        let point1 = { lat: driverLat, lng: driverLong };
        if (driverLat) {
            fitMap(point1, point2);
            getTravelDistanceandTime(point1, point2)
                .then((response) => {
                    console.log(response.rows[0].elements[0].distance, point1, point2)
                    setReachDistance(response.rows[0].elements[0].distance.text.split(' '));
                    setReachTime(response.rows[0].elements[0].duration.text.split(' '));
                })
                .catch((err) => { console.log(err) })
        }
    }, [driverLat])

    const getDriverUpdatedLocation = () => {
        firebase.database().ref('Location/' + context.currentDriver).on('value', function (snapshot) {
            console.log("snapshot.val()", snapshot.val())
            const { latitude, longitude } = snapshot.val();
            setDriverLat(latitude);
            setDriverLong(longitude);
        });
    }

    const cancelCabs = () => {
        setModalVisible(true)
    }

    const cancelCab = () => {
        setLoading(true)
        setModalVisible(false)
        let booking = { ...curBooking };
        booking.status = 'CANCELLED';
        booking.cancelReason = cancelReasonSelected;
        cancelBooking(booking)
            .then((response) => {
                console.log(response)
                setLoading(false)
                if (response.type == "success") {
                    tempBooking(booking, context.currentDriver);
                } else {
                    alert(response.msg);
                }
            })
    }

    const toggleDrawer = () => props.navigation.toggleDrawer();


    const renderButtons = () => {
        return (
            <View style={{ flex: 1.5, flexDirection: 'row' }}>
                {curBooking.status == 'ACCEPTED' ? (
                    <View style={{ flex: 1 }}>
                        <Button
                            title={"Cancel Ride"}
                            loading={loading}
                            loadingProps={{ size: "large", color: colors.BLUE.secondary }}
                            titleStyle={{ color: colors.WHITE, fontWeight: 'bold' }}
                            onPress={cancelCabs}
                            buttonStyle={{ height: '100%', backgroundColor: colors.BLACK }}
                            containerStyle={{ height: '100%' }}
                        />
                    </View>
                ) : null}

            </View>
        );
    }



    //ride cancel confirm modal design
    const alertModal = () => {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={alertModalVisible}
                onRequestClose={() => {
                    setAlertModalVisible(false);
                }}>
                <View style={styles.alertModalContainer}>
                    <View style={styles.alertModalInnerContainer}>

                        <View style={styles.alertContainer}>

                            <Text style={styles.rideCancelText}>{"Cancel"}</Text>

                            <View style={styles.horizontalLLine} />

                            <View style={styles.msgContainer}>
                                <Text style={styles.cancelMsgText}>{"Cancel Message 1"}  {bookingId} {"Cancel Message 2"} </Text>
                            </View>
                            <View style={styles.okButtonContainer}>
                                <Button
                                    title={"Ok"}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => {
                                        setAlertModalVisible(false);
                                        props.navigation.popToTop();
                                    }}
                                    buttonStyle={styles.okButtonStyle}
                                    containerStyle={styles.okButtonContainerStyle}
                                />
                            </View>

                        </View>

                    </View>
                </View>

            </Modal>
        )
    }

    //caacel modal design
    const cancelModal = () => {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={styles.cancelModalContainer}>
                    <View style={styles.cancelModalInnerContainer}>

                        <View style={styles.cancelContainer}>
                            <View style={styles.cancelReasonContainer}>
                                <Text style={styles.cancelReasonText}>{"Select why you want to cancel"}</Text>
                            </View>

                            <View style={styles.radioContainer}>
                                <RadioForm
                                    radio_props={cancelReasons}
                                    initial={0}
                                    animation={false}
                                    buttonColor={colors.GREY.secondary}
                                    selectedButtonColor={colors.GREY.secondary}
                                    buttonSize={10}
                                    buttonOuterSize={20}
                                    style={styles.radioContainerStyle}
                                    labelStyle={styles.radioText}
                                    radioStyle={styles.radioStyle}
                                    onPress={(value) => { setCancelReasonSelected(value) }}
                                />
                            </View>
                            <View style={styles.cancelModalButtosContainer}>
                                <Button
                                    title={"Don't Cancel"}
                                    titleStyle={styles.signInTextStyle}
                                    onPress={() => { setModalVisible(false) }}
                                    buttonStyle={styles.cancelModalButttonStyle}
                                    containerStyle={styles.cancelModalButtonContainerStyle}
                                />

                                {/* <View style={styles.buttonSeparataor} /> */}

                                <Button
                                    title={"Cancel Ride"}
                                    titleStyle={[styles.signInTextStyle, { color: colors.white }]}
                                    onPress={cancelCab}
                                    buttonStyle={[styles.cancelModalButttonStyle, { backgroundColor: colors.BLACK }]}
                                    containerStyle={styles.cancelModalButtonContainerStyle}
                                />
                            </View>

                        </View>


                    </View>
                </View>

            </Modal>
        )
    }



    const chat = () => {
        props.navigation.navigate("onlineChat", { bookingId: bookingId })
    }

    const onPressCall = (phoneNumber) => {
        let call_link = Platform.OS == 'android' ? 'tel:' + phoneNumber : 'telprompt:' + phoneNumber;
        Linking.canOpenURL(call_link).then(supported => {
            if (supported) {
                return Linking.openURL(call_link);
            }
        }).catch(error => console.log(error));
    }


    const PurchaseInfoModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={purchaseInfoModalStatus}
                onRequestClose={() => {
                    setPurchaseInfoModalStatus(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading}>{"Parcel Type"}</Text>
                            <Text style={styles.textContent}>
                                {curBooking && curBooking.parcelTypeSelected ? curBooking.parcelTypeSelected.description : ''}
                            </Text>
                        </View>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading}>{'Options'}</Text>
                            <Text style={styles.textContent}>
                                {curBooking && curBooking.optionSelected ? curBooking.optionSelected.description : ''}
                            </Text>
                        </View>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading}>{'Delivery Person'}</Text>
                            <Text style={styles.textContent}>
                                {curBooking ? curBooking.deliveryPerson : ''}
                            </Text>
                        </View>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading}>{"Delivery Person Phone"}</Text>
                            <Text style={styles.textContent}>
                                {curBooking ? curBooking.deliveryPersonPhone : ''}
                            </Text>
                        </View>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading}>{"Pickup Instructions"}</Text>
                            <Text style={styles.textContent}>
                                {curBooking ? curBooking.pickUpInstructions : ''}
                            </Text>
                        </View>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading}>{"Delivery Instructions"}</Text>
                            <Text style={styles.textContent}>
                                {curBooking ? curBooking.deliveryInstructions : ''}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', height: 40 }}>
                            <OldTouch
                                loading={false}
                                onPress={() => setPurchaseInfoModalStatus(false)}
                                style={styles.modalButtonStyle}
                            >
                                <Text style={styles.modalButtonTextStyle}>{"Ok"}</Text>
                            </OldTouch>
                        </View>
                    </View>
                </View>
            </Modal>

        )
    }




    const UserInfoModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={userInfoModalStatus}
                onRequestClose={() => {
                    setUserInfoModalStatus(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading1}>{"Delivery Persons Phone"}</Text>
                            <Text style={styles.textContent1} onPress={() => onPressCall(curBooking.deliveryPersonPhone)}>
                                <Icon
                                    name="ios-call"
                                    type="ionicon"
                                    size={15}
                                    color={colors.BLUE.secondary}
                                />
                                {curBooking ? curBooking.deliveryPersonPhone : ''}
                            </Text>
                        </View>
                        <View style={styles.textContainerStyle}>
                            <Text style={styles.textHeading1}>{"Sender Phone"}</Text>

                            <Text style={styles.textContent1} onPress={() => onPressCall(curBooking.customer_contact)}>
                                <Icon
                                    name="ios-call"
                                    type="ionicon"
                                    size={15}
                                    color={colors.BLUE.secondary}
                                />
                                {curBooking ? curBooking.customer_contact : ''}
                            </Text>


                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', height: 40 }}>
                            <OldTouch
                                loading={false}
                                onPress={() => setUserInfoModalStatus(false)}
                                style={styles.modalButtonStyle}
                            >
                                <Text style={styles.modalButtonTextStyle}>{"Ok"}</Text>
                            </OldTouch>
                        </View>
                    </View>
                </View>
            </Modal>

        )
    }

    const onShare = async (curBooking) => {
        try {
            const result = await Share.share({
                message: curBooking.OTP + " is your OTP please share with driver"
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <View style={styles.mainContainer}>
            {/* //Header */}
            <Header
                leftComponent={{
                    icon: 'menu',
                    color: colors.black,
                    onPress: toggleDrawer,
                }}
                backgroundColor={colors.primary}
                centerComponent={<Text style={styles.headerTitleStyle}>{"Active Booking"}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.headerInnerStyle}
            />
            <View style={styles.banner}>
                <View style={styles.leftSection}>
                    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>{`${reachTime[0]}`}</Text>
                    <Text style={{ color: colors.white, fontSize: 12 }}>{`${reachTime[1]}`}</Text>
                </View>
                <View style={styles.rightSection}>
                    <Text style={{ color: colors.BLACK, fontWeight: 'bold', fontSize: 16 }}>{`${reachDistance[0]}`}</Text>
                    <Text style={{ color: colors.BLACK, fontSize: 12 }}>{`${reachDistance[1]}`}</Text>
                </View>
            </View>

            <View style={styles.mapcontainer}>
                {curBooking && driverLat ?
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: curBooking.tripdata.pickup.lat,
                            longitude: curBooking.tripdata.pickup.lng,
                            latitudeDelta: latitudeDelta,
                            longitudeDelta: longitudeDelta
                        }}
                    >
                        {curBooking.status == 'ACCEPTED' ? (
                            <Marker.Animated
                                coordinate={new AnimatedRegion({
                                    latitude: driverLat,
                                    longitude: driverLong,
                                    latitudeDelta: latitudeDelta,
                                    longitudeDelta: longitudeDelta
                                })}
                            >
                                <Image
                                    source={carImageIcon}
                                    style={{ height: 40, width: 40 }}
                                />
                            </Marker.Animated>
                        ) : null}

                        <Marker
                            coordinate={{ latitude: (curBooking.tripdata.pickup.lat), longitude: (curBooking.tripdata.pickup.lng) }}
                            title={curBooking.tripdata.pickup.add}
                        />


                    </MapView>
                    : null}
                {/* <TouchableOpacity
                    style={[styles.floatButton, { bottom: 80 }]}
                    onPress={() => alert("Chat Pressed")}
                >
                    <Icon
                        name="ios-chatbubbles"
                        type="ionicon"
                        size={30}
                        color={colors.WHITE}
                    />
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={[styles.floatButton, { bottom: 10 }]}
                    onPress={() => onPressCall(curBooking.driver_contact)}
                >
                    <Icon
                        name="ios-call"
                        type="ionicon"
                        size={30}
                        color={colors.WHITE}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>

                <View style={styles.otpContainer}>
                    <Text style={styles.cabText}>{"Booking Status"}: <Text style={styles.cabBoldText}>{curBooking && curBooking.status ? curBooking.status : null} </Text></Text>
                    {/* <View style={{ flexDirection: 'row', padding: 1 }}>
                        <Text style={styles.otpText}>{curBooking ? "OTP : " + " " + curBooking.OTP : null}</Text>
                        <View style={{ alignSelf: 'center', marginRight: 3 }}>
                            <TouchableOpacity onPress={() => onShare(curBooking)}>
                                <Icon
                                    name="share-social-outline"
                                    type="ionicon"
                                    size={22}
                                    color={colors.BLUE.secondary} />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </View>
                <View style={styles.cabDetailsContainer}>
                    {curBooking && curBooking.status != "SEARCHING" ?
                        <View style={styles.cabDetails}>
                            <View style={styles.cabName}>
                                <Text style={styles.cabNameText}>{curBooking.car_type}</Text>
                            </View>

                            <View style={styles.cabPhoto}>
                                <Image source={curBooking.carImage ? { uri: curBooking.carImage } : require('../assets/microBlackCar.png')} resizeMode={'contain'} style={styles.cabImage} />
                            </View>

                            <View style={styles.cabNumber}>
                                <Text style={styles.cabNumberText}>{curBooking.vehicle_number}</Text>
                            </View>

                        </View>
                        : null}
                    {curBooking && curBooking.status != "SEARCHING" ?
                        <View style={styles.verticalDesign}>
                            <View style={styles.triangle} />
                            <View style={styles.verticalLine} />
                        </View>
                        : null}
                    {curBooking && curBooking.status != "SEARCHING" ?
                        <View style={styles.driverDetails}>
                            <View style={styles.driverPhotoContainer}>
                                <Image source={curBooking.driver_image ? { uri: curBooking.driver_image } : require('../assets/profilePic.png')} style={styles.driverPhoto} />
                            </View>
                            <View style={styles.driverNameContainer}>
                                <Text style={styles.driverNameText}>{curBooking.driver_name}</Text>
                            </View>
                            <View style={styles.ratingContainer}>

                            </View>

                        </View>
                        : null}
                </View>
                {
                    renderButtons()
                }
            </View>
            {
                PurchaseInfoModal()
            }
            {
                UserInfoModal()
            }
            {
                cancelModal()
            }
            {
                alertModal()
            }
        </View>
    );

}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.WHITE, },
    headerStyle: {
        backgroundColor: colors.primary,
        borderBottomWidth: 0,
    },
    headerInnerStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    headerTitleStyle: {
        color: colors.black,
        fontFamily: 'Roboto-Bold',
        fontSize: 18
    },
    topContainer: { flex: 1.5, flexDirection: 'row', borderTopWidth: 0, alignItems: 'center', backgroundColor: colors.GREY.default, paddingEnd: 20 },
    topLeftContainer: {
        flex: 1.5,
        alignItems: 'center'
    },
    topRightContainer: {
        flex: 9.5,
        justifyContent: 'space-between',
    },
    circle: {
        height: 15,
        width: 15,
        borderRadius: 15 / 2,
        backgroundColor: colors.GREEN.default
    },
    staightLine: {
        height: height / 25,
        width: 1,
        backgroundColor: colors.primary
    },
    square: {
        height: 17,
        width: 17,
        backgroundColor: colors.primary
    },
    whereButton: { flex: 1, justifyContent: 'center', borderBottomColor: colors.WHITE, borderBottomWidth: 1 },
    whereContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    whereText: { flex: 9, fontFamily: 'Roboto-Regular', fontSize: 14, fontWeight: '400', color: colors.WHITE },
    iconContainer: { flex: 1 },
    dropButton: { flex: 1, justifyContent: 'center' },
    mapcontainer: {
        flex: 7,
        width: width
    },
    bottomContainer: { flex: 2.5, alignItems: 'center' },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    otpContainer: { flex: 0.8, backgroundColor: colors.YELLOW.secondary, width: width, flexDirection: 'row', justifyContent: 'space-between' },
    cabText: { paddingLeft: 10, alignSelf: 'center', color: colors.BLACK, fontFamily: 'Roboto-Regular' },
    cabBoldText: { fontFamily: 'Roboto-Bold' },
    otpText: { alignSelf: 'center', color: colors.BLACK, fontFamily: 'Roboto-Bold' },
    cabDetailsContainer: { flex: 2.5, backgroundColor: colors.WHITE, flexDirection: 'row', position: 'relative', zIndex: 1 },
    cabDetails: { flex: 19 },
    cabName: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    cabNameText: { color: colors.GREY.btnPrimary, fontFamily: 'Roboto-Bold', fontSize: 13 },
    cabPhoto: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cabImage: { width: 60, height: height / 20, marginBottom: 5, marginTop: 5 },
    cabNumber: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    cabNumberText: { color: colors.GREY.iconSecondary, fontFamily: 'Roboto-Bold', fontSize: 13 },
    verticalDesign: { flex: 2, height: 50, width: 1, alignItems: 'center' },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: colors.TRANSPARENT,
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 10,
        borderLeftColor: colors.TRANSPARENT,
        borderRightColor: colors.TRANSPARENT,
        borderBottomColor: colors.YELLOW.secondary,
        transform: [
            { rotate: '180deg' }
        ],

        marginTop: -1,
        overflow: 'visible'
    },
    verticalLine: { height: height / 18, width: 0.5, backgroundColor: colors.BLACK, alignItems: 'center', marginTop: 10 },
    driverDetails: { flex: 19, alignItems: 'center', justifyContent: 'center' },
    driverPhotoContainer: { flex: 5.4, justifyContent: 'flex-end', alignItems: 'center' },
    driverPhoto: { borderRadius: height / 20 / 2, width: height / 20, height: height / 20 },
    driverNameContainer: { flex: 2.2, alignItems: 'center', justifyContent: 'center' },
    driverNameText: { color: colors.GREY.btnPrimary, fontFamily: 'Roboto-Bold', fontSize: 14 },
    ratingContainer: { flex: 2.4, alignItems: 'center', justifyContent: 'center' },
    ratingContainerStyle: { marginTop: 2, paddingBottom: Platform.OS == 'android' ? 5 : 0 },

    //alert modal
    alertModalContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.GREY.background },
    alertModalInnerContainer: { height: 200, width: (width * 0.85), backgroundColor: colors.WHITE, alignItems: 'center', alignSelf: 'center', borderRadius: 7 },
    alertContainer: { flex: 2, justifyContent: 'space-between', width: (width - 100) },
    rideCancelText: { flex: 1, top: 15, color: colors.BLACK, fontFamily: 'Roboto-Bold', fontSize: 20, alignSelf: 'center' },
    horizontalLLine: { width: (width - 110), height: 0.5, backgroundColor: colors.BLACK, alignSelf: 'center', },
    msgContainer: { flex: 2.5, alignItems: 'center', justifyContent: 'center' },
    cancelMsgText: { color: colors.BLACK, fontFamily: 'Roboto-Regular', fontSize: 15, alignSelf: 'center', textAlign: 'center' },
    okButtonContainer: { flex: 1, width: (width * 0.85), flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center' },
    okButtonStyle: { flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignItems: 'center', justifyContent: 'center' },
    okButtonContainerStyle: { flex: 1, width: (width * 0.85), backgroundColor: colors.GREY.iconSecondary, },

    //cancel modal
    cancelModalContainer: { flex: 1, justifyContent: 'center', backgroundColor: colors.GREY.background },
    cancelModalInnerContainer: { height: 400, width: width * 0.85, padding: 0, backgroundColor: colors.WHITE, alignItems: 'center', alignSelf: 'center', borderRadius: 7 },
    cancelContainer: { flex: 1, justifyContent: 'space-between', width: (width * 0.85) },
    cancelReasonContainer: { flex: 1 },
    cancelReasonText: { top: 10, color: colors.BLACK, fontFamily: 'Roboto-Bold', fontSize: 20, alignSelf: 'center' },
    radioContainer: { flex: 8, alignItems: 'center' },
    radioText: { fontSize: 16, fontFamily: 'Roboto-Medium', color: colors.DARK, },
    radioContainerStyle: { paddingTop: 30, marginLeft: 10 },
    radioStyle: { paddingBottom: 25 },
    cancelModalButtosContainer: { flex: 1, flexDirection: 'row', backgroundColor: colors.GREY.iconSecondary, alignItems: 'center', justifyContent: 'center' },
    buttonSeparataor: { height: height / 35, width: 0.5, backgroundColor: colors.WHITE, alignItems: 'center', marginTop: 3 },
    cancelModalButttonStyle: { backgroundColor: colors.primary, borderRadius: 0 },
    cancelModalButtonContainerStyle: { flex: 1, width: (width * 2) / 2, backgroundColor: colors.GREY.iconSecondary, alignSelf: 'center', margin: 0 },
    signInTextStyle: {
        fontFamily: 'Roboto-Bold',
        fontWeight: "700",
        color: colors.BLACK
    },
    floatButton: {
        borderWidth: 1,
        borderColor: colors.BLACK,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        position: "absolute",
        right: 10,
        height: 60,
        backgroundColor: colors.BLACK,
        borderRadius: 30
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(22,22,22,0.8)"
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textContainerStyle: {
        flexDirection: 'column',
        alignItems: "flex-start",
        marginBottom: 12
    },
    textHeading: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    textHeading1: {
        fontSize: 20,
        color: colors.BLACK
    },
    textContent: {
        fontSize: 14,
        margin: 4
    },
    textContent1: {
        fontSize: 20,
        color: colors.BLUE.primary,
        padding: 5
    },
    modalButtonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY.btnPrimary,
        width: 100,
        height: 40,
        elevation: 0,
        borderRadius: 10
    },
    modalButtonTextStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 18
    },
    banner: {
        height: 50,
        width: 100,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 80,
        zIndex: 9999,
        left: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        flexDirection: 'row',
        elevation: 5
    },
    leftSection: {
        width: "40%",
        height: "100%",
        backgroundColor: colors.BLACK,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightSection: {
        width: "60%",
        height: "100%",
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
});