//estaa
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsScreen } from '../tabs';
import { NuevaIncidenciaScreen } from '../tabs';

const Stack = createStackNavigator();

export function StackNavegacionSettings() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="NuevaIncidenciaScreen" component={NuevaIncidenciaScreen} />
    </Stack.Navigator>
  );
}
