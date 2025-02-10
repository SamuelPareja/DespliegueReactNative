
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const auth = getAuth();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Usuario autenticado correctamente');
      })
      .catch((error) => {
        console.error(error.message);
        Alert.alert('Error', 'Credenciales incorrectas o usuario no registrado.');
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo_vedruna.png')} style={styles.logo} />
      <Text style={styles.title}>VEDRUNA EDUCACIÓN</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduzca su correo o nick..."
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su contraseña..."
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
  
      {/* Contenedor para el texto en la parte inferior */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
          <Text style={styles.createAccount}>
            ¿No tienes cuenta? <Text style={styles.createAccountLink}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
  logo: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#3C3C3C',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 15,
  },
  forgotPassword: { color: '#9fc63b', alignSelf: 'flex-end', marginBottom: 30 },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#9fc63b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  createAccount: { color: '#aaa', marginTop: 10 },
  createAccountLink: { color: '#9fc63b', fontWeight: 'bold' 
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30, 
    alignSelf: 'center',
  },
});
