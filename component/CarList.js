import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Image
} from 'react-native'
import { Tooltip, Icon, Button } from "react-native-elements";
import Colors from "../config/colors";
import { FontAwesome } from "@expo/vector-icons";


const CarList = ({ prop, key, selectCarType }) => {
    return (
        <TouchableOpacity
            onPress={() => {
                prop.provider_data.length > 0 ? selectCarType(prop, key) : null
            }}
            activeOpacity={1}
            key={key}
        >
            <View
                key={key}
                style={[
                    styles.subContainer,
                    {
                        backgroundColor:
                            prop.active == true
                                ? Colors.LIGHTYELLOW
                                : prop.provider_data.length > 0 ?
                                    Colors.WHITE : "#f5f5f5"
                        ,
                        borderWidth: 1,
                        borderColor: prop.active == true
                            ? Colors.YELLOWBORDER
                            : prop.provider_data.length > 0 ?
                                Colors.WHITE : "#f5f5f5"
                    },
                ]}
            >
                <View
                    style={[styles.imageStyle, { width: "20%", }]}
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
                </View>
                <View style={styles.CarNameContainer}>
                    <Text style={styles.text1}>{`${prop.name.toUpperCase()}`}
                        &nbsp;&nbsp;<FontAwesome name="user" size={12} color={`${Colors.DULL_RED}`} />
                        <Text>&nbsp;{`${prop.capacity ?? 0}`}</Text>
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text2}>
                            ({prop.provider_data.length > 0 ? prop.provider_data.length + ' Cars available' : "Not Available"})
                        </Text>
                    </View>
                </View>
                <View
                    style={styles.carCapacityContainer}
                >
                    {prop.capacity && prop.capacity != "" ? (
                        <View style={{ marginRight: 5 }}>
                            <Tooltip
                                backgroundColor={"#fff"}
                                overlayColor={"rgba(50, 50, 50, 0.70)"}
                                height={10 + 70 * 2}
                                width={250}
                                skipAndroidStatusBar={true}
                                popover={
                                    <View
                                        style={{
                                            justifyContent: "space-around",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Text key={key}>{`${prop.description}`}</Text>

                                    </View>
                                }
                            >
                                <Icon
                                    name="information-circle-outline"
                                    type="ionicon"
                                    color={`${Colors.grey}`}
                                    size={18}
                                />
                            </Tooltip>
                        </View>
                    ) : null}
                    <Text
                        style={[
                            styles.text2,
                            { fontWeight: "bold", color: Colors.black, marginRight: 3 },
                        ]}
                    >
                        {prop?.price ? "₹" : null}
                        {prop.price ?? null}
                    </Text>
                </View>
            </View>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    subContainer: {
        flexDirection: 'row',
        elevation: 3,
        marginHorizontal: 10,
        paddingHorizontal: 5,
        marginVertical: 5,
        borderRadius: 10
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
    CarNameContainer: {
        width: "50%",
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    carCapacityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        paddingRight: 5,
        width: "30%",
        justifyContent: 'flex-end'
    },
    text2: {
        fontSize: 13,
        fontWeight: "900",
        color: Colors.grey,
    },
    text1: {
        fontSize: 13,
        fontWeight: "bold",
        color: Colors.black,
        // alignSelf: 'center'
    },
})

export default CarList;
