import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ProjectListingScreen from '../screens/ProjectListingScreen'


const Stack = createStackNavigator();


export default class ProjectDetailNavigator extends Component {

    render() {
        return (
                <Stack.Navigator>
                    <Stack.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen options={{ headerShown: false }} name="ProjectListingScreen" component={ProjectListingScreen} />
                </Stack.Navigator>
        );
    }
}