import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	location: {
		flexDirection: "row",
		alignItems: "center",
	},
	mapMarker: {
		width: "8%",
		alignItems: "center",
		paddingVertical: 5,
	},
	address: {
		width: "92%",
	},
	addressText: {
		fontSize: 13,
		color: Colors.black,
	},
	timeline: {
		width: "8%",
		alignItems: "center",
	},
	timelineItem: {
		fontSize: 8,
		lineHeight: 5,
		fontWeight: "bold",
	},
});

const AddressTimeline = (props) => (
	<>
		<View style={styles.location}>
			<View style={styles.mapMarker}>
				<FontAwesome name="map-marker" size={20} color={Colors.success} />
			</View>
			<View style={styles.address}>
				<Text style={styles.addressText} ellipsizeMode="tail" numberOfLines={2}>
					{props.source}
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
				<FontAwesome name="map-marker" size={20} color={Colors.danger} />
			</View>
			<View style={styles.address}>
				<Text style={styles.addressText} ellipsizeMode="tail" numberOfLines={2}>
					{props.destination}
				</Text>
			</View>
		</View>
	</>
);

export default AddressTimeline;
