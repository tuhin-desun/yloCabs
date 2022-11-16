import React from "react";
import AppContext from "./AppContext";

export default class GlobalState extends React.Component {
	constructor(props) {
		super(props);

		this.setUserData = (data) => this.setState({ userData: data });

		this.setCurrentDriver = (data) => this.setState({ currentDriver: data });
		this.unsetCurrentDriver = () => this.setState({ currentDriver: null });

		this.unsetUserData = () => this.setState({ userData: null });
		this.setSettings = (data) => this.setState({ appSettings: data });
		this.unsetSettings = () => this.setState({ driverBookingData: null });
		this.setBookingData = (data) => this.setState({ bookingData: data });
		this.unsetBookingData = () => this.setState({ bookingData: null })
		this.setCancelReason = (data) => this.setState({ cancelReasons: data });
		this.unsetCancelReason = () => this.setState({ cancelReasons: null });


		this.state = {
			userData: props.userData,
			setUserData: this.setUserData,
			unsetUserData: this.unsetUserData,
			currentDriver: null,
			setCurrentDriver: this.setCurrentDriver,
			unsetCurrentDriver: this.unsetUserData,
			bookingData: null,
			setBookingData: this.setBookingData,
			unsetBookingData: this.unsetBookingData,
			cancelReasons: props.cancelReasons,
			setCancelReason: this.setCancelReason,
			unsetCancelReason: this.unsetCancelReason,
			settings: props.settingsData,
			setSettings: this.setSettings,
			unsetSettings: this.unsetSettings,
		};
	}

	render = () => (
		<AppContext.Provider value={this.state}>
			{this.props.children}
		</AppContext.Provider>
	);
}
