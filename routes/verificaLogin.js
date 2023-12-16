const config = require("../config/config");
const utils = require("../utils/utils");
const usuario = require("../models/usuario");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.redirect("/");
});

router.post("/", (req, res) => {
    const valido = req.cookies.valido;
    const dados = req.body;

    const resposta = {
        sucesso: true,
        existe: false,
        mensagem: null,
    };

    if (!valido) {
        resposta.sucesso = false;
        resposta.mensagem = "Usuário não logado";
        res.status(200).send(resposta);
    } else {
        (async () => {
            try {
                const existe = await usuario.existeLogin(dados.login);
                resposta.existe = existe;
            } catch (erro) {
                resposta.sucesso = false;
                resposta.mensagem = "Uma exceção aconteceu ao consultar o banco de dados";
            } finally {
                res.status(200).send(resposta);
            }
        })();
    }
});

module.exports = router;
