# UBI

## O Problema que o App Resolve
Com a rotina agitada nas cidades, é muito comum que esqueçamos da localização exata de lugares interessantes pelos quais passamos. O **UBI** surge para resolver este problema, permitindo ao utilizador criar um mapa próprio e personalizado, guardando locais importantes, organizando-os por cores, marcando os favoritos e descobrindo a que distância se encontra de cada um deles em tempo real.

---

## Aplicação do Hardware definido
O tema que me foi sorteado, Geolocalização e Mapas, não é apenas uma funcionalidade, mas sim o NÚCLEO de toda a aplicação, utilizado de forma intensiva em várias etapas:

1. **Gestão de Permissões:** A app solicita acesso à localização em primeiro plano (Foreground) logo no início.
2. **Preenchimento Automático:** Ao adicionar um "Novo Local", consultamos o GPS e preenchemos instantaneamente a Latitude e Longitude atuais do utilizador no formulário.
3. **Navegação em Tempo Real:** O mapa principal acompanha o movimento do utilizador continuamente.
4. **Cálculo Dinâmico:** A aplicação utiliza a Fórmula de Haversine para calcular, em tempo real, a distância exata (em metros ou quilómetros) entre a posição do utilizador (GPS) e os pinos guardados na base de dados.

---

## As Telas

O UBI é composto por uma navegação em abas (Tabs) e uma pilha (Stack) para edição, contendo as seguintes interfaces:

### 1. Mapa (Menu Principal)
O ecrã inicial da app. Carrega um mapa interativo que se centraliza na localização do utilizador. Faz uma requisição **GET** via Axios para a nossa API na nuvem e desenha os marcadores (pinos) coloridos no mapa. Na metade inferior, exibe uma lista organizada dinamicamente que mostra os locais do mais próximo para o mais distante em relação ao utilizador.

### 2. Novo Local (Formulário de cadastro)
Ecrã focado na criação de dados.
* **Campos (5):** Nome (Texto), Latitude (Número), Longitude (Número), Cor (Seletor Customizado) e Favorito (Switch).
* **Gestão e Validação:** Utiliza `React Hook Form` em conjunto com o `Zod`. Impede a submissão de dados inválidos, alterando as bordas para vermelho e apresentando mensagens de erro.
* **Integração:** Submete os dados para a cloud utilizando uma requisição **POST** no Axios, com tratamento de estado de *loading* (ActivityIndicator desativa o botão durante o envio).

### 3. Meus Locais (Listagem e CRUD)
Faz uma leitura (**GET**) limpa de todos os registos guardados na API. Através de cards intuitivos, permite ao utilizador gerir o seu catálogo. Possui um botão de exclusão que aciona um **DELETE** via Axios com confirmação (Alert) de segurança.

### 4. Editar Local (Não acessível pela barra inferior)
Acessível a partir dos "Meus Locais". Recebe o iD do local por parâmetro na URL da rota. Executa um **GET** específico para preencher o formulário e, ao salvar, faz uma requisição **PUT** via Axios para atualizar a cloud. Reutiliza os componentes construídos em `/components` para manter a coerência visual e de código.

---

## Tecnologias Utilizadas
* **React Native & Expo:** Framework principal e roteamento (`expo-router`).
* **React Hook Form & Zod:** Gestão de estados do formulário e validação de esquemas.
* **Axios:** Comunicação HTTP assíncrona com a MockAPI.
* **Expo Location:** Acesso ao hardware de GPS do dispositivo.
* **React Native Maps:** Renderização cartográfica e marcações visuais.
* **Entypo (Expo Vector Icons):** Iconografia da interface e personalização dos pinos.
