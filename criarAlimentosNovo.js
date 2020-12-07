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

    Alimentos.find({}).exec(function (err, data) {
        if (err) { return console.log(err) };
        let imageLink;
        for (const i in data) {
            // Estrutura try... catch necessária nos casos onde o alimento não possui imagem.
            try {
                imageLink = "https://static.openfoodfacts.org/images/products/"+ data[Number(i)].code.substring(0,3) +'/'+ data[Number(i)].code.substring(3,6) +'/'+ data[Number(i)].code.substring(6,9) +'/'+ data[Number(i)].code.substring(9) +'/'+ Object.getOwnPropertyNames(data[Number(i)].get('images')).find(function(val){return (/front_/).test(val)}) +'.'+ data[Number(i)].get('images')[Object.getOwnPropertyNames(data[Number(i)].get('images')).find(function(val){return (/front_/).test(val)})].rev + '.200.jpg';
            } catch (error) {
                imageLink = '/img_not_found.png';
            }
            let alimento = new AlimentosNovo({
                code: data[Number(i)].code,
                barcode: Number(data[Number(i)].code).toString(10).length === 13 ? data[Number(i)].code + "(EAN / EAN-13)" : data[Number(i)].code + "(EAN / EAN-13) " + data[Number(i)].code.substring(1) + "(UPC / UPC-A)",
                status: "published",
                imported_t: new Date(),
                url: "https://world.openfoodfacts.org/product/" + data[Number(i)].code,
                product_name: data[Number(i)].product_name,
                quantity: data[Number(i)].quantity,
                categories: data[Number(i)].category_properties,
                packaging: data[Number(i)].packaging,
                brands: data[Number(i)].brands,
                image_url: imageLink
            });
            alimento.save(function (err, data) {
                if (err) { console.log(err) };
                console.log("aliemnto salvo:" , alimento.product_name , alimento.code);
            });
        };
    });

});