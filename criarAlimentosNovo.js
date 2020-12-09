require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

    const Alimentos = mongoose.model('Alimentos', alimentosSchema);
    const AlimentosNovo = mongoose.model('Alimentos-novo', alimentosSchema);

    Alimentos.find({}).select('code product_name quantity categories packaging brands images').skip(3 * 10000).limit(10000).exec(function (err, data) {
        if (err) { return console.log(err) };

        const alimentosSelecionados = data;
        for (const i in data) {
            AlimentosNovo.findOne({ code: alimentosSelecionados[Number(i)].code }).select('code product_name').exec(function (err, data) {
                if (err) { return console.log(err) };
                if (data) {
                    console.log('Alimento já cadastrado: ' + data.product_name + ' ' + data.code);
                } else {
                    let imageLink;
                    // Estrutura try... catch necessária nos casos onde o alimento não possui imagem.
                    try {
                        imageLink = "https://static.openfoodfacts.org/images/products/" + alimentosSelecionados[Number(i)].code.substring(0, 3) + '/' + alimentosSelecionados[Number(i)].code.substring(3, 6) + '/' + alimentosSelecionados[Number(i)].code.substring(6, 9) + '/' + alimentosSelecionados[Number(i)].code.substring(9) + '/' + Object.getOwnPropertyNames(alimentosSelecionados[Number(i)].get('images')).find(function (val) { return (/front_/).test(val) }) + '.' + alimentosSelecionados[Number(i)].get('images')[Object.getOwnPropertyNames(alimentosSelecionados[Number(i)].get('images')).find(function (val) { return (/front_/).test(val) })].rev + '.200.jpg';
                    } catch (error) {
                        imageLink = '/img_not_found.png';
                    }
                    let alimento = new AlimentosNovo({
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
                    });
                    alimento.save(function (err, data) {
                        if (err) { console.log(err) };
                        console.log("Aliemnto salvo: ", alimento.product_name, alimento.code);
                    });
                }
            });
        };
    });
});