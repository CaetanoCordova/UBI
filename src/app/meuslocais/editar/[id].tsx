import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiLocais } from '../../../utils/axios';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 letras'),
  latitude: z.string().min(1, 'A latitude é obrigatória'),
  longitude: z.string().min(1, 'A longitude é obrigatória'),
  cor: z.string().min(1, 'Selecione uma cor'),
  favorito: z.boolean()
});

type FormData = z.infer<typeof formSchema>;

export default function EditarLocal() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Pega o ID da URL
  
  // Estado para controlar o carregamento inicial dos dados do pino
  const [carregandoDados, setCarregandoDados] = useState(true);

  const opcoesDeCores = ['#006928', '#2883eb', '#b125d4', '#db3309', '#ff7300', '#dac725', '#c7c7c7', '#333333'];

  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', latitude: '', longitude: '', cor: '#c7c7c7', favorito: false }
  });

  // Buscar os dados do local específico na API assim que a tela abre
  useEffect(() => {
    async function buscarLocalDaAPI() {
      try {
        setCarregandoDados(true);
        // Faz um GET apenas para este ID específico
        const response = await apiLocais.get(`/locais/${id}`);
        const local = response.data;
        
        // Preenche o formulário com os dados que vieram da API
        setValue('nome', local.nome);
        setValue('latitude', local.latitude.toString());
        setValue('longitude', local.longitude.toString());
        setValue('cor', local.cor);
        setValue('favorito', local.favorito || false);
      } catch (error) {
        console.error("Erro ao buscar local para edição:", error);
        Alert.alert('Erro', 'Não foi possível carregar os dados deste local.');
        router.back();
      } finally {
        setCarregandoDados(false);
      }
    }
    
    if (id) {
      buscarLocalDaAPI();
    }
  }, [id, setValue]);

  // Função que envia a atualização para a API (PUT)
  const onSubmit = async (data: FormData) => {
    try {
      const localAtualizado = {
        nome: data.nome,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        cor: data.cor,
        favorito: data.favorito,
      };

      // Faz o PUT para atualizar os dados no servidor
      await apiLocais.put(`/locais/${id}`, localAtualizado);

      Alert.alert('Sucesso!', 'Local atualizado com sucesso!');
      router.back(); // Volta para a lista de locais
      
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o local no servidor.');
    }
  };

  if (carregandoDados) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7ac480" />
        <Text style={{ marginTop: 10, color: '#90a89a', fontFamily: 'Nunito_600SemiBold' }}>A carregar dados do local...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome do Local</Text>
        <Controller control={control} name="nome" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={[styles.input, errors.nome && styles.inputError]} placeholder="Ex: Cristo Redentor" onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
        {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Latitude</Text>
        <Controller control={control} name="latitude" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={[styles.input, errors.latitude && styles.inputError]} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
        {errors.latitude && <Text style={styles.errorText}>{errors.latitude.message}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Longitude</Text>
        <Controller control={control} name="longitude" render={({ field: { onChange, onBlur, value } }) => (
          <TextInput style={[styles.input, errors.longitude && styles.inputError]} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={value} />
        )} />
        {errors.longitude && <Text style={styles.errorText}>{errors.longitude.message}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cor do Pino no Mapa</Text>
        <Controller control={control} name="cor" render={({ field: { onChange, value } }) => (
          <View style={styles.colorPickerContainer}>
            {opcoesDeCores.map((cor) => (
              <TouchableOpacity key={cor} style={[styles.colorCircle, { backgroundColor: cor }, value === cor && styles.colorSelected]} onPress={() => onChange(cor)} activeOpacity={0.7} />
            ))}
          </View>
        )} />
        {errors.cor && <Text style={styles.errorText}>{errors.cor.message}</Text>}
      </View>

      <View style={styles.switchGroup}>
        <Text style={styles.label}>Marcar como Favorito?</Text>
        <Controller control={control} name="favorito" render={({ field: { onChange, value } }) => (
          <Switch trackColor={{ false: "#e0e0e0", true: "#a0e8ac" }} thumbColor={value ? "#7ac480" : "#f4f3f4"} onValueChange={onChange} value={value} />
        )} />
      </View>

      <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.7 }]} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Alterações</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  inputGroup: { marginBottom: 24 },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontFamily: 'Nunito_600SemiBold' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 14, fontSize: 16, backgroundColor: '#f5f5f5', fontFamily: 'Nunito_400Regular' },
  inputError: { borderColor: '#EDADAD', borderWidth: 2 },
  errorText: { color: '#EDADAD', fontSize: 13, marginTop: 4, fontFamily: 'Nunito_600SemiBold' },
  colorPickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  colorCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
  colorSelected: { borderColor: '#333', transform: [{ scale: 1.1 }] },
  button: { backgroundColor: '#7ac480', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontFamily: 'Nunito_700Bold' },
});