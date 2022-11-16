import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
	},
	detailsSection: {
		paddingVertical: 18,
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	avatar: {
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
	},
	lineContainer: {
		marginLeft: 15,
	},
	line: {
		height: 8,
		width: 150,
		borderRadius: 3,
		marginVertical: 3,
	},
});

const ProfileSkeleton = (props) => (
	<SkeletonPlaceholder>
		<View style={styles.container}>
			{[1, 2, 3, 4, 5].map((element) => (
				<View key={element.toString()} style={styles.detailsSection}>
					<View style={styles.avatar} />
					<View style={styles.lineContainer}>
						<View style={styles.line} />
						<View style={styles.line} />
					</View>
				</View>
			))}
		</View>
	</SkeletonPlaceholder>
);

export default ProfileSkeleton;
