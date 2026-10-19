import React from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';

const Login = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [mostrarSenha, setMostrarSenha] = React.useState(false);
  const [erro, setErro] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);

  const entrar = async () => {
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }
    setEnviando(true);
    setErro('');
    try {
      await login(email.trim(), senha);
      navigation.replace('Perfil'); // área administrativa
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
        <Appbar.Content title="Login" titleStyle={styles.headerTitulo} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        <Text variant="headlineMedium" style={styles.formTitulo}>
          Bem-vindo!
        </Text>
        <Text variant="bodyLarge" style={styles.formTexto}>
          Entre com sua conta
        </Text>

        <TextInput
          label="E-mail"
          placeholder="Digite seu e-mail"
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
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry={!mostrarSenha}
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon={mostrarSenha ? 'eye-off' : 'eye'} onPress={() => setMostrarSenha(!mostrarSenha)} />}
          style={styles.input}
          onSubmitEditing={entrar}
        />

        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        <Button mode="contained" icon="login" style={styles.botao} onPress={entrar} loading={enviando} disabled={enviando}>
          ENTRAR
        </Button>

        <Button mode="text" icon="account-plus" onPress={() => navigation.navigate('Cadastro')}>
          NÃO TENHO CADASTRO
        </Button>
      </ScrollView>
    </View>
  );
};

export default Login;
