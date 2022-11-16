import AsyncStorage from "@react-native-async-storage/async-storage";
import * as mime from "react-native-mime-types";
import moment from 'moment';


const storageKey = "@ylo_cab_user_data";

export const readUserData = async () => {
	try {
		let rawData = await AsyncStorage.getItem(storageKey);
		return rawData !== null ? JSON.parse(rawData) : null;
	} catch (e) {
		throw new Error("failed data retrieve from device");
	}
};

export const getAccessToken = async () => {
	try {
		let rawData = await AsyncStorage.getItem(storageKey);
		return rawData !== null ? JSON.parse(rawData).access_token : null;
	} catch (e) {
		throw new Error("failed to retrieve access token");
	}
};

export const writeUserData = async (value) => {
	try {
		await AsyncStorage.setItem(storageKey, JSON.stringify(value));
	} catch (e) {
		throw new Error("failed data save to device");
	}
};

export const removeUserData = async () => {
	try {
		await AsyncStorage.removeItem(storageKey);
	} catch (e) {
		throw new Error("failed to remove data from device");
	}
};

export const getFileData = (obj = {}) => {
	let uri = obj.uri;
	let arr = uri.split("/");
	let fileName = arr[arr.length - 1];

	return {
		uri: uri,
		name: fileName,
		type: mime.lookup(fileName),
	};
};

export const getFormattedDate = (dateStr, formatType = "YYYY-MM-DD") => {
	if (dateStr) {
		var d = new Date(dateStr);
	} else {
		var d = new Date();
	}


	//prepare day
	let day = d.getDate();
	day = day < 10 ? "0" + day : day;

	//prepare month
	let month = d.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	//prepare year
	let year = d.getFullYear();

	let date = undefined;
	switch (formatType) {
		case "DD/MM/YYYY":
			date = day + "/" + month + "/" + year;
			break;
		case "DD-MM-YYYY":
			date = day + "-" + month + "-" + year;
			break;
		default:
			date = year + "-" + month + "-" + day;
	}

	return date;
};

export const isMobile = (no) => {
	let regx = /^\d{10}$/;
	return regx.test(no);
};

export const isEmail = (email) => {
	let regx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return regx.test(email);
};

export const generateBookingId = () => {
	let id = "YLOCABS";
	const length = 3;
	let max = 10;
	let min = 99;
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	let randomString = result;

	let randomNumbers = Math.floor(min + Math.random() * (max + 1 - min));

	id += randomString + randomNumbers + new Date().getSeconds();
	return id;
}

export const generateOTP = () => {
	var digits = '0123456789';
	let OTP = '';
	for (let i = 0; i < 4; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
}

export const timeStamp = () => {
	return moment().format('X');
}

export const namedDateTime = (timestamp) => {
	return moment(timestamp, 'X').format('lll');
}

//array and keyword then returns the array which matches
export const getValueOfSetting = (arrys, keywrd) => {
	return arrys.filter(function (item) { return item.key == keywrd; });
}