import React from 'react';
import { View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { styles } from './css/Styles';

export default function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Avatar.Icon size={96} icon="file-account" color="#1f4e8c" style={{ backgroundColor: '#fff' }} />
      <Text style={styles.splashTitulo}>Currículos</Text>
      <Text style={styles.splashSub}>Cadastre, divulgue e encontre talentos</Text>
    </View>
  );
}
