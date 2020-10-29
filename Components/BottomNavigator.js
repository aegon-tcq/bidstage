
import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ProjectDetailNavigator from './ProjectDetailNavigator';
import ProfileScreen from '../screens/ProfileScreen.js';
import PrposalsScreen from '../screens/PrposalsScreen.js';
import Myprojects from '../screens/Myprojects.js';




export default class BottomNavigator extends Component {
    render() {
        const Tabs = AnimatedTabBarNavigator();

        return (
            <NavigationContainer>
                <Tabs.Navigator
                    // default configuration from React Navigation
                    tabBarOptions={{
                        activeTintColor: '#7133D1',
                        inactiveTintColor: '#F1FAEE',
                        activeBackgroundColor: '#F1FAEE',
                        tabStyle: {
                            borderRadius: 30,
                            backgroundColor: '#7d86f8',
                            paddingTop: 5,
                            paddingBottom: 5,
                            marginBottom: 5,
                            marginLeft: '2.5%',
                            width: '95%',
                        },
                        backgroundColor: '#FFF'
                    }}

                    appearence={{
                        topPadding: 5,
                        horizontalPadding: 15,
                    }}
                >
                    <Tabs.Screen
                        name="Home"
                        component={ProjectDetailNavigator}
                        options={{
                            tabBarIcon: ({ focused, color }) => (
                                <Icon
                                    name="home"
                                    size={24}
                                    color={focused ? color : "#222222"}
                                    focused={focused}
                                    color={color}
                                />
                            )
                        }}

                    />
                     <Tabs.Screen
                        name="Proposals"
                        component={PrposalsScreen}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                                <MaterialCommunityIcons
                                    name="inbox-arrow-down"
                                    size={24}
                                    color={focused ? color : "#222222"}
                                    focused={focused}
                                    color={color}
                                />
                            )
                        }}
                    />
                   <Tabs.Screen
                        name="Accepted Bids"
                        component={Myprojects}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                                <MaterialCommunityIcons
                                    name="form-select"
                                    size={24}
                                    color={focused ? color : "#222222"}
                                    focused={focused}
                                    color={color}
                                />
                            )
                        }}
                    />
                    <Tabs.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                            tabBarIcon: ({ focused, color, size }) => (
                                <Icon
                                    name="user"
                                    size={24}
                                    color={focused ? color : "#222222"}
                                    focused={focused}
                                    color={color}
                                />
                            )
                        }}
                    />
                </Tabs.Navigator>
            </NavigationContainer>

        )
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});