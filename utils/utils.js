// Função que exibe página de erro
function renderizaErro(res, mensagem) {
    res.cookie("valido", false);
    res.clearCookie("id");
    let error = { status: 500, stack: [] };
    res.render("error", {
        title: "Erro de Autenticação",
        message: mensagem,
        error: error,
    });
}

module.exports = { renderizaErro };
