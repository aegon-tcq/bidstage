import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const HeaderComponent = (props) => {
    return (
        <LinearGradient
            colors={props.color}
            style={{
                height: 100,
                width: '100%',
                justifyContent: 'center',
                padding: 20,
                borderBottomLeftRadius:30

            }}
            start={{ x: 0.7, y: 0 }}
        >
            <Text style={{
                color: '#FFF'
            }}>{props.data}</Text>
        </LinearGradient>

    );
}

export default HeaderComponent;