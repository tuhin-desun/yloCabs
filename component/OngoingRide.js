import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Image,
} from "react-native";
import Colors from "../config/colors";
import { FontAwesome } from "@expo/vector-icons";
const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class OngoingRide extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            DATA: [
                {
                    id: 1,
                    status: "1",
                    title: "Prime SUV",
                },
                {
                    id: 2,
                    status: "0",
                    title: "Mini",
                },
                {
                    id: 3,
                    status: "0",
                    title: "Prime Sedun",
                },
                // {
                //     id: 4,
                //     status: "0",
                //     title: "Mini",
                // },
                // {
                //     id: 5,
                //     status: "0",
                //     title: "Mini",
                // },
                // {
                //     id: 6,
                //     status: "0",
                //     title: "Mini",
                // },
            ],
        }
    }





    renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.card}
            onPress={() => this.props.navigation.navigate("RideDetails")}
        >
            <View style={styles.cardHead}>
                {/* <View style={{ flexDirection: "row" }}> */}
                <View
                    style={styles.ImageContainer}
                    onPress={() => this.props.navigation.toggleDrawer()}
                >
                    <Image
                        source={require("../assets/taxi.png")}
                        style={styles.ImageStyle}
                        resizeMode={"contain"}
                    />
                </View>
                <View style={{ width: "70%", paddingLeft: 20 }}>
                    <Text style={styles.title}>Fri, Mar 12, 01:37 PM</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ paddingRight: 5 }}>
                            <Text style={{ fontSize: 12 }}>{item.title}</Text>
                        </View>
                        <Text style={{ color: "#ddd", fontSize: 12 }}>|</Text>
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ fontSize: 12 }} ellipsizeMode="tail">
                                YLO815326
                            </Text>
                        </View>
                    </View>

                    {/* {item.status == "1" ? (
                        <Text style={[styles.status, { color: "green" }]}>Complete</Text>
                    ) : (
                        <Text style={[styles.status, { color: "#d9534f" }]}>
                            Canceled
                        </Text>
                    )} */}
                </View>
                {/* </View> */}
                <View style={{ width: "15%", alignItems: "flex-end" }}>
                    <Text style={styles.title}>₹ 100</Text>
                    <Text style={styles.paymentStatus}>QR Pay</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.location}>
                    <View style={styles.mapMarker}>
                        <FontAwesome name="map-marker" size={15} color="green" />
                    </View>
                    <View style={styles.address}>
                        <Text style={styles.addressText} ellipsizeMode="tail" numberOfLines={2}>
                            C/6, Birnagar,Kolkata, Maidandd, Esplaned, West Bengal 700050,
                            India,
                        </Text>
                    </View>
                </View>
                <View style={styles.timeline}>
                    <Text style={styles.timelineItem}>
                        {"."}
                    </Text>
                    <Text style={styles.timelineItem}>
                        {"."}
                    </Text>
                    <Text style={styles.timelineItem}>
                        {"."}
                    </Text>
                    <Text style={styles.timelineItem}>
                        {"."}
                    </Text>
                    <Text style={styles.timelineItem}>
                        {"."}
                    </Text>
                </View>
                <View style={styles.location}>
                    <View style={styles.mapMarker}>
                        <FontAwesome name="map-marker" size={15} color="#d9534f" />
                    </View>
                    <View style={styles.address}>
                        <Text style={styles.addressText} ellipsizeMode="tail" numberOfLines={2}>
                            Esplaned Bus Stop, Maidan, Esplaned, Kolkata, West Bengal 700050,
                            India
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
    render = () => {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.DATA}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    // contentContainerStyle={{ height: '100%' }}
                    ListFooterComponent={() => <View style={{ height: 10 }} />}
                />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: Colors.white,
        marginTop: 10,
        marginHorizontal: 8,
        // height: windowheight / 5,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHead: {
        // borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
    },
    status: {
        fontSize: 12,
        fontWeight: "bold",
    },
    paymentStatus: {
        fontSize: 13,
        color: Colors.medium,
    },
    cardContent: {
        paddingVertical: 10,
        // paddingHorizontal: 10,
        marginHorizontal: 10,
        // borderWidth: 1
    },
    addressText: {
        // borderWidth: 1,
        fontSize: 13,
        color: "#243224",
    },
    timeline: {
        width: "10%",
        alignItems: "center",
        // borderWidth: 1
    },
    timelineItem: {
        fontSize: 8,
        lineHeight: 5,
        fontWeight: "bold"
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
        //borderWidth: 1,
        //marginHorizontal: 10
    },
    mapMarker: {
        width: "10%",
        alignItems: "center",
        paddingVertical: 5,
        //borderWidth: 1
    },
    address: {
        width: "90%"
    },
    ImageContainer: {
        width: "15%",
        //borderWidth: 1
    },
    ImageStyle: {
        height: 40,
        width: 60,
    },
});
