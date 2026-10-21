import { StyleSheet } from 'react-native';

export const cores = {
  primaria: '#1f4e8c',
  fundo: '#f4f6fa',
  texto: '#1d2733',
  suave: '#6b7788',
};

export const styles = StyleSheet.create({
  // splash
  splash: { flex: 1, backgroundColor: cores.primaria, alignItems: 'center', justifyContent: 'center' },
  splashTitulo: { color: '#fff', fontSize: 30, fontWeight: 'bold', marginTop: 16 },
  splashSub: { color: '#cfe0f5', marginTop: 6 },

  // telas
  tela: { flex: 1, backgroundColor: cores.fundo },
  header: { backgroundColor: cores.primaria },
  headerTitulo: { color: '#fff', fontWeight: 'bold' },
  headerUsuario: { color: '#fff', fontSize: 14, maxWidth: 160, marginRight: 4 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  vazio: { textAlign: 'center', color: cores.suave, marginTop: 40, paddingHorizontal: 24 },

  // lista / cards
  lista: { padding: 12, paddingBottom: 100 },
  card: { marginBottom: 14, backgroundColor: '#fff' },
  cardCover: { height: 180 },
  cardActions: { justifyContent: 'flex-end', flexWrap: 'wrap' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingBottom: 8 },
  chip: { backgroundColor: '#e6eef8' },

  fab: { position: 'absolute', right: 16, bottom: 20, backgroundColor: cores.primaria },

  // formulários (login / cadastro / currículo)
  formContainer: { flex: 1, backgroundColor: cores.fundo },
  formContent: { padding: 20, paddingBottom: 60 },
  formTitulo: { fontWeight: 'bold', marginBottom: 4, color: cores.texto },
  formTexto: { color: cores.suave, marginBottom: 20 },
  input: { marginBottom: 12, backgroundColor: '#fff' },
  botao: { marginTop: 8, paddingVertical: 4 },
  erro: { color: '#b3261e', marginBottom: 8 },
  secao: { marginTop: 18, marginBottom: 8, fontWeight: 'bold', color: cores.texto },
  bloco: { borderWidth: 1, borderColor: '#d9e0ea', borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: '#fbfcfe' },
  fotoPreview: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 8 },

  // detalhe
  detalheTopo: { alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  detalheFoto: { width: 130, height: 130, borderRadius: 65, marginBottom: 10 },
  detalheNome: { fontWeight: 'bold', color: cores.texto, textAlign: 'center' },
  detalheCargo: { color: cores.primaria, marginTop: 2, textAlign: 'center' },
  detalheCorpo: { padding: 16 },
  detalheLinha: { marginBottom: 6, color: cores.texto },
  itemTitulo: { fontWeight: 'bold', color: cores.texto },
  itemSub: { color: cores.suave },

  // menu lateral
  menuCabeca: { backgroundColor: cores.primaria, padding: 20, paddingTop: 48 },
  menuNome: { color: '#fff', fontWeight: 'bold', marginTop: 10 },
  menuSub: { color: '#cfe0f5' },

  // busca
  buscaBox: { padding: 12, backgroundColor: '#fff' },
});
