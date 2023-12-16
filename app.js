let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

let indexRouter = require("./routes/index");
let listaRouter = require("./routes/lista");
let perfilRouter = require("./routes/perfil");
let autenticaRouter = require("./routes/autentica");
let atualizaPerfil = require("./routes/atualizaPerfil");
let verificaLogin = require("./routes/verificaLogin");
let insereUsuario = require("./routes/insereUsuario");
let removeUsuario = require("./routes/removeUsuario");
let atualizaUsuario = require("./routes/atualizaUsuario");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/lista", listaRouter);
app.use("/perfil", perfilRouter);
app.use("/autentica", autenticaRouter);
app.use("/atualizaPerfil", atualizaPerfil);
app.use("/verificaLogin", verificaLogin);
app.use("/insereUsuario", insereUsuario);
app.use("/removeUsuario", removeUsuario);
app.use("/atualizaUsuario", atualizaUsuario);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error", {
        title: "Erro Inesperado",
        message: err.message,
        error: res.locals.error,
    });
});

module.exports = app;
