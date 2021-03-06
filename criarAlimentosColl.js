require('dotenv').config();
const cron = require('node-cron');
const importarDbOFF = require('./importarDbOFF.js');

//Constantes
const numDeExecuções = Number(process.env.NUM_DE_EXECUCOES);
const docsExecutadosporVez = Number(process.env.DOCS_EXECUTADOS_POR_VEZ);
const intervaloEntreExecuçõesMin = Number(process.env.INTERVALO_ENTRE_EXECUCOES_MIN);
const URI_DB = process.env.URI;

const mongoose = require('mongoose');
mongoose.connect(URI_DB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    const alimentosSchema = new mongoose.Schema({
        code: String,
        barcode: String,
        status: String,
        imported_t: Date,
        url: String,
        product_name: String,
        quantity: String,
        categories: String,
        packaging: String,
        brands: String,
        image_url: String
    });

    const Alimentos = mongoose.model('alimentos', alimentosSchema);

    // É iniciado às 0h o processo de importação da base de ddos do OFF para a base de dados da API.
    cron.schedule('* 0 * * *', () => {
        console.clear();

        console.log('Importando dados do OFF para o bando de dados da API.');
        importarDbOFF();
    });

    let numDaExecução = Infinity;

    // É iniciado às 1h o processo de formatação da base de dados da API
    cron.schedule('* 1 * * *', () => {
        console.clear();

        numDaExecução = 0;
        console.log(new Date(), ' - Processo de formatação dos dados da API iniciado.');
        Alimentos.deleteMany({ product_name: /^(?!.)/ }, function (err, data) {
            if (err) { return console.log(err) };
            let excluidos1 = data.n;
            Alimentos.deleteMany({ product_name: { $exists: false } }, function (err, data) {
                if (err) { return console.log(err) };
                console.log('Foram excluídos ' + (excluidos1 + data.n) + ' alimentos sem nome.');
            });
        });
    });

    //Processo de formatação da base de dados da API é executado de acordo com a periodicidade definida na constante "intervaloEntreExecuçõesMin"
    cron.schedule('*/' + intervaloEntreExecuçõesMin + ' * * * *', () => {
        console.clear();

        if (++numDaExecução <= numDeExecuções) {
            console.log(new Date() + ' - Execução ' + numDaExecução + '/' + numDeExecuções);

            Alimentos.find({}).select('code product_name quantity categories packaging brands images barcode status imported_t url image_url').skip((numDaExecução - 1) * docsExecutadosporVez).limit(docsExecutadosporVez).exec(function (err, data) {
                if (err) { return console.log(err) };
                const alimentosSelecionados = data;
                console.log('Documentos encontrados: ' + alimentosSelecionados.length);

                for (const i in alimentosSelecionados) {

                    if (alimentosSelecionados[Number(i)].imported_t) {
                        console.log('Alimento já formatado: ' + alimentosSelecionados[Number(i)].code, alimentosSelecionados[Number(i)].product_name);

                    } else {
                        let imageLink;
                        // Estrutura try catch necessária nos casos onde o alimento não possui imagem.
                        try {
                            imageLink = "https://static.openfoodfacts.org/images/products/" + alimentosSelecionados[Number(i)].code.substring(0, 3) + '/' + alimentosSelecionados[Number(i)].code.substring(3, 6) + '/' + alimentosSelecionados[Number(i)].code.substring(6, 9) + '/' + alimentosSelecionados[Number(i)].code.substring(9) + '/' + Object.getOwnPropertyNames(alimentosSelecionados[Number(i)].get('images')).find(function (val) { return (/front_/).test(val) }) + '.' + alimentosSelecionados[Number(i)].get('images')[Object.getOwnPropertyNames(alimentosSelecionados[Number(i)].get('images')).find(function (val) { return (/front_/).test(val) })].rev + '.200.jpg';
                        } catch (error) {
                            imageLink = '/img_not_found.png';
                        }
                        Alimentos.replaceOne({ code: alimentosSelecionados[Number(i)].code },
                            {
                                code: alimentosSelecionados[Number(i)].code,
                                barcode: Number(alimentosSelecionados[Number(i)].code).toString(10).length === 13 ? alimentosSelecionados[Number(i)].code + "(EAN / EAN-13)" : alimentosSelecionados[Number(i)].code + "(EAN / EAN-13) " + alimentosSelecionados[Number(i)].code.substring(1) + "(UPC / UPC-A)",
                                status: "published",
                                imported_t: new Date(),
                                url: "https://world.openfoodfacts.org/product/" + alimentosSelecionados[Number(i)].code,
                                product_name: alimentosSelecionados[Number(i)].product_name,
                                quantity: alimentosSelecionados[Number(i)].quantity,
                                categories: alimentosSelecionados[Number(i)].categories,
                                packaging: alimentosSelecionados[Number(i)].packaging,
                                brands: alimentosSelecionados[Number(i)].brands,
                                image_url: imageLink
                            }, { omitUndefined: true }, function (err, data) {
                                if (err) { return console.log(err) };
                                console.log('Alimento atualizado: ' + alimentosSelecionados[Number(i)].code, alimentosSelecionados[Number(i)].product_name);
                            });
                    }
                };
            });
        } else if (numDaExecução !== Infinity) {
            console.log(new Date() + ' - Número de execuções foi alcançado');
        }
    });
});


