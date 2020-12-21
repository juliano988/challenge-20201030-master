require('dotenv').config();
var cors = require('cors');
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
        packaging: String,
        brands: String,
        image_url: String
    });

    const Alimentos = mongoose.model('alimentos', alimentosSchema);

    app.use(express.static('public'));

    //Enable  CORS
    app.use(cors())

    app.get('/', (req, res) => {
        res.status(200).send('Fullstack Challenge 20201030');
    });

    app.put('/products/:code', function (req, res) {
        if (req.query.product_name || req.query.quantity || req.query.categories || req.query.packaging || req.query.brands || req.query.image_url) {
            Alimentos.findOneAndUpdate({ code: req.params.code }, {
                product_name: req.query.product_name,
                quantity: req.query.quantity,
                categories: req.query.categories,
                packaging: req.query.packaging,
                brands: req.query.brands,
                image_url: req.query.image_url
            }, { new: true, omitUndefined: true }).select('-_id').exec(function (err, data) {
                if (err) { return console.log(err) };
                if (data) {
                    res.status(200).json({ mensagem: "Dados atualizados com sucesso!", alimento_atualizado: data });
                } else {
                    res.status(400).json('Produto não encontrado ou código incorreto');
                }
            });
        } else {
            res.status(406).json('Nenhum parâmetro foi inserido para atualização ou parâmetro inserido é invalido.');
        };
    });

    app.delete('/products/:code', function (req, res) {
        Alimentos.findOneAndUpdate({ code: req.params.code }, {
            status: 'trash'
        }, { new: true }).select('-_id').exec(function (err, data) {
            if (err) { return console.log(err) };
            if (data) {
                res.status(200).json({ mensagem: "Status do alimento alterado com sucesso!", alimento_atualizado: data })
            } else {
                res.status(400).json('Produto não encontrado ou código incorreto');
            }
        });
    });

    app.get('/products/:code', function (req, res) {
        Alimentos.findOne({ code: req.params.code }).select('-_id').exec(function (err, data) {
            if (err) { return console.log(err) };
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(400).json('Produto não encontrado ou código incorreto')
            }
        });
    });

    app.get('/products', function (req, res) {
        if (Number(req.query.p)) {
            const pagina = req.query.p;
            const resultadosPorPagina = 20;
            let qDocumentos;
            Alimentos.countDocuments({}, function (err, data) {
                if (err) { return console.log(err) };
                qDocumentos = data;
                Alimentos.find({}).skip((pagina - 1) * resultadosPorPagina).limit(resultadosPorPagina).select('-_id').exec(function (err, data) {
                    if (err) { return console.log(err) };
                    if (data.length) {
                        res.status(200).json({ pagina_atual: pagina, total_paginas: Math.ceil(qDocumentos / resultadosPorPagina), q_resultados: data.length, resultados: data });
                    } else {
                        res.status(406).json('Número da página solicitada está incoreto ou não existe.');
                    }
                });
            });
        } else {
            if (req.query.p) {
                res.status(406).json('Número da página solicitada está incoreto ou não existe.');
            } else {
                Alimentos.find({}).select('-_id').exec(function (err, data) {
                    if (err) { return console.log(err) };
                    res.status(200).json(data);
                });
            }
        };
    });

    app.listen(8080, () => {
        console.log(`Example app listening at http://localhost:8080`);
    });

});