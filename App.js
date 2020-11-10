import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//importing screens 
import SplashScreen from './screens/SplashScreen.js';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen.js';
import auth from '@react-native-firebase/auth';
import BottomNavigator from './Components/BottomNavigator.js';

import LottieView from 'lottie-react-native';


const Stack = createStackNavigator();

class App extends Component {

  state = {
    LoggedIn: null
  }


  componentDidMount(){

    setTimeout(()=>auth().onAuthStateChanged((user) => { 
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
    
  }),1000)
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
        return <View style={{flex:1,alignItems:'center'}}>
           <LottieView source={require('./assets/splash.json')} autoPlay loop={false} />
           <Text style={{marginTop:'95%',color:'#7d86f8',fontWeight:'bold',fontSize:20}}>BidStage</Text>
        </View>

    }
  }
};

export default App;
