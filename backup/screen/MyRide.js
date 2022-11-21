import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlightBase,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Constants from "expo-constants";
const Tab = createMaterialTopTabNavigator();
import Colors from "../config/colors";
import OngoingRide from "../component/OngoingRide";
import UpcomingRide from "../component/UpcomingRide";
import RideHistory from "../component/RideHistory";
import Header from "../component/Header";

export default class MyRide extends React.Component {
  state = {
    activeTab: "Ongoing",
  };

  render = () => {
    return (
      <View style={styles.container}>
        <Header
          leftIconName={"ios-menu-sharp"}
          leftButtonFunc={() => this.props.navigation.toggleDrawer()}
          title={"My Rides"}
        />
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() =>
              this.state.activeTab !== "Ongoing"
                ? this.setState({ activeTab: "Ongoing" })
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
              this.state.activeTab !== "Upcoming"
                ? this.setState({ activeTab: "Upcoming" })
                : null
            }
            style={
              this.state.activeTab == "Upcoming"
                ? styles.tabItemActive
                : styles.tabItem
            }
          >
            <Text
              style={
                this.state.activeTab == "Upcoming"
                  ? { fontWeight: "bold" }
                  : null
              }
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.state.activeTab !== "Past"
                ? this.setState({ activeTab: "Past" })
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
        {this.state.activeTab == "Ongoing" ? (
          <OngoingRide {...this.props} />
        ) : this.state.activeTab == "Upcoming" ? (
          <UpcomingRide {...this.props} />
        ) : (
          <RideHistory {...this.props} />
        )}
      </View>
    );
  };
}
const styles = StyleSheet.create({
  container: {
    //paddingTop: Constants.statusBarHeight,
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
    width: "33.33%",
  },
  tabItemActive: {
    alignItems: "center",
    borderBottomWidth: 2,
    paddingVertical: 15,
    width: "33.33%",
  },
});
