import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Colors from "../config/colors";

const LOGO = require("../assets/logo.png");

export default function InvoicePrint(props) {
	const html = `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Invoice</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px 30px 0 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 15px;
				line-height: 22px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #000;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 5px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 0px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}

			/** RTL **/
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
		<center><h3 style="margin-top: 0px;font-size: 27px;color: #000;">Original Invoice</h3></center>
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
									<img src="https://ylocabs.com/ycab/ylocab3/uploads/logo.png" style="width: 100%; max-width: 130px" />
								</td>

								<td>
									Invoice ID :  ${props.rideData.bookingID}<br />
									Date :  ${props.rideData.tripdata.tripDate}<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="2">
						<table>
							<tr>
								<td>
									<strong>Driver</strong><br />
									<img style="height: 50px; width: 50px" src="${props.rideData.driver_image ? props.rideData.driver_image : 'https://cabs.invoice2day.in/ylocab3/uploads/profilePic.png'}" /><br />
									Name : ${props.rideData.driver_name}<br />
									Vehicle Name : ${props.rideData.car_type}<br />
									Model Name : ${props.rideData.vechile_model}<br />
									Vehicle Number : ${props.rideData.vehicle_number}<br />
									Mobile No: ${props.rideData.driver_contact}<br /> }
								</td>

								<td>
								    <strong>Customer</strong><br />
									Name : ${props.rideData.user_name}<br />
									Mobile No: ${props.rideData.user_mobile}<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>
            </table>
            <table cellpadding="0" cellspacing="0">
				<tr class="heading">
					<td>Ride Details</td>
				</tr>

				<tr class="details">
					<td><strong>Pickup Address</strong>: ${props.rideData.currentAddress}</td>
				</tr>
				<tr>
                    <td><strong>Destination Address</strong>: ${props.rideData.destinationAddress}</td>
				</tr>
				</table>
                <table cellpadding="0" cellspacing="0">
				<tr class="heading">
					<td>Description</td>

					<td>Amount (INR)</td>
				</tr>

				<tr class="item">
					<td>Distance Fare</td>

					<td><i class="fa fa-inr"></i> ${props.rideData.estimate.fare}</td>
				</tr>

				<tr class="item">
					<td>Waiting Charges</td>

					<td><i class="fa fa-inr"></i> 0</td>
				</tr>

				<tr class="item">
					<td>Ylocabs Service Charge </td>

					<td><i class="fa fa-inr"></i> 0</td>
				</tr>

                <tr class="item">
					<td>Previous Cancel Charge</td>

					<td><i class="fa fa-inr"></i> ${props.rideData.estimate.previous_due}</td>
				</tr>

				<tr class="total">
					<td></td>

					<td>Total : <i class="fa fa-inr"></i> ${props.rideData.estimate.estimateFare}</td>
				</tr>
			</table>
		</div>
	</body>
</html>
`;

	const printToFile = async () => {
		// On iOS/android prints the given html. On web prints the HTML from the current page.
		const { uri } = await Print.printToFileAsync({
			html
		});
		console.log('File has been saved to:', uri);
		await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
	}


	return (
		<TouchableOpacity
			onPress={printToFile}
			activeOpacity={0.7} style={styles.button}>
			<Text style={styles.buttonText}>DOWNLOAD INVOICE</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#ecf0f1',
		flexDirection: 'column',
		padding: 8,
	},
	spacer: {
		height: 8
	},
	printer: {
		textAlign: 'center',
	},
	button: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: Colors.primary,
		borderRadius: 5,
	},
	buttonText: {
		fontSize: 15,
		fontWeight: "bold",
		textAlign: "center",
	},
});
