require('dotenv').config();
const express = require('express');
var methodOverride = require('method-override');
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
        packaging: String,
        brands: String,
        image_url: String
    });

    const AlimentosNovo = mongoose.model('Alimentos-novo', alimentosSchema);

    app.use(express.static('public'));

    // override with the X-HTTP-Method-Override header in the request
    app.use(methodOverride('X-HTTP-Method-Override'))

    app.get('/', (req, res) => {
        res.status(200).send('Fullstack Challenge 20201030');
    });

    app.get('/products/:code', function (req, res) {
        AlimentosNovo.findOne({ code: req.params.code }).select('-_id').exec(function (err, data) {
            if (err) { return console.log(err) };
            if (data) {
                res.json(data);
            } else {
                res.json('Produto não encontrado ou código incorreto')
            }
        });
    });

    app.get('/products', function (req, res) {
        if (req.query.p) {
            const pagina = req.query.p;
            const resultadosPorPagina = 10;
            let qDocumentos;
            AlimentosNovo.countDocuments({}, function (err, data) {
                if (err) { return console.log(err) };
                qDocumentos = data;
                AlimentosNovo.find({}).skip((pagina - 1) * resultadosPorPagina).limit(resultadosPorPagina).select('-_id').exec(function (err, data) {
                    if (err) { return console.log(err) };
                    res.json({ pagina_atual: pagina, total_paginas: Math.ceil(qDocumentos / resultadosPorPagina), q_resultados: data.length, resultados: data });
                });
            });
        } else {
            AlimentosNovo.find({}).select('-_id').exec(function (err, data) {
                if (err) { return console.log(err) };
                res.json(data);
            });
        };
    });

    app.get('/consulta', (req, res) => {
        res.sendFile(__dirname + '/project/index.html');
    });

    app.listen(3000, () => {
        console.log(`Example app listening at http://localhost:3000`);
    });

});