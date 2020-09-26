import React, { Component } from 'react';
import {
  ActivityIndicator,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//importing screens 
import SplashScreen from './screens/SplashScreen.js';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen.js';
import auth from '@react-native-firebase/auth';
import BottomNavigator from './Components/BottomNavigator.js';
const Stack = createStackNavigator();

class App extends Component {

  state = {
    LoggedIn: null
  }


  componentDidMount(){

    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          LoggedIn: true
        })
      }
      else {
        this.setState({
          LoggedIn: false
        })
      }
    })
  }

  render() {
    switch (this.state.LoggedIn) {
      case false:
        return (
          <>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
                <Stack.Screen options={{ headerShown: false }} name="LoginScreen" component={LoginScreen} />
                <Stack.Screen options={{ headerShown: false }} name="SignupScreen" component={SignupScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </>
        );
      case true:
        return <BottomNavigator />

      default:
        return <ActivityIndicator
          style={{
            flex:1,
            backgroundColor: 'rgba(125,134,248,1)',
          }}
          size='large'
          color='#F1FAEE'
        />

    }
  }
};

export default App;
