import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../config/colors";

export default class DatePicker extends React.Component {
	render = () => {
		const { ...props } = this.props;
		return (
			<>
				<TouchableOpacity
					style={styles.fieldBox}
					activeOpacity={1}
					onPress={props.onPress}
				>
					<AntDesign name="calendar" style={styles.textInputIcon} size={20} />
					{!!props.date ? (
						<Text style={styles.textfielddate}>
							{props.date.toDateString()}
						</Text>
					) : (
						<Text style={[styles.textfielddate, { opacity: 0.6 }]}>
							{"DD/MM/YYYY"}
						</Text>
					)}
				</TouchableOpacity>
				{props.show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={!!props.date ? props.date : new Date()}
						mode={props.mode}
						is24Hour={true}
						display="default"
						onChange={props.onChange}
						minimumDate={props.minimumDate}
					/>
				)}
			</>
		);
	};
}

const styles = StyleSheet.create({
	fieldBox: {
		//borderWidth: 1,
		flexDirection: "row",
		paddingVertical: 7,
		paddingHorizontal: 5,
		alignItems: "center",
	},
	textfielddate: {
		paddingLeft: 10,
	},
	textInputIcon: {
		color: Colors.primary,
	},
});
