import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	Dimensions,
	ScrollView,
	Modal,
	Pressable,
	TextInput,
	Animated,
} from "react-native";
import {
	AntDesign,
	FontAwesome,
	Entypo,
	MaterialIcons,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import Colors from "../config/colors";
import RadioButton from "../component/RadioButton";
import DatePicker from "../component/DatePicker";
import * as ImagePicker from "expo-image-picker";
//import Animated from 'react-native-reanimated';
import BottomSheet from "reanimated-bottom-sheet";
import Header from "../component/Header";
const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class Account extends React.Component {
	state = {};
	_menu = null;

	setMenuRef = (ref) => {
		this._menu = ref;
	};

	hideMenu = () => {
		this._menu.hide();
	};

	showMenu = () => {
		this._menu.show();
	};
	render = () => {
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title="Settings"
				/>
				<ScrollView>
					<View style={styles.section}>
						<View style={styles.detailsSection}>
							<View style={styles.iconContainer}>
								<MaterialIcons name="privacy-tip" size={24} color="black" />
							</View>
							<View style={styles.name}>
								<Text style={styles.title}>Emergency Contacts</Text>
							</View>

							<Pressable
								style={styles.iconContainer}
								onPress={() => this.props.navigation.navigate("ContactList")}
							>
								<AntDesign name="plus" size={24} color="black" />
							</Pressable>
						</View>
						<View
							style={{
								//borderWidth: 1,
								flexDirection: "row",
								alignItems: "center",
								paddingHorizontal: 15,
								paddingVertical: 10,
								borderBottomWidth: 1,
								borderColor: Colors.textInputBorder,
							}}
						>
							<View style={styles.contactCircle}>
								<Text>S</Text>
							</View>
							<View style={{ marginLeft: 10, width: "70%" }}>
								<Text>John Doe</Text>
								<Text>+919832098320</Text>
							</View>
							<Menu
								ref={this.setMenuRef}
								button={
									<MaterialCommunityIcons
										name="dots-vertical"
										size={22}
										color="black"
										onPress={this.showMenu}
									/>
								}
							>
								<MenuItem onPress={this.hideMenu}>Delete</MenuItem>
							</Menu>
						</View>
						<View style={{ marginTop: 25 }}>
							<Text style={{ fontWeight: "bold", fontSize: 17 }}>
								Favourite
							</Text>
						</View>
						<View style={styles.detailsSection}>
							<View style={styles.iconContainer}>
								<Entypo name="home" size={24} color="black" />
							</View>
							<View style={styles.name}>
								<Text style={styles.title}>Home</Text>
								<Text style={styles.lable}>Add Favourite Place</Text>
							</View>
						</View>
						<View style={styles.detailsSection}>
							<View style={styles.iconContainer}>
								<MaterialCommunityIcons
									name="briefcase"
									size={24}
									color="black"
								/>
							</View>
							<View style={styles.name}>
								<Text style={styles.title}>Work</Text>
								<Text style={styles.lable}>Add Favourite Place</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		position: "relative",
	},
	section: {
		paddingHorizontal: 20,
		// paddingVertical: 10,
	},
	detailsSection: {
		paddingVertical: 18,
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	iconContainer: {
		backgroundColor: Colors.primary,
		overflow: "hidden",
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	name: {
		marginLeft: 15,
		width: "60%",
	},

	title: {
		fontSize: 15,
		fontWeight: "bold",
	},
	lable: {
		color: Colors.medium,
	},
	contactCircle: {
		backgroundColor: Colors.darkgrey,
		overflow: "hidden",
		height: 40,
		width: 40,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
	},
});
