import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';

import auth from '@react-native-firebase/auth';

export default class HomeSreen extends Component {
  sout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }
  render() {
    return (
      <View>
        <ImageBackground
          source={require('../assets/homebkcg4.png')}
          resizeMode='contain'
          style={styles.image2}
          imageStyle={styles.image2_imageStyle}
        >
        </ImageBackground>
        <View style={styles.bottom} >

        </View>
        <ScrollView>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text>
          <Text>1</Text><Text>1</Text>
          
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image2: {
  },
  image2_imageStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  bottom : {
    height: Dimensions.get('window').height*0.8,
  }

});