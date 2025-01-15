
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const auth = getAuth();

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Éxito', 'Usuario registrado correctamente.');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error(error.message);
        Alert.alert('Error', 'No se pudo crear la cuenta. Revisa los datos ingresados.');
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/img_registrase.png')} style={styles.image} />
      <Text style={styles.title}>Completar los siguientes campos:</Text>
      <TextInput style={styles.input} placeholder="Introduzca su nick" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Introduzca su nombre" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Introduzca su primer apellido" placeholderTextColor="#aaa" />
      <TextInput style={styles.input} placeholder="Introduzca su segundo apellido" placeholderTextColor="#aaa" />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su e-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.finalizeButton} onPress={handleRegister}>
        <Text style={styles.finalizeButtonText}>FINALIZAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#282828', justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: 200, height: 200, marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 18, color: '#58D68D', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', height: 50, borderBottomWidth: 1, borderBottomColor: '#aaa', color: '#fff', marginBottom: 15, paddingHorizontal: 10 },
  finalizeButton: { width: '100%', height: 50, backgroundColor: '#58D68D', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 20 },
  finalizeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
