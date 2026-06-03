import { LocalPagina } from "../types/typelocal";
import { apiLocais } from "../utils/axios";

const URL_API_PRODUTOS = process.env.EXPO_PUBLIC_URL_API_PRODUTOS;

if (!URL_API_PRODUTOS) {
    throw new Error('Variável EXPO_PUBLIC_URL_API_PRODUCTS não configurada.');
}

//export function useAxiosLocation() {



    //return {
        //GetLocal,
        //SaveLocal,
    //}
//}