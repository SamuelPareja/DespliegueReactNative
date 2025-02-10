import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import data from "../data.json";
import { ProfileImageContext  } from '../ProfileImageContext';

export function StackB() {
  const navigation = useNavigation();
  const route = useRoute();
  const { post, comentarios } = route.params; // Recibimos los comentarios como parámetro

  const [userName, setUserName] = useState("Usuario desconocido");
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState(comentarios || []); // Inicializamos con los comentarios recibidos
  const [currentComment, setCurrentComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { profileImageUri } = useContext(ProfileImageContext);

  useEffect(() => {
    const usuario = data.usuarios.find((usuario) => usuario._id === post.user_id);
    if (usuario) {
      setUserName(usuario.nombre);
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
    }

    // Ya no necesitamos filtrar los comentarios aquí, ya que los recibimos filtrados
  }, [post.user_id]);

  const handlePublishComment = () => {
    if (currentComment.trim() && currentUser) {
      const newComment = {
        id: (comments.length + 1).toString(),
        user_id: currentUser.uid,
        idPublicacion: post._id,
        comentario: currentComment.trim(),
      };
      setComments([...comments, newComment]);
      setCurrentComment("");
      setModalVisible(false);
    }
  };

  const toggleLike = () => {
    setIsLiked(prevLiked => !prevLiked);
  };

  const renderComment = ({ item }) => {
    const usuario = data.usuarios.find((usuario) => usuario._id === item.user_id);
    return (
      <View style={styles.commentWrapper}>
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.commentUserImage} />
           ) : (
         <Image source={require("../../../assets/user_default.png")} style={styles.commentUserImage} />
          )}
        <View style={styles.commentContent}>
          <Text style={styles.commentUserName}>{usuario ? usuario.nombre : "Usuario desconocido"}</Text>
          <Text style={styles.commentText}>{item.comentario}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInnerContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.arrow}>&lt;</Text>
          </TouchableOpacity>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.userImage} />
            ) : (
            <Image source={require("../../../assets/user_default.png")} style={styles.userImage} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userPublished}>Publicado por</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>

        {post.image_url ? (
          <Image 
            source={{ uri: post.image_url }} 
            style={styles.mainImage} 
          />
        ) : (
          <Text style={styles.noImageText}>Imagen no disponible</Text>
        )}

        <TouchableOpacity onPress={toggleLike}>
          <Text style={styles.likes}>
            {isLiked ? '💚' : '🤍'} {(post.like ? post.like.length : 0) + (isLiked ? 1 : 0)} me gusta
          </Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{post.titulo || "Sin título"}</Text>
          <Text style={styles.description}>{post.comentario || "Sin descripción"}</Text>
          <Text style={styles.time}>
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : "Fecha desconocida"}
          </Text>
        </View>

        <View style={styles.commentsHeaderContainer}>
          <Text style={styles.commentsHeader}>COMENTARIOS</Text>
          <TouchableOpacity style={styles.addCommentButton} onPress={() => setModalVisible(true)}>
            <Image
              source={require("../../../assets/boton_anadir_publi.png")}
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
        </View>

        {comments.length === 0 ? (
          <Text style={styles.noComments}>No hay comentarios.</Text>
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.commentsContainer}
          />
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Comentario:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Máx. 500 Caracteres"
              placeholderTextColor="#707070"
              maxLength={500}
              value={currentComment}
              onChangeText={setCurrentComment}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePublishComment} style={styles.publishButton}>
                <Text style={styles.buttonText}>PUBLICAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  scrollContent: {
    flex: 1,
  },
  scrollInnerContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  arrow: {
    color: '#9fc63b',
    fontSize: 44,
    marginRight: 15,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#9fc63b',
    borderWidth: 2,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  userPublished: {
    color: '#707070',
    fontSize: 12,
  },
  mainImage: {
    width: '100%',
    height: 330,
    borderRadius: 10,
    marginBottom: 10,
  },
  likes: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 20,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    color: '#9fc63b',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 10,
    marginTop: 7,
  },
  time: {
    color: '#707070',
    fontSize: 12,
  },
  commentsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsHeader: {
    color: '#9fc63b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addCommentButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 5,
  },
  noComments: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 20,
  },
  commentsContainer: {
    paddingBottom: 20,
  },
  commentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderColor: '#9fc63b',
    borderWidth: 2,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1B1B1B',
    borderRadius: 10,
    padding: 20,
    borderColor: '#9fc63b',
    borderWidth: 1,
  },
  modalTitle: {
    color: '#9fc63b',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  textInput: {
    height: 250,
    backgroundColor: '#2A2A2A',
    borderRadius: 5,
    color: '#FFFFFF',
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  publishButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#9fc63b',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});