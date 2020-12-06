# Fullstack Challenge 20201030


## Introdução

Nesse desafio trabalharemos no desenvolvimento de uma REST API que utilizará os dados do projeto Open Food Facts, um banco de dados aberto com informação nutricional de diversos produtos alimentícios.

O projeto tem como objetivo dar suporte a equipe de nutricionistas da empresa Fitness Foods LC para que possam comparar de maneira rápida a informação nutricional dos alimentos da base do Open Food Facts.

### Obrigatório

- Trabalhar em um FORK deste repositório em seu usuário;
- O projeto back-end deverá ser desenvolvido usando em NodeJs ou Linguagem de preferência;
- O projeto front-end deverá ser desenvolvido usando em ReactJs ou Framework de preferência;
- Documentação para configuração do projeto em ambientes de produção (como instalar, rodar e referências a libs usadas);


## O projeto

- Criar um banco de dados MongoDB usando Atlas: https://www.mongodb.com/cloud/atlas ou algum Banco de Dados SQL se não sentir confortável com NoSQL;
- Criar uma REST API com as melhores práticas de desenvolvimento.
- Criar uma versão Web para listar os produtos
- Recomendável usar Drivers oficiais para integração com o DB

### Modelo de Dados:

Para a definição do modelo, consultar o arquivo [products.json](./products.json) que foi exportado do Open Food Facts, um detalhe importante é que temos dois campos personalizados para poder fazer o controle interno do sistema e que deverão ser aplicados em todos os alimentos no momento da importação, os campos são:

- `imported_t`: campo do tipo Date com a dia e hora que foi importado;
- `status`: campo do tipo Enum com os possíveis valores draft, `trash` e `published`;

### Sistema do CRON

Para prosseguir com o desafio, precisaremos criar na API um sistema de atualização que vai importar os dados para a Base de Dados com a versão mais recente do [Open Food Facts](https://br.openfoodfacts.org/data) uma vez ao día. Adicionar aos arquivos de configuração o melhor horário para executar a importação.

A lista de arquivos do Open Food, pode ser encontrada em: 

- https://static.openfoodfacts.org/data/delta/index.txt

Onde cada linha representa um arquivo que está disponível em https://static.openfoodfacts.org/data/delta/{filename}. O nome do arquivo contém o timestamp UNIX da primeira e última alteração contida no arquivo JSON, para que os arquivos possam ser importados (após extracção) ordenados.

É recomendável utilizar uma Collection secundária para controlar os históricos das importações e facilitar a validação durante a execução.

Nota: Importante lembrar que todos os dados deverão ter os campos personalizados `imported_t` e `status`.

### A REST API

Na REST API teremos os seguintes endpoints:

- `GET /`: Retornar um Status: 200 e uma Mensagem "Fullstack Challenge 20201030"
- `PUT /products/:code`: Será responsável por receber atualizações do Projeto Web
- `DELETE /products/:code`: Mudar o status do produto para `trash`
- `GET /products/:code`: Obter a informação somente de um produto da base de dados
- `GET /products`: Listar todos os produtos da base de dados, adicionar sistema de paginação para não sobrecarregar o `REQUEST`.

#### Extras

- **Diferencial 1** Configurar um sistema de alerta se tem algum falho durante o Sync dos produtos;
- **Diferencial 2** Descrever a documentação da API utilizando o conceito de Open API 3.0;
- **Diferencial 3** Escrever Unit Tests para os endpoints da API;
- **Diferencial 4** Configurar Docker no Projeto para facilitar o Deploy da equipe de DevOps;
- **Diferencial 5** Escrever um esquema de segurança aplicado nos endpoints (Api Key ou JWT)

### Front End

Desenvolver um projeto em ReactJs ou técnologia de preferência para listar os produtos com a seguinte informação:

- Imagem
- Nome

Ao clicar nos produtos, expandiremos a informação utilizando um modal com os dados:

- Barcode
- Status
- Packaging
- Brands
- Store

#### Extras

- **Diferencial 1** Adicionar fluxo de editar os dados do produto;
- **Diferencial 2** Adicionar fluxo para deletar produtos;
- **Diferencial 3** Adicionar um sistema de comparação entre os produtos;
- **Diferencial 4** Escrever Unit Tests para os componentes do projeto;


## Readme do Repositório

- Deve conter o título de cada projeto
- Uma descrição de uma frase
- Como instalar e usar o projeto (instruções)
- Não esqueça o [.gitignore](https://www.toptal.com/developers/gitignore)

## Finalização

Avisar sobre a finalização e enviar para correção em: [https://coodesh.com/review-challenge](https://bit.ly/3e7MjcK)
Após essa etapa será marcado a apresentação/correção do projeto.

## Instruções para a Apresentação:

1. Será necessário compartilhar a tela durante a vídeo chamada;
2. Deixe todos os projetos de solução previamente abertos em seu computador antes de iniciar a chamada;
3. Deixe os ambientes configurados e prontos para rodar;
4. Prepara-se pois você será questionado sobre cada etapa e decisão do Challenge;
5. Prepare uma lista de perguntas, dúvidas, sugestões de melhorias e feedbacks (caso tenha).


## Suporte

Use o nosso canal no slack: http://bit.ly/32CuOMy para tirar dúvidas sobre o processo ou envie um e-mail para contato@coodesh.com.

