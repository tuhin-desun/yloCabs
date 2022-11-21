import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  Animated,
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
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { Header, AddressTimeline } from "../component";
import { Tooltip, Icon, Button } from "react-native-elements";
import { GetDistance } from "../utils/GeoFunctions";

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
  constructor(props) {
    super(props);
    this.state = {
      location: {},
      destinationLocation: {},
      coordinates: [],
      allCars: [
        {
          active: true,
          available: true,
          base_fare: 5,
          cancelSlab: [
            {
              amount: 5,
              minsDelayed: "5",
              tableData: {
                id: 0,
              },
            },
          ],
          convenience_fee_type: "percentage",
          convenience_fees: 5,
          createdAt: "2021-11-29T13:56:59.604Z",
          extra_info: "Capacity: 2,Type: Mini",
          id: "-Mpfz-BraRZ-ORzpFp0D",
          image:
            "https://cdn.pixabay.com/photo/2018/05/22/01/37/icon-3420270__340.png",
          minTime: "1 min",
          min_fare: 5,
          name: "Mini",
          nearbyData: [
            {
              approved: true,
              arriveDistance: 0.002186509175634568,
              arriveTime: {
                distance_in_km: 0.003,
                time_in_secs: 1,
                timein_text: "1 min",
              },
              bankAccount: "",
              bankCode: "",
              bankName: "",
              carImage:
                "https://cdn.pixabay.com/photo/2018/05/22/01/37/icon-3420270__340.png",
              carType: "Mini",
              createdAt: "2021-11-29T08:12:50.833Z",
              driverActiveStatus: true,
              email: "bswnth79@gmail.com",
              firstName: "Biswa",
              id: "cSQhF3qHdxV77J0nwwtAW1voRbs2",
              lastName: "Nath",
              licenseImage: {
                _U: 0,
                _V: 0,
              },
              location: {
                lat: 23.1844986,
                lng: 88.5733286,
              },
              mobile: "+917001849004",
              other_info: "",
              pushToken: "ExponentPushToken[YdVYR8OPciBDGp-BhsoHoK]",
              queue: false,
              referralId: "biswa1658",
              userPlatform: "ANDROID",
              usertype: "driver",
              vehicleMake: "Maruti",
              vehicleModel: "ZZLTH",
              vehicleNumber: "WB09876",
              walletBalance: 0,
            },
          ],
          rate_per_hour: 5,
          rate_per_unit_distance: 5,
        },
        {
          active: false,
          available: false,
          base_fare: 10,
          cancelSlab: [
            {
              amount: 10,
              minsDelayed: 2,
            },
            {
              amount: 15,
              minsDelayed: 4,
            },
          ],
          convenience_fee_type: "percentage",
          convenience_fees: 15,
          extra_info: "Capacity: 3,Type: Taxi",
          id: "type1",
          image:
            "https://cdn.pixabay.com/photo/2015/01/17/11/37/taxi-icon-602136__340.png",
          minTime: "",
          min_fare: 10,
          name: "Economy",
          rate_per_hour: 5,
          rate_per_unit_distance: 5,
        },
        {
          active: false,
          available: false,
          base_fare: 12,
          cancelSlab: [
            {
              amount: 15,
              minsDelayed: 2,
            },
            {
              amount: 20,
              minsDelayed: 4,
            },
          ],
          convenience_fee_type: "percentage",
          convenience_fees: 15,
          extra_info: "Capacity: 4,Type: HatchBack",
          id: "type2",
          image:
            "https://cdn.pixabay.com/photo/2018/05/22/01/37/icon-3420270__340.png",
          minTime: "",
          min_fare: 20,
          name: "Comfort",
          rate_per_hour: 6,
          rate_per_unit_distance: 8,
        },
        {
          active: false,
          available: false,
          base_fare: 15,
          cancelSlab: [
            {
              amount: 20,
              minsDelayed: 2,
            },
            {
              amount: 25,
              minsDelayed: 4,
            },
          ],
          convenience_fee_type: "percentage",
          convenience_fees: 15,
          extra_info: "Capacity: 4,Type: Sedan",
          id: "type3",
          image:
            "https://cdn.pixabay.com/photo/2016/04/01/09/11/car-1299198__340.png",
          minTime: "",
          min_fare: 30,
          name: "Exclusive",
          rate_per_hour: 8,
          rate_per_unit_distance: 10,
        },
      ],
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
      bookingModalStatus: false,
    };

    this.mapViewRef = React.createRef();
  }

  componentDidMount = () => {
    Location.requestPermissionsAsync()
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
  };

  componentDidUpdate() {
    const { location, destinationLocation } = this.state;
    if (
      location.hasOwnProperty("latitude") &&
      destinationLocation.hasOwnProperty("latitude")
    ) {
      let distance = GetDistance(
        location.latitude,
        location.longitude,
        destinationLocation.latitude,
        destinationLocation.longitude
      );
    }
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
        this.setState({ location: location });
      })
      .catch((error) => console.log(error));
  };

  getAddress = async (location) => {
    let address = await Location.reverseGeocodeAsync(location);
    this.setState({
      currentAddress: `${address[0].name}, ${address[0].city}, ${address[0].country}`,
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

  closeRequestModal = () => this.setState({ isRequestModalOpen: false });

  selectCarType = (value, key) => {
    let carTypes = this.state.allCars;
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
        this.setState({ instructionInitData: instObj });
      } else {
        carTypes[i].active = false;
      }
    }
  };

  render = () => (
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
            followsUserLocation={true}
            loadingEnabled={true}
            loadingIndicatorColor={Colors.primary}
            userLocationUpdateInterval={500}
          >
            {(this.state.coordinates || []).map((cord, index) => (
              <Marker key={index} coordinate={cord} />
            ))}

            {this.state.coordinates.length >= 2 ? (
              <MapViewDirections
                origin={this.state.coordinates[0]}
                destination={this.state.coordinates[1]}
                apikey={Configs.GOOGLE_MAPS_API_KEY}
                strokeWidth={5}
                strokeColor={Colors.primary}
                onReady={(result) => {
                  this.mapViewRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: windowWidth / 20,
                      bottom: windowHeight / 20,
                      left: windowWidth / 20,
                      top: windowHeight / 20,
                    },
                  });
                }}
              />
            ) : null}
          </MapView>
        ) : null}
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
              })
            }
            style={styles.addressStyle1}
          >
            <Text
              numberOfLines={1}
              style={[styles.textStyle, { fontSize: 14 }]}
            >
              {this.state.currentAddress}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({
                isDestinationAddressModalOpen: true,
              })
            }
            style={styles.addressStyle2}
          >
            <Text
              numberOfLines={1}
              style={[styles.textStyle, { fontSize: 14 }]}
            >
              {this.state.destinationAddress}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonBar}>
        <Button
          title={"Book Later"}
          loading={this.state.bookLaterLoading}
          loadingProps={{ size: "large", color: Colors.WHITE }}
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            console.log("Book Later");
          }}
          buttonStyle={[
            styles.buttonStyle,
            { backgroundColor: Colors.GREY.default },
          ]}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title={"Book Now"}
          loading={this.state.bookLoading}
          loadingProps={{ size: "large", color: Colors.WHITE }}
          titleStyle={styles.buttonTitleStyle}
          onPress={() => {
            console.log("Book Now");
          }}
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor:
                "taxi" == "taxi" ? Colors.YELLOW.primary : Colors.ORANGE.bright,
            },
          ]}
          containerStyle={styles.buttonContainer}
        />
      </View>
      <View style={styles.fullCarView}>
        <ScrollView
          horizontal={true}
          style={styles.fullCarScroller}
          showsHorizontalScrollIndicator={false}
        >
          {this.state.allCars.map((prop, key) => {
            return (
              <View
                key={key}
                style={[
                  styles.cabDivStyle,
                  {
                    backgroundColor:
                      prop.active == true
                        ? Colors.YELLOW.secondary
                        : Colors.WHITE,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.selectCarType(prop, key);
                  }}
                  style={styles.imageStyle}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      prop.image
                        ? { uri: prop.image }
                        : require("../assets/microBlackCar.png")
                    }
                    style={styles.imageStyle1}
                  />
                </TouchableOpacity>
                <View style={styles.textViewStyle}>
                  <Text style={styles.text1}>{prop.name.toUpperCase()}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={[
                        styles.text2,
                        { fontWeight: "bold", color: Colors.GREY.btnPrimary },
                      ]}
                    >
                      {"₹"}
                      {prop.rate_per_unit_distance} / {"mi"}{" "}
                    </Text>
                    {prop.extra_info && prop.extra_info != "" ? (
                      <Tooltip
                        style={{ marginLeft: 3, marginRight: 3 }}
                        backgroundColor={"#fff"}
                        overlayColor={"rgba(50, 50, 50, 0.70)"}
                        height={10 + 30 * prop.extra_info.split(",").length}
                        width={180}
                        skipAndroidStatusBar={true}
                        popover={
                          <View
                            style={{
                              justifyContent: "space-around",
                              flexDirection: "column",
                            }}
                          >
                            {prop.extra_info.split(",").map((ln) => (
                              <Text key={ln}>{ln}</Text>
                            ))}
                          </View>
                        }
                      >
                        <Icon
                          name="information-circle-outline"
                          type="ionicon"
                          color="#517fa4"
                          size={28}
                        />
                      </Tooltip>
                    ) : null}
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.text2}>
                      ({prop.minTime != "" ? prop.minTime : "Not Available"})
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isCurrentAddressModalOpen}
        onRequestClose={this.closeSearchModal}
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
        onRequestClose={this.closeSearchModal}
      >
        <View style={styles.searchModalOverlay}>
          <View style={styles.seacrhModalContainer}>
            <View style={styles.seacrhModalBody}>
              <GooglePlacesAutocomplete
                placeholder="Destination"
                onPress={(data, details = null) => {
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

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={this.state.isRequestModalOpen}
      >
        <View style={styles.reqModalOverlay}>
          <View style={styles.reqModalContainer}>
            <View style={styles.reqModalHeader}>
              <Text style={styles.reqModalTitle}>Add Booking Request</Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.closeRequestModal}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color={Colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.reqModalBody}>
              <View style={{ paddingRight: 8 }}>
                <AddressTimeline
                  source={
                    "C/6, Birnagar,Kolkata, Maidandd, Esplaned, West Bengal 700050, India"
                  }
                  destination={
                    "Esplaned Bus Stop, Maidan, Esplaned, Kolkata, West Bengal 700050, India"
                  }
                />

                <Text style={styles.distanceLabel}>
                  Distance: <Text style={{ fontWeight: "normal" }}>2.5 KM</Text>
                </Text>

                <Text style={styles.dropdownLabel}>Service Type:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    mode="dropdown"
                    style={{ height: 42 }}
                    selectedValue={this.state.serviceTypeID}
                    onValueChange={(value, index) =>
                      this.setState({ serviceTypeID: value })
                    }
                  >
                    {(this.state.allCars || []).map((v, i) => (
                      <Picker.Item
                        key={v.value}
                        label={v.label}
                        value={v.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <TouchableOpacity activeOpacity={1} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
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
    backgroundColor: "green",
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
    borderBottomColor: Colors.grey,
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
    flex: 1,
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
    height: 60,
    width: width,
    flexDirection: "row",
  },
  buttonContainer: {
    width: width / 2,
    height: 60,
  },
  buttonStyle: {
    width: width / 2,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitleStyle: {
    color: Colors.WHITE,
    fontFamily: "Roboto-Bold",
    fontSize: 18,
  },
  locationButtonView: {
    position: "absolute",
    height: Platform.OS == "ios" ? 55 : 42,
    width: Platform.OS == "ios" ? 55 : 42,
    bottom: 180,
    right: 10,
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
    marginVertical: 20,
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
  },
  imageStyle1: {
    height: 40,
    width: 50 * 1.8,
  },
  textViewStyle: {
    height: 50,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  text1: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
    fontWeight: "900",
    color: Colors.black,
  },
  text2: {
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    fontWeight: "900",
    color: Colors.grey,
  },
});
