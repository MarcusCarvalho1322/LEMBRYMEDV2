'use client';

import { createContext, useContext } from 'react';

export const AuthContext = createContext<{ token: string | null; logout: () => void }>({
  token: null,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
