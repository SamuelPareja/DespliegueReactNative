import React, { createContext, useState } from 'react';

// Crear el contexto
export const ProfileImageContext = createContext();

// Proveedor del contexto
export const ProfileImageProvider = ({ children }) => {
  const [profileImageUri, setProfileImageUri] = useState(null);

  return (
    <ProfileImageContext.Provider value={{ profileImageUri, setProfileImageUri }}>
      {children}
    </ProfileImageContext.Provider>
  );
};
