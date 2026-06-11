import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Typelocal } from "../../types/typelocal";
import { apiLocais } from "../../utils/axios";

export default function MeusLocaisIndex() {
  const router = useRouter();
  const [locais, setLocais] = useState<Typelocal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarLocaisDaAPI();
    }, [])
  );

  const carregarLocaisDaAPI = async () => {
    try {
      setIsLoading(true);
      const response = await apiLocais.get('/locais'); // GET
      setLocais(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de locais da nuvem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletar = (idParaDeletar: string, nomeLocal: string) => {
    Alert.alert(
      "Excluir Local",
      `Tem certeza que deseja apagar "${nomeLocal}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await apiLocais.delete(`/locais/${idParaDeletar}`); // DELETE
              setLocais(prev => prev.filter(local => local.id !== idParaDeletar));
              Alert.alert('Sucesso', 'Local apagado com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Falha ao tentar apagar o local do servidor.');
            }
          } 
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7ac480" />
        <Text style={{ marginTop: 10, color: '#90a89a', fontFamily: 'Nunito_600SemiBold' }}>A carregar dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Locais na Nuvem</Text>

      <FlatList
        data={locais}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Entypo name="location" size={48} color="#C4C8E4" />
            <Text style={styles.emptyText}>Não existem locais na nuvem.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.colorIndicator, { backgroundColor: item.cor }]} />
              <Text style={styles.cardTitle}>{item.nome}</Text>
              {item.favorito && <Entypo name="star" size={18} color="#FFA500" style={{ marginLeft: 8 }} />}
            </View>
            
            <Text style={styles.cardCoords}>Lat: {item.latitude} | Lon: {item.longitude}</Text>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/meuslocais/editar/${item.id}`)}>
                <Entypo name="edit" size={18} color="#7ac480" />
                <Text style={[styles.actionText, { color: '#7ac480' }]}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => handleDeletar(item.id, item.nome)}>
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
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  colorIndicator: { width: 16, height: 16, borderRadius: 8, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A3840', fontFamily: 'Nunito_700Bold' },
  cardCoords: { fontSize: 14, color: '#90a89a', fontFamily: 'Nunito_400Regular' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 16, borderTopWidth: 1, borderTopColor: '#FAF4EC', paddingTop: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 14, fontWeight: 'bold', fontFamily: 'Nunito_600SemiBold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#90a89a', fontFamily: 'Nunito_600SemiBold' }
});