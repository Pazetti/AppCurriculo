import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Button, Divider, FAB, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';
import { api } from './api';
import ListaCurriculos from './ListaCurriculos';

const iniciaisDe = (nome = '') =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?';

const formatarData = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d) ? '—' : d.toLocaleDateString('pt-BR');
};

// MEU PERFIL — dados cadastrados do usuário + todos os currículos criados por ele.
export function MinhaConta({ navigation }) {
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

  // proteção de rota: sem login, não entra no perfil
  if (!usuario) {
    return (
      <View style={styles.tela}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction iconColor="white" onPress={() => navigation.navigate('Home')} />
          <Appbar.Content title="Meu perfil" titleStyle={styles.headerTitulo} />
        </Appbar.Header>
        <View style={styles.centro}>
          <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 16 }}>
            Você precisa estar logado para ver o seu perfil.
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

  const cabecalho = (
    <View style={{ marginBottom: 12 }}>
      <View style={styles.perfilCard}>
        <Avatar.Text size={72} label={iniciaisDe(usuario.nome)} />
        <Text variant="titleLarge" style={styles.perfilNome} numberOfLines={2}>
          {usuario.nome}
        </Text>

        <Divider style={styles.perfilDivisor} />

        <View style={styles.perfilLinha}>
          <Avatar.Icon size={32} icon="email-outline" style={styles.perfilIcone} color="#1f4e8c" />
          <View style={{ flex: 1 }}>
            <Text style={styles.perfilRotulo}>E-mail</Text>
            <Text style={styles.perfilValor}>{usuario.email}</Text>
          </View>
        </View>

        <View style={styles.perfilLinha}>
          <Avatar.Icon size={32} icon="calendar-account" style={styles.perfilIcone} color="#1f4e8c" />
          <View style={{ flex: 1 }}>
            <Text style={styles.perfilRotulo}>Membro desde</Text>
            <Text style={styles.perfilValor}>{formatarData(usuario.criadoEm)}</Text>
          </View>
        </View>

        <View style={styles.perfilLinha}>
          <Avatar.Icon size={32} icon="file-account-outline" style={styles.perfilIcone} color="#1f4e8c" />
          <View style={{ flex: 1 }}>
            <Text style={styles.perfilRotulo}>Currículos criados</Text>
            <Text style={styles.perfilValor}>{carregando && dados.length === 0 ? '…' : dados.length}</Text>
          </View>
        </View>
      </View>

      {!!erro && <Text style={[styles.erro, { marginTop: 8 }]}>{erro}</Text>}

      <Text variant="titleMedium" style={[styles.secao, { marginLeft: 4 }]}>
        Meus currículos
      </Text>
    </View>
  );

  return (
    <View style={styles.tela}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="white" onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Meu perfil" titleStyle={styles.headerTitulo} />
        <Appbar.Action icon="view-dashboard" iconColor="white" onPress={() => navigation.navigate('Perfil')} />
        <Appbar.Action icon="logout" iconColor="white" onPress={sair} />
      </Appbar.Header>

      <ListaCurriculos
        dados={dados}
        carregando={carregando}
        onAtualizar={carregar}
        navigation={navigation}
        cabecalho={cabecalho}
        vazio="Você ainda não criou nenhum currículo. Toque em “Novo currículo”."
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

export default MinhaConta;
