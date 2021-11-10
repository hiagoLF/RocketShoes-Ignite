# RocketShoes - React - Ignite

- Projeto de solução para o desafio 03 da trilha React do treinamento Ignite da RocketSeat

# Rodando o projeto

- Requerimento: Node 14^
- Dentro da pasta do projeto, execute os seguintes comandos

```bash
# Instale as dependências
yarn install

# Inicie a API fake
yarn server

# Abra outro terminal e inicie o projeto
yarn dev

# Projeto: http://localhost:3000/
# API fake: http://localhost:3333/

# Para rodar os testes basta executar...
yarn test
```

# Api Fake

- Desenvolvida com JSON server
- Rotas:
  - `/stock` - Listagem do estoque de produtos
  - `/products` - Listagem dos produtos
  - `/stock/1` - Buscar estoque para produto com id 1
  - `/products/1` - Buscar produto com id 1
