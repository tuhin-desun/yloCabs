import React from "react";
import AppLoading from "expo-app-loading";
import { readUserData } from "./utils/Util";
import GlobalState from "./context/GlobalState";
import Navigation from "./navigation/Navigation";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
			userData: null,
		};
	}

	persistData = () => {
		readUserData()
			.then((data) => {
				this.setState({
					userData: data,
					isReady: true,
				});
			})
			.catch((error) => console.log(error));
	};

	onFinish = () => null;

	render = () =>
		this.state.isReady ? (
			<GlobalState userData={this.state.userData}>
				<Navigation />
			</GlobalState>
		) : (
			<AppLoading
				startAsync={this.persistData}
				onFinish={this.onFinish}
				onError={console.log}
			/>
		);
}
