import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import RequestScreen from './RequestScreen';
import ExchangeScreen from './ExchangeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome';

function ExchangeViewTabNavigator() {

   const BottomTab = createMaterialBottomTabNavigator();

   return (
      <BottomTab.Navigator
         barStyle={{ backgroundColor: 'purple' }}
      >
         <BottomTab.Screen
            name="exchangeScreen"
            component={ExchangeScreen}
            options={{
               tabBarLabel: 'Exchange Screen',
               title: 'Exchange Items',
               tabBarIcon: ({color}) => <MaterialCommunityIcons 
                  name='handshake-o'
                  size={20}
                  color={color}
               />
            }}
         />
         <BottomTab.Screen
            name="requestScreen"
            component={RequestScreen}
            options={{
               tabBarLabel: 'Request Screen',
               title: 'Request Items',
               tabBarIcon: ({color}) => <MaterialCommunityIcons 
                  name='envelope-open'
                  size={20}
                  color={color}
               />
            }}
         />
      </BottomTab.Navigator>
   )
}

export default ExchangeViewTabNavigator;