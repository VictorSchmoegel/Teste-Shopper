# Teste-Shopper

Uma aplicação para gerenciar viagens e motoristas, utilizando uma arquitetura full-stack com frontend em React (Vite), backend em Node.js, banco de dados MySQL e containerização com Docker.

## **Tecnologias Utilizadas**
- **Frontend:** React com Vite
- **Backend:** Node.js com Express
- **Banco de Dados:** MySQL
- **Containerização:** Docker e Docker Compose
- **Proxy:** Nginx

---

## **Configuração do Ambiente**

### **Pré-requisitos**
1. [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.
2. Chave de API do Google Maps (GOOGLE_API_KEY).


#### **Instruções de Uso**
1. Crie o arquivo .env na raiz do projeto com a seguinte variável:
    -GOOGLE_API_KEY="sua_chave_de_api_do_google".
2. Subir a Aplicação.
    -Execute o seguinte comando na raiz do projeto para iniciar todos os serviços:
    ``docker-compose up --build``
    Os serviços disponíveis serão:
  **Frontend**: http://localhost
  **Backend**: http://localhost:8080
  **Banco de Dados**: Porta 5234 (local), configurado no Docker Compose.
