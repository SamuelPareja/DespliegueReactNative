import React, { createContext, useState, useEffect } from 'react';

export const PublicacionesContext = createContext();

export function PublicacionesProvider({ children }) {
  const [publicaciones, setPublicaciones] = useState([]);

  // Función para agregar una nueva publicación
  const agregarPublicacion = (nuevaPublicacion) => {
    setPublicaciones((prevPublicaciones) => [nuevaPublicacion, ...prevPublicaciones]);
  };

  // Función para cargar publicaciones desde la base de datos
  const cargarPublicaciones = async () => {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/proyecto01/publicaciones');
      if (!response.ok) {
        throw new Error('Error al cargar publicaciones');
      }
      const data = await response.json();
      setPublicaciones(data); // Actualiza las publicaciones con lo obtenido del backend
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  };

  // Cargar las publicaciones al inicio
  useEffect(() => {
    cargarPublicaciones();
  }, []);

  return (
    <PublicacionesContext.Provider value={{ publicaciones, agregarPublicacion }}>
      {children}
    </PublicacionesContext.Provider>
  );
}
