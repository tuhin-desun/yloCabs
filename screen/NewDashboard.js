import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import * as IntentLauncher from "expo-intent-launcher";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { Header, AddressTimeline } from "../component";
import { Tooltip, Icon, Button } from "react-native-elements";
import { GetDistance, getCloseDriver } from "../utils/GeoFunctions";
import {
  getAvailableCars,
  makeBookRequest,
  getUserProfile,
  cancelBooking,
  cancelSearchBooking,
  getAdvertisementImages,
  getPopUp,
} from "../services/APIServices";
import AppContext from "../context/AppContext";
import firebase from "../config/firebase";
import { tempBooking } from "../utils/helper";
import {
  generateBookingId,
  getFormattedDate,
  generateOTP,
} from "../utils/Util";
import BookingModal from "../component/BookingModal";
import { timeStamp } from "../utils/Util";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import LottieLoader from "../component/LottieLoader";
import * as WebBrowser from "expo-web-browser";
import Animated, { diff, SlideInRight } from "react-native-reanimated";
import CarList from "../component/CarList";
import { DatePicker } from "../component";
import colors from "../config/colors";
import moment from "moment";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
var { height, width } = Dimensions.get("window");
const hasNotch =
  Platform.OS === "ios" &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (height === 780 ||
    width === 780 ||
    height === 812 ||
    width === 812 ||
    height === 844 ||
    width === 844 ||
    height === 896 ||
    width === 896 ||
    height === 926 ||
    width === 926);

export default class Dashboard extends React.Component {
  static contextType = AppContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      location: {
        latitude: 0,
        longitude: 0,
      },
      destinationLocation: {},
      coordinates: [],
      allCars: [],
      carName: undefined,
      serviceTypeID: undefined,
      isSearchModalOpen: false,
      isRequestModalOpen: false,
      currentAddress: "Pickup Location",
      destinationAddress: "Destination Address",
      isCurrentAddressModalOpen: false,
      isDestinationAddressModalOpen: false,
      instructionInitData: {
        deliveryPerson: "",
        deliveryPersonPhone: "",
        pickUpInstructions: "",
        deliveryInstructions: "",
        parcelTypeIndex: 0,
        optionIndex: 0,
        parcelTypeSelected: null,
        optionSelected: null,
      },
      pickerConfig: {
        selectedDateTime: new Date(),
        dateModalOpen: false,
        dateMode: "date",
      },
      bookLoading: false,
      bookLaterLoading: false,
      bookingDate: null,
      bookingData: [],
      bookingModalStatus: false,
      duration: 0,
      distance: 0,
      waypoints: [],
      tripdata: [],
      estimate: [],
      instructionData: [],
      settings: [],
      freeCars: [],
      placeSelectionType: "pickup",
      previouslyCalledCars: [],
      currentDriver: null,
      driverAssignModal: false,
      driverAssignGoing: false,
      isActiveTimer: false,
      seconds: 0,
      cancelSearchPressed: false,
      data: [],
      snapPoints: ["40%", "60%"],
      advertisementData: [],
      advtModalVisible: false,
      advtModalImgURL: "",
      findingCar: true,

