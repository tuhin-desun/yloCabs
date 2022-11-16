import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	Dimensions,
	Animated,
	TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { OverlayLoader } from "../component";
import { setupAccount } from "../services/APIServices";
import { writeUserData, isEmail } from "../utils/Util";
import AppContext from "../context/AppContext";

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;

export default class SetupAccount extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
			firstName:
				typeof props.route.params !== "undefined"
					? props.route.params.first_name
					: "",
			lastName:
				typeof props.route.params !== "undefined"
					? props.route.params.last_name
					: "",
			email:
				typeof props.route.params !== "undefined"
					? props.route.params.email
					: "",
			userData:
				typeof props.route.params !== "undefined"
					? props.route.params.userData
					: null,
			showLoader: false,
			firstNameValidationFailed: false,
			lastNameValidationFailed: false,
			emailValidationFailed: false,
		};
	}

	saveData = () => {
		this.setState(
			{
				firstNameValidationFailed: false,
				lastNameValidationFailed: false,
				emailValidationFailed: false,
			},
			() => {
				let { firstName, lastName, email, userData } = this.state;
				if (firstName.trim().length === 0) {
					this.setState({ firstNameValidationFailed: true });
					return false;
				} else if (lastName.trim().length === 0) {
					this.setState({ lastNameValidationFailed: true });
					return false;
				} else if (email.trim().length > 0 && !isEmail(email)) {
					this.setState({ emailValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let reqObj = {
						id: this.state.id,
						first_name: firstName,
						last_name: lastName,
						email: email,
					};

					setupAccount(userData.access_token, reqObj)
						.then((response) => {
							if (response.check === Configs.SUCCESS_TYPE) {
								userData.first_name = firstName;
								userData.last_name = lastName;
								userData.email = email.trim().length > 0 ? email : null;

								this.setState(
									{
										showLoader: false,
									},
									() => {
										writeUserData(userData);
										this.context.setUserData(userData);
									}
								);
							} else {
								alert(response.message);
							}
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	render = () => (
		<View style={styles.container}>
			<View style={styles.section}>
				<Text style={styles.title}>Setup your YLO account</Text>
				<Text style={styles.subTitle}>
					Your name helps drivers identify you.
				</Text>
				<Text style={styles.subTitle}>
					An email address lets us share trip receipts.
				</Text>
				<View style={styles.form}>
					<TextInput
						value={this.state.firstName}
						placeholder="First Name"
						autoCapitalize="words"
						autoCompleteType="off"
						onChangeText={(firstName) => this.setState({ firstName })}
						style={[
							styles.textInput,
							this.state.firstNameValidationFailed ? styles.inputError : null,
						]}
					/>
					<TextInput
						value={this.state.lastName}
						placeholder="Last Name"
						autoCapitalize="words"
						autoCompleteType="off"
						onChangeText={(lastName) => this.setState({ lastName })}
						style={[
							styles.textInput,
							this.state.lastNameValidationFailed ? styles.inputError : null,
						]}
					/>
					<TextInput
						value={this.state.email}
						placeholder="Email (Optional)"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCompleteType="off"
						onChangeText={(email) => this.setState({ email })}
						style={[
							styles.textInput,
							this.state.emailValidationFailed ? styles.inputError : null,
						]}
					/>
					<TouchableOpacity
						activeOpacity={1}
						onPress={this.saveData}
						style={styles.nextButton}
					>
						<Text style={styles.nextButtonText}>Next</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.backImageContainer}>
				<Animated.Image
					source={require("../assets/mobile_verification.png")}
					resizeMode={"cover"}
					style={{
						height: windowwidth / 3,
						width: windowwidth,
					}}
				/>
			</View>
			<OverlayLoader visible={this.state.showLoader} />
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		height: windowheight + Constants.statusBarHeight,
		width: windowwidth,
	},
	section: {
		paddingTop: 60,
		paddingHorizontal: 25,
		height: windowheight,
	},
	title: {
		paddingTop: 30,
		color: "#000",
		fontSize: 25,
		fontWeight: "600",
		paddingBottom: 10,
	},
	subTitle: {
		lineHeight: 18,
	},
	form: {
		marginVertical: 40,
	},
	textInput: {
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		marginVertical: 10,
		paddingTop: 10,
		paddingHorizontal: 10,
	},
	inputError: {
		borderBottomWidth: 1,
		borderColor: Colors.danger,
	},
	nextButton: {
		marginTop: 30,
		borderRadius: 10,
		height: 45,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
		minWidth: 300,
		marginBottom: 100,
	},
	nextButtonText: {
		textAlign: "center",
		fontSize: 20,
		color: "#fff",
	},
	backImageContainer: {
		position: "absolute",
		bottom: 0,
		alignItems: "center",
		width: windowwidth,
	},
});
