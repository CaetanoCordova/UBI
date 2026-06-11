import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  isLoading?: boolean;
}

export function CustomInput({ label, error, isLoading, style, ...rest }: CustomInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputWithIcon}>
        <TextInput
          style={[styles.input, { flex: 1 }, error && styles.inputError, style]}
          {...rest}
        />
        {isLoading && <ActivityIndicator size="small" color="#7ac480" style={styles.loader} />}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 8, color: '#333', fontFamily: 'Nunito_600SemiBold' },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 8, 
    padding: 14, 
    fontSize: 16, 
    backgroundColor: '#f5f5f5', 
    fontFamily: 'Nunito_400Regular' 
  },
  inputError: { borderColor: '#EDADAD', borderWidth: 2 },
  errorText: { color: '#EDADAD', fontSize: 13, marginTop: 4, fontFamily: 'Nunito_600SemiBold' },
  loader: { position: 'absolute', right: 15 },
});