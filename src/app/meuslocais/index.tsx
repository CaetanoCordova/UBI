import { useBackgroundPermissions, useForegroundPermissions } from "expo-location";
import { StyleSheet, Text, View } from "react-native";
 
export default function Index() {
  const [permission, requestPermission] = (useBackgroundPermissions() && useForegroundPermissions());
 
  if (!permission || !permission.granted) {
    return (
      <View style={styles.containerCenter}>
        <View style={styles.card}>
        <Text style={styles.text}>Teste</Text>
        </View>
      </View>
    );
  }
 
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      
      <View style={styles.footer}>        
        <Text style={styles.buttonText}>Voltar para Câmera</Text>
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