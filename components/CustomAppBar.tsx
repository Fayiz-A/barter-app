import React from 'react';
import { StyleSheet, Text, View, ColorValue } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';

interface Props {
   title:string,
   color?: ColorValue,
   drawerAvailable?: boolean
}

export default function CustomAppBar(props: Props) {

   const navigation = useNavigation();
   
   return(
      <Appbar.Header
         style={{backgroundColor: props.color ? props.color:'#6d4c41'}}
      >
         {
            props.drawerAvailable ? <Appbar.Action 
               icon={'menu'}
               size={30}
               onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
            />:null
         }
         <Appbar.Content 
            title={props.title} 
            style={{alignItems: "center"}}
         />
      </Appbar.Header>
   );
}

const styles = StyleSheet.create({
   centerComponent: {
      fontSize: 20
   }
})