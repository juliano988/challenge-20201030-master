const fetch = require('node-fetch');
const download = require('download');
const gunzip = require('gunzip-file');
const { execFile } = require('child_process');
const del = require('del');

//Constantes:
const uri = '--uri ' + 'mongodb+srv://julio123:julio123@cluster0.ab00a.mongodb.net/Nata_House_Desafio';
const collection = '--collection alimentos';
const type = '--type json';
const file = '--file ' + __dirname + '\\arquivosOFF\\';

module.exports = function importarDbOFF() {
    fetch('https://static.openfoodfacts.org/data/delta/index.txt')
        .then(function (response) {
            return response.text(); // or .text() or .blob() ...
        })
        .then(function (text) {
            // text is the response body
            //Slice inserido apenas para fins de teste para evitar ocupar o limite de espaço maxímo no bando de dados.
            const nomeArquivos = text.trim().split(/\s/)//.slice(0,10);
            console.log('Arquivos para download: ' + nomeArquivos.length);

            (async () => {
                let inportFlag = 0;
                for (let i in nomeArquivos) {
                    const iNum = Number(i);
                    await download('https://static.openfoodfacts.org/data/delta/' + nomeArquivos[iNum], 'arquivosOFF');
                    console.log('Arquivo baixado ' + (iNum + 1).toString(10).padStart(2, '0') + '/' + nomeArquivos.length + ': ' + nomeArquivos[iNum])
                    gunzip('arquivosOFF/' + nomeArquivos[iNum], 'arquivosOFF/' + nomeArquivos[iNum].replace('.gz', ''), function () {
                        console.log('Arquivo descompactado ' + (iNum + 1).toString(10).padStart(2, '0') + '/' + nomeArquivos.length + ': ' + nomeArquivos[iNum]);
                    });
                    execFile('mongoimport', [uri, collection, type, file + nomeArquivos[iNum].replace('.gz', '')], { shell: true }, function () {
                        console.log('Arquivo importado ' + (iNum + 1).toString(10).padStart(2, '0') + '/' + nomeArquivos.length + ': ' + nomeArquivos[iNum].replace('.gz', ''));
                        if (++inportFlag >= nomeArquivos.length) {
                            del(['arquivosOFF']);
                            console.log('Processo de importação concluído!');
                        }
                    });
                }
            })();
        })
        .catch(function (e) {
            // error in e.message
            console.log(e.message);
        });
}