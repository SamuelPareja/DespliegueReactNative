import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; 
import { HomeScreen, PerfilScreen, AddScreen } from "../tabs";
import { StackNavegacionPubli } from "../navegacion/StackNavegacionPubli";
import { StackNavegacionSettings } from "../navegacion/StackNavegacionSettings";  // 🔹 Importa el nuevo Stack

export function TabNavegacion() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: "#282828" },
                tabBarActiveTintColor: "#9fc63b",
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
                name="Perfil"
                component={PerfilScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Incidencias"
                component={StackNavegacionSettings}  // 🔹 Usa el Stack en lugar de SettingsScreen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
