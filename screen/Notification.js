import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    TouchableOpacity
} from "react-native";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import Colors from "../config/colors";
import Config from "../config/Configs";
import Header from "../component/Header";
import { getNotifications } from "../services/APIServices";
import AppContext from "../context/AppContext";


const NEWS_CONTAINER_HEIGHT = 50;
const HEADING_CONTAINER_HEIGHT = 50;
const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 2) / 4);

export default class Notification extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.carousel = React.createRef();
        this.state = {
            isLoading: true,
            notifications: [],
            refreshing: false,
            isListEnd: false,
        };
        this.page = 0;
    }

    componentDidMount = () => {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchNotifications();
        });

    };

    componentWillUnmount = () => {
        this._unsubscribe();
    }



    footerComponent = () => {
        return (
            <>
                {!this.state.isListEnd ? (
                    <TouchableOpacity
                        style={{
                            width: "30%",
                            height: 30,
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={this.fetch_more_notification}
                    >
                        <Text style={{ color: Colors.white }}>Load More</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={{
                            width: "30%",
                            height: 30,
                            backgroundColor: Colors.primary,
                            borderRadius: 5,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={this.fetch_more_notification}
                    >
                        <Text style={{ color: Colors.white }}>No new notification available</Text>
                    </TouchableOpacity>
                )
                }
            </>
        )
    }

    fetchNotifications = () => {
        this.page = 1;
        let obj = {
            "page": this.page,
            "user_id": this.context.userData.id
        }
        getNotifications(obj)
            .then((response) => {
                this.setState({
                    isLoading: false,
                    notifications: response,
                });
            })
            .catch((error) => console.log(error));
    }

    fetch_more_notification = () => {
        this.page = this.page + 1;
        let obj = {
            "page": this.page,
            "user_id": this.context.userData.id
        }
        this.setState({
            isLoading: true
        }, () => {
            getNotifications(obj)
                .then((response) => {
                    if (response.length > 0) {
                        this.setState({
                            isLoading: false,
                            notifications: [...this.state.notifications, ...response],
                        });
                    } else {
                        this.setState({
                            isListEnd: true,
                            isLoading: false,
                        })
                    }
                })
                .catch((error) => console.log(error))
        })
    }

    checkAccount = (customerCode) => {
        getAccountInfo(customerCode)
            .then((response) => {
                if (response.is_deleted == '1') {
                    this.props.navigation.navigate("Logout")
                }
            })
            .catch((err) => { console.log(err) })
    }

    toggleDrawer = () => this.props.navigation.toggleDrawer();

    listEmptyComponent = () => <ListEmpty />;

    renderItem = ({ item }) => (
        <View style={styles.notificationsContainer}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '10%', alignItems: 'center' }}>
                    <Image style={{ height: 25, width: 25, marginTop: 5, paddingLeft: 20 }} source={require('../assets/pn-icon.png')} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 5, paddingVertical: 2, fontStyle: 'italic' }}>
                        <Text style={{ fontSize: 18, }}>{item.notification_title}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 5, paddingBottom: 10 }}>
                        <Text style={{ fontSize: 14, paddingRight: 5, textAlign: 'justify' }}>{item.notification}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    render = () => {
        return (
            <View style={styles.container}>
                <Header
                    leftIconName={"ios-menu-sharp"}
                    leftButtonFunc={() => this.props.navigation.toggleDrawer()}
                // title={"Notifications"}
                />
                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.notifications}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={this.state.notifications.length}
                        ListEmptyComponent={this.listEmptyComponent.bind(this)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={this.fetchNotifications}
                            />
                        }
                        ListFooterComponent={this.footerComponent}
                    />
                )}
            </View>
        )
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGrey,
    },
    newsSkeleton: {
        margin: 5,
        width: SLIDER_WIDTH - 10,
        height: NEWS_CONTAINER_HEIGHT,
        borderRadius: 3,
    },
    newsContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.secondary,
        margin: 5,
        height: NEWS_CONTAINER_HEIGHT,
        alignSelf: "center",
        paddingHorizontal: 5,
        borderRadius: 3,
    },
    carouselConatainer: {
        marginBottom: 5,
    },
    carouselSkeleton: {
        marginHorizontal: 5,
        height: ITEM_HEIGHT,
        width: ITEM_WIDTH - 10,
        borderRadius: 3,
    },
    slide: {
        height: ITEM_HEIGHT,
        width: ITEM_WIDTH - 10,
        marginHorizontal: 5,
        borderRadius: 3,
    },
    sliderImage: {
        height: ITEM_HEIGHT,
        width: ITEM_WIDTH - 10,
        borderRadius: 3,
    },
    headingContainer: {
        height: HEADING_CONTAINER_HEIGHT,
        width: "100%",
        backgroundColor: Colors.primary,
        flexDirection: "row",
    },
    titleContainer: {
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
    },
    headingText: {
        color: Colors.secondary,
        fontWeight: "bold",
        fontSize: 16,
    },
    listSkeleton: {
        width: 1000,
        height: 2000,
        borderRadius: 3,
    },
    btnContainer: {
        width: "25%",
        alignItems: "center",
        justifyContent: "center",
    },
    addBtn: {
        backgroundColor: Colors.warning,
        width: 70,
        paddingVertical: 5,
        borderRadius: 4,
    },
    withdrawBtn: {
        backgroundColor: Colors.danger,
        width: 70,
        paddingVertical: 5,
        borderRadius: 4,
    },
    btnText: {
        color: Colors.white,
        fontSize: 12,
        lineHeight: 12,
        textAlign: "center",
    },
    notificationsContainer: {
        marginVertical: 5,
        width: '97%',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.white,
        backgroundColor: Colors.white
    }
});
