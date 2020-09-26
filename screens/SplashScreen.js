import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, Alert, ImageBackground } from "react-native";
import * as Animatable from 'react-native-animatable';

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
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}>
          <Animatable.View
            animation='fadeInUp'
            duration={1000}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert('alert pressed')}>
              <Text style={styles.btext}>
                Want to Work
              </Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            animation='fadeInUp'
            duration={1000}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.btext}>
                Want to Hire
              </Text>
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
    borderRadius: 15,
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
    paddingHorizontal: 15
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
