import React, { Component } from "react";
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	ToastAndroid,
	Modal,
	Pressable,
	Share,
} from "react-native";
import { Clipboard } from "react-native";
import Header from "../component/Header";
import Colors from "../config/colors";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default class Refer extends Component {
	state = {
		modalVisible: false,
	};
	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};
	copyToClipboard = () => {
		Clipboard.setString("hello world");
		ToastAndroid.show("Code copied.", ToastAndroid.SHORT);
	};
	onShare = async () => {
		try {
			const result = await Share.share({
				message:
					"React Native | A framework for building native apps using React",
			});

			// if (result.action === Share.sharedAction) {
			// 	if (result.activityType) {
			// 		// shared with activity type of result.activityType
			// 	} else {
			// 		// shared
			// 	}
			// } else if (result.action === Share.dismissedAction) {
			// 	// dismissed
			// }
		} catch (error) {
			alert(error.message);
		}
	};
	render() {
		const { modalVisible } = this.state;
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"arrow-back"}
					leftButtonFunc={() => this.props.navigation.goBack()}
				/>
				<View style={styles.topSection}>
					<Text style={styles.heading}>Invite Your friends to YLO</Text>
					<Pressable onPress={() => this.setModalVisible(true)}>
						<Text style={styles.subtitle}>Know More</Text>
					</Pressable>
				</View>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						//Alert.alert("Modal has been closed.");
						this.setModalVisible(!modalVisible);
					}}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View
								style={{
									backgroundColor: Colors.primary,
									borderTopLeftRadius: 10,
									borderTopRightRadius: 10,
									alignItems: "center",
									paddingVertical: 15,
								}}
							>
								<Text style={styles.modalHeadText}>
									Here's how to invite and earn
								</Text>
							</View>
							<View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
								<View style={styles.pointRow}>
									<FontAwesome
										name="hand-o-right"
										size={20}
										color={Colors.primary}
									/>
									<Text style={styles.modalText}>
										Lorem Ipsum is simply dummy text of the printing and
										typesetting industry. Lorem Ipsum has been the industry's
										standard dummy text ever since the 1500s,
									</Text>
								</View>
								<View style={styles.pointRow}>
									<FontAwesome
										name="hand-o-right"
										size={20}
										color={Colors.primary}
									/>
									<Text style={styles.modalText}>
										Lorem Ipsum is simply dummy text of the printing and
										typesetting industry. Lorem Ipsum has been the industry's
										standard dummy text ever since the 1500s,
									</Text>
								</View>
								<Pressable
									style={[styles.button, styles.buttonClose]}
									onPress={() => this.setModalVisible(!modalVisible)}
								>
									<Text style={styles.buttonText}>Got it</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
				<View style={styles.section}>
					<Text
						style={{
							fontWeight: "bold",
							paddingTop: 10,
							paddingBottom: 5,
							paddingHorizontal: 10,
							fontSize: 16,
						}}
					>
						Your Invites
					</Text>
					<View style={styles.distance}>
						<View style={styles.distanceColumn1}>
							<Text style={styles.title}>₹ 0</Text>
							<Text style={styles.subtitle}>EARNED</Text>
						</View>
						<View style={styles.distanceColumn2}>
							<Text style={styles.title}>₹ 0</Text>
							<Text style={styles.subtitle}>PENDING</Text>
						</View>
					</View>
					<View
						style={{ position: "absolute", bottom: 0, left: 10, right: 10 }}
					>
						<View style={styles.share}>
							<Text style={styles.subtitle}>Your referal code</Text>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={styles.code}>01ANG9U</Text>
								<MaterialIcons
									name="content-copy"
									size={20}
									color="black"
									onPress={this.copyToClipboard}
								/>
							</View>
						</View>
						<TouchableOpacity
							activeOpacity={0.7}
							style={styles.button}
							onPress={this.onShare}
						>
							<Text style={styles.buttonText}>SHARE CODE</Text>
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
	topSection: {
		backgroundColor: Colors.primary,
		paddingVertical: 15,
		paddingHorizontal: 15,
	},
	heading: {
		fontSize: 18,
		fontWeight: "bold",
		paddingBottom: 8,
	},
	subtitle: {
		color: Colors.medium,
	},
	section: {
		flex: 1,
		padding: 15,
		position: "relative",
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
		fontSize: 18,
		fontWeight: "bold",
	},
	share: {
		backgroundColor: Colors.lightGrey,
		paddingHorizontal: 10,
		paddingVertical: 15,
		borderWidth: 2,
		borderRadius: 5,
		borderStyle: "dashed",
		borderColor: Colors.grey,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	code: {
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 5,
	},
	button: {
		paddingHorizontal: 10,
		paddingVertical: 12,
		backgroundColor: Colors.primary,
		borderRadius: 5,
		marginVertical: 20,
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
	},
	centeredView: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0,0,0,0.5)",
		//alignItems: "flex-end",
		// marginTop: 22,
	},
	modalView: {
		//marginHorizontal: 20,
		backgroundColor: "white",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		//paddingHorizontal: 35,
		//alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalHeadText: {
		fontWeight: "bold",
		fontSize: 16,
	},
	modalText: {
		textAlign: "justify",
		width: "85%",
		marginLeft: 10,
		color: Colors.medium,
		lineHeight: 23,
	},
	pointRow: {
		flexDirection: "row",
		marginTop: 10,
		alignItems: "flex-start",
		//borderWidth: 1,
	},
});
