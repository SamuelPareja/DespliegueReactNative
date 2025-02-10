import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import data from "../data.json";
import { ProfileImageContext  } from '../ProfileImageContext';


const PublicationItem = React.memo(({ post, usuario, onLike, isLiked, comentarios }) => {
  const navigation = useNavigation();
  const postComments = comentarios.filter(comment => comment.idPublicacion === post._id);
  const { profileImageUri } = useContext(ProfileImageContext);

  return (
    <View style={styles.publicationWrapper}>
      <TouchableOpacity
        style={styles.publication}
        onPress={() => navigation.navigate("A2", { post, comentarios: postComments })}
      >
        <View style={styles.userInfo}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.userImage} />
              ) : (
            <Image source={require("../../../assets/user_default.png")} style={styles.userImage} />
             )}
          <View>
            <Text style={styles.publishedBy}>Publicado por</Text>
            <Text style={styles.userName}>
              {usuario?.nombre || "Usuario desconocido"}
            </Text>
            <Text style={styles.time}>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Fecha desconocida"}
            </Text>
          </View>
        </View>

        {post.image_url ? (
          <Image
            source={{ uri: post.image_url }}
            style={styles.publicationImage}
          />
        ) : (
          <Text style={styles.noImageText}>Imagen no disponible</Text>
        )}
      </TouchableOpacity>

      <View style={styles.publicationDetails}>
        <TouchableOpacity onPress={() => onLike(post._id)}>
          <Text style={styles.likes}>
            {isLiked ? "💚" : "🤍"} {(post.like ? post.like.length : 0) + (isLiked ? 1 : 0)} Me gusta
          </Text>
        </TouchableOpacity>
        <Text style={styles.publicationTitle}>{post.titulo || "Sin título"}</Text>
        <Text style={styles.description}>{post.comentario || "Sin descripción"}</Text>
        <Text style={styles.commentCount}>{postComments.length} comentarios</Text>
      </View>
    </View>
  );
});

export function StackA() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNick, setUserNick] = useState("");
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const publicacionesResponse = await fetch(process.env.EXPO_PUBLIC_API_URL + "/proyecto01/publicaciones");
        if (!publicacionesResponse.ok) throw new Error("Error al cargar publicaciones");
        const publicacionesData = await publicacionesResponse.json();

        const publicacionesConId = publicacionesData.map(pub => ({
          ...pub,
          _id: pub._id || Math.random().toString(36).substr(2, 9)
        }));

        const usuariosPorId = {};
        data.usuarios.forEach((usuario) => {
          usuariosPorId[usuario._id] = usuario;
        });

        const initialLikes = {};
        publicacionesConId.forEach((post) => {
          initialLikes[post._id] = false;
        });

        setPublicaciones(publicacionesConId);
        setUsuarios(usuariosPorId);
        setLikes(initialLikes);
        setComentarios(data.comentarios);

      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserNick = () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const uid = currentUser.uid;
        const usuario = data.usuarios.find((user) => user._id === uid);
        if (usuario) {
          setUserNick(usuario.nick);
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

  const toggleLike = useCallback((postId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: !prevLikes[postId],
    }));
  }, []);

  const renderItem = useCallback(({ item }) => (
    <PublicationItem
      key={item._id}
      post={item}
      usuario={usuarios[item.user_id]}
      onLike={toggleLike}
      isLiked={likes[item._id] || false}
      comentarios={comentarios}
    />
  ), [usuarios, likes, toggleLike, comentarios]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando publicaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../../../assets/logo_vedruna.png")} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.nick}>{userNick || "Nick"}</Text>
          <Text style={styles.title}>VEDRUNA</Text>
        </View>
      </View>

      <FlatList
        data={publicaciones}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
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