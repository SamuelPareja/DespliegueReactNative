import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { firebaseApp } from '../../../firebase-config';
import data from "../data.json";

export function PerfilScreen() {
    const [publicaciones, setPublicaciones] = useState([]);
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('Cargando...');
    const [mostrarLikes, setMostrarLikes] = useState(false);
    const auth = getAuth(firebaseApp);

    useEffect(() => {
        const fetchUserData = () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setEmail(currentUser.email);
                const uid = currentUser.uid;
                const usuario = data.usuarios.find((user) => user._id === uid);
                if (usuario) {
                    setNombre(usuario.nombre || "Sin nombre");
                } else {
                    console.warn("Usuario no encontrado en data.json");
                    setNombre("Sin nombre");
                }
            } else {
                console.warn("No hay ningún usuario autenticado");
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    console.warn("No hay usuario autenticado");
                    return;
                }

                const userId = currentUser.uid;

                const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/proyecto01/publicaciones");
                if (!response.ok) throw new Error("Error al cargar publicaciones");
                const data = await response.json();

                let publicacionesFiltradas;
                if (mostrarLikes) {
                    // Filtrar publicaciones que el usuario ha dado like
                    publicacionesFiltradas = data.filter(pub => 
                        pub.like && pub.like.includes(userId) && pub.image_url
                    );
                } else {
                    // Filtrar publicaciones del usuario actual
                    publicacionesFiltradas = data.filter(pub => 
                        pub.user_id === userId && pub.image_url
                    );
                }
                
                setPublicaciones(publicacionesFiltradas);
            } catch (error) {
                console.error("Error al cargar publicaciones:", error);
            }
        };

        fetchPublicaciones();
    }, [mostrarLikes]);

    return (
        <View style={styles.container}>
            <View style={styles.profileTopSection}>
                <Image source={require('../../../assets/user_default.png')} style={styles.profileImage} />
                <View style={styles.publicacionesContainer}>
                    <Text style={styles.publicacionesNumero}>{publicaciones.length}</Text>
                    <Text style={styles.publicacionesTexto}>
                        {mostrarLikes ? "likes" : "publicaciones"}
                    </Text>
                </View>
            </View>

            <View style={styles.profileSection}>
                <Text style={styles.username}>{nombre}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>

            <View style={styles.buttonSection}>
                <TouchableOpacity onPress={() => setMostrarLikes(false)}>
                    <Image 
                        source={require('../../../assets/boton_publicaciones.png')} 
                        style={[styles.iconButton, !mostrarLikes && styles.activeButton]} 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMostrarLikes(true)}>
                    <Image 
                        source={require('../../../assets/boton_corazon.png')} 
                        style={[styles.iconButton, mostrarLikes && styles.activeButton]} 
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={publicaciones}
                numColumns={3}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.publicacionItem}>
                        <Image 
                            source={{ uri: item.image_url }} 
                            style={styles.publicacionImage} 
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B1B1B',
        alignItems: 'center',
        paddingTop: 20,
    },
    profileTopSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '90%',
        marginLeft: 40,
        marginBottom: 15,
        marginTop: 40,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#9fc63b',
        marginRight: 15,
    },
    publicacionesContainer: {
        alignItems: 'center',
    },
    publicacionesNumero: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    publicacionesTexto: {
        fontSize: 14,
        color: '#aaa',
    },
    profileSection: {
        alignSelf: 'flex-start',
        marginLeft: 40,
        marginBottom: 20,
    },
    username: {
        fontSize: 18,
        color: '#9fc63b',
        fontWeight: 'bold',
    },
    email: {
        color: '#aaa',
        textDecorationLine: 'underline',
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    iconButton: {
        width: 30,
        height: 30,
        marginHorizontal: 10,
    },
    publicacionItem: {
        width: 120,
        height: 120,
        margin: 1,
        backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    publicacionImage: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
});
