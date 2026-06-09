import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSecureStore } from "../../hooks/useSecureStore";
import { Typelocal } from "../../types/typelocal";

export default function MeusLocaisIndex() {
  const router = useRouter();
  const { ler, criar } = useSecureStore();
  const [locais, setLocais] = useState<Typelocal[]>([]);

  // Carrega os dados sempre que a tela é focada
  useFocusEffect(
    useCallback(() => {
      carregarLocais();
    }, [])
  );

  const carregarLocais = async () => {
    const dados = await ler('meus_locais');
    if (dados) {
      setLocais(JSON.parse(dados));
    }
  };

  // Função para Deletar um local
  const handleDeletar = (idParaDeletar: string, nomeLocal: string) => {
    Alert.alert(
      "Excluir Local",
      `Tem certeza que deseja excluir "${nomeLocal}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            // Filtra a lista removendo o item com o ID escolhido
            const novaLista = locais.filter(local => local.id !== idParaDeletar);
            // Salva a nova lista no SecureStore
            await criar('meus_locais', JSON.stringify(novaLista));
            // Atualiza a tela
            setLocais(novaLista);
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locais Registrados</Text>

      <FlatList
        data={locais}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Entypo name="location" size={48} color="#C4C8E4" />
            <Text style={styles.emptyText}>Você ainda não possui locais.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.colorIndicator, { backgroundColor: item.cor }]} />
              <Text style={styles.cardTitle}>{item.nome}</Text>
            </View>
            
            <Text style={styles.cardCoords}>Lat: {item.latitude}</Text>
            <Text style={styles.cardCoords}>Lon: {item.longitude}</Text>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                // Navega para a tela de edição passando o ID na URL
                onPress={() => router.push(`/meuslocais/editar/${item.id}`)}
              >
                <Entypo name="edit" size={18} color="#7ac480" />
                <Text style={[styles.actionText, { color: '#7ac480' }]}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeletar(item.id, item.nome)}
              >
                <Entypo name="trash" size={18} color="#EDADAD" />
                <Text style={[styles.actionText, { color: '#EDADAD' }]}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf1", padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4A3840', marginBottom: 20, fontFamily: 'Nunito_700Bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  colorIndicator: { width: 16, height: 16, borderRadius: 8, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A3840', fontFamily: 'Nunito_700Bold' },
  cardCoords: { fontSize: 14, color: '#90a89a', fontFamily: 'Nunito_400Regular', marginLeft: 26 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 16, borderTopWidth: 1, borderTopColor: '#FAF4EC', paddingTop: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Nunito_600SemiBold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#90a89a', fontFamily: 'Nunito_600SemiBold' }
});