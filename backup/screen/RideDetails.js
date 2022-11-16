import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Colors from "../config/colors";
import Header from "../component/Header";
import { StatusBar } from "expo-status-bar";
const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;
export default class RideDetails extends React.Component {
	render = () => {
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"arrow-back"}
					leftButtonFunc={() => this.props.navigation.goBack()}
					title={"Fri Mar 12,08:27 PM"}
					subTitle={"YLO08596325"}
				/>

				<ScrollView>
					<View>
						<Image
							source={require("../assets/map-details.jpg")}
							resizeMode="cover"
							style={{ height: windowheight / 5, width: windowwidth }}
						/>
					</View>

					<View style={styles.section}>
						<View style={styles.driverDetails}>
							<View style={styles.profileImageContainer}>
								<Image
									source={require("../assets/driver.jpg")}
									style={styles.ImageStyle}
									resizeMode={"contain"}
								/>
							</View>
							<View>
								<Text style={styles.name}>John Doe</Text>
								<View style={styles.starRow}>
									<Text style={styles.title}>You Rated </Text>
									<AntDesign name="star" size={14} color={Colors.primary} />
									<AntDesign name="star" size={14} color={Colors.primary} />
									<AntDesign name="star" size={14} color={Colors.primary} />
									<AntDesign name="star" size={14} color={Colors.primary} />
									<AntDesign name="star" size={14} color={Colors.light} />
								</View>
							</View>
						</View>
						<View style={styles.row}>
							<View style={styles.ImageContainer}>
								<Image
									source={require("../assets/taxi.png")}
									style={styles.ImageStyle}
									resizeMode={"contain"}
								/>
							</View>
							<Text style={styles.name}>Mini</Text>
							<Text style={{ color: "#ddd", marginHorizontal: 5 }}>|</Text>
							<Text style={styles.name}>Suzuki Dzire</Text>
						</View>
						<View style={styles.row}>
							<View style={styles.ImageContainer}>
								<Image
									source={require("../assets/cash.png")}
									style={styles.ImageStyle}
									resizeMode={"contain"}
								/>
							</View>
							<Text style={styles.name}>₹ 105.00</Text>
						</View>

						<View
							style={{
								paddingVertical: 15,
								paddingHorizontal: 10,
							}}
						>
							<View style={styles.location}>
								<View style={styles.mapMarker}>
									<FontAwesome name="map-marker" size={15} color="green" />
								</View>
								<View style={styles.address}>
									<Text
										style={styles.addressText}
										ellipsizeMode="tail"
										numberOfLines={2}
									>
										C/6, Birnagar,Kolkata, Maidandd, Esplaned, West Bengal
										700050, India,
									</Text>
								</View>
							</View>
							<View style={styles.timeline}>
								<Text style={styles.timelineItem}>{"."}</Text>
								<Text style={styles.timelineItem}>{"."}</Text>
								<Text style={styles.timelineItem}>{"."}</Text>
								<Text style={styles.timelineItem}>{"."}</Text>
								<Text style={styles.timelineItem}>{"."}</Text>
							</View>
							<View style={styles.location}>
								<View style={styles.mapMarker}>
									<FontAwesome name="map-marker" size={15} color="#d9534f" />
								</View>
								<View style={styles.address}>
									<Text
										style={styles.addressText}
										ellipsizeMode="tail"
										numberOfLines={2}
									>
										Esplaned Bus Stop, Maidan, Esplaned, Kolkata, West Bengal
										700050, India
									</Text>
								</View>
							</View>
						</View>
						<View style={styles.distance}>
							<View style={styles.distanceColumn1}>
								<Text style={styles.caption}>54 km</Text>
								<Text style={styles.title}>DISTANCE</Text>
							</View>
							<View style={styles.distanceColumn2}>
								<Text style={styles.caption}>50:0 mins</Text>
								<Text style={styles.title}>DURATION</Text>
							</View>
						</View>
						<View style={styles.billCard}>
							<View style={styles.billHeading}>
								<Text style={styles.name}>Bill Details</Text>
							</View>
							<View style={styles.billSec}>
								<Text>Your Trip</Text>
								<Text>₹ 105.41</Text>
							</View>
							<View style={styles.billSec}>
								<Text>Rounded Off</Text>
								<Text>-₹ 0.41</Text>
							</View>
							<View style={styles.billFoot}>
								<View>
									<Text style={styles.name}>Total Bill</Text>
									<Text style={styles.title}>Includes ₹ 16.91 Taxes</Text>
								</View>
								<Text style={styles.name}>₹ 105</Text>
							</View>

							<View style={styles.billHeading}>
								<Text style={styles.name}>Payment</Text>
							</View>
							<View style={styles.billFoot}>
								<Text style={styles.name}>Cash</Text>
								<Text style={styles.name}>₹ 105</Text>
							</View>
							<TouchableOpacity activeOpacity={0.7} style={styles.button}>
								<Text style={styles.buttonText}>DOWNLOAD INVOICE</Text>
							</TouchableOpacity>
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
	},

	section: {
		paddingHorizontal: 20,
	},
	row: {
		flexDirection: "row",
		//marginVertical: 10,
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		paddingVertical: 15,
	},
	profileImageContainer: {
		backgroundColor: Colors.background,
		//borderWidth:1,
		overflow: "hidden",
		height: 70,
		width: 70,
		borderRadius: 70 / 2,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	driverDetails: {
		alignItems: "center",
		flexDirection: "row",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		// borderTopWidth: 0.5
	},
	ImageContainer: {
		marginRight: 10,
		alignItems: "center",
		justifyContent: "center",
		// borderWidth: 1
	},
	ImageStyle: {
		height: 70,
		width: 70,
		borderRadius: 60 / 2,
	},
	starRow: {
		flexDirection: "row",
		paddingTop: 5,
	},
	addressText: {
		// borderWidth: 1,
		fontSize: 13,
		color: "#243224",
	},
	timeline: {
		width: "10%",
		alignItems: "center",
		// borderWidth: 1
	},
	timelineItem: {
		fontSize: 8,
		lineHeight: 5,
		fontWeight: "bold",
	},
	location: {
		flexDirection: "row",
		alignItems: "center",
		//borderWidth: 1,
		//marginHorizontal: 10
	},
	mapMarker: {
		width: "10%",
		alignItems: "center",
		paddingVertical: 5,
		//borderWidth: 1
	},
	address: {
		width: "90%",
	},
	distance: {
		flexDirection: "row",
		marginHorizontal: 10,
		paddingHorizontal: 10,
		marginVertical: 10,
		paddingVertical: 15,
		borderRadius: 5,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	distanceColumn1: {
		borderRightWidth: 0.5,
		borderColor: Colors.textInputBorder,
		width: "50%",
		alignItems: "center",
	},
	distanceColumn2: {
		borderLeftWidth: 0.5,
		borderColor: Colors.textInputBorder,
		width: "50%",
		alignItems: "center",
	},
	title: {
		color: Colors.medium,
		fontSize: 13,
		//paddingVertical: 5
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
	},
	caption: {
		fontSize: 13,
	},
	billCard: {
		borderTopWidth: 5,
		borderRadius: 5,
		borderColor: Colors.primary,
		marginVertical: 10,
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	billHeading: {
		marginVertical: 5,
	},
	billSec: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	billFoot: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 15,
		// borderRadius: 10
	},
	comment: {
		fontSize: 13,
	},
	button: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: Colors.primary,
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
	},
});
