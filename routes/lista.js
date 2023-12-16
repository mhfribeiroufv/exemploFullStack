const config = require("../config/config");
const utils = require("../utils/utils");
const usuario = require("../models/usuario");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    const valido = req.cookies.valido;
    if (!valido) {
        res.redirect("/");
    } else {
        (async () => {
            try {
                const id = req.cookies.idUsuario;
                const admin = await usuario.superUsuario(id);
                if (!admin) {
                    res.redirect("/");
                } else {
                    const nome = await usuario.getNome(id);
                    const dados = {
                        title: config.title,
                        header: "Olá " + nome + "!",
                        usuarios: await usuario.lista(),
                        idAutenticado: id,
                        separador: config.separador,
                    };
                    res.render("lista", dados);
                }
            } catch (erro) {
                utils.renderizaErro(res, erro.message);
            }
        })();
    }
});

module.exports = router;
