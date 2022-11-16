import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Pressable,
	FlatList,
	Alert,
	ActivityIndicator,
} from "react-native";
import * as Contacts from "expo-contacts";
import CheckBox from "@react-native-community/checkbox";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../component/Header";
export default class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoading: false,
			contacts: [],
		};
	}

	loadContacts = async () => {
		const { status } = await Contacts.requestPermissionsAsync();

		if (status !== "granted") {
			return;
		}
		const { data } = await Contacts.getContactsAsync({
			fields: [Contacts.Fields.PhoneNumbers],
		});

		//console.log(data);
		this.setState({ contacts: data, inMemoryContacts: data, isLoading: false });
	};
	componentDidMount() {
		this.setState({ isLoading: true });
		this.loadContacts();
	}

	renderItem = ({ item }) => {
		//console.log(item);
		return (
			<>
				{item.phoneNumbers ? (
					<Pressable
						onPress={() => alert("hii")}
						style={{
							//minHeight: 70,
							paddingHorizontal: 5,
							paddingVertical: 10,
							borderBottomWidth: 1,
							borderColor: Colors.lightGrey,
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<View style={styles.contactCircle}>
							<Text style={{ textAlign: "center" }}>{item.name.charAt(0)}</Text>
						</View>
						<View style={{ marginLeft: 10, width: "75%" }}>
							<Text
								style={{
									color: Colors.black,
									fontWeight: "bold",
									fontSize: 16,
									paddingVertical: 5,
								}}
							>
								{item.name + " "}
							</Text>
							<Text style={{ color: "black" }}>
								{item.phoneNumbers[0].number}
							</Text>
						</View>
						<CheckBox value={false} tintColors={{ true: Colors.primary }} />
					</Pressable>
				) : null}
			</>
		);
	};

	searchContacts = (value) => {
		const filteredContacts = this.state.inMemoryContacts.filter((contact) => {
			let contactLowercase = (
				contact.firstName +
				" " +
				contact.lastName
			).toLowerCase();

			let searchTermLowercase = value.toLowerCase();

			return contactLowercase.indexOf(searchTermLowercase) > -1;
		});
		this.setState({ contacts: filteredContacts });
	};

	render() {
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"arrow-back"}
					leftButtonFunc={() => this.props.navigation.goBack()}
					title="Choose from Contact"
				/>
				<View style={styles.section}>
					<View style={styles.searchContainer}>
						<Ionicons name="ios-search" size={20} color={Colors.medium} />
						<TextInput
							placeholder="Search"
							style={styles.searchInput}
							onChangeText={(value) => this.searchContacts(value)}
						/>
					</View>

					<View style={{ flex: 1, backgroundColor: Colors.white }}>
						{this.state.isLoading ? (
							<View
								style={{
									...StyleSheet.absoluteFill,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<ActivityIndicator size="large" color={Colors.primary} />
							</View>
						) : null}
						<FlatList
							data={this.state.contacts}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
							ListEmptyComponent={() => (
								<View
									style={{
										flex: 1,
										alignItems: "center",
										justifyContent: "center",
										marginTop: 50,
									}}
								>
									<Text style={{ color: Colors.primary }}>
										No Contacts Found
									</Text>
								</View>
							)}
						/>
					</View>
					<Pressable style={styles.button}>
						<Text style={styles.buttonText}>ADD (1)</Text>
					</Pressable>
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
		flex: 1,
		paddingHorizontal: 15,
	},
	searchContainer: {
		//backgroundColor: Colors.lightGrey,
		flexDirection: "row",
		padding: 5,
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 5,
		borderColor: Colors.primary,
		marginVertical: 15,
	},
	searchInput: {
		flex: 1,
		fontSize: 18,
		paddingHorizontal: 10,
		//borderWidth:1
	},
	contactCircle: {
		backgroundColor: Colors.lightGrey,
		overflow: "hidden",
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		paddingHorizontal: 10,
		paddingVertical: 12,
		backgroundColor: Colors.primary,
		borderRadius: 5,
		marginVertical: 12,
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
	},
});
