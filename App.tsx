import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//screens and assets
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return <LoginScreen /> ;
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