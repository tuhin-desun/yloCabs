import React, { useContext } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import {
	Entypo,
	FontAwesome,
	MaterialCommunityIcons,
	AntDesign,
} from "@expo/vector-icons";
import MobileVerificationScreen from "../screen/Mobileverification";
import OtpInputScreen from "../screen/OtpVerification";
import SetupAccountScreen from "../screen/SetupAccount";
import DashboardScreen from "../screen/Dashboard";
import MyRideScreen from "../screen/MyRide";
import RideDetailsScreen from "../screen/RideDetails";
import AccountScreen from "../screen/Account";
import ReferEarnScreen from "../screen/Refer";
import SupportScreen from "../screen/Support";
import SettingScreen from "../screen/Settings";
import ContactList from "../screen/ContactList";
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

	return (
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
			</View>
		</DrawerContentScrollView>
	);
};

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
							component={DashboardScreen}
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
							name="ReferEarn"
							component={ReferEarnScreen}
							options={{
								drawerLabel: ({ focused, color }) => (
									<Text style={{ color, marginLeft: -10 }}>Refer & Earn</Text>
								),
								drawerIcon: ({ focused, color }) => (
									<FontAwesome
										name="share-square-o"
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
						<Drawer.Screen
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
						/>
						<Drawer.Screen
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
						/>
						<Drawer.Screen
							name="About"
							component={DashboardScreen}
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
					</Drawer.Navigator>
				) : (
					<LoginStack />
				)}
			</NavigationContainer>
		);
	}
}

const styles = StyleSheet.create({
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
});
