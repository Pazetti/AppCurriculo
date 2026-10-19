import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken } from './api';

const AuthContext = createContext(null);
const CHAVE = '@curriculos:token';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, restaura a sessão salva (se o token ainda for válido)
  useEffect(() => {
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE);
        if (salvo) {
          setToken(salvo);
          const { usuario: u } = await api.me();
          setUsuario(u);
        }
      } catch (e) {
        setToken(null);
        await AsyncStorage.removeItem(CHAVE).catch(() => {});
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const iniciarSessao = async ({ token, usuario: u }) => {
    setToken(token);
    await AsyncStorage.setItem(CHAVE, token);
    setUsuario(u);
  };

  const login = async (email, senha) => iniciarSessao(await api.login({ email, senha }));

  const cadastrar = async (nome, email, senha) =>
    iniciarSessao(await api.cadastrar({ nome, email, senha }));

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem(CHAVE);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
