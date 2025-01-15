import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { StackA, StackB } from "../stackss"


export function StackNavegacionPubli() {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator screenOptions={{
           // headerShown: false, //para quitar titulo de cabecera
         }}>
            <Stack.Screen name="A1" component={StackA} />
            <Stack.Screen name="A2" component={StackB} />
        </Stack.Navigator>
    )
}
