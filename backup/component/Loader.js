import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.background,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	loaderText: {
		color: Colors.primary,
		opacity: 0.7,
	},
});

const Loader = () => (
	<View style={styles.container}>
		<ActivityIndicator size="large" color={Colors.primary} />
		<Text style={styles.loaderText}>Please wait...</Text>
	</View>
);

export default Loader;
