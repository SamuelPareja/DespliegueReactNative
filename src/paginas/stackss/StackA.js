import { View, Text, Button } from 'react-native';
import React from 'react';
import { useNavigation } from "@react-navigation/native";


export function StackA() {
    const navigation = useNavigation();
    return(
        <View>
            <Text>StackA</Text>
            <Button title='StackB' onPress={() => navigation.navigate('A2')} />
        </View>
    )
}
