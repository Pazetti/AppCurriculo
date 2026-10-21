import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { ActivityIndicator, Text, Snackbar } from 'react-native-paper';
import ModCard, { ConfirmarExclusao } from './Cards';
import { styles } from './css/Styles';
import { useAuth } from './AuthContext';
import { api } from './api';

// Lista reutilizável (Home, Pesquisa e Meu perfil).
// Cuida de editar / excluir / abrir detalhe.
export default function ListaCurriculos({ dados, carregando, onAtualizar, navigation, vazio, cabecalho }) {
  const { usuario } = useAuth();
  const [excluindo, setExcluindo] = useState(null);
  const [msg, setMsg] = useState('');

  const confirmar = async () => {
    const alvo = excluindo;
    setExcluindo(null);
    try {
      await api.excluir(alvo._id);
      setMsg('Currículo excluído.');
      onAtualizar();
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (carregando && dados.length === 0) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={dados}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={cabecalho}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={onAtualizar} />}
        ListEmptyComponent={<Text style={styles.vazio}>{vazio}</Text>}
        renderItem={({ item }) => (
          <ModCard
            item={item}
            podeGerenciar={!!usuario && item.usuario?._id === usuario.id}
            onVer={(c) => navigation.navigate('Detalhe', { id: c._id })}
            onEditar={(c) => navigation.navigate('FormCurriculo', { id: c._id })}
            onExcluir={setExcluindo}
          />
        )}
      />
      <ConfirmarExclusao item={excluindo} onCancelar={() => setExcluindo(null)} onConfirmar={confirmar} />
      <Snackbar visible={!!msg} onDismiss={() => setMsg('')} duration={3000}>
        {msg}
      </Snackbar>
    </>
  );
}
