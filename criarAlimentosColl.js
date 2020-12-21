var cron = require('node-cron');

//Constantes
const numDeExecuções = 10;
const docsExecutadosporVez = 5000;
const intervaloEntreExecuçõesMin = 5;

const URI_DB = "mongodb+srv://julio123:julio123@cluster0.ab00a.mongodb.net/Nata_House_Desafio?retryWrites=true&w=majority";

require('dotenv').config();
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

    //Processo é reiniciado às 1h
    // cron.schedule('* 1 * * *', () => {
    //     numDaExecução = 1;
    // });

    //Processo é executado a cada 5min
    let numDaExecução = 1;
    cron.schedule('*/' + intervaloEntreExecuçõesMin + ' * * * *', () => {
        console.clear();
        if (numDaExecução <= numDeExecuções) {
            console.log(new Date() + ' - Execução ' + numDaExecução + '/' + numDeExecuções);

            Alimentos.find({}).select('code product_name quantity categories packaging brands images barcode status imported_t url image_url').skip((numDaExecução++ - 1) * docsExecutadosporVez).limit(docsExecutadosporVez).exec(function (err, data) {
                if (err) { return console.log(err) };
                const alimentosSelecionados = data;
                console.log('Documentos encontrados: ' + alimentosSelecionados.length);
                for (const i in alimentosSelecionados) {
                    let imageLink;
                    // Estrutura try catch necessária nos casos onde o alimento não possui imagem.
                    try {
                        //if necessário no caso do codigo ser executado mais de uma vez consecutiva.
                        if (alimentosSelecionados[Number(i)].image_url) {
                            imageLink = alimentosSelecionados[Number(i)].image_url
                        } else {
                            imageLink = "https://static.openfoodfacts.org/images/products/" + alimentosSelecionados[Number(i)].code.substring(0, 3) + '/' + alimentosSelecionados[Number(i)].code.substring(3, 6) + '/' + alimentosSelecionados[Number(i)].code.substring(6, 9) + '/' + alimentosSelecionados[Number(i)].code.substring(9) + '/' + Object.getOwnPropertyNames(alimentosSelecionados[Number(i)].get('images')).find(function (val) { return (/front_/).test(val) }) + '.' + alimentosSelecionados[Number(i)].get('images')[Object.getOwnPropertyNames(alimentosSelecionados[Number(i)].get('images')).find(function (val) { return (/front_/).test(val) })].rev + '.200.jpg';
                        }
                    } catch (error) {
                        imageLink = '/img_not_found.png';
                    }
                    Alimentos.replaceOne({ code: alimentosSelecionados[Number(i)].code },
                        {
                            code: alimentosSelecionados[Number(i)].code,
                            barcode: Number(alimentosSelecionados[Number(i)].code).toString(10).length === 13 ? alimentosSelecionados[Number(i)].code + "(EAN / EAN-13)" : alimentosSelecionados[Number(i)].code + "(EAN / EAN-13) " + alimentosSelecionados[Number(i)].code.substring(1) + "(UPC / UPC-A)",
                            status: alimentosSelecionados[Number(i)].status || "published",
                            imported_t: alimentosSelecionados[Number(i)].imported_t || new Date(),
                            url: "https://world.openfoodfacts.org/product/" + alimentosSelecionados[Number(i)].code,
                            product_name: alimentosSelecionados[Number(i)].product_name,
                            quantity: alimentosSelecionados[Number(i)].quantity,
                            categories: alimentosSelecionados[Number(i)].categories,
                            packaging: alimentosSelecionados[Number(i)].packaging,
                            brands: alimentosSelecionados[Number(i)].brands,
                            image_url: imageLink
                        }, function (err, data) {
                            if (err) { return console.log(err) };
                            console.log('Alimento atualizado: ' + alimentosSelecionados[Number(i)].code, alimentosSelecionados[Number(i)].product_name);
                        });
                };
            })
        } else {
            console.log(new Date() + ' - Número de execuções necessárias foi alcançado');
        }
    });
});


