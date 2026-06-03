import axios from 'axios';

const URL_API_LOCAIS = process.env.EXPO_PUBLIC_URL_API_LOCAIS;

if (!URL_API_LOCAIS) {
    throw new Error('Variável EXPO_PUBLIC_URL_API_LOCAIS não configurada.');
}

export const apiLocais = axios.create({
  baseURL: URL_API_LOCAIS,
});


apiLocais.interceptors.request.use(config => {
  console.log('Interceptando requisição', config)
  console.log(config);
  console.log('---- ----');
  config.headers.set('cabecalho-c', 'placeholder');

  return config;
});
