import { Stack } from "expo-router";

export default function MeusLocaisLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ 
          headerShown: false, // Oculta o cabeçalho principal da aba
        }}
      />
      {/* Nova tela de edição que vamos criar */}
      <Stack.Screen
        name="editar/[id]"
        options={{ 
          title: 'Editar Local', 
          headerShown: true, // Mostra o cabeçalho com botão de "Voltar"
          headerBackTitle: 'Voltar',
          headerTintColor: '#7ac480'
        }}
      />
    </Stack>
  );
}