import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { PublicacionesContext } from '../../paginas/PublicacionesContext';

export function AddScreen() {
  const { agregarPublicacion } = useContext(PublicacionesContext);
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uid, setUid] = useState(null); // UID del usuario actual

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUid(currentUser.uid);
    }
  }, []);

    const seleccionarImagen = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu galería.');
            return;
        }
    
        Alert.alert(
            "Seleccionar imagen",
            "¿Qué deseas hacer?",
            [
                {
                    text: "Tomar foto",
                    onPress: tomarFoto
                },
                {
                    text: "Elegir de la galería",
                    onPress: elegirDeGaleria
                },
                {
                    text: "Cancelar",
                    style: "cancel"
                }
            ]
        );
    };
    
    const tomarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu cámara.');
            return;
        }
    
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };
    
    const elegirDeGaleria = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };  

  const publicar = async () => {
    if (!title || !description || !imageUri) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const nuevaPublicacion = {
      user_id: uid,
      image_url: imageUri, // Usar la URI de la imagen seleccionada
      titulo: title,
      comentario: description,
      like: [],
    };

    try {
      // Enviamos la publicación a MongoDB a través de la API del backend
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/proyecto01/publicaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaPublicacion),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la publicación en la base de datos');
      }

      // Si todo sale bien, también la agregamos al contexto para actualizar la lista localmente
      agregarPublicacion(nuevaPublicacion);

      // Reseteamos los campos
      setTitle('');
      setDescription('');
      setImageUri(null);

      Alert.alert('¡Éxito!', 'Publicación guardada y añadida con éxito.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la publicación en la base de datos');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>PUBLICACIÓN</Text>

        <View style={styles.imageWrapper}>
          <TouchableOpacity style={styles.imageContainer} onPress={seleccionarImagen}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Image
                source={require('../../../assets/Add.png')}
                style={styles.imagePlaceholder}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Título:</Text>
          <TextInput
            style={styles.input}
            placeholder="Máx. 40 Caracteres"
            placeholderTextColor="#707070"
            maxLength={40}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Máx. 250 Caracteres"
            placeholderTextColor="#707070"
            maxLength={250}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.button} onPress={publicar}>
            <Text style={styles.buttonText}>PUBLICAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#9fc63b',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 30,
    height: 160,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 10,
    borderColor: '#9fc63b',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  label: {
    color: '#9fc63b',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2B2B2B',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#FFF',
    marginBottom: 30,
    height: 40,
  },
  textArea: {
    height: 180,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1B1B1B',
    borderColor: '#9fc63b',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
