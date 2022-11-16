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
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import BottomSheet from "reanimated-bottom-sheet";
import {
	Header,
	DatePicker,
	OverlayLoader,
	ProfileSkeleton,
} from "../component";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import firebase from "../config/firebase";
import {
	getFileData,
	writeUserData,
	removeUserData,
	getFormattedDate,
	isEmail,
} from "../utils/Util";
import {
	getUserProfile,
	setProfileImage,
	updateProfile,
} from "../services/APIServices";
import AppContext from "../context/AppContext";

const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class Account extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			mobile: "",
			gender: null,
			dob: null,
			memberSince: "",
			modalVisible: false,
			isDatePickerVisible: false,
			opacity: new Animated.Value(0),
			isOpen: false,
			isLoading: true,
			showLoader: false,
			firstNameValidationFailed: false,
			lastNameValidationFailed: false,
			emailValidationFailed: false,
			genderValidationFailed: false,
			dobValidationFailed: false,
		};

		this.bs = React.createRef();
	}

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener(
			"focus",
			this.onScreenFocus
		);
	}

	onScreenFocus = () => {
		this.setState(
			{
				isLoading: true,
			},
			() => {
				this.loadProfileData();
			}
		);
	};

	componentWillUnmount = () => {
		this.focusListener();
	};

	loadProfileData = () => {
		let { userData } = this.context;
		getUserProfile(userData.id)
			.then((response) => {
				let data = response.data;
				this.setState({
					isLoading: false,
					firstName: data.first_name,
					lastName: data.last_name,
					email: data.email,
					mobile: data.mobile,
					gender: data.gender,
					dob: data.dob !== null ? new Date(data.dob) : null,
					memberSince: data.member_since,
				});
			})
			.catch((error) => console.log(error));
	};

	toggleEditModal = () =>
		this.setState({ modalVisible: !this.state.modalVisible });

	setGender = (value) => this.setState({ gender: value });

	showDatepicker = () => {
		this.setState({ isDatePickerVisible: true });
	};

	onChangeDate = (event, selectedDate) => {
		const currentDate = selectedDate || this.state.dob;
		this.setState({
			isDatePickerVisible: false,
			dob: currentDate,
		});
	};

	openImagePickerAsync = () => {
		this.onClose();
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				let options = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.5,
				};

				ImagePicker.launchImageLibraryAsync(options).then((result) => {
					if (!result.cancelled) {
						this.setState({ showLoader: true });

						let { userData } = this.context;
						let reqObj = {
							id: userData.id,
							profile_image: getFileData(result),
						};

						setProfileImage(reqObj)
							.then((response) => {
								if (response.check === Configs.SUCCESS_TYPE) {
									let data = response.data;
									this.setState(
										{
											showLoader: false,
										},
										() => {
											userData.picture = data.uri;
											writeUserData(userData);
											this.context.setUserData(userData);
										}
									);
								} else {
									console.log(response);
									this.setState({ showLoader: false });
								}
							})
							.catch((error) => {
								console.log(error);
								this.setState({ showLoader: false });
							});
					}
				});
			} else {
				alert("Please allow permission to choose an image");
			}
		});
	};

	openCameraAsync = () => {
		this.onClose();
		ImagePicker.requestCameraPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					image: undefined,
					imageData: undefined,
				});

				let options = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.5,
				};

				ImagePicker.launchCameraAsync(options).then((result) => {
					if (!result.cancelled) {
						this.setState({ showLoader: true });

						let { userData } = this.context;
						let reqObj = {
							id: userData.id,
							profile_image: getFileData(result),
						};

						setProfileImage(reqObj)
							.then((response) => {
								if (response.check === Configs.SUCCESS_TYPE) {
									let data = response.data;
									this.setState(
										{
											showLoader: false,
										},
										() => {
											userData.picture = data.uri;
											writeUserData(userData);
											this.context.setUserData(userData);
										}
									);
								} else {
									console.log(response);
									this.setState({ showLoader: false });
								}
							})
							.catch((error) => {
								console.log(error);
								this.setState({ showLoader: false });
							});
					}
				});
			} else {
				alert("Please allow permission to take photo");
			}
		});
	};

	saveData = () => {
		this.setState(
			{
				firstNameValidationFailed: false,
				lastNameValidationFailed: false,
				emailValidationFailed: false,
				genderValidationFailed: false,
				dobValidationFailed: false,
			},
			() => {
				let { firstName, lastName, email, gender, dob } = this.state;
				if (firstName.trim().length === 0) {
					this.setState({ firstNameValidationFailed: true });
					return false;
				} else if (lastName.trim().length === 0) {
					this.setState({ lastNameValidationFailed: true });
					return false;
				} else if (email.trim().length === 0 || !isEmail(email)) {
					this.setState({ emailValidationFailed: true });
					return false;
				} else if (gender === null) {
					this.setState({ genderValidationFailed: true });
					return false;
				} else if (dob === null) {
					this.setState({ dobValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let { userData } = this.context;
					let reqObj = {
						userid: userData.id,
						first_name: firstName,
						last_name: lastName,
						email: email,
						gender: gender,
						dob: getFormattedDate(dob),
					};

					updateProfile(reqObj)
						.then((response) => {
							userData.first_name = firstName;
							userData.last_name = lastName;
							userData.email = email;
							writeUserData(userData);
							this.context.setUserData(userData);

							this.setState({
								showLoader: false,
								modalVisible: false,
							});
						})
						.catch((error) => {
							console.log(error);
							this.setState({ showLoader: false });
						});
				}
			}
		);
	};

	logout = () => {
		this.setState({ showLoader: true });
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.setState({ showLoader: false });
				removeUserData();
				this.context.unsetUserData();
			})
			.catch((error) => console.log(error));
	};

	onOpen = () => {
		this.setState({ isOpen: true });
		this.bs.current.snapTo(0);
		Animated.timing(this.state.opacity, {
			toValue: 0.7,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	onClose = () => {
		Animated.timing(this.state.opacity, {
			toValue: 0,
			duration: 350,
			useNativeDriver: true,
		}).start();
		this.bs.current.snapTo(1);
		setTimeout(() => {
			this.setState({ isOpen: false });
		}, 50);
	};

	renderHeader = () => (
		<View style={styles.bsheader}>
			<View style={styles.panelHeader}>
				<View style={styles.panelHandle}></View>
			</View>
		</View>
	);

	renderInner = () => (
		<View style={styles.panel}>
			<View style={{ alignItems: "center" }}>
				<Text style={styles.panelTitle}>Upload Photo</Text>
				<Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
			</View>
			<TouchableOpacity
				style={styles.panelButton}
				onPress={this.openCameraAsync}
			>
				<MaterialIcons
					name="photo-camera"
					size={18}
					color="white"
					style={{ marginRight: 5 }}
				/>
				<Text style={styles.panelButtonTitle}>Take Photo</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.panelButton}
				onPress={this.openImagePickerAsync}
			>
				<MaterialIcons
					name="photo-library"
					size={18}
					color="white"
					style={{ marginRight: 5 }}
				/>
				<Text style={styles.panelButtonTitle}>Choose From Library</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.panelButton} onPress={this.onClose}>
				<MaterialIcons
					name="cancel"
					size={18}
					color="white"
					style={{ marginRight: 5 }}
				/>
				<Text style={styles.panelButtonTitle}>Cancel</Text>
			</TouchableOpacity>
		</View>
	);

	renderBackDrop = () => (
		<Animated.View
			style={{
				opacity: this.state.opacity,
				backgroundColor: "rgba(0,0,0,0.7)",
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 1,
			}}
		>
			<TouchableOpacity
				style={{
					width: windowwidth,
					height: windowheight,
					backgroundColor: "transparent",
				}}
				activeOpacity={1}
				onPress={this.onClose}
			/>
		</Animated.View>
	);

	render = () => {
		const { userData } = this.context;
		const { modalVisible } = this.state;
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title="My Account"
				/>
				<View style={styles.profileSection}>
					<TouchableOpacity
						activeOpacity={0.8}
						style={styles.imageButton}
						onPress={this.onOpen}
					>
						<View style={styles.profileImageContainer}>
							<Image
								source={
									userData && userData.picture !== null
										? { uri: userData.picture }
										: require("../assets/deafult-profile-img.png")
								}
								style={styles.ImageStyle}
								resizeMode="contain"
							/>
						</View>
						<View style={styles.camIcon}>
							<MaterialIcons name="photo-camera" size={15} color="black" />
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this.toggleEditModal}
						style={{ padding: 10, flexDirection: "row", marginTop: 5 }}
					>
						<Text style={styles.nameText}>
							{userData !== null
								? userData.first_name + " " + userData.last_name
								: null}
						</Text>

						<AntDesign name="edit" size={24} color="black" />
					</TouchableOpacity>
				</View>

				<ScrollView>
					{this.state.isLoading ? (
						<ProfileSkeleton />
					) : (
						<View style={styles.section}>
							<View style={styles.detailsSection}>
								<View style={styles.iconContainer}>
									<MaterialIcons name="call" size={26} color="black" />
								</View>
								<View style={styles.name}>
									<Text style={styles.lable}>Phone</Text>
									<Text style={styles.title}>
										{this.state.mobile !== null
											? Configs.PHONE_NUMBER_COUNTRY_CODE + this.state.mobile
											: "N/A"}
									</Text>
								</View>
							</View>
							<View style={styles.detailsSection}>
								<View style={styles.iconContainer}>
									<MaterialIcons name="email" size={26} color="black" />
								</View>
								<View style={styles.name}>
									<Text style={styles.lable}>Email</Text>
									<Text style={styles.title}>
										{this.state.email !== null ? this.state.email : "N/A"}
									</Text>
								</View>
							</View>

							<View style={styles.detailsSection}>
								<View style={styles.iconContainer}>
									<MaterialIcons name="person" size={28} color="black" />
								</View>
								<View style={styles.name}>
									<Text style={styles.lable}>Gender</Text>
									<Text style={styles.title}>
										{this.state.gender !== null ? this.state.gender : "N/A"}
									</Text>
								</View>
							</View>
							<View style={styles.detailsSection}>
								<View style={styles.iconContainer}>
									<MaterialIcons name="event" size={26} color="black" />
								</View>
								<View style={styles.name}>
									<Text style={styles.lable}>Date of birth</Text>
									<Text style={styles.title}>
										{this.state.dob !== null
											? getFormattedDate(this.state.dob, "DD/MM/YYYY")
											: "N/A"}
									</Text>
								</View>
							</View>
							<View style={styles.detailsSection}>
								<View style={styles.iconContainer}>
									<MaterialIcons
										name="perm-contact-calendar"
										size={26}
										color="black"
									/>
								</View>
								<View style={styles.name}>
									<Text style={styles.lable}>Member since</Text>
									<Text style={styles.title}>{this.state.memberSince}</Text>
								</View>
							</View>
							<TouchableOpacity
								style={styles.detailsSection}
								onPress={this.logout}
							>
								<View style={styles.logouticonContainer}>
									<MaterialIcons name="logout" size={26} color="black" />
								</View>
								<View style={styles.name}>
									<Text style={styles.title}>Log Out</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}
				</ScrollView>

				<BottomSheet
					ref={this.bs}
					snapPoints={[300, 0]}
					initialSnap={1}
					enabledContentGestureInteraction={false}
					renderHeader={this.renderHeader}
					renderContent={this.renderInner}
					onCloseEnd={this.onClose}
				/>

				{this.state.isOpen && this.renderBackDrop()}

				<Modal
					animationType="slide"
					transparent={true}
					statusBarTranslucent={true}
					visible={modalVisible}
					onRequestClose={this.toggleEditModal}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={styles.modalHead}>
								<Text style={styles.headtext}>Update Profile</Text>
							</View>
							<ScrollView>
								<View style={styles.form}>
									<Text style={styles.modalText}>First Name</Text>
									<View
										style={[
											styles.formField,
											this.state.firstNameValidationFailed
												? styles.errorField
												: null,
										]}
									>
										<TextInput
											style={styles.textInput}
											value={this.state.firstName}
											selectionColor={Colors.primary}
											autoCapitalize="words"
											autoCompleteType="off"
											onChangeText={(firstName) => this.setState({ firstName })}
										/>
									</View>

									<Text style={styles.modalText}>Last Name</Text>
									<View
										style={[
											styles.formField,
											this.state.lastNameValidationFailed
												? styles.errorField
												: null,
										]}
									>
										<TextInput
											style={styles.textInput}
											value={this.state.lastName}
											selectionColor={Colors.primary}
											autoCapitalize="words"
											autoCompleteType="off"
											onChangeText={(lastName) => this.setState({ lastName })}
										/>
									</View>

									<Text style={styles.modalText}>Mobile Number</Text>
									<View style={styles.formField}>
										<TextInput
											editable={false}
											value={this.state.mobile}
											style={styles.textInput}
										/>
									</View>

									<Text style={styles.modalText}>Email</Text>
									<View
										style={[
											styles.formField,
											this.state.emailValidationFailed
												? styles.errorField
												: null,
										]}
									>
										<TextInput
											value={this.state.email}
											autoCapitalize="none"
											autoCompleteType="off"
											keyboardType="email-address"
											selectionColor={Colors.primary}
											style={styles.textInput}
											onChangeText={(email) => this.setState({ email })}
										/>
									</View>

									<Text style={styles.modalText}>Gender</Text>
									<View style={styles.genderContainer}>
										{Configs.GENDERS.map((element) => (
											<TouchableOpacity
												key={element.toString()}
												activeOpacity={1}
												onPress={this.setGender.bind(this, element)}
												style={[
													styles.radioBtn,
													this.state.genderValidationFailed
														? styles.errorField
														: null,
												]}
											>
												<Text style={styles.radioBtnText}>{element}</Text>
												<MaterialIcons
													name={
														this.state.gender === element
															? "radio-button-on"
															: "radio-button-off"
													}
													size={20}
													color={Colors.primary}
												/>
											</TouchableOpacity>
										))}
									</View>

									<Text style={styles.modalText}>Date of Birth</Text>
									<View
										style={[
											styles.formField,
											this.state.dobValidationFailed ? styles.errorField : null,
										]}
									>
										<DatePicker
											onPress={this.showDatepicker}
											show={this.state.isDatePickerVisible}
											onChange={this.onChangeDate}
											date={this.state.dob}
											mode={"date"}
											isMandatory={false}
										/>
									</View>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
										}}
									>
										<Pressable
											style={[styles.button, styles.buttonCancel]}
											onPress={this.toggleEditModal}
										>
											<Text style={[styles.textStyle, { color: Colors.grey }]}>
												CANCEL
											</Text>
										</Pressable>
										<Pressable
											style={[styles.button, styles.buttonUpdate]}
											onPress={this.saveData}
										>
											<Text style={styles.textStyle}>UPDATE</Text>
										</Pressable>
									</View>
								</View>
							</ScrollView>
						</View>
					</View>
				</Modal>
				<OverlayLoader visible={this.state.showLoader} />
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
	},
	profileSection: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		height: windowheight / 4,
	},
	imageButton: {
		position: "relative",
	},
	detailsSection: {
		paddingVertical: 18,
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	profileImageContainer: {
		backgroundColor: Colors.white,
		overflow: "hidden",
		height: 100,
		width: 100,
		borderWidth: 2,
		borderColor: Colors.white,
		borderRadius: 100 / 2,
		alignItems: "center",
		justifyContent: "center",
	},
	ImageStyle: {
		height: 100,
		width: 100,
	},
	camIcon: {
		borderWidth: 0.5,
		borderRadius: 25 / 2,
		borderColor: Colors.primary,
		width: 25,
		height: 25,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: 8,
		right: 0,
		backgroundColor: Colors.white,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
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
	logouticonContainer: {
		backgroundColor: "#d4d4d2",
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
	},
	nameText: {
		fontSize: 20,
		fontWeight: "bold",
		paddingHorizontal: 5,
	},
	title: {
		fontSize: 15,
		fontWeight: "bold",
	},
	lable: {
		color: Colors.medium,
	},
	editButton: {
		marginLeft: 30,
		borderWidth: 1,
		borderColor: Colors.primary,
		borderRadius: 50,
		paddingHorizontal: 10,
		paddingVertical: 2,
	},
	editText: {
		fontSize: 15,
		color: Colors.primary,
	},
	centeredView: {
		height: windowheight,
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		margin: 10,
		backgroundColor: "white",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 15,
		elevation: 2,
		width: "48%",
	},
	buttonCancel: {
		backgroundColor: Colors.lightGrey,
	},
	buttonUpdate: {
		backgroundColor: Colors.primary,
	},
	textStyle: {
		fontWeight: "bold",
		textAlign: "center",
	},
	modalHead: {
		paddingVertical: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	headtext: {
		fontSize: 18,
		fontWeight: "bold",
	},
	form: {
		marginVertical: 20,
		paddingHorizontal: 20,
	},
	formField: {
		paddingVertical: 5,
		marginTop: 5,
		marginBottom: 15,
		paddingHorizontal: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	modalText: {
		fontWeight: "bold",
		fontSize: 13,
		marginLeft: 5,
	},
	modalLable: {
		marginBottom: 15,
	},
	textInput: {
		paddingVertical: 5,
		paddingHorizontal: 5,
	},
	bsheader: {
		backgroundColor: Colors.primary,
		paddingTop: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHeader: {
		alignItems: "center",
	},
	panelHandle: {
		width: 40,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.white,
		marginBottom: 10,
	},
	panelTitle: {
		fontSize: 20,
		height: 30,
	},
	panelSubtitle: {
		fontSize: 14,
		color: "gray",
		height: 20,
		marginBottom: 10,
	},
	panel: {
		padding: 20,
		backgroundColor: Colors.white,
	},
	panelButton: {
		flexDirection: "row",
		padding: 10,
		borderRadius: 10,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 7,
	},
	panelButtonTitle: {
		fontSize: 15,
		fontWeight: "bold",
		color: "white",
	},
	genderContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 5,
		marginBottom: 15,
	},
	radioBtn: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		width: "30%",
		borderWidth: 1,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		backgroundColor: "white",
		paddingVertical: 10,
		paddingHorizontal: 8,
	},
	radioBtnText: {
		fontSize: 14,
		color: "#000",
		fontWeight: "700",
	},
	errorField: {
		borderWidth: 1,
		borderColor: Colors.danger,
	},
});
