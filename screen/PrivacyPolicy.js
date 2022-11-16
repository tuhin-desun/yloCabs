import React, { useState, useContext, useEffect } from "react";
import { Text, StyleSheet, View, useWindowDimensions, ScrollView, ActivityIndicator } from "react-native";
import Colors from "../config/colors";
import { Header } from "../component";
import AppContext from "../context/AppContext";
import RenderHtml from 'react-native-render-html';
import { getValueOfSetting } from "../utils/Util";

const PrivacyPolicy = (props) => {

    const context = useContext(AppContext);
    const { width } = useWindowDimensions();
    const [content, setContent] = useState(getValueOfSetting(context.settings, 'page_privacy')[0].value,);
    const [screenName, setScreenName] = useState(props.route.params?.name ?? '');

    const source = {
        html: content
    };

    return (
        <View style={styles.container}>
            <Header
                leftIconName={"ios-arrow-back"}
                leftButtonFunc={() => props.navigation.goBack()}
                title={'Privacy Policy'}
                rightIconName={"name"}
            />
            <ScrollView style={{ flex: 1, backgroundColor: 'transparent', paddingHorizontal: 10 }}>
                <RenderHtml
                    contentWidth={width}
                    source={source}
                />
            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    section: {
        flex: 1,
    },
    detailsSection: {
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
    }
});

export default PrivacyPolicy;
