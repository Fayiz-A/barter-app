import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import database from './configs/firebase.config';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//screens and assets
import LoginScreen from './screens/LoginScreen';
import { Provider } from 'react-native-paper';
import ExchangeViewTabNavigator from './screens/ ExchangeViewTabNavigator';

export default function App() {

	database.enablePersistence();

	const Stack = createStackNavigator();

	const defaultOptions = {
		headerShown: false
	}

	return (
			<Provider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName='exchangeViewTabNavigator'>
						<Stack.Screen
							name='loginScreen'
							component={LoginScreen}
							options={defaultOptions}
						/>
						<Stack.Screen
							name='exchangeViewTabNavigator'
							component={ExchangeViewTabNavigator}
							options={defaultOptions}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
	)
}

export const injectWebCss = () => {

	// Only on web
	if (Platform.OS != 'web') return

	// Inject style
	const style = document.createElement('style')
	style.textContent = `textarea, select, input, button { outline: none!important; }`
	return document.head.append(style)

}

injectWebCss()