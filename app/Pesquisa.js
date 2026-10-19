import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import { api } from './api';
import ListaCurriculos from './ListaCurriculos';

// Pesquisa por termo: nome, cargo, cidade, habilidades, empresas, cursos...
const Pesquisa = ({ navigation }) => {
  const [termo, setTermo] = useState('');
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscou, setBuscou] = useState(false);

  const buscar = useCallback(async (t) => {
    setCarregando(true);
    try {
      setDados(await api.listar(t));
      setBuscou(true);
    } catch (e) {
      setDados([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  // busca automática enquanto digita (com pequeno atraso)
  useEffect(() => {
    const t = setTimeout(() => buscar(termo.trim()), 400);
    return () => clearTimeout(t);
  }, [termo, buscar]);

  // ao voltar de uma edição, atualiza o resultado
  useFocusEffect(
    useCallback(() => {
      if (buscou) buscar(termo.trim());
    }, [])
  );

  return (
    <View style={styles.tela}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pesquisar" titleStyle={styles.headerTitulo} />
      </Appbar.Header>

      <View style={styles.buscaBox}>
        <Searchbar
          placeholder="Nome, cargo, cidade ou habilidade"
          value={termo}
          onChangeText={setTermo}
          autoFocus
        />
      </View>

      <ListaCurriculos
        dados={dados}
        carregando={carregando}
        onAtualizar={() => buscar(termo.trim())}
        navigation={navigation}
        vazio={termo ? `Nenhum resultado para “${termo}”.` : 'Nenhum currículo encontrado.'}
      />
    </View>
  );
};

export default Pesquisa;
