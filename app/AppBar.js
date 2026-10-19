import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import { api } from './api';
import { useAuth } from './AuthContext';
import ListaCurriculos from './ListaCurriculos';

// Tela inicial: lista pública de todos os currículos
const AppBar = ({ navigation }) => {
  const { usuario } = useAuth();
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setDados(await api.listar());
      setErro('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  // recarrega sempre que a tela ganha foco (após criar/editar/excluir)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <View style={styles.tela}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" iconColor="white" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Currículos" titleStyle={styles.headerTitulo} />
        <Appbar.Action icon="magnify" iconColor="white" onPress={() => navigation.navigate('Pesquisa')} />
        <Appbar.Action icon="account" iconColor="white" onPress={() => navigation.navigate('Acesso')} />
      </Appbar.Header>

      {!!erro && <Text style={[styles.erro, { padding: 12 }]}>{erro}</Text>}

      <ListaCurriculos
        dados={dados}
        carregando={carregando}
        onAtualizar={carregar}
        navigation={navigation}
        vazio="Nenhum currículo cadastrado ainda."
      />

      {!!usuario && (
        <FAB
          icon="plus"
          color="white"
          label="Novo currículo"
          style={styles.fab}
          onPress={() => navigation.navigate('FormCurriculo')}
        />
      )}
    </View>
  );
};

export default AppBar;
