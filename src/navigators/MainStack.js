import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const MainStack = createStackNavigator();

import HomeScreen from '../pages/HomeScreen';
import ProductScreen from '../pages/ProductScreen';
import BluetoothScreen from '../pages/BluetoothScreen';

export default () => {
   return (
     <MainStack.Navigator>
       <MainStack.Screen
         name="Home"
         component={HomeScreen}
         options={{headerShown: false}}
       />
       <MainStack.Screen
         name="Produto"
         component={ProductScreen}
         options={{headerShown: false}}
       />
       <MainStack.Screen
         name="Bluetooth"
         component={BluetoothScreen}
         options={{headerShown: false}}
       />
     </MainStack.Navigator>
   );
}