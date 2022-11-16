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
