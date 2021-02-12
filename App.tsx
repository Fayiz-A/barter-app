import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

//screens and assets
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return (
    <View>
        <LoginScreen /> 
    </View>
  );
}

const styles = StyleSheet.create({

});
