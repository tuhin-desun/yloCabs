import React, { useContext } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity, Linking, Platform, Share } from "react-native";
import {
	Entypo,
	FontAwesome,
	MaterialCommunityIcons,
	AntDesign,
	MaterialIcons,
	Feather,
	Ionicons
} from "@expo/vector-icons";
import MobileVerificationScreen from "../screen/Mobileverification";
import OtpInputScreen from "../screen/OtpVerification";
import SetupAccountScreen from "../screen/SetupAccount";
import NewDashboardScreen from "../screen/NewDashboard";
import MyRideScreen from "../screen/MyRide";
import RideDetailsScreen from "../screen/RideDetails";
import AccountScreen from "../screen/Account";
import SupportScreen from "../screen/Support";
import SettingScreen from "../screen/Settings";
import ContactList from "../screen/ContactList";
import BookedCabScreen from "../screen/BookedCabScreen";
import ReachedScreen from "../screen/ReachedScreen";
import About from "../screen/About";
import PrivacyPolicy from "../screen/PrivacyPolicy";
import { NavigationContainer } from "@react-navigation/native";
import {
	createStackNavigator,
	CardStyleInterpolators,
} from "@react-navigation/stack";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import MenuButton from "../component/MenuButton";
import AppContext from "../context/AppContext";
import PaymentDetails from "../screen/PaymentDetails";
import Payment from "../screen/Payment";
import firebase from "../config/firebase";
import PermissionDeclaration from "../screen/PermissionDeclaration";
import { removeUserData, getValueOfSetting } from "../utils/Util";
import Notification from "../screen/Notification";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const LoginStack = () => (
	<Stack.Navigator
		initialRouteName="MobileVerification"
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		{/* <Stack.Screen
			name="PermissionDeclaration"
			component={PermissionDeclaration}
		/> */}
		<Stack.Screen
			name="MobileVerification"
			component={MobileVerificationScreen}
		/>
		<Stack.Screen name="OtpInput" component={OtpInputScreen} />
		<Stack.Screen name="SetupAccount" component={SetupAccountScreen} />
	</Stack.Navigator>
);

const RideStack = () => (
	<Stack.Navigator
		initialRouteName="MyRide"
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		<Stack.Screen name="MyRide" component={MyRideScreen} />
		<Stack.Screen name="RideDetails" component={RideDetailsScreen} />
	</Stack.Navigator>
);

SettingsStack = () => (
	<Stack.Navigator
		initialRouteName="Settings"
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		<Stack.Screen name="Settings" component={SettingScreen} />
		<Stack.Screen name="ContactList" component={ContactList} />
	</Stack.Navigator>
);

const CustomDrawerContent = (props) => {
	const context = useContext(AppContext);
	const userData = context.userData;

	const shareApp = async () => {
		let url = getValueOfSetting(context.settings, 'f_u_url')[0].value;
		try {
			const result = await Share.share({
				message: "Download the app from playstore " + url
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

	const logout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				removeUserData();
				context.unsetUserData();
			})
			.catch((error) => console.log(error));
	};

	const call = () => {
		let call_link = Platform.OS == 'android' ? 'tel:' + 100 : 'telprompt:' + 100;
		Linking.canOpenURL(call_link).then(supported => {
			if (supported) {
				return Linking.openURL(call_link);
			}
		}).catch(error => console.log(error));
	}

	return (
		<View style={styles.container}>
			<DrawerContentScrollView {...props}>
				<View style={styles.drawerContent}>
					<View style={{ marginTop: -5, backgroundColor: Colors.primary }}>
						<View style={styles.userInfoSection}>
							<View style={styles.userImage}>
								<Image
									source={
										userData && userData.picture !== null
											? { uri: userData.picture }
											: require("../assets/deafult-profile-img.png")
									}
									style={{ height: 70, width: 70, borderRadius: 70 / 2 }}
									resizeMode={"cover"}
								/>
							</View>
							<View style={{ width: "68%" }}>
								<Text style={styles.title}>
									{userData !== null
										? userData.first_name + " " + userData.last_name
										: null}
								</Text>
								<Text style={styles.caption}>
									{userData !== null
										? "Mobile: " +
										Configs.PHONE_NUMBER_COUNTRY_CODE +
										userData.mobile
										: null}
								</Text>
							</View>
						</View>
					</View>
					<DrawerItemList {...props} />
					<TouchableOpacity
						style={[styles.logout, { borderTopWidth: 0, paddingHorizontal: 22, paddingVertical: 10 }]}
						onPress={shareApp}
					>
						<FontAwesome
							name="share-square-o"
							size={20}
							color={"#000"}
						/>
						<Text style={{ marginLeft: 15 }}>Refer</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.logout, { borderTopWidth: 0, paddingHorizontal: 22 }]}
						onPress={call}
					>
						<Feather name="phone-call" size={20} color="black" />
						<Text style={{ marginLeft: 15 }}>Emergency</Text>
					</TouchableOpacity>
				</View>
			</DrawerContentScrollView>
			<TouchableOpacity
				style={styles.logout}
				onPress={logout}
			>
				<MaterialIcons name="logout" size={24} color="black" />
				<Text style={{ marginLeft: 15 }}>Logout</Text>
			</TouchableOpacity>
		</View>

	);
};


