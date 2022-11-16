import React from "react";
import AppContext from "./AppContext";

export default class GlobalState extends React.Component {
	constructor(props) {
		super(props);

		this.setUserData = (data) => this.setState({ userData: data });

		this.unsetUserData = () => this.setState({ userData: null });

		this.state = {
			userData: props.userData,
			setUserData: this.setUserData,
			unsetUserData: this.unsetUserData,
		};
	}

	render = () => (
		<AppContext.Provider value={this.state}>
			{this.props.children}
		</AppContext.Provider>
	);
}
