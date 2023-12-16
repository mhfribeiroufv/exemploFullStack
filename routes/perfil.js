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
                let dados = await usuario.getDados(id);
                res.render("perfil", {
                    title: config.title,
                    header: "Perfil de Usuário",
                    data: dados,
                    separador: config.separador,
                });
            } catch (erro) {
                utils.renderizaErro(res, erro.message);
            }
        })();
    }
});

module.exports = router;
