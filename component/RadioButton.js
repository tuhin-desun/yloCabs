import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../config/colors'

export default class RadioButton extends Component {
    state = {
        value: null,
    };

    render() {
        const { data } = this.props;
        const { value } = this.state;

        return (
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,
                marginBottom: 15,
            }}>
                {data.map(res => {
                    return (
                        <TouchableOpacity
                            key={res.key}
                            activeOpacity={1}
                            style={styles.container}
                            onPress={() => {
                                this.setState({
                                    value: res.key,
                                });
                            }}>
                            <Text style={styles.radioText}>{res.text}</Text>

                            <View style={value === res.key ? styles.radioCircleSelected : styles.radioCircle}>
                                {value === res.key && <View style={styles.selectedRb} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '30%',
        borderWidth: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.textInputBorder,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 5,

    },
    radioText: {
        // marginRight: 35,
        fontSize: 14,
        color: '#000',
        fontWeight: '700'
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        borderWidth: 2,
        borderColor: Colors.textInputBorder,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleSelected: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: Colors.primary,
    },
});