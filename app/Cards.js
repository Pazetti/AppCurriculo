import React from 'react';
import { Card, Text, Button, Chip, Avatar, Dialog, Portal } from 'react-native-paper';
import { View } from 'react-native';
import { styles } from './css/Styles';

const iniciais = (nome = '') =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?';

// Card de um currículo.
// - Todos veem o botão "Ver".
// - "Editar" e "Excluir" só aparecem quando o usuário está autenticado e é o dono (podeGerenciar).
const ModCard = ({ item, onVer, podeGerenciar, onEditar, onExcluir }) => {
  const esquerda = () =>
    item.foto ? (
      <Avatar.Image size={44} source={{ uri: item.foto }} />
    ) : (
      <Avatar.Text size={44} label={iniciais(item.nome)} />
    );

  return (
    <Card style={styles.card}>
      <Card.Title
        title={item.nome}
        subtitle={[item.cargo, item.cidade].filter(Boolean).join(' • ')}
        left={esquerda}
      />
      {!!item.foto && <Card.Cover style={styles.cardCover} source={{ uri: item.foto }} />}
      {!!item.resumo && (
        <Card.Content style={{ marginTop: 10 }}>
          <Text numberOfLines={3}>{item.resumo}</Text>
        </Card.Content>
      )}
      {item.habilidades?.length > 0 && (
        <View style={[styles.chips, { marginTop: 10 }]}>
          {item.habilidades.slice(0, 5).map((h) => (
            <Chip key={h} compact style={styles.chip}>
              {h}
            </Chip>
          ))}
        </View>
      )}
      <Card.Actions style={styles.cardActions}>
        {podeGerenciar && (
          <>
            <Button icon="pencil" onPress={() => onEditar(item)}>
              Editar
            </Button>
            <Button icon="delete" textColor="#b3261e" onPress={() => onExcluir(item)}>
              Excluir
            </Button>
          </>
        )}
        <Button mode="contained-tonal" icon="eye" onPress={() => onVer(item)}>
          Ver
        </Button>
      </Card.Actions>
    </Card>
  );
};

// Diálogo de confirmação (funciona no celular e no navegador)
export const ConfirmarExclusao = ({ item, onCancelar, onConfirmar }) => (
  <Portal>
    <Dialog visible={!!item} onDismiss={onCancelar}>
      <Dialog.Title>Excluir currículo</Dialog.Title>
      <Dialog.Content>
        <Text>Tem certeza que deseja excluir o currículo de “{item?.nome}”? Essa ação não pode ser desfeita.</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onCancelar}>Cancelar</Button>
        <Button textColor="#b3261e" onPress={onConfirmar}>
          Excluir
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default ModCard;
