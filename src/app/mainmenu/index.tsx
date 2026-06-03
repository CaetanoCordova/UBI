import { useForegroundPermissions } from "expo-location";
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
 
export default function Index() {
  const [permission, requestPermission] = useForegroundPermissions();

  const loadLocation = async () => {
    const permissao = await Location.requestForegroundPermissionsAsync();

    if (!permissao || !permissao.granted) {
      console.log("Location permission denied.")
      return;
    }

    const localizacao = await Location.getCurrentPositionAsync();
    console.log('Location: ', localizacao)
  }
 
  useEffect(() => {
    loadLocation()
  }, [])

  if (!permission || !permission.granted) {
    return (
      <View>
        <Text>Localizacao</Text>
        <MapView style={{ width: 400, height: 400}}/>
      </View>

      // <View style={styles.containerCenter}>
      //   <View style={styles.card}>
      //   <Text style={styles.text}>Permissão de acesso à localização negada!</Text>
      //     <TouchableOpacity onPress={requestPermission} style={styles.button}>
      //       <Text style={styles.buttonText}>Solicitar Permissões</Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
    );
  }
 
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      <View style={styles.footer}>        
        <Text style={styles.buttonText}>Voltar para o Mapa</Text>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },
  card: {
    margin: 20,
    gap: 15,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#333"
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "cadetblue",
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center'
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  }
});