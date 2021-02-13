import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import database from './configs/firebase.config';

//screens and assets
import LoginScreen from './screens/LoginScreen';
import { Provider } from 'react-native-paper';

export default function App() {
	database.enablePersistence();

  return <Provider>
	  			<LoginScreen /> 
		  	</Provider>
}

export const injectWebCss = () => {

	// Only on web
	if ( Platform.OS != 'web' ) return

	// Inject style
	const style = document.createElement('style')
	style.textContent = `textarea, select, input, button { outline: none!important; }`
	return document.head.append(style)

}

injectWebCss()