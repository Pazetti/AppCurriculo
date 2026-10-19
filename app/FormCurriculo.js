import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Appbar, TextInput, Button, Text, ActivityIndicator, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';
import { api } from './api';

const expVazia = { empresa: '', cargo: '', periodo: '', descricao: '' };
const forVazia = { instituicao: '', curso: '', periodo: '' };

// Cadastro e edição de currículo (rota protegida)
export default function FormCurriculo({ navigation, route }) {
  const { usuario } = useAuth();
  const id = route.params?.id; // se existir -> edição

  const [form, setForm] = useState({
    nome: usuario?.nome || '',
    cargo: '',
    email: usuario?.email || '',
    telefone: '',
    cidade: '',
    resumo: '',
    habilidades: '',
    foto: '',
  });
  const [experiencias, setExperiencias] = useState([]);
  const [formacao, setFormacao] = useState([]);
  const [carregando, setCarregando] = useState(!!id);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  // edição: carrega os dados existentes
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const c = await api.obter(id);
        setForm({
          nome: c.nome || '',
          cargo: c.cargo || '',
          email: c.email || '',
          telefone: c.telefone || '',
          cidade: c.cidade || '',
          resumo: c.resumo || '',
          habilidades: (c.habilidades || []).join(', '),
          foto: c.foto || '',
        });
        setExperiencias(c.experiencias || []);
        setFormacao(c.formacao || []);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    })();
  }, [id]);

  const escolherFoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (r.canceled) return;
    const a = r.assets[0];
    if (a.base64) {
      setForm((f) => ({ ...f, foto: `data:${a.mimeType || 'image/jpeg'};base64,${a.base64}` }));
    } else if (a.uri?.startsWith('data:')) {
      setForm((f) => ({ ...f, foto: a.uri }));
    } else {
      setErro('Não foi possível ler a imagem selecionada.');
    }
  };

  const mudarLista = (setter) => (i, campo, valor) =>
    setter((lista) => lista.map((item, idx) => (idx === i ? { ...item, [campo]: valor } : item)));

  const salvar = async () => {
    if (!form.nome.trim() || !form.cargo.trim()) {
      setErro('Nome e cargo/título profissional são obrigatórios.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      const dados = { ...form, experiencias, formacao };
      if (id) await api.atualizar(id, dados);
      else await api.criar(dados);
      navigation.goBack();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  // proteção de rota
  if (!usuario) {
    return (
      <View style={styles.tela}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
          <Appbar.Content title="Currículo" titleStyle={styles.headerTitulo} />
        </Appbar.Header>
        <View style={styles.centro}>
          <Text variant="titleMedium" style={{ textAlign: 'center', marginBottom: 16 }}>
            Faça login para cadastrar ou editar currículos.
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('Login')}>
            FAZER LOGIN
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.formContainer}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title={id ? 'Editar currículo' : 'Novo currículo'} titleStyle={styles.headerTitulo} />
      </Appbar.Header>

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          {/* FOTO */}
          {!!form.foto && <Image source={{ uri: form.foto }} style={styles.fotoPreview} />}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
            <Button mode="outlined" icon="image" onPress={escolherFoto}>
              {form.foto ? 'Trocar imagem' : 'Escolher imagem'}
            </Button>
            {!!form.foto && (
              <Button textColor="#b3261e" icon="delete" onPress={() => setForm((f) => ({ ...f, foto: '' }))}>
                Remover
              </Button>
            )}
          </View>

          <TextInput label="Nome completo *" value={form.nome} onChangeText={set('nome')} mode="outlined" style={styles.input} />
          <TextInput
            label="Cargo / título profissional *"
            placeholder="Ex.: Desenvolvedor Full Stack"
            value={form.cargo}
            onChangeText={set('cargo')}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="E-mail de contato"
            value={form.email}
            onChangeText={set('email')}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput label="Telefone" value={form.telefone} onChangeText={set('telefone')} mode="outlined" keyboardType="phone-pad" style={styles.input} />
          <TextInput label="Cidade" value={form.cidade} onChangeText={set('cidade')} mode="outlined" style={styles.input} />
          <TextInput
            label="Resumo profissional"
            value={form.resumo}
            onChangeText={set('resumo')}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <TextInput
            label="Habilidades (separe por vírgula)"
            placeholder="React Native, Node.js, MongoDB"
            value={form.habilidades}
            onChangeText={set('habilidades')}
            mode="outlined"
            style={styles.input}
          />

          {/* EXPERIÊNCIAS */}
          <Text variant="titleMedium" style={styles.secao}>
            Experiências
          </Text>
          {experiencias.map((e, i) => (
            <View key={i} style={styles.bloco}>
              <TextInput label="Empresa" value={e.empresa} onChangeText={(v) => mudarLista(setExperiencias)(i, 'empresa', v)} mode="outlined" dense style={styles.input} />
              <TextInput label="Cargo" value={e.cargo} onChangeText={(v) => mudarLista(setExperiencias)(i, 'cargo', v)} mode="outlined" dense style={styles.input} />
              <TextInput label="Período" placeholder="2022 - 2024" value={e.periodo} onChangeText={(v) => mudarLista(setExperiencias)(i, 'periodo', v)} mode="outlined" dense style={styles.input} />
              <TextInput label="Descrição" value={e.descricao} onChangeText={(v) => mudarLista(setExperiencias)(i, 'descricao', v)} mode="outlined" multiline dense style={styles.input} />
              <Button icon="delete" textColor="#b3261e" onPress={() => setExperiencias((l) => l.filter((_, idx) => idx !== i))}>
                Remover experiência
              </Button>
            </View>
          ))}
          <Button icon="plus" mode="outlined" onPress={() => setExperiencias((l) => [...l, { ...expVazia }])}>
            Adicionar experiência
          </Button>

          {/* FORMAÇÃO */}
          <Text variant="titleMedium" style={styles.secao}>
            Formação
          </Text>
          {formacao.map((f, i) => (
            <View key={i} style={styles.bloco}>
              <TextInput label="Instituição" value={f.instituicao} onChangeText={(v) => mudarLista(setFormacao)(i, 'instituicao', v)} mode="outlined" dense style={styles.input} />
              <TextInput label="Curso" value={f.curso} onChangeText={(v) => mudarLista(setFormacao)(i, 'curso', v)} mode="outlined" dense style={styles.input} />
              <TextInput label="Período" placeholder="2019 - 2023" value={f.periodo} onChangeText={(v) => mudarLista(setFormacao)(i, 'periodo', v)} mode="outlined" dense style={styles.input} />
              <Button icon="delete" textColor="#b3261e" onPress={() => setFormacao((l) => l.filter((_, idx) => idx !== i))}>
                Remover formação
              </Button>
            </View>
          ))}
          <Button icon="plus" mode="outlined" onPress={() => setFormacao((l) => [...l, { ...forVazia }])}>
            Adicionar formação
          </Button>

          {!!erro && <Text style={[styles.erro, { marginTop: 16 }]}>{erro}</Text>}

          <Button mode="contained" icon="content-save" style={[styles.botao, { marginTop: 24 }]} onPress={salvar} loading={salvando} disabled={salvando}>
            {id ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR CURRÍCULO'}
          </Button>
        </ScrollView>
      )}
    </View>
  );
}
