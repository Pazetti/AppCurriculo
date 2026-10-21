import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

import { PaperProvider, Drawer as PaperDrawer } from 'react-native-paper';
import { theme } from './theme/theme';

import SplashScreen from './SplashScreen';
import { AuthProvider, useAuth } from './AuthContext';

// Telas
import AppBar from './AppBar';
import Pesquisa from './Pesquisa';
import Acesso from './Acesso';
import Login from './Login';
import Cadastro from './Cadastro';
import MinhaConta from './MinhaConta';
import FormCurriculo from './FormCurriculo';
import Detalhe from './Detalhe';
import { CabecalhoMenu } from './CabecaMenu';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={AppBar} />
      <Stack.Screen name="Pesquisa" component={Pesquisa} />
      <Stack.Screen name="Acesso" component={Acesso} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Detalhe" component={Detalhe} />
      {/* Telas do usuário logado (protegidas dentro de cada tela) */}
      <Stack.Screen name="MinhaConta" component={MinhaConta} />
      <Stack.Screen name="FormCurriculo" component={FormCurriculo} />
    </Stack.Navigator>
  );
}

// Menu lateral: mostra o nome do usuário logado e as opções conforme o estado de login
function MenuLateral(props) {
  const { usuario, logout } = useAuth();

  const ir = (tela) => {
    props.navigation.navigate('Inicio', { screen: tela });
    props.navigation.closeDrawer();
  };

  const sair = async () => {
    await logout();
    ir('Home');
  };

  return (
    <View style={{ flex: 1 }}>
      <CabecalhoMenu />
      <DrawerContentScrollView {...props}>
        <PaperDrawer.Item label="Início" icon="home" onPress={() => ir('Home')} />
        <PaperDrawer.Item label="Pesquisar" icon="magnify" onPress={() => ir('Pesquisa')} />
        {usuario ? (
          <>
            <PaperDrawer.Item label="Meu perfil" icon="account-circle" onPress={() => ir('MinhaConta')} />
            <PaperDrawer.Item label="Novo currículo" icon="file-plus" onPress={() => ir('FormCurriculo')} />
            <PaperDrawer.Item label="Sair" icon="logout" onPress={sair} />
          </>
        ) : (
          <>
            <PaperDrawer.Item label="Entrar" icon="login" onPress={() => ir('Login')} />
            <PaperDrawer.Item label="Cadastrar" icon="account-plus" onPress={() => ir('Cadastro')} />
          </>
        )}
      </DrawerContentScrollView>
    </View>
  );
}

function DrawerNavigation() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={(props) => <MenuLateral {...props} />}>
      <Drawer.Screen name="Inicio" component={StackNavigator} />
    </Drawer.Navigator>
  );
}

function Principal() {
  const { carregando } = useAuth();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (splash || carregando) return <SplashScreen />;

  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Principal />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
