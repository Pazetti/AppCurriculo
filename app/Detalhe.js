import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Appbar, Text, Chip, Divider, ActivityIndicator, Avatar } from 'react-native-paper';
import { styles } from './css/Styles';
import { api } from './api';

// Visualização completa de um currículo (pública)
export default function Detalhe({ navigation, route }) {
  const { id } = route.params;
  const [c, setC] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api
      .obter(id)
      .then(setC)
      .catch((e) => setErro(e.message));
  }, [id]);

  return (
    <View style={styles.tela}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Currículo" titleStyle={styles.headerTitulo} />
      </Appbar.Header>

      {!c && !erro && <ActivityIndicator style={{ marginTop: 40 }} />}
      {!!erro && <Text style={[styles.erro, { padding: 16 }]}>{erro}</Text>}

      {c && (
        <ScrollView>
          <View style={styles.detalheTopo}>
            {c.foto ? (
              <Image source={{ uri: c.foto }} style={styles.detalheFoto} />
            ) : (
              <Avatar.Icon size={110} icon="account" style={{ marginBottom: 10 }} />
            )}
            <Text variant="headlineSmall" style={styles.detalheNome}>
              {c.nome}
            </Text>
            <Text variant="titleMedium" style={styles.detalheCargo}>
              {c.cargo}
            </Text>
          </View>

          <View style={styles.detalheCorpo}>
            {!!c.email && <Text style={styles.detalheLinha}>✉️  {c.email}</Text>}
            {!!c.telefone && <Text style={styles.detalheLinha}>📞  {c.telefone}</Text>}
            {!!c.cidade && <Text style={styles.detalheLinha}>📍  {c.cidade}</Text>}

            {!!c.resumo && (
              <>
                <Text variant="titleMedium" style={styles.secao}>
                  Resumo
                </Text>
                <Text>{c.resumo}</Text>
              </>
            )}

            {c.habilidades?.length > 0 && (
              <>
                <Text variant="titleMedium" style={styles.secao}>
                  Habilidades
                </Text>
                <View style={[styles.chips, { paddingHorizontal: 0 }]}>
                  {c.habilidades.map((h) => (
                    <Chip key={h} style={styles.chip}>
                      {h}
                    </Chip>
                  ))}
                </View>
              </>
            )}

            {c.experiencias?.length > 0 && (
              <>
                <Text variant="titleMedium" style={styles.secao}>
                  Experiências
                </Text>
                {c.experiencias.map((e, i) => (
                  <View key={i} style={{ marginBottom: 12 }}>
                    <Text style={styles.itemTitulo}>{[e.cargo, e.empresa].filter(Boolean).join(' — ')}</Text>
                    {!!e.periodo && <Text style={styles.itemSub}>{e.periodo}</Text>}
                    {!!e.descricao && <Text>{e.descricao}</Text>}
                    {i < c.experiencias.length - 1 && <Divider style={{ marginTop: 12 }} />}
                  </View>
                ))}
              </>
            )}

            {c.formacao?.length > 0 && (
              <>
                <Text variant="titleMedium" style={styles.secao}>
                  Formação
                </Text>
                {c.formacao.map((f, i) => (
                  <View key={i} style={{ marginBottom: 12 }}>
                    <Text style={styles.itemTitulo}>{f.curso}</Text>
                    <Text style={styles.itemSub}>{[f.instituicao, f.periodo].filter(Boolean).join(' • ')}</Text>
                  </View>
                ))}
              </>
            )}

            {!!c.usuario?.nome && (
              <Text style={[styles.itemSub, { marginTop: 24 }]}>Publicado por {c.usuario.nome}</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
