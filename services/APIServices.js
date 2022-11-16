import Configs from "../config/Configs";
import { getAccessToken } from "../utils/Util";

const getRequestUrl = (segment, requestObj = {}) => {
	let params = [];
	let url = Configs.BASE_URL + segment;

	for (const [key, value] of Object.entries(requestObj)) {
		params.push(key + "=" + value);
	}

	if (params.length > 0) {
		url += "/?" + params.join("&");
	}

	return url;
};

const getRequestUrl2 = (segment, requestObj = {}) => {
	let params = [];
	let url = Configs.BASE_URL2 + segment;

	for (const [key, value] of Object.entries(requestObj)) {
		params.push(key + "=" + value);
	}

	if (params.length > 0) {
		url += "/?" + params.join("&");
	}

	return url;
};

const getRequestOptions = async (requestMethod = "GET", requestObj = {}) => {
	let accessToken = await getAccessToken();
	let requestHeaders = new Headers();
	requestHeaders.append("Authorization", "Bearer " + accessToken);

	let requestOptions = { method: requestMethod };

	if (requestMethod === "GET") {
		requestOptions.headers = requestHeaders;
	} else {
		requestHeaders.append("Content-Type", "multipart/form-data");

		let formData = new FormData();
		for (const [key, value] of Object.entries(requestObj)) {
			formData.append(key, value);
		}

		requestOptions.headers = requestHeaders;
		requestOptions.body = formData;
	}
	return requestOptions;
};

export const userAuthentication = async (reqObj = {}) => {
	let url = Configs.BASE_URL + "user_authentication";

	let formData = new FormData();
	for (const [key, value] of Object.entries(reqObj)) {
		formData.append(key, value);
	}

	let requestOptions = {
		method: "POST",
		headers: { "Content-Type": "multipart/form-data" },
		body: formData,
	};
	let response = await fetch(url, requestOptions);
	// console.log(url, await response.text());
	return await response.json();
};

export const setupAccount = async (accessToken, reqObj = {}) => {
	let url = Configs.BASE_URL + "setup_account";
	let formData = new FormData();
	for (const [key, value] of Object.entries(reqObj)) {
		formData.append(key, value);
	}

	let requestHeaders = new Headers();
	requestHeaders.append("Authorization", "Bearer " + accessToken);
	requestHeaders.append("Content-Type", "multipart/form-data");

	let requestOptions = {
		method: "POST",
		headers: requestHeaders,
		body: formData,
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const setProfileImage = async (requestObj) => {
	let url = getRequestUrl("upload_profile_image");
	let requestOptions = await getRequestOptions("POST", requestObj);
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getUserProfile = async (userid) => {
	let url = getRequestUrl("user_profile", { userid });
	let options = await getRequestOptions();
	let response = await fetch(url, options);
	return await response.json();
};

export const updateProfile = async (requestObj) => {
	let url = getRequestUrl("update_profile");
	let requestOptions = await getRequestOptions("POST", requestObj);
	let response = await fetch(url, requestOptions);
	return await response.json();
};




export const makeBookRequest = async (reqObj = {}) => {
	let url = getRequestUrl2("handleBookRequest");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	// console.log(url, requestOptions);
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const informServer = async (requestObj) => {
	let url = getRequestUrl("update_profile");
	let requestOptions = await getRequestOptions("GET", requestObj);
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const cancelBooking = async (reqObj = {}) => {
	let url = getRequestUrl2("cancel_booking");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(await response.text())
	return await response.json();
};

export const cancelSearchBooking = async (reqObj = {}) => {
	let url = getRequestUrl2("cancel_search_booking");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(await response.text())
	return await response.json();
};


export const handlePaymentRequest = async (reqObj = {}) => {
	let url = getRequestUrl2("handle_payment_request");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const fetchRideHistory = async (reqObj = {}) => {
	let url = getRequestUrl2("get_ride_history");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	console.log(url, requestOptions)
	return await response.json();
};
export const getAdvertisementImages = async (requestObj = {}) => {
	let url = getRequestUrl2("get_advertisement_images");
	let requestOptions = await getRequestOptions("GET", requestObj);
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getPopUp = async (requestObj = {}) => {
	let url = getRequestUrl2("get_advertisement_pop_images");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log("test", await response.text())
	return await response.json();
};

export const getCancelReasons = async (reqObj = {}) => {
	let url = getRequestUrl2("fetch_cancel_reasons");
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(await response.text())
	return await response.json();
};

export const fetchSettings = async (reqObj = {}) => {
	let url = getRequestUrl2("fetch_settings");
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};



	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const sendOTP = async (reqObj = {}) => {
	let url = getRequestUrl2("sendOTP");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const getNotifications = async (reqObj = {}) => {
	let url = getRequestUrl2("get_notifications");
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url, requestOptions)
	// console.log(url,await response.text())
	return await response.json();
};

// export const getAvailableCars = async (requestObj = {}) => {
// 	let url = ''
// 	if (Object.keys(requestObj).length === 0 && requestObj.constructor === Object) {
// 		url = getRequestUrl2("get_service_type_with_driver");
// 	} else {
// 		url = getRequestUrl2("get_service_type_with_driver", requestObj);
// 	}
// 	console.log("AVAILABLE CARS URL", url)
// 	let requestOptions = await getRequestOptions("GET", requestObj);
// 	let response = await fetch(url, requestOptions);
// 	console.log(await response.text());
// 	return await response.json();
// };

export const getAvailableCars = async (requestObj = {}) => {
	let url = getRequestUrl2("get_service_type_with_driver");
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestObj),
	};

	console.log("AVAILABLE CARS URL", url, requestOptions)
	let response = await fetch(url, requestOptions);
	// console.log(await response.text());
	return await response.json();
};
