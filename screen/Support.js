import React, { Component } from "react";
import { Text, StyleSheet, View, Image, Dimensions, Linking, Platform, TouchableOpacity } from "react-native";
import { Entypo, Ionicons, FontAwesome } from "@expo/vector-icons";
import Header from "../component/Header";
import Colors from "../config/colors";
import AppContext from "../context/AppContext";
import { getValueOfSetting } from "../utils/Util";


const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class Support extends Component {
	static contextType = AppContext

	constructor(props) {
		super(props);
	}

	call = () => {
		let number = getValueOfSetting(this.context.settings, 'contact_number')[0].value;
		let call_link = Platform.OS == 'android' ? 'tel:' + number : 'telprompt:' + number;
		Linking.canOpenURL(call_link).then(supported => {
			if (supported) {
				return Linking.openURL(call_link);
			}
		}).catch(error => console.log(error));
	}

	mail = () => {
		let email = getValueOfSetting(this.context.settings, 'contact_email')[0].value;
		let call_link = Platform.OS == 'android' ? 'mailto:' + email : 'mailto:' + email;
		Linking.canOpenURL(call_link).then(supported => {
			if (supported) {
				return Linking.openURL(call_link);
			}
		}).catch(error => console.log(error));
	}

	whatsapp = () => {
		let number = getValueOfSetting(this.context.settings, 'contact_number')[0].value;
		let call_link = `https://api.whatsapp.com/send?phone=${number}`;
		Linking.canOpenURL(call_link).then(supported => {
			if (supported) {
				return Linking.openURL(call_link);
			}
		}).catch(error => console.log(error));
	}


	render() {
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title={"Support"}
				/>
				<View style={styles.section}>
					<View style={styles.card}>
						<Text style={styles.supportText}>
							Support Available 24/7, But sometime wait time can be longer
						</Text>
					</View>
					<Image
						source={require("../assets/support.png")}
						style={{ width: windowwidth, height: windowwidth }}
					/>
					<View style={styles.card}>
						{/* <TouchableOpacity
							onPress={this.whatsapp}
							style={styles.row}>
							<Text style={styles.supportText}>Chat with our Support</Text>
							<FontAwesome name="whatsapp" size={24} color={Colors.primary} />
						</TouchableOpacity> */}
						<TouchableOpacity
							onPress={this.call}
							style={styles.row}>
							<Text style={styles.supportText}>Call Us</Text>
							<Ionicons name="call" size={24} color={Colors.primary} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={this.mail}
							style={styles.row}>
							<Text style={styles.supportText}>Mail Us</Text>
							<Ionicons name="mail" size={24} color={Colors.primary} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	section: {
		padding: 10,
	},
	card: {
		backgroundColor: Colors.white,
		paddingHorizontal: 25,
		paddingVertical: 20,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	supportText: {
		fontWeight: "bold",
		textAlign: "center",
		lineHeight: 25,
		fontSize: 15,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 0.5,
		borderColor: Colors.textInputBorder,
		paddingVertical: 15,
		paddingHorizontal: 5,
	},
});
