import React from "react";

export default React.createContext({
	userData: null,
	setUserData: (data) => { },
	unsetUserData: () => { },
	currentDriver: null,
	setCurrentDriver: (data) => { },
	unsetCurrentDriver: () => { },
	bookingData: null,
	setBookingData: (data) => { },
	unsetBookingData: () => { },
	cancelReasons: [],
	setCancelReason: (data) => { },
	unsetCancelReason: () => { },
	settings: () => { },
	setSettings: (data) => { },
	unsetSettings: () => { }
});
