import * as SecureStore from 'expo-secure-store';

export function useSecureStore() {

    const criar = async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    }

    const ler = async (key: string): Promise<string | null> => {
        return await SecureStore.getItemAsync(key);
    }

//  Ah eu sei lá, tu nem pediu isso >:[
//    const atualizar = async (key: string): Promise<string | null> => {
//       return await SecureStore.(key);
//    }

    const deletar = async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    }

    return {
        criar,
        ler,
        deletar,
    }
}