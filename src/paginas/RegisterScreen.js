import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos1, setApellidos1] = useState('');
  const [apellidos2, setApellidos2] = useState('');
  const navigation = useNavigation();
  const auth = getAuth();

  const handleRegister = async () => {
    try {
      // Registrar usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid; // Obtener el UID del usuario
      await AsyncStorage.setItem("userEmail", email); // Guarda el email
      await AsyncStorage.setItem("userName", nombre); // Guarda el email

      // Datos que se enviarán al backend
      const userData = {
        id: uid, // UID de Firebase
        nick,
        nombre,
        apellidos: `${apellidos1} ${apellidos2}`, // Combinar apellidos
        profile_picture: "", // Por ahora vacío
      };

      // Llamada al backend para registrar al usuario en MongoDB
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/proyecto01/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Error en el registro del usuario en MongoDB.");
      }

      Alert.alert("Éxito", "Usuario registrado correctamente.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error en el registro:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/img_registrase.png')} style={styles.image} />
      <Text style={styles.title}>Completar los siguientes campos:</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduzca su nick"
        placeholderTextColor="#aaa"
        value={nick}
        onChangeText={setNick}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su nombre"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su primer apellido"
        placeholderTextColor="#aaa"
        value={apellidos1}
        onChangeText={setApellidos1}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su segundo apellido"
        placeholderTextColor="#aaa"
        value={apellidos2}
        onChangeText={setApellidos2}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su e-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
  container: {
    flex: 1,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    color: '#58D68D',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    color: '#fff',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  finalizeButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#58D68D',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  finalizeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
