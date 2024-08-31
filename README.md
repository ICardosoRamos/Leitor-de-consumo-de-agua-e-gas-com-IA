# Leitor-de-consumo-de-agua-e-gas-com-IA
Leitor de conta de agua e gas com Inteligência Artificial Gemini

# Leitor de consumo de agua e gas com IA(Gemini do Google)

Um sistema que permite o usuário registrar leituras de água ou gas mas com a facilidade de enviar uma imagem do relógio de registro para o Gemini do Google capturar o texto da imagem.

### 📋 Observações

A LLM até o momento não é capaz de coletar o texto da imagem com 100% de precisão, tudo depende partindo da qualidade da imagem até a própria resposta do servidor onde a IA se encontra.

### Documentação da api:

Cria uma leitura:
POST /upload:
Request Body:
{
  "image": PRECISA SER BASE64,
  "customer_code": "1",
  "measure_datetime": "2020-05-23T00:00:00Z",
  "measure_type": "WATER"
}

Confirma uma leitura já criada.
PATCH /confirm:
Request Body:
{
  "confirmed_value": 21321,
  "measure_uuid": "IU7uG6EZwx"
}

Abre uma imagem que já foi lida pelo POST através de link retornado.
GET /tmb/:filename:
Sem mais detalhes.

Lista as leituras por cliente.
PATCH /:customer_code/list:
Pode ter um query params no estilo "WATER" ou "GAS".

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

Tecnologias que você precisa para iniciar o projeto na sua maquina:

```
Docker com disponibilidade do docker compose v2 ou docker compose v1.
```

### 🔧 Instalação

Uma série de exemplos passo-a-passo que informam o que você deve executar para ter um ambiente de desenvolvimento em execução.

Clone o projeto:

```
git clone git@github.com:ICardosoRamos/projeto_fw7.git
```

Abra um terminal:

Execute:

```
docker compose up --build ou docker compose up(se tiver na v2 do docker compose é necessário o - entre eles, exemplo: docker-compose)
```

## 🛠️ Construído com

Mencione as ferramentas que você usou para criar seu projeto

* [Node.js](https://nodejs.org/docs/latest/api/) - Servidor backend.
* [Fastify](https://fastify.dev/) - Biblioteca para criar APIs no Node.js.
* [Prisma](https://www.prisma.io/) - ORM usada para conexões com o banco.
* [POSTGRESQL](https://www.postgresql.org/) - Database utilizado.

## ✒️ Autores

Mencione todos aqueles que ajudaram a levantar o projeto desde o seu início

* **Irwyng Cardoso Ramos** - *Trabalho Total* - [ICardosoRamos](https://github.com/ICardosoRamos)

---
⌨️ com ❤️ por [Irwyng Cardoso Ramos](https://github.com/ICardosoRamos) Será ótimo aprender mais com vocês se o retorno for positivo. Vlw😊
