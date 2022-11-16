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
} from "react-native";
import Constants from "expo-constants";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import firebase from "../config/firebase";
import { OverlayLoader } from "../component";
import { isMobile } from "../utils/Util";
import { sendOTP } from "../services/APIServices";
import _ from 'lodash';

const windowheight = Dimensions.get("screen").height;
const windowwidth = Dimensions.get("window").width;

export default class MobileVerification extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			coverHeight: new Animated.Value(windowheight),
			formOpacity: new Animated.Value(0),
			welcomeOpacity: new Animated.Value(1),
			bottonelavation: new Animated.Value(0),
			logoImageSize: new Animated.Value(windowwidth / 2),
			backImageHeight: new Animated.Value(windowheight / 6),
			phoneNumber: "",
			phoneNumberValidationFailed: false,
			showLoader: false,
		};

		this.recaptchaVerifier = React.createRef();
	}

	componentDidMount() {
		setTimeout(() => {
			this.startrAnimation();
		}, 500);
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

	onChangePhone = (number) => {
		this.setState({
			phoneNumber: number,
		});
	};

	onPressContinue = () => {
		let { phoneNumber } = this.state;
		if (isMobile(phoneNumber)) {
			this.setState({ showLoader: true });

			sendOTP({ mobile: phoneNumber })
				.then((res) => {
					this.setState(
						{
							showLoader: false,
						},
						() => {
							this.props.navigation.navigate("OtpInput", {
								phoneNumber: this.state.phoneNumber,
								// verificationToken: token,
								otp: res.body,
							});
						}
					);
				})
				.catch((error) => console.log(error));
		} else {
			this.setState({ phoneNumberValidationFailed: true });
			return false;
		}
	};

	render = () => {
		const {
			coverHeight,
			formOpacity,
			bottonelavation,
			welcomeOpacity,
			backImageHeight,
			logoImageSize,
		} = this.state;
		return (
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
							opacity: welcomeOpacity,
							fontSize: 30,
							fontWeight: "bold",
							textAlign: "center",
						}}
					>
						Welcome to YLO Cab
					</Animated.Text>
				</Animated.View>
				<View
					style={{
						backgroundColor: Colors.white,
						flex: 1,
						padding: 25,
					}}
				>
					<Animated.View style={{ opacity: formOpacity }}>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "bold",
								marginBottom: 10,
							}}
						>
							What is your phone number?
						</Text>
						<Text
							style={{
								fontSize: 12,
								marginBottom: 10,
							}}
						>
							We'll text a code to verify your number
						</Text>
					</Animated.View>
					<Animated.View style={{ opacity: formOpacity }}>
						<View
							style={[
								styles.inputContainer,
								this.state.phoneNumberValidationFailed
									? styles.inputError
									: null,
							]}
						>
							<Image
								source={require("../assets/india-flag-icon-15.jpg")}
								style={styles.flagImageStyle}
							/>
							<Text style={{ fontSize: 17 }}>
								{Configs.PHONE_NUMBER_COUNTRY_CODE}
							</Text>
							<TextInput
								placeholder="Phone Number"
								keyboardType="numeric"
								autoCompleteType="off"
								maxLength={10}
								style={styles.textInput}
								value={this.state.phoneNumber}
								onChangeText={this.onChangePhone}
							/>
						</View>
						<TouchableOpacity
							activeOpacity={0.7}
							style={[styles.button, { elevation: bottonelavation }]}
							onPress={this.onPressContinue}
						>
							<Text style={styles.buttonText}>CONTINUE</Text>
						</TouchableOpacity>
					</Animated.View>
				</View>
				<OverlayLoader visible={this.state.showLoader} />
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	section: {
		position: "relative",
		paddingTop: Constants.statusBarHeight + 20,
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
		flexDirection: "row",
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
		borderLeftWidth: 1,
		borderColor: Colors.textInputBorder,
		marginLeft: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		fontSize: 17,
		width: "78%",
	},
	button: {
		marginTop: 30,
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
