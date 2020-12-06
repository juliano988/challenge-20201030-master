require('dotenv').config();
const express = require('express');
const app = express();
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
        packaging: Array,
        brands: String,
        image_url: String
    });

    const AlimentosNovo = mongoose.model('Alimentos-novo', alimentosSchema);

    app.use(express.static('public'));

    app.get('/', (req, res) => {
        res.json({status: req.statusCode , mensagem: 'Fullstack Challenge 20201030'})
    });

    app.get('/consulta', (req, res) => {
        res.sendFile(__dirname + '/project/index.html');
    });

    app.listen(3000, () => {
        console.log(`Example app listening at http://localhost:3000`);
    });

});