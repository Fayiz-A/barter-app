import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Dimensions, ScaledSize } from 'react-native';
import database from './configs/firebase.config';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, DrawerContent } from '@react-navigation/drawer';
import { DrawerItems } from 'react-navigation-drawer';

//screens and assets
import LoginScreen from './screens/LoginScreen';
import { Provider } from 'react-native-paper';
import ExchangeViewTabNavigator from './screens/ ExchangeViewTabNavigator';

function Root() {
	const Stack = createStackNavigator();

	const defaultOptions = {
		headerShown: false
	}

	return (
		<Stack.Navigator initialRouteName='homeScreen'>
			<Stack.Screen
				name='loginScreen'
				component={LoginScreen}
				options={defaultOptions}
			/>
			<Stack.Screen
				name='homeScreen'
				component={ExchangeViewTabNavigator}
				options={defaultOptions}
			/>
		</Stack.Navigator>

	)
}

export default function App() {

	if(database) database.enablePersistence();

	const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));

   useEffect(() => {
      Dimensions.addEventListener("change", ({ window, screen }) => {
         setDimensions(window);
      });
   }, []);

	const Drawer = createDrawerNavigator();

	const defaultOptions = {
		headerShown: false
	}

	const styles = (dimensions:ScaledSize) => StyleSheet.create({
		drawer: {
			borderTopRightRadius: 20,
			borderBottomRightRadius: 20,
		}
	})

	return (
			<Provider>
				<NavigationContainer>
						<Drawer.Navigator 
							initialRouteName='homeScreen' 
							drawerStyle={styles(dimensions).drawer}
							drawerContent={(options) => {
								return (
									<View>
										<DrawerContent 
											state={options.state}
											navigation={options.navigation}
											descriptors={options.descriptors}
											progress={options.progress}
										/>
										<Text>Hey</Text>
									</View>
								)
							}}
							drawerType='front'

						>
							<Drawer.Screen 
								name='Home'
								component={Root}
								options={defaultOptions}
							/>
						</Drawer.Navigator>
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