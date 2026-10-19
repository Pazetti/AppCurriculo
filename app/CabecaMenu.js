import React from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';

// Cabeçalho do menu lateral: mostra o nome do usuário logado
export function CabecalhoMenu() {
  const { usuario } = useAuth();

  const iniciais = usuario
    ? usuario.nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join('')
    : '?';

  return (
    <View style={styles.menuCabeca}>
      {usuario ? (
        <Avatar.Text size={56} label={iniciais} />
      ) : (
        <Avatar.Icon size={56} icon="account" />
      )}
      <Text variant="titleMedium" style={styles.menuNome}>
        {usuario ? usuario.nome : 'Visitante'}
      </Text>
      <Text style={styles.menuSub}>{usuario ? usuario.email : 'Você não está logado'}</Text>
    </View>
  );
}
