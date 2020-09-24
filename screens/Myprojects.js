import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';


export default class Myprojects extends Component{
  sout=()=>{
    auth()
  .signOut()
  .then(() => console.log('User signed out!'));
  }
  render(){
    return(
      <View>
        <Text>Project</Text>
      </View>
    )
  }
}