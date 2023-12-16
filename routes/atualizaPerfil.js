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
        mensagem: "Dados atualizados com sucesso",
        novo_nome: null,
    };
    if (!valido) {
        resposta["sucesso"] = false;
        resposta["mensagem"] = "Usuário não logado";
        res.status(200).send(resposta);
    } else {
        (async () => {
            try {
                const id = req.cookies.idUsuario;
                if (dados.senha_atual !== null) {
                    const senha_valida = await usuario.autentica(id, dados.senha_atual);
                    if (!senha_valida) {
                        resposta["sucesso"] = false;
                        resposta["mensagem"] = "A senha atual não confere";
                    } else {
                        const atualizado = await usuario.mudaSenha(
                            id,
                            dados.senha_atual,
                            dados.nova_senha,
                            dados.nova_senha
                        );
                        if (!atualizado) {
                            resposta["sucesso"] = false;
                            resposta["mensagem"] = "Houve um erro ao atualizar a senha";
                        }
                    }
                }

                if (resposta["sucesso"] && dados.nome !== null) {
                    const atualizado = await usuario.mudaNome(id, dados.nome);
                    if (!atualizado) {
                        resposta["sucesso"] = false;
                        resposta["mensagem"] = "Houve um erro ao atualizar o nome";
                    } else {
                        resposta["novo_nome"] = dados.nome;
                    }
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
