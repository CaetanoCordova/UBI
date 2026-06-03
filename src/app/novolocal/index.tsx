import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Dica: Futuramente, você pode importar o tipo daqui:
// import { TipoLocal } from '../../types/typelocal';

export default function NovoLocalIndex() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('#FF0000'); // Vermelho por padrão

  // Opções de cores para o pino
  const opcoesDeCores = ['#FF0000', '#0000FF', '#00FF00', '#FFA500', '#800080', '#000000'];

  const handleSalvar = async () => {
    if (!nome || !latitude || !longitude) {
      Alert.alert('Erro', 'Por favor, preencha o nome, latitude e longitude.');
      return;
    }

    // Objeto do novo local
    const novoPino = {
      nome,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      cor: corSelecionada,
    };

    // Aqui você pode usar o seu hook useAxios para enviar para a API
    // ex: await api.post('/locais', novoPino);
    
    console.log('Novo pino salvo:', novoPino);
    Alert.alert('Sucesso!', 'Local adicionado aos seus mapas!');
    
    // Volta para o menu principal ou tela anterior
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Input de Nome */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Local</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Cristo Redentor, Minha Casa..."
          value={nome}
          onChangeText={setNome}
        />
      </View>

      {/* Input de Latitude */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: -22.951916"
          keyboardType="numeric"
          value={latitude}
          onChangeText={setLatitude}
        />
      </View>

      {/* Input de Longitude */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: -43.210487"
          keyboardType="numeric"
          value={longitude}
          onChangeText={setLongitude}
        />
      </View>

      {/* Seletor Visual de Cor do Pino */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cor do Pino no Mapa</Text>
        <View style={styles.colorPickerContainer}>
          {opcoesDeCores.map((cor) => (
            <TouchableOpacity
              key={cor}
              style={[
                styles.colorCircle,
                { backgroundColor: cor },
                corSelecionada === cor && styles.colorSelected // Aplica estilo se estiver selecionada
              ]}
              onPress={() => setCorSelecionada(cor)}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Marcador</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1, // Garante que o scroll ocupe a tela toda
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22, // Deixa perfeitamente redondo
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#333', // Dá um destaque escuro na borda da cor escolhida
    transform: [{ scale: 1.1 }], 
  },
  button: {
    backgroundColor: '#007AFF', 
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});