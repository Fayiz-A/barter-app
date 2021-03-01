import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Dimensions, ScaledSize, useWindowDimensions } from 'react-native';
import database from './configs/firebase.config';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentOptions, DrawerContent } from '@react-navigation/drawer';
import { DrawerItems } from 'react-navigation-drawer';

//screens and assets
import LoginScreen from './screens/LoginScreen';
import { Provider } from 'react-native-paper';
import ExchangeViewTabNavigator from './screens/ ExchangeViewTabNavigator';
import CustomButton from './components/CustomButton';
import firebase from 'firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationActions } from 'react-navigation';
import { Icon } from 'react-native-elements';
import SettingsScreen from './screens/SettingsScreen';

interface DrawerScreenInfo {
	name: string,
	component: any
}

interface StackScreenInfo {
	name: string,
	component: any
}

function Root() {
	const Stack = createStackNavigator();

	const defaultOptions = {
		headerShown: false
	}

	const stackScreenInfoList:StackScreenInfo[] = [
		{
			name: 'loginScreen',
			component: LoginScreen,
		},
		{
			name: 'homeScreen',
			component: ExchangeViewTabNavigator,
		}
	];

	return (
		<Stack.Navigator initialRouteName='loginScreen'>
			{
				stackScreenInfoList.map(detail => {
					return (
						<Stack.Screen 
							name={detail.name}
							component={detail.component}
							options={defaultOptions}
						/>
					)
				})
			}
		</Stack.Navigator>

	)
}

export default function App() {

	// if(database) database.enablePersistence();
	const dimensions = useWindowDimensions();

	const Drawer = createDrawerNavigator();

	const defaultOptions = {
		headerShown: false
	}

	const styles = (dimensions: ScaledSize) => StyleSheet.create({
		drawer: {
			borderTopRightRadius: 20,
			borderBottomRightRadius: 20,
		},
		drawerContent: {
			flex: 1
		},
		logOutButton: {
			flex: 1,
			justifyContent: 'flex-end',
			paddingLeft: '5%',
			paddingBottom: '5%'
		},
		logOutButtonContent: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		logOutButtonText: {
			paddingLeft: '3%',
			fontWeight: 'bold',
			fontSize: 15
		}
	})


	const logOutUserAndNavigateToLoginScreen = async (navigation: any) => {
		await firebase.auth().signOut();
		navigation.navigate('loginScreen');
	}

	const drawerScreenInfoList:DrawerScreenInfo[] = [
		{
			name: 'Home',
			component: Root,
		},
		{
			name: 'Settings',
			component: SettingsScreen,
		}
	];

	return (
		<Provider>
			<NavigationContainer>
				<Drawer.Navigator
					initialRouteName='homeScreen'
					drawerStyle={styles(dimensions).drawer}
					drawerContent={(options) => {
						return (
							<View style={styles(dimensions).drawerContent}>
								<DrawerContent
									state={options.state}
									navigation={options.navigation}
									descriptors={options.descriptors}
									progress={options.progress}
								/>
								<View style={styles(dimensions).logOutButton}>
									<TouchableOpacity
										onPress={() => logOutUserAndNavigateToLoginScreen(options.navigation)}
									>
										<View style={styles(dimensions).logOutButtonContent}>
											<Icon name='power-off' type='font-awesome'/>
											<Text style={styles(dimensions).logOutButtonText}>Log Out</Text>
										</View>
									</TouchableOpacity>
								</View>
							</View>
						)
					}}
					drawerType='front'

				>
					{
						drawerScreenInfoList.map(detail => {
							return (
								<Drawer.Screen 
									name={detail.name}
									component={detail.component}
									options={defaultOptions}
								/>
							)
						})
					}
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