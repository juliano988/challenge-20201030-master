## API de alteração e consulta a base de dados alimentar - Fullstack Challenge 20201030


### Descrição

API desenvolvida com o objetivo de criar uma base de dados alimentar personalizada com base nos dados disponibilizados pela [Open Food Facts](https://br.openfoodfacts.org/data), e com isso realizar alterações e consultas na mesma.

Desafio proposto pela [nata.house](https://natahouse.com/).

### Requisitos

Para a instalação desta API, o usuário precisará:

- NodeJs;
- MongoDB;

### Instalação

O processo de instalação consiste em duas etapas:

1. Extração dos alimentos da base de dados do [Open Food Facts](https://br.openfoodfacts.org/data) e importa-los para a base de dados da API;

2. Formatação dos dados da base de dados da API para o formato adequado ao funcionamento da mesma.

Ambas as etapas serão feitas através do arquivo ***criarAlimentosColl.js*** que se encontra na raíz do diretório da API.

Durante a execução deste código, o seguinte erro pode ocorrer:

>``
>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
>``

Este erro é causado pela quantidade muito grande de promessas que o compilador precisa executar, ocupando muito espaço na memória *RAM* da máquina e forçando o JavaScript a terminar a execução do código.

Para evitar esse problema, a execução deste código foi dividia em partes.

Ao abrir o arquivo ***.env*** contido na raiz do diretório temos as seguintes linhas:

>```
>URI=""
>NUM_DE_EXECUCOES=10
>DOCS_EXECUTADOS_POR_VEZ=5000
>INTERVALO_ENTRE_EXECUCOES_MIN=5
>```

Onde:

* ***URI***: é a sua URI de acesso ao banco de dados, e que deve seguir o seguinte padrão:
> ``
>mongodb+srv://<user>:<password>@<cluster>.ab00a.mongodb.net/<dbname>?retryWrites=true&w=majority
>``

>Este modelo de URI pode ser extraído do seu banco de dados [MongoDB Atlas](http://www.mongodb.com/), caso a *URI* que deseja utilizar seja diferente deste modelo, demais partes do código da API precisarão ser alteradas.

* ***NUM_DE_EXECUCOES***: número de execuções do código de formatação dos dados;
* ***DOCS_EXECUTADOS_POR_VEZ***: número de documentos que serão formatados por execução no banco de dados da API.
* **INTERVALO_ENTRE_EXECUCOES_MIN**: O tempo médio em minutos que cada execução poderá demandar.

Como já foi mencionado, a execução deste código se da em partes para evitar erros de memória, portanto é necessário saber a quantidade máxima aproximada de documentos que a base de dados pode ter, e em seguida dividir este valor pelo número de execuções desejadas para completar a formatação dos dados, e armazenar o resultado desta divisão na constante **DOCS_EXECUTADOS_POR_VEZ** e o número de execuções desejadas para completar a formatação dos dados na constante **NUM_DE_EXECUCOES**, e por fim, armazenar o tempo em minutos necessário para cada execução em **INTERVALO_ENTRE_EXECUCOES_MIN**.

O valor destas contantes dependem primordialmente da qualidade de sua conexão com a internet, com o processamento de sua máquina, e com a quantidade de memória *RAM* que a mesma possui.

Vale ressaltar que o superdimensionamento destas constantes não causam prejuízos ao funcionamento da API, porém o subdimensionamento das mesmas podem ocasionar perda de dados e/ou erros de execução.

Os valores predefinidos funcionam bem em máquinas com capacidade de processamento e de memoria *RAM* medianas

Feito isso, o arquivo ***criarAlimentosColl.js*** já pode ser executado.

A execução deste código respeita a seguinte periodicidade:
* **0h:** Ocorre o precesso de importação dos dados;
* **1h:** Ocorre o processo de formatação dos dados.
> *Obs.: O processo de formatação, após às 1h, é executado com a periodicidade definida na constante **INTERVALO_ENTRE_EXECUCOES_MIN**, e pela quantidade de vezes definida na constante **NUM_DE_EXECUCOES**.*

### Utilização

Para inicializar o ***back-end*** e o ***front-end*** respectivamente, execute o comando ***npm start*** na raiz do diretório e na pasta ***front-end***.

O back-end se encontra na porta **8080** e o fronte end na porta **3000**.

É possível interagir com a API das seguintes formas:

* **GET /**: Retorna a mensagem: *Fullstack Challenge 20201030*;
* **PUT /products/:code/?{product_name}&{quantity}&{categories}&{packaging}&{brands}&{image_url}**: Atualiza os parâmetros de um determinado produto identificado pelo campo ***code***;
* **DELETE /products/:code**: Altera o *status* de um produto para *trash*;
* **GET /products/:code**: Obter as informações de um determinado produto identificado pelo ***code***;
* **GET /products/?{p}**: Obter as informações de todos os produtos contidos na base de dados ou exibir os resultados por paginas através do parametro ***p***, que recebe um numero inteiro como valor;

> *obs.: Os parametros delimitados por "{}" são opcionais.*