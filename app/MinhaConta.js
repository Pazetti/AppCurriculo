import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Avatar, Button, Divider, FAB, Snackbar, Text, TextInput } from 'react-native-paper';
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

function Linha({ icone, rotulo, valor }) {
  return (
    <View style={styles.perfilLinha}>
      <Avatar.Icon size={32} icon={icone} style={styles.perfilIcone} color="#1f4e8c" />
      <View style={{ flex: 1 }}>
        <Text style={styles.perfilRotulo}>{rotulo}</Text>
        <Text style={styles.perfilValor}>{valor}</Text>
      </View>
    </View>
  );
}

// Formulário de edição dos dados da conta (nome, e-mail e, se quiser, senha)
function EditarDados({ usuario, onCancelar, onSalvo }) {
  const { atualizarPerfil } = useAuth();
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e e-mail.');
      return;
    }
    const dados = { nome: nome.trim(), email: email.trim() };

    if (novaSenha || senhaAtual || confirmar) {
      if (!senhaAtual) return setErro('Informe a senha atual para trocar a senha.');
      if (novaSenha.length < 6) return setErro('A nova senha deve ter pelo menos 6 caracteres.');
      if (novaSenha !== confirmar) return setErro('As senhas não conferem.');
      dados.senhaAtual = senhaAtual;
      dados.novaSenha = novaSenha;
    }

    setSalvando(true);
    setErro('');
    try {
      await atualizarPerfil(dados);
      onSalvo();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <View style={{ alignSelf: 'stretch' }}>
      <TextInput
        label="Nome completo"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
        style={styles.input}
      />
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
        style={styles.input}
      />

      <Text variant="titleSmall" style={[styles.secao, { marginTop: 8 }]}>
        Alterar senha (opcional)
      </Text>
      <TextInput
        label="Senha atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        mode="outlined"
        secureTextEntry={!mostrarSenha}
        left={<TextInput.Icon icon="lock" />}
        right={<TextInput.Icon icon={mostrarSenha ? 'eye-off' : 'eye'} onPress={() => setMostrarSenha(!mostrarSenha)} />}
        style={styles.input}
      />
      <TextInput
        label="Nova senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        mode="outlined"
        secureTextEntry={!mostrarSenha}
        left={<TextInput.Icon icon="lock-plus" />}
        style={styles.input}
      />
      <TextInput
        label="Confirmar nova senha"
        value={confirmar}
        onChangeText={setConfirmar}
        mode="outlined"
        secureTextEntry={!mostrarSenha}
        left={<TextInput.Icon icon="lock-check" />}
        style={styles.input}
        onSubmitEditing={salvar}
      />

      {!!erro && <Text style={styles.erro}>{erro}</Text>}

      <Button mode="contained" icon="content-save" style={styles.botao} onPress={salvar} loading={salvando} disabled={salvando}>
        SALVAR
      </Button>
      <Button mode="text" onPress={onCancelar} disabled={salvando}>
        CANCELAR
      </Button>
    </View>
  );
}

// MEU PERFIL — dados cadastrados do usuário (editáveis) + currículos criados por ele.
// É a tela mostrada logo após o login ou o cadastro.
export function MinhaConta({ navigation }) {
  const { usuario, logout } = useAuth();
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [editando, setEditando] = useState(false);
  const [msg, setMsg] = useState('');

  const uid = usuario?.id;

  const carregar = useCallback(async () => {
    if (!uid) return;
    setCarregando(true);
    try {
      setDados(await api.meus());
      setErro('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [uid]);

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

        {editando ? (
          <>
            <Divider style={styles.perfilDivisor} />
            <EditarDados
              usuario={usuario}
              onCancelar={() => setEditando(false)}
              onSalvo={() => {
                setEditando(false);
                setMsg('Dados atualizados.');
              }}
            />
          </>
        ) : (
          <>
            <Text variant="titleLarge" style={styles.perfilNome} numberOfLines={2}>
              {usuario.nome}
            </Text>

            <Divider style={styles.perfilDivisor} />

            <Linha icone="email-outline" rotulo="E-mail" valor={usuario.email} />
            <Linha icone="calendar-account" rotulo="Membro desde" valor={formatarData(usuario.criadoEm)} />
            <Linha
              icone="file-account-outline"
              rotulo="Currículos criados"
              valor={carregando && dados.length === 0 ? '…' : dados.length}
            />

            <Button mode="outlined" icon="pencil" style={{ alignSelf: 'stretch', marginTop: 4 }} onPress={() => setEditando(true)}>
              EDITAR DADOS
            </Button>
          </>
        )}
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
        <Text style={styles.headerUsuario} numberOfLines={1}>
          {usuario.nome}
        </Text>
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

      <Snackbar visible={!!msg} onDismiss={() => setMsg('')} duration={3000}>
        {msg}
      </Snackbar>
    </View>
  );
}

export default MinhaConta;
