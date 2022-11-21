import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlightBase,
  ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Constants from "expo-constants";
const Tab = createMaterialTopTabNavigator();
import Colors from "../config/colors";
import OngoingRide from "../component/OngoingRide";
import UpcomingRide from "../component/UpcomingRide";
import RideHistory from "../component/RideHistory";
import PastRides from "../component/PastRideHistory";
import Header from "../component/Header";
import { fetchRideHistory } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class MyRide extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "Ongoing",
      loading: true,
      data: [],
    };
  }

  componentDidMount() {
    const { activeTab } = this.state;
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      console.log("Current State", this.state);
      this.setState(
        {
          loading: true,
        },
        () => {
          this.getRideHistory(this.state.activeTab);
        }
      );
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  changeActiveTab = (tabName) => {
    this.setState(
      {
        loading: true,
        activeTab: tabName,
      },
      () => {
        this.getRideHistory(tabName);
      }
    );
  };

  getRideHistory = (tabName) => {
    const { userData } = this.context;
    let obj = {
      rideType: tabName,
      user_id: userData.id,
      user_type: "user",
    };
    fetchRideHistory(obj)
      .then((response) => {
        console.log(this.state.activeTab, response);
        let obj = [];
        if (response.data.length > 0) {
          obj = response.data.map((item) => {
            return JSON.parse(item);
          });
        }
        this.setState({ data: obj, loading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render = () => {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop:
              this.state.activeTab === "Ongoing"
                ? Constants.statusBarHeight
                : 0,
          },
        ]}
      >
        <Header
          leftIconName={"ios-menu-sharp"}
          leftButtonFunc={() => this.props.navigation.toggleDrawer()}
          title={"My Rides"}
        />
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() =>
              this.state.activeTab !== "Ongoing"
                ? this.changeActiveTab("Ongoing")
                : null
            }
            style={
              this.state.activeTab == "Ongoing"
                ? styles.tabItemActive
                : styles.tabItem
            }
          >
            <Text
              style={
                this.state.activeTab == "Ongoing"
                  ? { fontWeight: "bold" }
                  : null
              }
            >
              Ongoing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.state.activeTab !== "Past"
                ? this.changeActiveTab("Past")
                : null
            }
            style={
              this.state.activeTab == "Past"
                ? styles.tabItemActive
                : styles.tabItem
            }
          >
            <Text
              style={
                this.state.activeTab == "Past" ? { fontWeight: "bold" } : null
              }
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        ) : this.state.activeTab == "Ongoing" ? (
          <RideHistory {...this.props} rideData={this.state.data} />
        ) : (
          <PastRides {...this.props} rideData={this.state.data} />
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Constants.statusBarHeight,
    flex: 1,
    //backgroundColor: Colors.primary
  },
  tabBar: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 15,
    // flex: 1,
    width: "50%",
  },
  tabItemActive: {
    alignItems: "center",
    borderBottomWidth: 2,
    paddingVertical: 15,
    width: "50%",
  },
});
