const PRODUCTION = true;

export default {
  BASE_URL: PRODUCTION
    ? "https://ylocabs.com/ycab/ylocab2/api/user/"
    : "https://ylocabs.com/devlopment/ycab/ylocab2/api/user/",
  BASE_URL2: PRODUCTION
    ? "https://ylocabs.com/ycab/ylocab3/user/"
    : "https://ylocabs.com/devlopment/ycab/ylocab3/user/",
  SUCCESS_TYPE: "success",
  FAILURE_TYPE: "failure",
  TIMER_VALUE: 60,
  PHONE_NUMBER_COUNTRY_CODE: "+91",
  GENDERS: ["Male", "Female", "Others"],
  GOOGLE_MAPS_API_KEY: "AIzaSyC2Fs7x6pczpiXikw0sLRapWHNbl1Ys3k0",
  BOOKING_STATUS: {
    'SEARCHING': 'SEARCHING',
    'CANCELLED': 'CANCELLED',
    'ACCEPTED': 'ACCEPTED',
    'STARTED': 'STARTED',
    'ARRIVED': 'ARRIVED',
    'PICKEDUP': 'PICKEDUP',
    'DROPPED': 'DROPPED',
    'COMPLETED': 'COMPLETED',
    'SCHEDULED': 'SCHEDULED',
    'PAYMENT_PENDING': 'PAYMENT PENDING',
    'REACHED': 'REACHED'
  }
};
