import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Appbar, Button, Text, Avatar } from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';

// Ícone de conta: logado -> meu perfil; deslogado -> escolher entrar/cadastrar
const Acesso = ({ navigation }) => {
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario) navigation.replace('MinhaConta');
  }, [usuario]);

  return (
    <View style={styles.tela}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Acesso" titleStyle={styles.headerTitulo} />
      </Appbar.Header>

      <View style={styles.centro}>
        <Avatar.Icon size={90} icon="account-lock" />
        <Text variant="titleLarge" style={{ marginVertical: 16, textAlign: 'center' }}>
          Acesse sua conta para gerenciar currículos
        </Text>
        <Button mode="contained" icon="login" style={{ width: 240, marginBottom: 10 }} onPress={() => navigation.navigate('Login')}>
          ENTRAR
        </Button>
        <Button mode="outlined" icon="account-plus" style={{ width: 240 }} onPress={() => navigation.navigate('Cadastro')}>
          CADASTRAR
        </Button>
      </View>
    </View>
  );
};

export default Acesso;
