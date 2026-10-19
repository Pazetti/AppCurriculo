import React from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';

const Cadastro = ({ navigation }) => {
  const { cadastrar } = useAuth();
  const [nome, setNome] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [confirmar, setConfirmar] = React.useState('');
  const [mostrarSenha, setMostrarSenha] = React.useState(false);
  const [erro, setErro] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);

  const criarConta = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não conferem.');
      return;
    }
    setEnviando(true);
    setErro('');
    try {
      await cadastrar(nome.trim(), email.trim(), senha); // já entra logado
      navigation.replace('Perfil');
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Cadastro" titleStyle={styles.headerTitulo} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        <Text variant="headlineMedium" style={styles.formTitulo}>
          Crie sua conta
        </Text>
        <Text variant="bodyLarge" style={styles.formTexto}>
          Cadastre-se para publicar e gerenciar seus currículos
        </Text>

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
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry={!mostrarSenha}
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon={mostrarSenha ? 'eye-off' : 'eye'} onPress={() => setMostrarSenha(!mostrarSenha)} />}
          style={styles.input}
        />
        <TextInput
          label="Confirmar senha"
          value={confirmar}
          onChangeText={setConfirmar}
          mode="outlined"
          secureTextEntry={!mostrarSenha}
          left={<TextInput.Icon icon="lock-check" />}
          style={styles.input}
          onSubmitEditing={criarConta}
        />

        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        <Button mode="contained" icon="account-plus" style={styles.botao} onPress={criarConta} loading={enviando} disabled={enviando}>
          CADASTRAR
        </Button>

        <Button mode="text" icon="login" onPress={() => navigation.navigate('Login')}>
          JÁ TENHO CONTA
        </Button>
      </ScrollView>
    </View>
  );
};

export default Cadastro;
