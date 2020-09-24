import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';


export default class SearchScreen extends Component{
  sout=()=>{
    auth()
  .signOut()
  .then(() => console.log('User signed out!'));
  }
  render(){
    return(
      <View>
        <Text>search</Text>
      </View>
    )
  }
}