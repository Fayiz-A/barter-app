import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

interface Props {
   title:string
}

export default function CustomAppBar(props: Props) {
   return(
      <Appbar.Header
         style={{backgroundColor: '#6d4c41'}}
      >
         <Appbar.Content title={props.title} style={{alignItems: "center"}}/>
      </Appbar.Header>
   );
}

const styles = StyleSheet.create({
   centerComponent: {
      fontSize: 20
   }
})