import React from "react";
import { LogBox } from 'react-native';
import AppLoading from "expo-app-loading";
import { readUserData } from "./utils/Util";
import { getCancelReasons, fetchSettings } from "./services/APIServices";
import GlobalState from "./context/GlobalState";
import Navigation from "./navigation/Navigation";
import firebase from "./config/firebase";
import { readUserDataFromFirebase } from "./utils/helper";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
			userData: null,
			cancelReasons: null
		};

		this.notificationListener = React.createRef();
		this.responseListener = React.createRef();
	}
	componentDidMount() {
		// Ignore all log notifications:
		LogBox.ignoreAllLogs();
		this.notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				// console.log(notification);
			});

		this.responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				// console.log(response);
			});
	}

	componentWillUnmount = () => {
		Notifications.removeNotificationSubscription(
			this.notificationListener.current
		);
		Notifications.removeNotificationSubscription(this.responseListener.current);
	};


	persistData = () => {
		Promise.all([readUserData(), getCancelReasons(), fetchSettings()])
			.then((response) => {
				let data = response[0]
				this.setState({
					cancelReasons: response[1]?.data,
					settingsData: response[2]?.data,
					userData: data,
					isReady: true,
				});
			})
			.catch((error) => console.log(error));
	};

	onFinish = () => null;

	render = () =>
		this.state.isReady ? (
			<GestureHandlerRootView style={{ flex: 1 }}>
				<GlobalState userData={this.state.userData} cancelReasons={this.state.cancelReasons} settingsData={this.state.settingsData}>
					<Navigation />
				</GlobalState>
			</GestureHandlerRootView>
		) : (
			<AppLoading
				startAsync={this.persistData}
				onFinish={this.onFinish}
				onError={console.log}
			/>
		);
}