const DashboardStack = () => {
	return (<Stack.Navigator
		initialRouteName="Dashboard"
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		<Stack.Screen name="Dashboard" component={NewDashboardScreen} />
		<Stack.Screen name="ReachedScreen" component={ReachedScreen} />
		<Stack.Screen name="BookedCab" component={BookedCabScreen} />
		<Stack.Screen name="PaymentDetails" component={PaymentDetails} />
		<Stack.Screen name="Payment" component={Payment} />
	</Stack.Navigator>)
}

export default class Navigation extends React.Component {
	static contextType = AppContext;

	render() {
		return (
			<NavigationContainer>
				{this.context.userData !== null ? (
					<Drawer.Navigator
						drawerContentOptions={{
							inactiveTintColor: Colors.black,
							activeTintColor: Colors.primary,
							activeBackgroundColor: Colors.white,
							itemStyle: { marginVertical: 5 },
						}}
						drawerContent={(props) => <CustomDrawerContent {...props} />}
					>
						<Drawer.Screen
							name="Dashboard"
							component={DashboardStack}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										{focused ? "Book Your Ride" : "Book Your Ride"}
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<Entypo
										name="home"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/>
						<Drawer.Screen
							name="MyRide"
							component={RideStack}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										My Ride
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<MaterialCommunityIcons
										name="map-marker-distance"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
								headerLeft: () => {
									return <MenuButton />;
								},
							}}
						/>
						<Drawer.Screen
							name="MyProfile"
							component={AccountScreen}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										My Profile
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<FontAwesome
										name="user-o"
										size={24}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/>

						<Drawer.Screen
							name="Notification"
							component={Notification}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text style={{ color, marginLeft: -10 }}>Notification</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<Ionicons
										name="notifications"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/>
						<Drawer.Screen
							name="Support"
							component={SupportScreen}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										Support
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<AntDesign
										name="customerservice"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/>
						{/* <Drawer.Screen
							name="JoinYlo"
							component={DashboardScreen}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										Join YLO
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<Entypo
										name="link"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/> */}
						{/* <Drawer.Screen
							name="Settings"
							component={SettingsStack}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										Settings
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<AntDesign
										name="setting"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/> */}
						<Drawer.Screen
							name="About"
							component={About}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										About
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<AntDesign
										name="questioncircleo"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/>
						<Drawer.Screen
							name="Privacy"
							component={PrivacyPolicy}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text
										style={[
											{ color, marginLeft: -10 },
											focused ? { fontWeight: "bold" } : null,
										]}
									>
										Privacy Policy
									</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<MaterialIcons
										name="privacy-tip"
										size={20}
										color={focused ? Colors.primary : "#000"}
									/>
								),
							}}
						/>
					</Drawer.Navigator>
				) : (
					<LoginStack />
				)}
			</NavigationContainer>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingHorizontal: 10,
		marginVertical: 20,
		flexDirection: "row",
	},
	userImage: {
		overflow: "hidden",
		height: 70,
		width: 70,
		borderRadius: 70 / 2,
		borderWidth: 2,
		borderColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 10,
	},
	caption: {
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 10,
	},
	logout: {
		paddingHorizontal: 25,
		paddingVertical: 20,
		flexDirection: "row",
		borderColor: "#f4f4f4",
		borderTopWidth: 1,
	},
});