      outstationModalVisible: false,
      activeKeyTrip: "daily",
      isDatePickerVisible: false,
      returnDate: null,
      returnDateSelected: false,
    };

    this.interval = null;
    this.mapViewRef = React.createRef();
    this.sheetRef = React.createRef();
    //Booking Status Change
  }

  componentDidMount = () => {
    Location.requestForegroundPermissionsAsync()
      .then((permissionResult) => {
        if (permissionResult.status === "granted") {
          Location.getProviderStatusAsync()
            .then((providerStatus) => {
              if (providerStatus.gpsAvailable) {
                this.getCurrentPosition();
              } else {
                Alert.alert(
                  "Warning",
                  "Please keep you GPS on to detect your location",
                  [
                    { text: "Cancel", onPress: this.exitApp },
                    { text: "OK", onPress: this.openDeviceLocationSetting },
                  ]
                );
              }
            })
            .catch((error) => console.log(error));
        } else {
          Alert.alert(
            "Warning",
            "Please grant the permission to detect your location"
          );
        }
      })
      .catch((error) => console.log(error));

    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );

    this.getPopUpAdvertisementImages();
  };

  linkHandler = (url) => {
    WebBrowser.openBrowserAsync(url);
  };

  onScreenFocus = () => {
    // alert("Thissss")
    this.getAllCars();
    this.loadProfileData();
  };

  animateBottomSheet = () => {
    setTimeout(() => {
      this.setState({
        snapPoints: ["50%", "60%", "70%"],
      });
    }, 1);
  };

  timerS = () => {
    this.setState({
      seconds: 0,
    });
    if (this.state.isActiveTimer) {
      this.interval = setInterval(() => {
        this.setState({
          seconds: this.state.seconds + 1,
        });
      }, 1000);
    } else if (!this.state.isActiveTimer) {
      this.setState({
        seconds: 0,
      });
      clearInterval(this.interval);
    }
  };

  loadProfileData = () => {
    let { userData } = this.context;
    getUserProfile(userData.id)
      .then((response) => {
        // console.log(this.context)
        let data = response.data;
        this.context.setUserData(data);
      })
      .catch((error) => console.log(error));
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentDriver != prevState.currentDriver) {
      if (this.state.currentDriver != null) {
        this.firebaseTempBookinfRef = firebase
          .database()
          .ref("TempBooking/" + this.state.currentDriver);
        this.listernfortempBooking(this.firebaseTempBookinfRef);
      }
    }
  }

  componentWillUnmount = () => {
    this.focusListener();
    clearInterval(this.interval);
  };

  getPopUpAdvertisementImages = () => {
    getPopUp({ is_popup: 1 })
      .then((response) => {
        if (response.length > 0) {
          this.setState({
            advtModalImgURL: response[0].image,
            advtModalURL: response[0].url,
            advtModalVisible: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  listernfortempBooking(firebaseTempBookinfRef) {
    firebaseTempBookinfRef.on("value", (snapshot) => {
      let value = JSON.stringify(snapshot);
      if (value != "null" && value != "undefined") {
        value = JSON.parse(value);
        let testObj = value.estimate.waypoints;
        const array = Object.keys(testObj).map((key) => testObj[key]);
        value.estimate.waypoints = "";
        value.estimate.waypoints = array;

        if (value.status == "SEARCHING" || value.status == "IGNORED") {
          if (this.state.seconds >= 125) {
            this.onModalCancel();
            return;
          }
        }

        if (value.status == "SEARCHING") {
          this.setState({
            bookingData: value,
          });
        }
        if (value.status == "IGNORED") {
          this.notifyDriver();
        }
        if (value.status == "ACCEPTED") {
          clearInterval(this.interval);
          this.setState(
            {
              previouslyCalledCars: [],
              driverAssignModal: false,
              bookingModalStatus: false,
              seconds: 0,
              isActiveTimer: false,
              destinationLocation: [],
            },
            () => {
              this.props.navigation.navigate("ReachedScreen", {
                curBooking: value,
              });
            }
          );
        }
        if (value.status == "REACHED") {
          this.props.navigation.push("BookedCab", { curBooking: value });
        }
        if (value.status == "STARTED") {
          this.props.navigation.push("BookedCab", { curBooking: value });
        }
        if (value.status == "PAID") {
          this.setState(
            {
              previouslyCalledCars: [],
              seconds: 0,
              isActiveTimer: false,
              destinationLocation: [],
            },
            () => {
              this.props.navigation.push("Dashboard");
            }
          );
        }
        if (value.status == "CANCELLED") {
          this.setState(
            {
              previouslyCalledCars: [],
              seconds: 0,
              isActiveTimer: false,
              destinationLocation: [],
            },
            () => {
              this.props.navigation.push("Dashboard");
            }
          );
        }
        if (value.status == "PAYMENT_PENDING") {
          this.props.navigation.navigate("PaymentDetails", {
            curBooking: value,
          });
        }
      }
    });
  }

  exitApp = () => BackHandler.exitApp();

  openDeviceLocationSetting = () => {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
    )
      .then((result) => this.getCurrentPosition())
      .catch((error) => console.log(error));
  };

  getCurrentPosition = () => {
    Location.getCurrentPositionAsync({ accuracy: 1 })
      .then((locationResult) => {
        // console.log(locationResult);
        let location = {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
        };
        this.getAddress(location);
        this.setState({ location: location }, () => this.getAllCars());
      })
      .catch((error) => console.log(error));
  };

  getAddress = async (location) => {
    let address = await Location.reverseGeocodeAsync(location);
    console.log(address);
    this.setState({
      currentAddress: `${address[0].name}, ${address[0].district}, ${address[0].city}, ${address[0].country}`,
    });
  };

  geRegion = () => {
    let { location } = this.state;
    let latitude = location.latitude;
    let longitude = location.longitude;
    let latitudeDelta = 0.0043;
    let longitudeDelta = 0.0034;

    return { latitude, longitude, latitudeDelta, longitudeDelta };
  };

  toggleDrawer = () => this.props.navigation.toggleDrawer();

  openSearchModal = () => {
    this.setState({ isSearchModalOpen: true });
  };

  closeSearchModal = () => {
    this.setState({ isSearchModalOpen: false });
  };

  closeCurrentLocationModal = () => {
    this.setState({ isCurrentAddressModalOpen: false });
  };

  closeDestinationLocationModal = () => {
    this.setState({ isDestinationAddressModalOpen: false });
  };

  closeRequestModal = () => this.setState({ isRequestModalOpen: false });

  selectCarType = (value, key) => {
    let carTypes = this.state.allCars;
    // console.log(carTypes);
    let instructionData = this.state.instructionInitData;
    for (let i = 0; i < carTypes.length; i++) {
      carTypes[i].active = false;
      if (carTypes[i].name == value.name) {
        carTypes[i].active = true;
        let instObj = { ...instructionData };
        if (Array.isArray(carTypes[i].parcelTypes)) {
          instObj.parcelTypeSelected = carTypes[i].parcelTypes[0];
          instObj.parcelTypeIndex = 0;
        }
        if (Array.isArray(carTypes[i].options)) {
          instObj.optionSelected = carTypes[i].options[0];
          instObj.optionIndex = 0;
        }
        this.setState(
          {
            carName: carTypes[i].name,
            instructionInitData: instObj,
            serviceTypeID: carTypes[i].id,
            base_fare: carTypes[i].base_fare,
            per_km: carTypes[i].per_km,
            outstation_round_trip: carTypes[i].outstation_round_trip,
            outstation_per_km: carTypes[i].outstation_per_km,
            fourty_base: carTypes[i].fourty_base,
            baseDistance: carTypes[i].distance,
            outstation: carTypes[i].outstation,
            nightbase: carTypes[i].nightbase,
            pextra: carTypes[i].pextra,
            phourfrom: carTypes[i].phourfrom,
            phourto: carTypes[i].phourto,
          },
          () => {
            this.setState({
              snapPoints: ["40%", "65%"],
            });
          }
        );
      } else {
        carTypes[i].active = false;
      }
    }
  };

  getCarPrice = (distance) => {
    let allCars = [];
    const { outstation, nightbase, pextra, phourfrom, phourto } = this.state;
    getAvailableCars({ location: this.state.location })
      .then((response) => {
        if (response.length > 0) {
          response.forEach((item) => {
            console.log("ITEM***************", item, this.state.activeKeyTrip);
            if (this.state.activeKeyTrip == "daily") {
              let baseFare = 0;
              let perKmCharge = 0;
              let chargeAbleDistance = 0;
              let currentTime = new Date().getHours() + ":00:00";
              if (distance < 40) {
                /**
                 * Night Calculation
                 * (currentTime >= nightstartTime or currentTime <= nightEndTime)
                 */
                // console.log("Night Time", currentTime >= phourfrom, currentTime, item.phourfrom)
                if (
                  currentTime >= item.phourfrom ||
                  currentTime <= item.phourto
                ) {
                  baseFare = item.nightbase;
                  perKmCharge = item.pextra;
                } else {
                  baseFare = item.base_fare;
                  perKmCharge = item.per_km;
                }
              }

              if (distance > 40 && distance < 50) {
                baseFare = item.fourty_base;
                perKmCharge = item.per_km;
              }

              if (distance > 50) {
                baseFare = item.outstation;
                perKmCharge = item.outstation_per_km;
              }

              if (item.distance == 0) {
                chargeAbleDistance = distance;
              } else {
                chargeAbleDistance = Number(distance) - Number(item.distance);
              }

              item.price = Math.ceil(
                Number(baseFare) + chargeAbleDistance * perKmCharge
              );

              console.log(
                "Car******",
                baseFare,
                chargeAbleDistance,
                perKmCharge,
                item,
                item.price
              );
            } else {
              let price = 0;
              let chargeAbleDistance = 0;
              let start = moment(new Date(), "M/D/YYYY");
              let end = moment(new Date(this.state.returnDate), "M/D/YYYY");
              let diffDays = end.diff(start, "days");
              // diffDays = diffDays + 1;

              if (item.distance == 0) {
                chargeAbleDistance = this.state.distance;
              } else {
                chargeAbleDistance =
                  Number(this.state.distance) - Number(item.distance);
              }
              console.log(
                "Round Trip   ",
                item.name,
                this.state.distance * item.outstation_round_trip,
                this.state.distance,
                item.outstation_round_trip,
                diffDays
              );
              // if (diffDays > 0) {
              //     diffDays = Number(diffDays) + 2;
              //     price = Math.ceil(Number(item.outstation) + ((chargeAbleDistance * item.outstation_round_trip) * (diffDays)));
              // } else {
              //     price = Math.ceil(Number(item.outstation) + ((chargeAbleDistance * item.outstation_round_trip) * 2));
              // }
              price = Math.ceil(
                Number(item.outstation) +
                  chargeAbleDistance * item.outstation_round_trip * 2
              );
              item.price = price;
            }

            allCars.push(item);
          });
          this.setState({
            allCars: allCars,
            findingCar: true,
          });
        }
        console.log(response, distance);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getAllCars = () => {
    Promise.all([
      getAvailableCars({ location: this.state.location }),
      getAdvertisementImages(),
    ])
      .then((response) => {
        // console.log("Response", response)
        this.setState(
          {
            allCars: response[0],
            advertisementData: response[1],
          },
          () => {
            let freeCars = [];
            response[0].forEach((item) => {
              if (item.provider_data.length > 0) {
                item.provider_data.forEach((item) => {
                  freeCars.push(item);
                });
              }
            });
            this.setState(
              {
                freeCars: freeCars,
              },
              () => {
                this.animateBottomSheet();
              }
            );
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getCars = async (reqObj) => {
    // console.log("calling get cars*************")
    const { serviceTypeID } = this.state;
    getAvailableCars({
      service_type: serviceTypeID,
      location: this.state.location,
    })
      .then((response) => {
        let closestDriver = [];
        let selectedDriver = [];
        let originalArr = [];
        if (this.state.previouslyCalledCars.length > 0) {
          originalArr = response[0].provider_data;
          selectedDriver = this.state.previouslyCalledCars;
          const original = originalArr.filter((item, index) => {
            return !this.state.previouslyCalledCars.includes(item.provider_id);
          });
          if (original.length > 0) {
            closestDriver = getCloseDriver(
              this.state.location,
              original,
              reqObj
            );
            selectedDriver.push(closestDriver.id);
            this.setState(
              {
                previouslyCalledCars: selectedDriver,
              },
              () => {
                console.log("selected drive", selectedDriver);
              }
            );
          } else {
            closestDriver = [];
          }
        } else {
          if (response[0].provider_data.length > 0) {
            closestDriver = getCloseDriver(
              this.state.location,
              response[0].provider_data,
              reqObj
            );
            selectedDriver.push(closestDriver.id);
            this.setState({
              previouslyCalledCars: selectedDriver,
            });
          } else {
            closestDriver = [];
          }
        }
        // console.log('closestDriver', closestDriver);
        if (Object.keys(closestDriver).length > 0) {
          this.context.setCurrentDriver(closestDriver.id);
          this.setState(
            {
              currentDriver: closestDriver.id,
            },
            () => {
              this.initiateBooking(reqObj, closestDriver.id);
            }
          );
        } else {
          alert("No Driver Found");
          this.onModalCancel();
        }

        // console.log(this.state.currentDriver)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  initiateBooking = (reqObj, driver_id) => {
    const carName = reqObj.carName;
    delete reqObj.carName;
    makeBookRequest(reqObj)
      .then((response) => {
        reqObj.carName = carName;
        reqObj.booking_request_id = response.result;
        // this.setState({ bookingData: reqObj });
        tempBooking(reqObj, driver_id);
        this.timerS();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  bookingPreview = async () => {
    if (!this.state.destinationLocation.hasOwnProperty("latitude")) {
      alert("Please select drop location");
      return;
    }
    const {
      waypoints,
      serviceTypeID,
      coordinates,
      currentAddress,
      destinationAddress,
      distance,
      duration,
      base_fare,
      per_km,
      fourty_base,
      baseDistance,
      outstation,
      nightbase,
      pextra,
      phourfrom,
      phourto,
      returnDate,
      activeKeyTrip,
      outstation_per_km,
      outstation_round_trip,
    } = this.state;

    if (typeof serviceTypeID == "undefined") {
      alert("Please select car type");
      return;
    }

    if (distance >= 50) {
      this.setState({
        outstationModalVisible: true,
      });
      return;
    }

    let tripdata = {
      type: "daily",
      pickup: {
        lat: coordinates[0].latitude,
        lng: coordinates[0].longitude,
        add: currentAddress,
      },
      drop: {
        lat: coordinates[1].latitude,
        lng: coordinates[1].longitude,
        add: destinationAddress,
      },
      tripDate: getFormattedDate(null, "DD-MM-YYYY"),
      returnDate: getFormattedDate(returnDate, "DD-MM-YYYY"),
      returnDateStamp: new Date(returnDate).valueOf(),
    };

    //The calculation of trip charge is mentioned below
    /**
     * 1. If distance less than 40 then (base_fare + (distance*per_km))
     * 2. If distance between 40-50 km then (fourty_base +(distance * per_km))
     * 3. If distance more than 50 km means outstation then (outstation + (distance * per_km))
     * 4. If travelling in night and less than 40km then (night_base + (distance * per_km_night/pextra))
     * N.B. if base distance is set 0 km then above operation will happen without any changes but if base distance is set to 1 or something else but not 0 then also use the same calculation as above only at the time of calculation deduct base distance from distance.
     */
    let currentTime = new Date().getHours() + ":00:00";
    let baseFare = 0;
    let perKmCharge = per_km;
    let travelDistance = 0;
    if (baseDistance == 0) {
      travelDistance = distance;
      // console.log("Here 1 ", travelDistance);
    } else {
      travelDistance = Number(distance) - Number(baseDistance);
      // console.log("Here 2 ", travelDistance);
    }

    if (travelDistance < 40) {
      /**
       * Night Calculation
       * (currentTime >= nightstartTime or currentTime <= nightEndTime)
       */

      if (currentTime >= phourfrom || currentTime <= phourto) {
        baseFare = nightbase;
        perKmCharge = pextra;
      } else {
        baseFare = base_fare;
        perKmCharge = per_km;
      }
    }

    if (travelDistance >= 40 && travelDistance <= 50) {
      baseFare = fourty_base;
    }

    if (travelDistance > 50) {
      baseFare = outstation;
      if (this.state.activeKeyTrip == "daily") {
        perKmCharge = outstation_per_km;
      } else {
        perKmCharge = outstation_round_trip;
      }
    }

    let fare = Math.ceil(
      Number(baseFare) + Number(travelDistance * perKmCharge)
    );
    let dueAdd = 0;
    // let cgst = ((dueAdd * 9) / 100);
    // let sgst = ((dueAdd * 9) / 100);
    let cgst = 0;
    let sgst = 0;
    let finalFare = Math.ceil(Number(cgst) + Number(sgst) + Number(dueAdd));

    // console.log("Preview1", baseFare, travelDistance, perKmCharge, fare, dueAdd, Number(cgst), Number(sgst), finalFare, this.context.userData.wallet);

    // return;

    let estimate = {
      waypoints: waypoints,
      estimateDistance: distance,
      estimateFare: fare,
      estimateTime: duration,
      fare: Number(fare).toFixed(2),
      cgst: Number(cgst).toFixed(2),
      sgst: Number(sgst).toFixed(2),
      previous_due: Number(this.context.userData.wallet),
    };
    this.setState({
      tripdata: tripdata,
      estimate: estimate,
      bookingModalStatus: true,
      isActiveTimer: true,
      returnDateSelected: false,
    });
  };

  bookingPreview2 = async () => {
    this.setState({
      outstationModalVisible: !this.state.outstationModalVisible,
    });
    if (!this.state.destinationLocation.hasOwnProperty("latitude")) {
      alert("Please select drop location");
      return;
    }
    const {
      waypoints,
      serviceTypeID,
      coordinates,
      currentAddress,
      destinationAddress,
      distance,
      duration,
      base_fare,
      per_km,
      fourty_base,
      baseDistance,
      outstation,
      nightbase,
      pextra,
      phourfrom,
      phourto,
      returnDate,
      activeKeyTrip,
      outstation_per_km,
      outstation_round_trip,
    } = this.state;

    if (typeof serviceTypeID == "undefined") {
      alert("Please select car type");
      return;
    }

    let tripdata = {
      type: activeKeyTrip,
      pickup: {
        lat: coordinates[0].latitude,
        lng: coordinates[0].longitude,
        add: currentAddress,
      },
      drop: {
        lat: coordinates[1].latitude,
        lng: coordinates[1].longitude,
        add: destinationAddress,
      },
      tripDate: getFormattedDate(null, "DD-MM-YYYY"),
      returnDate: getFormattedDate(returnDate, "DD-MM-YYYY"),
      returnDateStamp: new Date(returnDate).valueOf(),
    };

    //The calculation of trip charge is mentioned below
    /**
     * 1. If distance less than 40 then (base_fare + (distance*per_km))
     * 2. If distance between 40-50 km then (fourty_base +(distance * per_km))
     * 3. If distance more than 50 km means outstation then (outstation + (distance * per_km))
     * 4. If travelling in night and less than 40km then (night_base + (distance * per_km_night/pextra))
     * N.B. if base distance is set 0 km then above operation will happen without any changes but if base distance is set to 1 or something else but not 0 then also use the same calculation as above only at the time of calculation deduct base distance from distance.
     */
    let currentTime = new Date().getHours() + ":00:00";
    let baseFare = 0;
    let perKmCharge = per_km;
    let travelDistance = 0;
    if (baseDistance == 0) {
      travelDistance = distance;
      // console.log("Here 1 ", travelDistance);
    } else {
      travelDistance = Number(distance) - Number(baseDistance);
      // console.log("Here 2 ", travelDistance);
    }

    if (travelDistance < 40) {
      /**
       * Night Calculation
       * (currentTime >= nightstartTime or currentTime <= nightEndTime)
       */

      if (currentTime >= phourfrom || currentTime <= phourto) {
        baseFare = nightbase;
        perKmCharge = pextra;
      } else {
        baseFare = base_fare;
        perKmCharge = per_km;
      }
    }

    if (travelDistance >= 40 && travelDistance <= 50) {
      baseFare = fourty_base;
    }

    if (travelDistance > 50) {
      baseFare = outstation;
      if (activeKeyTrip == "daily") {
        perKmCharge = outstation_per_km;
      } else {
        perKmCharge = outstation_round_trip;
      }
    }

    let fare = Math.ceil(
      Number(baseFare) + Number(travelDistance * perKmCharge)
    );
    // let dueAdd = Number(fare) - Number(this.context.userData.wallet);
    let dueAdd = 0;
    // let cgst = ((dueAdd * 9) / 100);
    // let sgst = ((dueAdd * 9) / 100);
    let cgst = 0;
    let sgst = 0;
    let finalFare = Math.ceil(Number(cgst) + Number(sgst) + Number(dueAdd));

    // console.log("Preview2", baseFare, travelDistance, perKmCharge, fare, dueAdd, Number(cgst), Number(sgst), finalFare, this.context.userData.wallet);

    // return;

    let estimate = {
      waypoints: waypoints,
      estimateDistance: distance,
      estimateFare: fare,
      estimateTime: duration,
      fare: Number(fare).toFixed(2),
      cgst: Number(cgst).toFixed(2),
      sgst: Number(sgst).toFixed(2),
      previous_due: Number(this.context.userData.wallet),
    };
    this.setState({
      tripdata: tripdata,
      estimate: estimate,
      bookingModalStatus: true,
      isActiveTimer: true,
      returnDateSelected: false,
    });
  };

  bookingRoundTrip = async () => {
    if (!this.state.destinationLocation.hasOwnProperty("latitude")) {
      alert("Please select drop location");
      return;
    }
    const {
      waypoints,
      serviceTypeID,
      coordinates,
      currentAddress,
      destinationAddress,
      distance,
      duration,
      base_fare,
      per_km,
      fourty_base,
      baseDistance,
      outstation,
      nightbase,
      pextra,
      phourfrom,
      phourto,
      returnDate,
      activeKeyTrip,
      outstation_round_trip,
      outstation_per_km,
    } = this.state;

    if (typeof serviceTypeID == "undefined") {
      alert("Please select car type");
      return;
    }

    let tripdata = {
      type: "round",
      pickup: {
        lat: coordinates[0].latitude,
        lng: coordinates[0].longitude,
        add: currentAddress,
      },
      drop: {
        lat: coordinates[1].latitude,
        lng: coordinates[1].longitude,
        add: destinationAddress,
      },
      tripDate: getFormattedDate(null, "DD-MM-YYYY"),
      returnDate: getFormattedDate(returnDate, "DD-MM-YYYY"),
      returnDateStamp: new Date(returnDate).valueOf(),
    };

    //The calculation of trip charge is mentioned below
    /**
     * 1. If distance less than 40 then (base_fare + (distance*per_km))
     * 2. If distance between 40-50 km then (fourty_base +(distance * per_km))
     * 3. If distance more than 50 km means outstation then (outstation + (distance * per_km))
     * 4. If travelling in night and less than 40km then (night_base + (distance * per_km_night/pextra))
     * N.B. if base distance is set 0 km then above operation will happen without any changes but if base distance is set to 1 or something else but not 0 then also use the same calculation as above only at the time of calculation deduct base distance from distance.
     */
    let currentTime = new Date().getHours() + ":00:00";
    let baseFare = base_fare;
    let perKmCharge = 0;
    let travelDistance = 0;
    let start = moment(new Date(), "M/D/YYYY");
    let end = moment(new Date(this.state.returnDate), "M/D/YYYY");
    let diffDays = end.diff(start, "days");
    diffDays = diffDays + 2;

    if (baseDistance == 0) {
      travelDistance = distance;
      // console.log("Here 1 ", travelDistance);
    } else {
      travelDistance = Number(distance) - Number(baseDistance);
      // console.log("Here 2 ", travelDistance);
    }

    let fare = Math.ceil(
      Number(baseFare) +
        Number(travelDistance * outstation_round_trip * diffDays)
    );

    let dueAdd = 0;
    // let cgst = ((dueAdd * 9) / 100);
    // let sgst = ((dueAdd * 9) / 100);
    let cgst = 0;
    let sgst = 0;
    let finalFare = Math.ceil(Number(cgst) + Number(sgst) + Number(dueAdd));

    // console.log("Round Trip", baseFare, travelDistance, per_km, fare, dueAdd, diffDays, Number(cgst), Number(sgst), finalFare, this.context.userData.wallet);

    // return;

    let estimate = {
      waypoints: waypoints,
      estimateDistance: distance,
      estimateFare: fare,
      estimateTime: duration,
      fare: Number(fare).toFixed(2),
      cgst: Number(cgst).toFixed(2),
      sgst: Number(sgst).toFixed(2),
      previous_due: Number(this.context.userData.wallet),
    };
    this.setState({
      tripdata: tripdata,
      estimate: estimate,
      bookingModalStatus: true,
      isActiveTimer: true,
      returnDateSelected: false,
    });
  };

  onModalCancel = () => {
    this.setState({
      cancelSearchPressed: true,
    });
    let booking = this.state.bookingData;
    booking.status = "CANCELLED";
    // console.log(this.context)
    cancelSearchBooking(booking).then((response) => {
      // console.log(response); return;
      if (response.type == "success") {
        this.clearCarSelection();
        tempBooking(booking, this.context.currentDriver);
        this.setState(
          {
            driverAssignModal: false,
            bookingModalStatus: false,
            driverAssignGoing: false,
            previouslyCalledCars: [],
            currentDriver: null,
            serviceTypeID: undefined,
            carName: undefined,
            destinationAddress: "Destination Address",
            seconds: 0,
            isActiveTimer: false,
            cancelSearchPressed: false,
            destinationLocation: [],
            allCars: [],
            coordinates: [],
            activeKeyTrip: "daily",
          },
          () => {
            clearInterval(this.interval);
          }
        );
        this.context.setCurrentDriver(null);
      } else {
        alert(response.msg);
      }
    });
    this.getAllCars();
  };

  cancelBeforeBook = () => {
    this.clearCarSelection();
    this.setState(
      {
        bookingModalStatus: false,
        driverAssignGoing: false,
        previouslyCalledCars: [],
        currentDriver: null,
        serviceTypeID: undefined,
        carName: undefined,
        destinationAddress: "Destination Address",
        seconds: 0,
        isActiveTimer: false,
        destinationLocation: [],
        allCars: [],
        coordinates: [],
        activeKeyTrip: "daily",
      },
      () => {
        clearInterval(this.interval);
      }
    );
    this.getAllCars();
  };

  clearCarSelection = () => {
    let carTypes = this.state.allCars;
    for (let i = 0; i < carTypes.length; i++) {
      carTypes[i].active = false;
    }
    this.setState({
      allCars: carTypes,
    });
  };

  setInstructionData = () => {
    console.log("Instruction data setter");
  };

  notifyDriver = async () => {
    if (!this.state.destinationLocation.hasOwnProperty("latitude")) {
      alert("Please select drop location");
      return;
    }
    this.setState({
      driverAssignModal: true,
      driverAssignGoing: true,
    });
    let status = "SEARCHING";
    const {
      serviceTypeID,
      carName,
      tripdata,
      estimate,
      coordinates,
      currentAddress,
      destinationAddress,
      distance,
      duration,
      base_fare,
    } = this.state;
    const user_id = this.context.userData.id;
    const user_name = `${this.context.userData.first_name} ${this.context.userData.last_name}`;
    const user_mobile = this.context.userData.mobile;
    const user_avatar = this.context.userData.picture;
    let bookingID = generateBookingId();
    let OTP = generateOTP();
    let currentTimeSeconds = timeStamp();
    let reqObj = {
      serviceTypeID,
      carName,
      coordinates,
      tripdata,
      estimate,
      currentAddress,
      destinationAddress,
      user_id,
      distance,
      duration,
      base_fare,
      bookingID,
      status,
      OTP,
      user_name,
      user_mobile,
      user_avatar,
      currentTimeSeconds,
    };
    //console.log(this.context.userData)
    let closeDriver = await this.getCars(reqObj);
    //console.log("notifyDriver", tripdata)
    // makeBookRequest(reqObj).then((response)=>{console.log(response)}).catch((err)=>{console.log(err)})
  };

  handleSheetChange = (index) => {
    console.log("handleSheetChange", index);
  };

  renderFirstFooter = (props) => {
    return (
      <BottomSheetFooter {...props} style={{ backgroundColor: Colors.white }}>
        <View style={styles.footerContainer}>
          <Button
            title={"Book Now"}
            loading={this.state.bookLoading}
            loadingProps={{ size: "large", color: Colors.WHITE }}
            titleStyle={styles.buttonTitleStyle}
            onPress={this.bookingPreview}
            raised
            buttonStyle={[
              styles.buttonStyle,
              {
                backgroundColor:
                  "taxi" == "taxi" ? Colors.primary : Colors.ORANGE.bright,
              },
            ]}
            containerStyle={[styles.buttonContainer, { width: "100%" }]}
          />
        </View>
      </BottomSheetFooter>
    );
  };

  renderSecondFooter = (props) => {
    return (
      <BottomSheetFooter {...props} style={{ backgroundColor: Colors.white }}>
        <View style={styles.footerContainer}>
          <Button
            title={"Book Now"}
            loading={this.state.bookLoading}
            loadingProps={{ size: "large", color: Colors.WHITE }}
            titleStyle={styles.buttonTitleStyle}
            onPress={this.bookingRoundTrip}
            raised
            buttonStyle={[
              styles.buttonStyle,
              {
                backgroundColor:
                  "taxi" == "taxi" ? Colors.primary : Colors.ORANGE.bright,
              },
            ]}
            containerStyle={[styles.buttonContainer, { width: "100%" }]}
          />
        </View>
      </BottomSheetFooter>
    );
  };

  setAdvtModalVisible = (visible) => {
    this.setState({ advtModalVisible: visible });
  };

  handleActiveTripKeyChange = (key) => {
    this.setState(
      {
        activeKeyTrip: key,
      },
      () => this.getCarPrice(this.state.distance)
    );
  };

  showDatepicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.returnDate;
    this.setState(
      {
        isDatePickerVisible: false,
        returnDate: currentDate,
        returnDateSelected: true,
      },
      () => {
        this.getCarPrice();
      }
    );
  };

  render = () => {
    // console.log("Seconds,", this.state.seconds, this.state.isActiveTimer)
    return (
      <View style={styles.container}>
        <Header
          leftIconName={"ios-menu-sharp"}
          leftButtonFunc={this.toggleDrawer}
        />
        <View style={styles.mapcontainer}>
          {this.state.location !== null ? (
            <MapView
              ref={this.mapViewRef}
              style={styles.mapViewStyle}
              provider={PROVIDER_GOOGLE}
              region={this.geRegion()}
              showsUserLocation={true}
              showsMyLocationButton={false}
              followsUserLocation={true}
              loadingEnabled={true}
              loadingIndicatorColor={Colors.primary}
              userLocationUpdateInterval={500}
              userLocationPriority={"high"}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {this.state.freeCars
                ? this.state.freeCars.map((item, index) => {
                    return (
                      <Marker.Animated
                        coordinate={{
                          latitude: item.location
                            ? Number(item.location.latitude)
                            : 0.0,
                          longitude: item.location
                            ? Number(item.location.longitude)
                            : 0.0,
                        }}
                        key={index}
                      >
                        <Image
                          key={index}
                          source={
                            item.carImage
                              ? { uri: item.carImage }
                              : require("../assets/microBlackCar.png")
                          }
                          style={{
                            height: 40,
                            width: 40,
                            resizeMode: "contain",
                          }}
                        />
                      </Marker.Animated>
                    );
                  })
                : null}

              {this.state.coordinates.length >= 2 ? (
                <MapViewDirections
                  origin={this.state.coordinates[0]}
                  destination={this.state.coordinates[1]}
                  apikey={Configs.GOOGLE_MAPS_API_KEY}
                  strokeWidth={0}
                  strokeColor={Colors.white}
                  mode={"DRIVING"}
                  onReady={(result) => {
                    this.setState(
                      {
                        duration: result.duration,
                        distance: result.distance,
                        waypoints: result.coordinates,
                        findingCar: false,
                      },
                      () => {
                        this.getCarPrice(result.distance);
                      }
                    );
                    this.mapViewRef.current.fitToCoordinates(
                      result.coordinates,
                      {
                        edgePadding: {
                          right: windowWidth / 20,
                          bottom: windowHeight / 20,
                          left: windowWidth / 20,
                          top: windowHeight / 20,
                        },
                      }
                    );
                  }}
                />
              ) : null}
            </MapView>
          ) : null}
          {this.state.placeSelectionType == "pickup" ? (
            <View pointerEvents="none" style={styles.mapFloatingPinView}>
              <Image
                pointerEvents="none"
                style={[styles.mapFloatingPin, { marginBottom: 40 }]}
                resizeMode="contain"
                source={require("../assets/green_marker_1.png")}
              />
            </View>
          ) : (
            <View pointerEvents="none" style={styles.mapFloatingPinView}>
              <Image
                pointerEvents="none"
                style={[styles.mapFloatingPin, { marginBottom: 40 }]}
                resizeMode="contain"
                source={require("../assets/red_marker.png")}
              />
            </View>
          )}
          <View style={styles.locationButtonView}>
            <TouchableOpacity
              onPress={this.getCurrentPosition}
              style={styles.locateButtonStyle}
            >
              <Icon
                name="gps-fixed"
                color={`${Colors.YELLOW.primary}`}
                size={26}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.addressBar}>
          <View style={styles.ballandsquare}>
            <View style={styles.hbox1} />
            <View style={styles.hbox2} />
            <View style={styles.hbox3} />
          </View>
          <View style={styles.contentStyle}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isCurrentAddressModalOpen: true,
                  allCars: [],
                })
              }
              style={styles.addressStyle1}
            >
              <Text
                numberOfLines={1}
                style={[styles.textStyle, { fontSize: 14, color: "#fff" }]}
              >
                {this.state.currentAddress}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  isDestinationAddressModalOpen: true,
                  //   allCars: [],
                })
              }
              style={styles.addressStyle2}
            >
              <Text
                numberOfLines={1}
                style={[styles.textStyle, { fontSize: 14, color: "#fff" }]}
              >
                {this.state.destinationAddress}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Sheet for cars */}
        <BottomSheet
          ref={this.sheetRef}
          index={1}
          snapPoints={this.state.snapPoints}
          onChange={this.handleSheetChange}
          footerComponent={
            this.state.activeKeyTrip == "daily"
              ? this.renderFirstFooter
              : this.renderSecondFooter
          }
        >
          <>
            {this.state.distance > 50 ? (
              <View style={styles.tripTabContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    borderRadius: 5,
                    width: "48%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      this.state.activeKeyTrip == "daily"
                        ? colors.primary
                        : colors.lightGrey,
                    paddingVertical: 15,
                  }}
                  onPress={this.handleActiveTripKeyChange.bind(this, "daily")}
                >
                  <Text
                    style={{
                      color:
                        this.state.activeKeyTrip == "daily"
                          ? colors.WHITE
                          : colors.grey,
                    }}
                  >
                    Daily
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    borderRadius: 5,
                    width: "48%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      this.state.activeKeyTrip == "daily"
                        ? colors.lightGrey
                        : colors.primary,
                    paddingVertical: 15,
                  }}
                  onPress={this.handleActiveTripKeyChange.bind(this, "round")}
                >
                  <Text
                    style={{
                      color:
                        this.state.activeKeyTrip == "daily"
                          ? colors.grey
                          : colors.WHITE,
                    }}
                  >
                    Round Trip
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <BottomSheetScrollView
              contentContainerStyle={styles.contentContainer}
            >
              <>
                {this.state.activeKeyTrip == "daily" ? (
                  <View>
                    {this.state.allCars.length > 0
                      ? this.state.allCars.map((prop, key) => {
                          return (
                            <CarList
                              prop={prop}
                              key={key}
                              selectCarType={this.selectCarType}
                            />
                          );
                        })
                      : null}
                  </View>
                ) : (
                  <View style={{ width: "100%" }}>
                    <View
                      style={{
                        width: "98%",
                        justifyContent: "center",
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                    >
                      <Text style={styles.modalText}>Return Date</Text>
                      <View
                        style={[
                          styles.formField,
                          this.state.returnDateValidation
                            ? styles.errorField
                            : null,
                        ]}
                      >
                        <DatePicker
                          onPress={this.showDatepicker}
                          show={this.state.isDatePickerVisible}
                          onChange={this.onChangeDate}
                          date={this.state.returnDate}
                          mode={"date"}
                          isMandatory={false}
                          minimumDate={
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth(),
                              new Date().getDate() + 1
                            )
                          }
                        />
                      </View>
                    </View>
                    <View>
                      {this.state.allCars.length > 0
                        ? this.state.allCars.map((prop, key) => {
                            return (
                              <CarList
                                prop={prop}
                                key={key}
                                selectCarType={this.selectCarType}
                              />
                            );
                          })
                        : null}
                    </View>
                  </View>
                )}
                <View style={{ flex: 1, marginHorizontal: 10, marginTop: 10 }}>
                  {this.state.advertisementData?.length > 0
                    ? this.state.advertisementData.map((item, index) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={this.linkHandler.bind(this, item.url)}
                          >
                            <Image
                              source={{ uri: item.image }}
                              style={{
                                height: 200,
                                width: "100%",
                                borderRadius: 10,
                                marginBottom: 10,
                              }}
                            />
                          </TouchableOpacity>
                        );
                      })
                    : null}
                </View>
              </>
            </BottomSheetScrollView>
          </>
        </BottomSheet>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isCurrentAddressModalOpen}
          onRequestClose={this.closeCurrentLocationModal}
          backButtonClose={true}
        >
          <View style={styles.searchModalOverlay}>
            <View style={styles.seacrhModalContainer}>
              <View style={styles.seacrhModalBody}>
                <GooglePlacesAutocomplete
                  placeholder="Pickup Location"
                  onPress={(data, details = null) => {
                    let address = data.description;
                    let destinationLocation = this.state.destinationLocation;
                    Location.setGoogleApiKey(Configs.GOOGLE_MAPS_API_KEY);

                    Location.geocodeAsync(address, { useGoogleMaps: true })
                      .then((geocodeResult) => {
                        let arr = [
                          destinationLocation
                            ? destinationLocation
                            : {
                                latitude: geocodeResult[0].latitude,
                                longitude: geocodeResult[0].longitude,
                              },
                          {
                            latitude: geocodeResult[0].latitude,
                            longitude: geocodeResult[0].longitude,
                          },
                        ];

                        let location = {
                          latitude: geocodeResult[0].latitude,
                          longitude: geocodeResult[0].longitude,
                        };

                        this.setState({
                          coordinates: arr,
                          location: location,
                          isCurrentAddressModalOpen: false,
                          currentAddress: address,
                          placeSelectionType: "pickup",
                        });
                      })
                      .catch((error) => console.log(error));
                  }}
                  query={{
                    key: Configs.GOOGLE_MAPS_API_KEY,
                    language: "en",
                    components: "country:in",
                  }}
                  currentLocation={true}
                  currentLocationLabel={this.state.currentAddress}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isDestinationAddressModalOpen}
          onRequestClose={this.closeDestinationLocationModal}
          backButtonClose={true}
        >
          <View style={styles.searchModalOverlay}>
            <View style={styles.seacrhModalContainer}>
              <View style={styles.seacrhModalBody}>
                <GooglePlacesAutocomplete
                  placeholder="Destination"
                  onPress={(data, details = null) => {
                    console.log(data, details);
                    let currentLocation = this.state.location;

                    let address = data.description;
                    Location.setGoogleApiKey(Configs.GOOGLE_MAPS_API_KEY);

                    // Location.reverseGeocodeAsync(currentLocation, {
                    // 	useGoogleMaps: true,
                    // })
                    // 	.then((revGeocodeResult) => {
                    // 		console.log(revGeocodeResult);
                    // 	})
                    // 	.catch((error) => console.log(error));

                    Location.geocodeAsync(address, { useGoogleMaps: true })
                      .then((geocodeResult) => {
                        let arr = [
                          currentLocation,
                          {
                            latitude: geocodeResult[0].latitude,
                            longitude: geocodeResult[0].longitude,
                          },
                        ];

                        this.setState({
                          isDestinationAddressModalOpen: false,
                          coordinates: arr,
                          destinationAddress: address,
                          destinationLocation: {
                            latitude: geocodeResult[0].latitude,
                            longitude: geocodeResult[0].longitude,
                          },
                          placeSelectionType: "drop",
                        });
                      })
                      .catch((error) => console.log(error));
                  }}
                  query={{
                    key: Configs.GOOGLE_MAPS_API_KEY,
                    language: "en",
                    components: "country:in",
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        <BookingModal
          settings={this.state.settings}
          tripdata={this.state.tripdata}
          estimate={this.state.estimate}
          instructionData={this.state.instructionData}
          setInstructionData={this.setInstructionData}
          bookingModalStatus={this.state.bookingModalStatus}
          bookNow={this.notifyDriver}
          onPressCancel={this.onModalCancel}
          driverAssignGoing={this.state.driverAssignGoing}
          cancelBeforeBook={this.cancelBeforeBook}
          cancelSearchPressed={this.state.cancelSearchPressed}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.driverAssignModal}
          onRequestClose={() => {
            this.setState({
              driverAssignModal: false,
            });
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(22,22,22,0.8)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: Colors.WHITE,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                maxHeight: 310,
                marginTop: 15,
              }}
            >
              <Image
                source={require("../assets/lodingDriver.gif")}
                resizeMode={"contain"}
                style={{ width: 160, height: 160, marginTop: 15 }}
              />
              <View>
                <Text
                  style={{
                    color: Colors.BLUE.default.primary,
                    fontSize: 16,
                    marginTop: 12,
                    marginBottom: 10,
                  }}
                >
                  {"Please wait finding driver for you"}
                </Text>
              </View>
              <View>
                <Button
                  title={"close"}
                  loading={false}
                  loadingProps={{ size: "large", color: Colors.YELLOW.primary }}
                  titleStyle={styles.buttonTitleStyle}
                  onPress={() => {
                    this.setState({
                      driverAssignModal: false,
                    });
                  }}
                  buttonStyle={{
                    borderRadius: 5,
                    backgroundColor: Colors.primary,
                  }}
                  containerStyle={{
                    height: 50,
                    width: 100,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.advtModalVisible}
          onRequestClose={() => {
            //alert("Modal has been closed.");
            this.setAdvtModalVisible(!this.state.advtModalVisible);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setAdvtModalVisible(!this.state.advtModalVisible);
            }}
            style={styles.centeredView}
          >
            <View>
              <View style={styles.modalView}>
                {/* <View style={styles.modalHead}>
                                <Text style={styles.headtext}>New Booking Arrived</Text>
                            </View> */}

                <View style={styles.modalBody}>
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        this.setAdvtModalVisible(!this.state.advtModalVisible);
                      }}
                      style={{
                        alignSelf: "flex-end",
                        marginBottom: -45,
                        zIndex: 99,
                        marginRight: 5,
                      }}
                    >
                      <AntDesign
                        name="closecircle"
                        size={40}
                        style={{ backgroundColor: "black", borderRadius: 50 }}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={this.linkHandler.bind(
                        this,
                        this.state.advtModalURL
                      )}
                    >
                      <Image
                        source={{ uri: this.state.advtModalImgURL }}
                        style={{
                          height: windowHeight / 3.5,
                          width: "100%",
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.outstationModalVisible}
          onRequestClose={() => {
            //alert("Modal has been closed.");
            this.setState(
              {
                outstationModalVisible: !this.state.outstationModalVisible,
              },
              () => {
                this.cancelBeforeBook();
              }
            );
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setState(
                {
                  outstationModalVisible: !this.state.outstationModalVisible,
                },
                () => {
                  this.cancelBeforeBook();
                }
              );
            }}
            style={styles.centeredView}
          >
            <View>
              <View
                style={[styles.modalView, { backgroundColor: Colors.primary }]}
              >
                <View
                  style={[
                    styles.modalHead,
                    {
                      backgroundColor: Colors.primary,
                      borderBottomWidth: 1,
                      borderBottomColor: "#959595",
                    },
                  ]}
                >
                  <Text style={styles.headtext}>Book YLO Outstation</Text>
                </View>

                <View style={[styles.modalBody, { alignItems: "center" }]}>
                  <Text>Drop Location is outside city limits.</Text>
                  <Text>Continue booking outstation instead?</Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: windowHeight / 14,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        {
                          outstationModalVisible:
                            !this.state.outstationModalVisible,
                        },
                        () => {
                          this.cancelBeforeBook();
                        }
                      );
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "50%",
                      borderTopWidth: 1,
                      borderTopColor: "#959595",
                      borderRightWidth: 1,
                      borderRightColor: "#959595",
                    }}
                  >
                    <Text style={{ color: Colors.grey, fontWeight: "bold" }}>
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.bookingPreview2}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "50%",
                      borderTopWidth: 1,
                      borderTopColor: "#959595",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>DONE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  addressBar: {
    position: "absolute",
    marginHorizontal: 20,
    top: hasNotch ? 100 : 80,
    height: 100,
    width: width - 40,
    flexDirection: "row",
    backgroundColor: Colors.black,
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 8,
    elevation: 3,
  },
  ballandsquare: {
    width: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  hbox1: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: Colors.GREEN.default,
  },
  hbox2: {
    height: 36,
    width: 1,
    backgroundColor: Colors.primary,
  },
  hbox3: {
    height: 12,
    width: 12,
    backgroundColor: Colors.primary,
  },
  contentStyle: {
    justifyContent: "center",
    width: width - 74,
    height: 100,
    paddingLeft: 10,
  },
  addressStyle1: {
    borderBottomColor: Colors.lightBlack,
    borderBottomWidth: 1,
    height: 48,
    width: width - 84,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 2,
  },
  textStyle: {
    fontSize: 14,
    color: Colors.white,
  },
  addressStyle2: {
    height: 48,
    width: width - 84,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  mapcontainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  mapViewStyle: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  mapFloatingPinView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  mapFloatingPin: {
    height: 40,
  },
  buttonBar: {
    position: "absolute",
    bottom: 10,
    height: 60,
    width: width,
    flexDirection: "row",
  },
  buttonContainer: {
    width: width / 2,
    height: 60,
  },
  buttonStyle: {
    // width: width / 2,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitleStyle: {
    color: Colors.WHITE,

    fontSize: 18,
  },
  locationButtonView: {
    position: "absolute",
    height: Platform.OS == "ios" ? 55 : 42,
    width: Platform.OS == "ios" ? 55 : 42,
    top: 150,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: Platform.OS == "ios" ? 30 : 3,
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  locateButtonStyle: {
    height: Platform.OS == "ios" ? 55 : 42,
    width: Platform.OS == "ios" ? 55 : 42,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
  },
  searchModalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
  },
  seacrhModalContainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: "#d1d1d1",
  },
  seacrhModalBody: {
    flex: 1,
    padding: 8,
  },
  reqModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  reqModalContainer: {
    minHeight: Math.floor((windowHeight * 45) / 100),
    width: windowWidth,
    backgroundColor: Colors.white,
  },
  reqModalHeader: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 8,
    elevation: 2,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
  },
  closeBtn: {
    width: 25,
    height: 25,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.black,
  },
  reqModalTitle: {
    fontSize: 18,
    color: Colors.black,
  },
  reqModalBody: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  distanceLabel: {
    marginVertical: 15,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdownLabel: {
    marginLeft: 12,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  pickerContainer: {
    marginLeft: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
  },
  submitBtn: {
    width: "100%",
    backgroundColor: Colors.primary,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fullCarView: {
    position: "absolute",
    bottom: 60,
    width: width - 10,
    height: 170,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
  },
  fullCarScroller: {
    width: width - 10,
    height: 160,
    flexDirection: "row",
  },
  cabDivStyle: {
    backgroundColor: Colors.white,
    width: (width - 40) / 3,
    height: "95%",
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderRadius: 8,
    elevation: 3,
  },
  imageStyle: {
    height: 50,
    width: 50 * 1.8,
    marginVertical: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
  },
  imageStyle1: {
    height: 60,
    width: 50 * 1.8,
  },
  textViewStyle: {
    height: 50,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  text1: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.black,
    // alignSelf: 'center'
  },
  text2: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.grey,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  contentContainer: {
    backgroundColor: Colors.WHITE,
    paddingBottom: "25%",
  },
  footerContainer: {
    margin: 12,
    borderRadius: 12,
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  centeredView: {
    height: windowHeight,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalView: {
    margin: 5,
    borderRadius: 10,
  },
  button: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    elevation: 2,
    width: "48%",
  },
  buttonCancel: {
    backgroundColor: Colors.lightGrey,
  },
  buttonUpdate: {
    backgroundColor: Colors.primary,
  },
  textStyle: {
    // color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalHead: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headtext: {
    fontSize: 25,
    fontWeight: "bold",
  },
  modalBody: {
    height: windowHeight / 6,
    justifyContent: "center",
  },
  modalText: {
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 5,
  },
  switchOuter: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  switchText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  switchInner: {
    height: 90,
    width: 90,
    borderRadius: 90 / 2,
    borderWidth: 3,
    borderColor: Colors.white,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  tripTabContainer: {
    width: "99%",
    borderRadius: 5,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  formField: {
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.textInputBorder,
    width: "98%",
  },
});
