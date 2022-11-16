import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function MyMenuButton() {
	const navigation = useNavigation();
	return (
		<View style={{ paddingLeft: 20 }}>
			<TouchableOpacity
				onPress={() => {
					navigation.toggleDrawer();
				}}
			>
				<Ionicons name="ios-menu-sharp" size={30} color="#fff" />
			</TouchableOpacity>
		</View>
	);
}

export default MyMenuButton;
