import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from '../screens/ProfileScreen.js';
import EditProjectScreen from '../screens/EditProjectScreen.js';

const Stack = createStackNavigator();

export default class ProfileScreenNavigator extends Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen options={{ headerShown: false }} name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen options={{ headerShown: false }} name="EditProjectScreen" component={EditProjectScreen} />
            </Stack.Navigator>
        );
    }
}