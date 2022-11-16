import React, { Component } from "react";
import { Text, StyleSheet, View, Image, Dimensions } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Header from "../component/Header";
import Colors from "../config/colors";
const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class Support extends Component {
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
						<View style={styles.row}>
							<Text style={styles.supportText}>Chat with our Support</Text>
							<Entypo name="chat" size={24} color={Colors.primary} />
						</View>
						<View style={styles.row}>
							<Text style={styles.supportText}>Call Us</Text>
							<Ionicons name="call" size={24} color={Colors.primary} />
						</View>
						<View style={styles.row}>
							<Text style={styles.supportText}>Mail Us</Text>
							<Ionicons name="mail" size={24} color={Colors.primary} />
						</View>
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
