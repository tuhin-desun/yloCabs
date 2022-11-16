const PRODUCTION = true;

export default {
  BASE_URL: PRODUCTION
    ? "https://ehostingguru.com/stage/ylocab/api/user/"
    : "http://192.168.1.116/ylocab/api/user/",
  SUCCESS_TYPE: "success",
  FAILURE_TYPE: "failure",
  TIMER_VALUE: 60,
  PHONE_NUMBER_COUNTRY_CODE: "+91",
  GENDERS: ["Male", "Female", "Others"],
  GOOGLE_MAPS_API_KEY: "AIzaSyAHG9wJDJThFRp7aZdG9O2LMRvSRXjjois",
};
