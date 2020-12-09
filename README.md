## API de alteração e consulta a base de dados alimentar - Fullstack Challenge 20201030
***

### Descrição

API desenvolvida com o objetivo de criar uma base de dados alimentar personalizada com base nos dados disponibilizados pela [Open Food Facts](https://br.openfoodfacts.org/data), e com isso realizar alterações e consultas na mesma.

Desafio proposto pela [nata.house](https://natahouse.com/).

### Requisitos

Para a instalação desta API, o usuário precisará:

- Sistema operacional Windows;
- NodeJs;
- MongoDB;

### Instalação

O processo de instalação consiste em duas etapas:

1. Extração dos alimentos da base de dados do [Open Food Facts](https://br.openfoodfacts.org/data) e importa-los para uma base de dados pessoal.

2. Criação de uma nova coleção no banco de dados com as propriedades dos alimentos selecionadas e customizadas.

Ambas as etapas serão feitas através de arquivos *.bat* que poderão ser executados periodicamente com o auxílio de um agendador de tarefas.

É recomendado o uso do Agendador de Tarefas do Windows.

#### Extração dos alimentos

1. Antes de executar, abra de forma editável o arquivo *baixar_dbs.bat*, que se encontra na raiz do diretório.

2. Na linha 4, altere o seguinte campo:

>* **<< DIRETÓRIO DO PROJETO >>** : Local onde a API foi salva;

3. Na etapa 8, ou linha 54, altere os seguintes campos:

>* **<< URI DE ACESSO AO BANCO DE DADOS >>** : Neste espaço você deve inserir a URI de acesso ao banco de dados pessoal mongodb para o funcionamento desta API;
>* **<< INSERIR COLEÇÃO >>** : Inserir o nome da coleção onde serão armazenados os documentos extraídos da base de dados do [Open Food Facts](https://br.openfoodfacts.org/data);

Feito isso, o arquivo já pode ser executado.

Espere a finalização da execução do programa antes de dar prosseguimento a instalação.

#### Criação da nova coleção

1. Antes de executar, abra de forma editável o arquivo *preencherAlimentosNovo.bat*, que se encontra na raiz do diretório;

2. Na linha 2, altere o seguinte campo:

>* **<< DIRETÓRIO DO PROJETO >>** : Local onde a API foi salva;

3 - Na pasta *criarAlimentosNovo*, abra de forma editável o arquivo criarAlimentosNovo1.js;

>Durante a execução deste código, o seguinte erro pode ocorrer:

>``
>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
>``

>Este erro é causado pela quantidade muito grande de promessas que o compilador precisa executar, ocupando muito espaço na memória *RAM* da máquina e forçando o JavaScript a terminar a execução do código.

>Para evitar esse problema, a execução deste código foi dividia em partes.

>Nas primeiras linhas do arquivo temos:

>```
>//Constantes
>const tempoExecucao_ms = 900000; //15 minutos
>const numDaExecução = 1;
>const docsExecutadosporVez = 10000;
>
>const URI_DB = 'INSERIR AQUI A URI DE ACESO AO >BANCO DE DADOS'
>```

>Onde:

>* ***tempoExecucao_ms***: é o tempo em milissegundos em que o código será executado.
>* ***numDaExecução***: a ordem de execução deste código.
>* ***docsExecutadosporVez***: número de documentos que serão salvos por execução no banco de dados pessoal.
>* **URI_DB**: A URI de acesso ao banco de dados.</br>
>>*obs.: Como este código será executado somente de forma local, não há perigo em expor a URI.*

>Caso considere necessário, fiquei a vontade para modificar estes parâmetros em todos os arquivos da pasta *criarAlimentosNovo* e o arquivo *preencherAlimentosNovo.bat*

Feito isso, o arquivo *preencherAlimentosNovo.bat* já pode ser executado.

### Utilização

É possível interagir com a API das seguintes formas:

* **GET /**: Retorna a mensagem: *Fullstack Challenge 20201030*;
* **PUT /products/:code/?{product_name}&{quantity}&{categories}&{packaging}&{brands}&{image_url}**: Atualiza os parâmetros de um determinado produto identificado pelo campo ***code***;
* **DELETE /products/:code**: Altera o *status* de um produto para *trash*;
* **GET /products/:code**: Obter as informações de um determinado produto identificado pelo ***code***;
* **GET /products/?{p}**: Obter as informações de todos os produtos contidos na base de dados ou exibir os resultados por paginas através do parametro ***p***, que recebe um numero inteiro como valor;
* **GET /consulta**: Acesso ao *front-end* da API;

> *obs.: Os parametros delimitados por "{}" são opcionais.*