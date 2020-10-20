import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, Alert, ImageBackground } from "react-native";
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const SplashScreen = ({ navigation }) => {
  return (
    <Animatable.View
      animation='fadeInDown'
      duration={600}
      style={styles.container}
    >
      <ImageBackground
        source={require("../assets/MainPurple.png")}
        resizeMode='stretch'
        style={styles.image2}
        imageStyle={styles.image2_imageStyle}
      >
        <Animatable.View
          animation='bounce'
          useNativeDriver={true}
          duration={900}
          style={{
            height: 200,
            width: 200,
            marginTop: '50%',
            borderRadius: 28,
            shadowColor: "rgba(0,0,0,1)",
            shadowOffset: {
              width: 20,
              height: 20
            },
            elevation: 5,
            shadowOpacity: 0.42,
            shadowRadius: 0,
          }}>
          <Image
            source={require('../assets/logos.png')}
            style={styles.logo}
          ></Image>

        </Animatable.View>
      </ImageBackground>
      <View style={styles.bottom}>
        <View style={{
          alignItems: 'center',
        }}>
          <Animatable.View
            animation='fadeInLeft'
            duration={1000}
          >
            <Text style={styles.post}>Post, Bid and Hire !</Text>
          </Animatable.View>

          <Animatable.View
            animation='fadeInRight'
            useNativeDriver={true}
            duration={1000}
          >
            <Text style={styles.txtbelow}>
              This is the best platform where you can get {"\n"}your work done in less
        money...
      </Text>
          </Animatable.View>
        </View>
        <View style={{
          marginTop: 25,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <Animatable.View
            animation='zoomIn'
            useNativeDriver={true}
            duration={1000}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.btext}>
                Go
              </Text>
              <FontAwesome
                name="arrow-circle-right"
                color='#FFF'
                size={20}
              />
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  logo: {
    height: 195,
    width: 195,
    borderRadius: 20,
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9fbfc'
  },
  post: {
    fontFamily: "roboto-700",
    color: "rgba(29,53,87,1)",
    fontSize: 28,
    textAlign: "center",
  },
  button: {
    height: 75,
    width: 75,
    borderRadius: 50,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 10,
      height: 10
    },
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 0,
    backgroundColor: "rgba(125,134,248,1)",
    padding: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection:'row'
  },
  btext: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15

  },
  image2: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: '#f9fbfc'
  },
  image2_imageStyle: {
    width: '100%',
    height: '50%',
    marginTop: '20%'

  },
  txtbelow: {
    marginTop: 5,
    fontFamily: "roboto-regular",
    color: "rgba(126,146,166,1)",
    textAlign: "center",
    fontSize: 12,
    opacity: 0.81
  }
});

export default SplashScreen;
