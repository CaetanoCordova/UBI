import * as Location from 'expo-location';
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';

// --- Função para calcular distância entre duas coordenadas (Fórmula de Haversine) ---
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Retorna a distância em km
}

// --- Dados falsos para teste (Depois virão da sua API) ---
const LOCAIS_MOCK = [
  { id: '1', nome: 'Cristo Redentor', latitude: -22.951916, longitude: -43.210487, cor: '#FF0000' },
  { id: '2', nome: 'Pão de Açúcar', latitude: -22.949289, longitude: -43.154529, cor: '#0000FF' },
  { id: '3', nome: 'MASP (SP)', latitude: -23.561414, longitude: -46.655881, cor: '#00FF00' },
];

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    async function startWatchingLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permissão de acesso à localização negada.');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    }

    startWatchingLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // --- Ordenar os locais pela distância em relação ao usuário ---
  const locaisOrdenados = useMemo(() => {
    if (!location) return []; // Se não tem localização, retorna vazio temporariamente

    // Copia o array de mock e mapeia para incluir a distância calculada
    const comDistancia = LOCAIS_MOCK.map((local) => {
      const dist = calcularDistancia(
        location.coords.latitude,
        location.coords.longitude,
        local.latitude,
        local.longitude
      );
      return { ...local, distanciaKm: dist };
    });

    // Ordena do menor para o maior (mais próximo primeiro)
    return comDistancia.sort((a, b) => a.distanciaKm - b.distanciaKm);
  }, [location]); // Recalcula sempre que a localização do usuário mudar


  // --- Telas de Loading e Erro ---
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
        <View style={styles.card}>
          <Text style={styles.text}>{errorMsg}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* METADE DE CIMA: O MAPA */}
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: location!.coords.latitude,
            longitude: location!.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Renderiza os pinos no mapa */}
          {locaisOrdenados.map((local) => (
            <Marker
              key={local.id}
              coordinate={{ latitude: local.latitude, longitude: local.longitude }}
              title={local.nome}
              pinColor={local.cor} // Usa a cor que o usuário selecionou no form
            />
          ))}
        </MapView>
      </View>

      {/* METADE DE BAIXO: A LISTA */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Locais Próximos</Text>
        
        <FlatList
          data={locaisOrdenados}
          keyExtractor={(item) => item.id}
          // O que fazer quando a lista está vazia
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum local salvo ainda.</Text>
              <Text style={styles.emptySubText}>Vá na aba "Novo Local" para adicionar!</Text>
            </View>
          }
          // Como renderizar cada item da lista
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
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  // Metade de Cima
  mapContainer: {
    flex: 1, // Ocupa 50%
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  // Metade de Baixo
  listContainer: {
    flex: 1, // Ocupa os outros 50%
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    marginTop: -20, // Faz a lista sobrepor levemente o mapa
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    fontFamily: 'Nunito_700Bold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Nunito_600SemiBold',
  },
  itemDistance: {
    fontSize: 14,
    color: '#7ac480',
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  // Estado Vazio
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  // Utilidades
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    gap: 12,
  },
  card: {
    margin: 20,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    fontFamily: 'Nunito_600SemiBold',
  },
});