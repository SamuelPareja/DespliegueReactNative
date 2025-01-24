import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; 
import { HomeScreen, SettingsScreen, AddScreen } from "../tabs"
import {StackNavegacionPubli} from "../navegacion/StackNavegacionPubli"

export function TabNavegacion() {
    const Tab = createBottomTabNavigator();
  return (
    // crea la barra de navegación inferior
        <Tab.Navigator
        screenOptions={{
            headerShown: false, // para quitar titulo de cabecera
            tabBarStyle: { backgroundColor: "#282828" },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#aaa",
        }}
    >
        <Tab.Screen
            name="Publicaciones"
            component={StackNavegacionPubli}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                ),
            }}
        />
        <Tab.Screen
            name="Añadir"
            component={AddScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="add-circle" color={color} size={size} />
                ),
            }}
        />
        <Tab.Screen
            name="Ajustes"
            component={SettingsScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" color={color} size={size} />
                ),
            }}
        />
      </Tab.Navigator>
  );
}