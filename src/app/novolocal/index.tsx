import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSecureStore } from '../../hooks/useSecureStore'; // Importando seu hook
import { Typelocal } from '../../types/typelocal'; // Importando o tipo

export default function NovoLocalIndex() {
  const router = useRouter();
  const { criar, ler } = useSecureStore(); // Trazendo as funções de salvar e ler

  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('#c7c7c7'); 
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(true);

  const opcoesDeCores = ['#006928', '#2883eb', '#b125d4', '#db3309', '#ff7300', '#dac725', '#c7c7c7', '#333333'];

  useEffect(() => {
    async function buscarLocalizacaoAtual() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const localAtual = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });
          setLatitude(localAtual.coords.latitude.toString());
          setLongitude(localAtual.coords.longitude.toString());
        }
      } catch (error) {
        console.error("Erro ao buscar localização: ", error);
      } finally {
        setBuscandoLocalizacao(false);
      }
    }
    buscarLocalizacaoAtual();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !latitude || !longitude) {
      Alert.alert('Erro', 'Por favor, preencha o nome, latitude e longitude.');
      return;
    }

    try {
      // 1. Criamos o objeto do novo pino
      const novoPino: Typelocal = {
        id: Date.now().toString(), // Cria um ID único baseado na hora atual
        nome,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        cor: corSelecionada,
      };

      // 2. Lemos a lista antiga que está salva no telemóvel
      const locaisSalvosString = await ler('meus_locais');
      const listaAntiga: Typelocal[] = locaisSalvosString ? JSON.parse(locaisSalvosString) : [];

      // 3. Juntamos a lista antiga com o novo pino
      const novaLista = [...listaAntiga, novoPino];

      // 4. Salvamos a nova lista completa no telemóvel (tem de ser em formato de texto/JSON)
      await criar('meus_locais', JSON.stringify(novaLista));

      Alert.alert('Gem alert!', 'Local salvo.');
      
      // Limpa os campos após salvar
      setNome('');
      router.navigate('/mainmenu'); // Volta direto para a aba do mapa
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert('Erro', 'Não foi possível salvar o local.');
    }
  };

  return (
    // ... TODO O RESTO DO SEU RETURN CONTINUA EXATAMENTE IGUAL ...
    <ScrollView contentContainerStyle={styles.container}>
      {/* ... */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Local</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da localização"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Latitude</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: -22.951916"
            keyboardType="numeric"
            value={latitude}
            onChangeText={setLatitude}
          />
          {buscandoLocalizacao && <ActivityIndicator size="small" color="#7ac480" style={styles.loader} />}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Longitude</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: -43.210487"
            keyboardType="numeric"
            value={longitude}
            onChangeText={setLongitude}
          />
          {buscandoLocalizacao && <ActivityIndicator size="small" color="#7ac480" style={styles.loader} />}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cor do Pino no Mapa</Text>
        <View style={styles.colorPickerContainer}>
          {opcoesDeCores.map((cor) => (
            <TouchableOpacity
              key={cor}
              style={[
                styles.colorCircle,
                { backgroundColor: cor },
                corSelecionada === cor && styles.colorSelected 
              ]}
              onPress={() => setCorSelecionada(cor)}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={buscandoLocalizacao}>
        <Text style={styles.buttonText}>
          {buscandoLocalizacao ? 'Aguarde o GPS...' : 'Salvar Marcador'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontWeight: '600', fontFamily: 'Nunito_600SemiBold' },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 14, fontSize: 16, backgroundColor: '#f5f5f5', fontFamily: 'Nunito_400Regular' },
  loader: { position: 'absolute', right: 15 },
  colorPickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  colorCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
  colorSelected: { borderColor: '#333', transform: [{ scale: 1.1 }] },
  button: { backgroundColor: '#7ac480', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'Nunito_700Bold' },
});