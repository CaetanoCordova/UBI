import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export function PrimaryButton({ title, isLoading, disabled, style, ...rest }: PrimaryButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, (disabled || isLoading) && styles.buttonDisabled, style]} 
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { 
    backgroundColor: '#7ac480', 
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
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontFamily: 'Nunito_700Bold' },
});