import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button, FAB, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';
import { api } from './api';
import ListaCurriculos from './ListaCurriculos';

// ÁREA ADMINISTRATIVA — só para usuários autenticados.
// Lista os currículos do usuário e permite cadastrar, editar e excluir.
export function Perfil({ navigation }) {
  const { usuario, logout } = useAuth();
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    if (!usuario) return;
    setCarregando(true);
    try {
      setDados(await api.meus());
      setErro('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // proteção de rota: sem login, não entra na área administrativa
  if (!usuario) {
    return (
      <View style={styles.tela}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction iconColor="white" onPress={() => navigation.navigate('Home')} />
          <Appbar.Content title="Área administrativa" titleStyle={styles.headerTitulo} />
        </Appbar.Header>
        <View style={styles.centro}>
          <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 16 }}>
            Você precisa estar logado para acessar esta área.
          </Text>
          <Button mode="contained" icon="login" onPress={() => navigation.navigate('Login')}>
            FAZER LOGIN
          </Button>
        </View>
      </View>
    );
  }

  const sair = async () => {
    await logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.tela}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="white" onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Área administrativa" titleStyle={styles.headerTitulo} />
        <Text style={styles.headerUsuario} numberOfLines={1}>
          {usuario.nome}
        </Text>
        <Appbar.Action icon="logout" iconColor="white" onPress={sair} />
      </Appbar.Header>

      {!!erro && <Text style={[styles.erro, { padding: 12 }]}>{erro}</Text>}

      <ListaCurriculos
        dados={dados}
        carregando={carregando}
        onAtualizar={carregar}
        navigation={navigation}
        vazio="Você ainda não cadastrou nenhum currículo. Toque em “Novo currículo”."
      />

      <FAB
        icon="plus"
        color="white"
        label="Novo currículo"
        style={styles.fab}
        onPress={() => navigation.navigate('FormCurriculo')}
      />
    </View>
  );
}

export default Perfil;
