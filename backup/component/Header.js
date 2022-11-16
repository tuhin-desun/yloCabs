import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
} from "react-native";
import Colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";

export default class Header extends React.Component {
	render = () => {
		const { ...props } = this.props;
		return (
			<>
				<StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
				<View style={styles.header}>
					<TouchableOpacity
						style={{ width: "15%" }}
						onPress={props.leftButtonFunc}
					>
						<Ionicons name={props.leftIconName} size={26} color="black" />
					</TouchableOpacity>
					{props.title ? (
						<View style={styles.headerLeft}>
							<Text style={styles.headerLeftTitle}>{props.title}</Text>
							{props.subTitle ? (
								<Text style={styles.headerLeftSubTitle}>{props.subTitle}</Text>
							) : null}
						</View>
					) : null}

					{typeof props.searchAction !== "undefined" ? (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={props.searchAction}
							style={{ padding: 5 }}
						>
							<Ionicons name="search" size={20} color={Colors.black} />
						</TouchableOpacity>
					) : null}

					{props.rightIconName ? (
						<View
							style={{
								width: "20%",
								alignItems: "center",
								flexDirection: "row",
								justifyContent: "space-around",
							}}
						>
							<Ionicons name="wallet" size={24} color="black" />
							<Text>₹ 100</Text>
						</View>
					) : null}
				</View>
			</>
		);
	};
}

const styles = StyleSheet.create({
	header: {
		height: 50,
		alignItems: "center",
		paddingHorizontal: 15,
		flexDirection: "row",
		backgroundColor: Colors.primary,
		//borderWidth: 1,
	},
	headerLeft: {
		// borderWidth: 1,
		width: "65%",
		// paddingLeft: 15,
		//alignItems: "center",
	},
	headerLeftTitle: {
		fontSize: 19,
		fontWeight: "bold",
	},
	headerLeftSubTitle: {
		// color: Colors.medium,
		fontSize: 15,
	},
});
