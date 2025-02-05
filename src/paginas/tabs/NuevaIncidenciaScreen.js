import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';

export function NuevaIncidenciaScreen() {
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);
    const [equipoClase, setEquipoClase] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUid(currentUser.uid);
        }
    }, []);

    const seleccionarImagen = async () => {
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

    const enviarIncidencia = async () => {
        if (!equipoClase || !titulo || !descripcion || !imageUri) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        const nuevaIncidencia = {
            id: Date.now().toString(), // Generamos un ID único
            user_id: uid,
            image_url: imageUri,
            equipoClase: equipoClase,
            titulo: titulo,
            descripcion: descripcion,
            estado: 'EN TRÁMITE'
        };

        try {
            // Aquí deberías enviar la incidencia a tu backend si es necesario
            Alert.alert('¡Éxito!', 'Incidencia enviada con éxito.');
            navigation.navigate('SettingsScreen', { nuevaIncidencia });
        } catch (error) {
            Alert.alert('Error', 'No se pudo enviar la incidencia');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>INCIDENCIA</Text>

            <TouchableOpacity style={styles.imageContainer} onPress={seleccionarImagen}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <Image source={require("../../../assets/Add.png")} style={styles.image} />
                )}
            </TouchableOpacity>

            <Text style={styles.label}>Nº del equipo / clase:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="" 
                placeholderTextColor="#A0A0A0"
                value={equipoClase}
                onChangeText={setEquipoClase}
            />

            <Text style={styles.label}>Título:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Máx. 40 Caracteres" 
                placeholderTextColor="#A0A0A0" 
                maxLength={40}
                value={titulo}
                onChangeText={setTitulo}
            />

            <Text style={styles.label}>Descripción del problema:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Máx. 250 Caracteres"
                placeholderTextColor="#A0A0A0"
                maxLength={250}
                multiline
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <TouchableOpacity style={styles.botonEnviar} onPress={enviarIncidencia}>
                <Text style={styles.textoBoton}>ENVIAR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1B1B1B",
        padding: 20,
        
    },
    header: {
        fontSize: 26,
        color: "#9fc63b",
        textAlign: "center",
        marginBottom: 40,
        marginTop:40,
        fontWeight: "bold",
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 35,
        borderWidth: 2,        // 🔹 Borde alrededor de la imagen
        borderColor: "#9fc63b", // 🔹 Color verde del borde
        borderRadius: 10,       // 🔹 Para hacerlo redondeado (ajusta según el tamaño)
        padding: 12, 
        width: 160,
        marginLeft: 100,
    },
    image: {
        width: 130,
        height: 130,
    },
    label: {
        fontSize: 16,
        color: "#9fc63b",
        marginBottom: 10,
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    textArea: {
        height: 150,
        textAlignVertical: "top",
    },
    botonEnviar: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#9fc63b",
        paddingVertical: 10,
        paddingHorizontal: 40, // 🔹 Para que el borde no sea tan ancho
        alignSelf: "center",    // 🔹 Para que el botón no ocupe todo el ancho
        borderRadius: 8,
    },
    textoBoton: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
