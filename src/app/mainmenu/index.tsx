import { apiLocais } from '@/src/utils/axios';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router'; // Importante para atualizar a lista ao trocar de aba
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { useSecureStore } from "../../hooks/useSecureStore";
import { Typelocal } from "../../types/typelocal";

// --- Função para calcular distância entre duas coordenadas ---
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locaisSalvos, setLocaisSalvos] = useState<Typelocal[]>([]); // Estado com os locais reais
  
  const { ler, deletar } = useSecureStore(); // Trazendo os métodos de ler e deletar do seu hook

  // --- BUSCAR LOCALIZAÇÃO DO USUÁRIO ---
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    async function startWatchingLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de acesso à localização negada.');
        return;
      }
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
        (newLocation) => { setLocation(newLocation); }
      );
    }
    startWatchingLocation();
    return () => { if (locationSubscription) locationSubscription.remove(); };
  }, []);

  // --- CARREGAR OS LOCAIS SALVOS SEMPRE QUE ABRIR A TELA ---
  useFocusEffect(
    useCallback(() => {
      async function buscarLocaisDaAPI() {
        try {
          // Requisito 4: GET na API
          const response = await apiLocais.get('/locais');
          setLocaisSalvos(response.data);
        } catch (error) {
          console.error("Erro ao buscar locais:", error);
        }
      }
      buscarLocaisDaAPI();
    }, [])
  );

  // --- Ordenar os locais pela distância ---
  const locaisOrdenados = useMemo(() => {
    if (!location) return []; 
    const comDistancia = locaisSalvos.map((local) => {
      const dist = calcularDistancia(
        location.coords.latitude, location.coords.longitude, local.latitude, local.longitude
      );
      return { ...local, distanciaKm: dist };
    });
    return comDistancia.sort((a, b) => a.distanciaKm - b.distanciaKm);
  }, [location, locaisSalvos]);


  if (!location && !errorMsg) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#7ac480" />
        <Text style={styles.text}>Buscando sua localização...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.containerCenter}>
        <View style={styles.card}><Text style={styles.text}>{errorMsg}</Text></View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: location!.coords.latitude, longitude: location!.coords.longitude,
            latitudeDelta: 0.05, longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {locaisOrdenados.map((local) => (
            <Marker
              key={local.id}
              coordinate={{ latitude: local.latitude, longitude: local.longitude }}
              title={local.nome}
              pinColor={local.cor} 
            />
          ))}
        </MapView>
      </View>

      <View style={styles.listContainer}>
        
        <FlatList
          data={locaisOrdenados}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum local salvo ainda</Text>
              <Text style={styles.emptySubText}>Acesse "Novo Local" para registrar coordenadas.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={[styles.colorDot, { backgroundColor: item.cor }]} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemDistance}>
                  {item.distanciaKm < 1 
                    ? `${(item.distanciaKm * 1000).toFixed(0)} metros de distância` 
                    : `${item.distanciaKm.toFixed(1)} km de distância`}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
 
// ... Styles permanecem exatamente os mesmos da resposta anterior
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  mapContainer: { flex: 2 },
  map: { ...StyleSheet.absoluteFillObject },
  listContainer: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, marginTop: -20, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', fontFamily: 'Nunito_700Bold' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  colorDot: { width: 16, height: 16, borderRadius: 8, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333', fontFamily: 'Nunito_600SemiBold' },
  itemDistance: { fontSize: 14, color: '#7ac480', marginTop: 2, fontFamily: 'Nunito_400Regular' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  emptySubText: { fontSize: 14, color: '#888', marginTop: 4 },
  containerCenter: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", gap: 12 },
  card: { margin: 20, padding: 30, backgroundColor: "white", borderRadius: 20, elevation: 5, alignItems: 'center' },
  text: { fontSize: 16, textAlign: "center", color: "#333", fontFamily: 'Nunito_600SemiBold' },
});