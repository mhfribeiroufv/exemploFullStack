const config = require("../config/config");
const utils = require("../utils/utils");
const usuario = require("../models/usuario");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.redirect("/");
});

// Requisição via post do formulário
router.post("/", (req, res) => {
    const valido = req.cookies.valido;
    const dados = req.body;
    const resposta = {
        sucesso: true,
        mensagem: "Usuário editado com sucesso",
    };
    if (!valido) {
        resposta["sucesso"] = false;
        resposta["mensagem"] = "Usuário não logado";
        res.status(200).send(resposta);
    } else {
        (async () => {
            try {
                const atualizado = await usuario.atualiza(dados);
                if (!atualizado) {
                    resposta["sucesso"] = false;
                    resposta["mensagem"] = "Houve um erro ao editar o usuário";
                }
            } catch (erro) {
                resposta["sucesso"] = false;
                resposta["mensagem"] = "Uma exceção foi lançada durante o processo: " + erro.message;
            } finally {
                res.status(200).send(resposta);
            }
        })();
    }
});

module.exports = router;
