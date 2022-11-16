import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
} from "react-native";
import Colors from "../config/colors";
import { Ionicons, Entypo } from "@expo/vector-icons";

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
						{props.leftIconType ? (
							<Entypo name="cross" size={26} color="black" />
						) : (
							<Ionicons name={props.leftIconName} size={26} color="black" />
						)}

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
		width: "85%",
		// paddingLeft: 15,
		alignItems: "flex-end",
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
