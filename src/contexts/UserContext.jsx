import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '[REDACTED]',
    avatar: 'https://avatars.githubusercontent.com/u/189115938?v=4&size=64',
    email: 'user@example.com', // Placeholder
    accountType: 'Local Account'
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
