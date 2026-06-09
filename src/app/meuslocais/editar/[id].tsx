import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSecureStore } from '../../../hooks/useSecureStore';
import { Typelocal } from '../../../types/typelocal';

export default function EditarLocal() {
  const router = useRouter();
  // Captura o ID da URL
  const { id } = useLocalSearchParams(); 
  const { ler, criar } = useSecureStore();

  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('#c7c7c7');

  const opcoesDeCores = ['#006928', '#2883eb', '#b125d4', '#db3309', '#ff7300', '#dac725', '#c7c7c7', '#333333'];

  // Carrega os dados deste pino específico quando a tela abrir
  useEffect(() => {
    async function carregarDados() {
      const dados = await ler('meus_locais');
      if (dados) {
        const locais: Typelocal[] = JSON.parse(dados);
        // Encontra o local que tem o ID igual ao da URL
        const localEncontrado = locais.find(loc => loc.id === id);
        
        if (localEncontrado) {
          setNome(localEncontrado.nome);
          setLatitude(localEncontrado.latitude.toString());
          setLongitude(localEncontrado.longitude.toString());
          setCorSelecionada(localEncontrado.cor);
        }
      }
    }
    carregarDados();
  }, [id]);

  const handleAtualizar = async () => {
    if (!nome || !latitude || !longitude) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const dados = await ler('meus_locais');
      if (dados) {
        let locais: Typelocal[] = JSON.parse(dados);
        
        // Mapeia a lista: se for o item que estamos editando, atualiza os dados, senão mantém como estava
        locais = locais.map(local => {
          if (local.id === id) {
            return {
              ...local,
              nome,
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              cor: corSelecionada
            };
          }
          return local;
        });

        // Salva a lista inteira atualizada
        await criar('meus_locais', JSON.stringify(locais));
        Alert.alert('Sucesso!', 'Local atualizado com sucesso!');
        router.back(); // Volta para a lista
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Local</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Latitude</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={latitude} onChangeText={setLatitude} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Longitude</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={longitude} onChangeText={setLongitude} />
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
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAtualizar}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Mesmos estilos do NovoLocal
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontFamily: 'Nunito_600SemiBold' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 14, fontSize: 16, backgroundColor: '#f5f5f5', fontFamily: 'Nunito_400Regular' },
  colorPickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  colorCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
  colorSelected: { borderColor: '#333', transform: [{ scale: 1.1 }] },
  button: { backgroundColor: '#7ac480', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontFamily: 'Nunito_700Bold' },
});