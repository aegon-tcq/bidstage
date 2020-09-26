import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';


export default class ProjectListingScreen extends Component {

  
  render() {
    return (
      <View>
        <View style={styles.topview}>
          <Text style={styles.header}>Category</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topview: {
    backgroundColor: '#7d86f8',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 10,
    shadowColor: "rgb(125, 134, 248)",
    shadowOffset: {
      height: 20,
      width: 20
    },
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  header: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',

  }

})