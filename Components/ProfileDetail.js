import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class ProfileDetail extends Component {

    render() {
        return (
            <View
                style={styles.container}
            >
                <View style={styles.header}>
                    <Text style={styles.headerText} >Profile Detail</Text>
                </View>
          
                {/* <LinearGradient
                    colors={['#003973', '#E5E5BE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        marginLeft:'2.5%',
                        width: '95%',
                        borderRadius: 20,
                        padding: 15,
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,

                        elevation: 14,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                        <Image
                            source={require('../assets/resume.png')}
                            style={{ height: 45, width: 45 }}
                        />
                        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Description</Text>
                    </View>
                    <Text style={{ color: '#FFF', marginTop: 15 }}>
                        The definition of a description is a statement that gives details about someone or something. An example of description is a story about the places visited on a family trip. noun.
                    </Text>
                </LinearGradient> */}
                <LinearGradient
                    colors={['#fbc7d4', '#9796f0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        marginLeft:'2.5%',
                        width: '95%',
                        borderRadius: 20,
                        padding: 15,
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 7,
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,

                        elevation: 14,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                        <Image
                            source={require('../assets/contact-book.png')}
                            style={{ height: 45, width: 45 }}
                        />
                        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Contact Information</Text>
                    </View>
                    <View style={{ marginTop:25,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                        <Image
                            source={require('../assets/phone-call.png')}
                            style={{ height: 30, width: 30 }}
                        />
                        <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>+917974325920</Text>
                    </View>
                    <View style={{  marginTop:15,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                        <Image
                            source={require('../assets/message.png')}
                            style={{ height: 30, width: 30 }}
                        />
                        <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold' }}>ayush@gmail.com</Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7d86f8'
    },
    main: {
        flex: 1
    }
})