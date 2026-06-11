import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { apiLocais } from '../../utils/axios';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { CustomInput } from '../../components/CustomInput';
import { PrimaryButton } from '../../components/PrimaryButton';

const formSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 letras'),
  latitude: z.string().min(1, 'A latitude é obrigatória'),
  longitude: z.string().min(1, 'A longitude é obrigatória'),
  cor: z.string().min(1, 'Selecione uma cor'),
  favorito: z.boolean()
});

type FormData = z.infer<typeof formSchema>;

export default function NovoLocalIndex() {
  const router = useRouter();
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(true);
  const opcoesDeCores = ['#006928', '#2883eb', '#b125d4', '#db3309', '#ff7300', '#dac725', '#c7c7c7', '#333333'];


  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', latitude: '', longitude: '', cor: '#FF0000', favorito: false }
  });

  useEffect(() => {
    async function buscarLocalizacaoAtual() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const localAtual = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          setValue('latitude', localAtual.coords.latitude.toString());
          setValue('longitude', localAtual.coords.longitude.toString());
        }
      } catch (error) {
        console.error("Erro ao buscar localização:", error);
      } finally {
        setBuscandoLocalizacao(false);
      }
    }
    buscarLocalizacaoAtual();
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const novoPino = {
        nome: data.nome,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        cor: data.cor,
        favorito: data.favorito,
      };

      await apiLocais.post('/locais', novoPino);
      Alert.alert('Sucesso!', 'Local guardado na nuvem!');
      router.navigate('/mainmenu');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível comunicar com o servidor.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Controller control={control} name="nome" render={({ field: { onChange, onBlur, value } }) => (
        <CustomInput 
          label="Nome do Local" 
          placeholder="Ex: Cristo Redentor" 
          onBlur={onBlur} onChangeText={onChange} value={value} 
          error={errors.nome?.message} 
        />
      )} />

      <Controller control={control} name="latitude" render={({ field: { onChange, onBlur, value } }) => (
        <CustomInput 
          label="Latitude" 
          keyboardType="numeric" 
          onBlur={onBlur} onChangeText={onChange} value={value} 
          error={errors.latitude?.message} 
          isLoading={buscandoLocalizacao} 
        />
      )} />

      <Controller control={control} name="longitude" render={({ field: { onChange, onBlur, value } }) => (
        <CustomInput 
          label="Longitude" 
          keyboardType="numeric" 
          onBlur={onBlur} onChangeText={onChange} value={value} 
          error={errors.longitude?.message} 
          isLoading={buscandoLocalizacao} 
        />
      )} />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cor do Pino no Mapa</Text>
        <Controller control={control} name="cor" render={({ field: { onChange, value } }) => (
          <View style={styles.colorPickerContainer}>
            {opcoesDeCores.map((cor) => (
              <TouchableOpacity 
                key={cor} 
                style={[styles.colorCircle, { backgroundColor: cor }, value === cor && styles.colorSelected]} 
                onPress={() => onChange(cor)} activeOpacity={0.7} 
              />
            ))}
          </View>
        )} />
        {errors.cor && <Text style={{color: '#EDADAD', fontSize: 13, marginTop: 4, fontFamily: 'Nunito_600SemiBold'}}>{errors.cor.message}</Text>}
      </View>

      <View style={styles.switchGroup}>
        <Text style={styles.label}>Marcar como Favorito?</Text>
        <Controller control={control} name="favorito" render={({ field: { onChange, value } }) => (
          <Switch trackColor={{ false: "#e0e0e0", true: "#a0e8ac" }} thumbColor={value ? "#7ac480" : "#f4f3f4"} onValueChange={onChange} value={value} />
        )} />
      </View>

      <PrimaryButton 
        title={buscandoLocalizacao ? 'Aguarde o GPS...' : 'Salvar Marcador'}
        onPress={handleSubmit(onSubmit)}
        disabled={buscandoLocalizacao}
        isLoading={isSubmitting}
      />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  inputGroup: { marginBottom: 24 },
  switchGroup: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontFamily: 'Nunito_600SemiBold' },
  colorPickerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  colorCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
  colorSelected: { borderColor: '#333', transform: [{ scale: 1.1 }] },
});