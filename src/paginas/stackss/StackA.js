import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth"; // Importamos Firebase Auth
import data from "../data.json"; // Importamos el archivo data.json

export function StackA() {
  const [publicaciones, setPublicaciones] = useState([]); // Almacena las publicaciones
  const [usuarios, setUsuarios] = useState({}); // Almacena los usuarios por _id
  const [loading, setLoading] = useState(true); // Maneja el estado de carga
  const [userNick, setUserNick] = useState(""); // Almacena el nick del usuario autenticado
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch de publicaciones
        const publicacionesResponse = await fetch(process.env.EXPO_PUBLIC_API_URL + "/proyecto01/publicaciones");
        if (!publicacionesResponse.ok) throw new Error("Error al cargar publicaciones");
        const publicacionesData = await publicacionesResponse.json();

        // Convertir usuarios de data.json a un objeto con _id como clave
        const usuariosPorId = {};
        data.usuarios.forEach((usuario) => {
          usuariosPorId[usuario._id] = usuario; // Almacena los usuarios del JSON
        });

        setPublicaciones(publicacionesData); // Guarda las publicaciones del backend
        setUsuarios(usuariosPorId); // Usa los usuarios del JSON
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    const fetchUserNick = () => {
      const auth = getAuth(); // Inicializamos Firebase Auth
      const currentUser = auth.currentUser; // Obtenemos el usuario autenticado

      if (currentUser) {
        const uid = currentUser.uid; // UID del usuario autenticado
        const usuario = data.usuarios.find((user) => user._id === uid); // Buscamos el usuario en data.json

        if (usuario) {
          setUserNick(usuario.nick); // Actualizamos el nick del usuario
        } else {
          console.warn("Usuario no encontrado en data.json");
        }
      } else {
        console.warn("No hay ningún usuario autenticado");
      }
    };

    fetchData();
    fetchUserNick();
  }, []);

  // Muestra un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando publicaciones...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../../../assets/logo_vedruna.png")} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.nick}>{userNick || "Nick"}</Text> {/* Mostramos el nick del usuario autenticado */}
          <Text style={styles.title}>VEDRUNA</Text>
        </View>
      </View>

      {/* Publicaciones */}
      {publicaciones.map((post, index) => {
        const usuario = usuarios[post.user_id]; // Busca el usuario relacionado con la publicación

        return (
          <View key={index} style={styles.publicationWrapper}>
            <TouchableOpacity
              style={styles.publication}
              onPress={() => navigation.navigate("A2", { post })} // Navegamos a StackB con los datos de la publicación
            >
              <View style={styles.userInfo}>
                <Image
                  source={require("../../../assets/user_default.png")}
                  style={styles.userImage}
                />
                <View>
                  <Text style={styles.publishedBy}>Publicado por</Text>
                  <Text style={styles.userName}>
                    {usuario?.nombre || "Usuario desconocido"} {/* Usuario o fallback */}
                  </Text>
                  <Text style={styles.time}>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "Fecha desconocida"} {/* Fecha o fallback */}
                  </Text>
                </View>
              </View>

              {post.image_url ? (
                <Image
                  source={{ uri: post.image_url }} // Verifica si la URL existe
                  style={styles.publicationImage}
                />
              ) : (
                <Text style={styles.noImageText}>Imagen no disponible</Text> // Mensaje si no hay imagen
              )}
            </TouchableOpacity>

            <View style={styles.publicationDetails}>
              <Text style={styles.likes}>❤️ 4 Me gusta</Text>
              <Text style={styles.publicationTitle}>{post.titulo || "Sin título"}</Text> {/* Título o fallback */}
              <Text style={styles.description}>{post.comentario || "Sin descripción"}</Text> {/* Descripción o fallback */}
              <Text style={styles.commentCount}>4 comentarios</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B1B1B",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
    justifyContent: "center",
  },
  logo: {
    width: 90,
    height: 90,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
  },
  nick: {
    color: "#9fc63b",
    fontSize: 18,
    fontWeight: "medium",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "bold",
  },
  publicationWrapper: {
    marginBottom: 20,
  },
  publication: {
    borderRadius: 10,
    overflow: "hidden",
  },
  publicationImage: {
    width: "100%",
    height: 330,
  },
  userInfo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    zIndex: 1,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#9fc63b",
    marginRight: 10,
  },
  publishedBy: {
    color: "#E0E0E0",
    fontSize: 12,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  time: {
    color: "#E0E0E0",
    fontSize: 12,
  },
  publicationDetails: {
    padding: 10,
    backgroundColor: "#1B1B1B",
  },
  likes: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 10,
  },
  publicationTitle: {
    color: "#9fc63b",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 10,
  },
  commentCount: {
    color: "#707070",
    fontSize: 12,
  },
});
