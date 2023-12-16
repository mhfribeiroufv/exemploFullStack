const btnNovo = document.getElementById("btnNovo");
const btnCancelar = document.getElementById("btnCancelar");
const btnInserir = document.getElementById("btnInserir");
const btnAtualizar = document.getElementById("btnAtualizar");

const painelForm = document.getElementById("painelForm");
const painelLista = document.getElementById("painelLista");

const campoLogin = document.getElementById("login");
const campoNome = document.getElementById("nome");
const campoSenha = document.getElementById("senha");
const campoConfirmacao = document.getElementById("confirmacao");
const campoAdmin = document.getElementById("admin");

const tituloFlutuante = document.getElementById("tituloFlutuante");

let loginValido = true;
let idEdit = undefined;

function exibe() {
    painelForm.classList.remove("oculto");
    painelLista.classList.add("esmaecido");
}

function resetInputs() {
    let inputs = document.querySelectorAll("#painelForm input");

    inputs.forEach(function (input) {
        switch (input.type) {
            case "text":
            case "password":
                input.value = "";
                break;
            case "checkbox":
            case "radio":
                input.checked = false;
                break;
        }
    });

    if (!btnAtualizar.classList.contains("oculto")) {
        btnAtualizar.classList.add("oculto");
    }

    if (btnInserir.classList.contains("oculto")) {
        btnInserir.classList.remove("oculto");
    }

    tituloFlutuante.innerText = "Inserir Novo Usuário:";

    campoLogin.removeAttribute("disabled");

    idEdit = undefined;
}

function cancela() {
    resetInputs();
    painelForm.classList.add("oculto");
    painelLista.classList.remove("esmaecido");
}

function verificaLogin() {
    let login = campoLogin.value;

    if (login) {
        fetch("/verificaLogin", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                login: login,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.sucesso) {
                    throw Error(data.mensagem);
                }
                if (data.existe) {
                    loginValido = false;
                    alert("Atenção, login existente");
                } else {
                    loginValido = true;
                }
            })
            .catch((error) => {
                alert("ERRO:" + error.message);
            });
    }
}

function validaForm() {
    let preenchimentoValido = true;
    let mensagens = [];

    if (!loginValido) {
        preenchimentoValido = false;
        mensagens.push("Este login já existe");
    }

    const login = campoLogin.value.trim();
    if (!login) {
        preenchimentoValido = false;
        mensagens.push("O campo login deve ser preenchido");
    }

    const nome = campoNome.value.trim();
    if (!nome) {
        preenchimentoValido = false;
        mensagens.push("O campo nome deve ser preenchido.");
    }

    const senha = campoSenha.value.trim();
    if (!senha) {
        preenchimentoValido = false;
        mensagens.push("O campo senha deve ser preenchido");
    }

    const confirmacao = campoConfirmacao.value.trim();
    if (!confirmacao) {
        preenchimentoValido = false;
        mensagens.push("O campo de confirmação de senha deve ser preenchido");
    }

    if (preenchimentoValido && confirmacao != senha) {
        preenchimentoValido = false;
        mensagens.push("As senhas informadas não conferem");
    }

    if (!preenchimentoValido) {
        const texto = "Erro no Preenchimento do Formulário:\n" + mensagens.join("\n");
        alert(texto);

        return false;
    }

    return true;
}

function insereLinha(id, dados) {
    const tabela = document.getElementById("tabelaUsuarios");

    const tr = document.createElement("tr");

    let td = document.createElement("td");
    td.innerText = id;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = dados.login;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = dados.nome;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = dados.admin ? "Sim" : "Não";
    tr.appendChild(td);

    td = document.createElement("td");
    let btnId = "btnEdit_" + id;
    let botaoAcao = document.createElement("button");
    botaoAcao.setAttribute("id", btnId);
    botaoAcao.classList.add("small");
    botaoAcao.innerHTML = "&#128395;";
    botaoAcao.addEventListener("click", preencheForm);
    td.appendChild(botaoAcao);
    tr.appendChild(td);

    td = document.createElement("td");
    btnId = "btnDel_" + id;
    botaoAcao = document.createElement("button");
    botaoAcao.setAttribute("id", btnId);
    botaoAcao.classList.add("small");
    botaoAcao.innerHTML = "&#128465;";
    botaoAcao.addEventListener("click", removeUsuario);
    td.appendChild(botaoAcao);
    tr.appendChild(td);

    tabela.appendChild(tr);
}

async function envia() {
    if (validaForm()) {
        const dados = {
            login: campoLogin.value.trim(),
            nome: campoNome.value.trim(),
            senha: campoSenha.value.trim(),
            admin: campoAdmin.checked,
        };

        try {
            const resposta = await fetch("/insereUsuario", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dadosResposta = await resposta.json();

            if (!dadosResposta.sucesso) {
                alert("Houve um erro na inserção de dados: " + dadosResposta.mensagem);
            } else {
                insereLinha(dadosResposta.id, dados);
                alert(dadosResposta.mensagem);
                cancela();
            }
        } catch (erro) {
            alert("Falha na requisição:" + erro);
        }
    }
}

function removeLinha(id) {
    const idBotao = "btnDel_" + id;
    const botao = document.getElementById(idBotao);

    const linha = botao.parentNode.parentNode;
    linha.parentNode.removeChild(linha);
}

async function removeUsuario() {
    const partes = this.id.split("_");
    const id = partes[1];
    const login = this.parentNode.parentNode.children[1].innerText;
    let confirmacao = window.confirm(`Tem certeza que deseja remover o usuário ${login}?`);

    if (confirmacao) {
        try {
            const resposta = await fetch("/removeUsuario", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ id: id }),
            });

            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dadosResposta = await resposta.json();

            if (!dadosResposta.sucesso) {
                alert("Houve um erro na remoção de dados: " + dadosResposta.mensagem);
            } else {
                removeLinha(id);
                alert(dadosResposta.mensagem);
                cancela();
            }
        } catch (erro) {
            alert("Falha na requisição:" + erro);
        }
    }
}

function preencheForm() {
    const partes = this.id.split("_");
    const id = partes[1];
    idEdit = id;

    exibe();

    btnAtualizar.classList.remove("oculto");
    btnInserir.classList.add("oculto");
    tituloFlutuante.innerText = "Editar Usuário:";

    const login = this.parentNode.parentNode.children[1];
    campoLogin.value = login.innerText;
    campoLogin.setAttribute("disabled", "true");

    const nome = this.parentNode.parentNode.children[2];
    campoNome.value = nome.innerText;

    const admin = this.parentNode.parentNode.children[3].innerText;
    if (admin == "Sim") {
        campoAdmin.checked = true;
    } else {
        campoAdmin.checked = false;
    }
}

function validaFormAtualiza() {
    let preenchimentoValido = true;
    let mensagens = [];

    const nome = campoNome.value.trim();
    if (!nome) {
        preenchimentoValido = false;
        mensagens.push("O campo nome deve ser preenchido.");
    }

    const senha = campoSenha.value.trim();
    const confirmacao = campoConfirmacao.value.trim();

    if (preenchimentoValido && confirmacao != senha) {
        preenchimentoValido = false;
        mensagens.push("As senhas informadas não conferem");
    }

    if (!preenchimentoValido) {
        const texto = "Erro no Preenchimento do Formulário:\n" + mensagens.join("\n");
        alert(texto);

        return false;
    }

    return true;
}

function atualizaLinha(dados) {
    const linha = document.getElementById("btnEdit_" + dados.id).parentNode.parentNode;

    linha.children[2].innerText = dados.nome;
    linha.children[3].innerText = dados.admin ? "Sim" : "Não";
}

async function editaUsuario() {
    if (validaFormAtualiza()) {
        const dados = { id: idEdit };
        dados.nome = campoNome.value;
        dados.admin = campoAdmin.checked;
        const senha = campoSenha.value.trim();
        dados.senha = senha ? senha : undefined;

        try {
            const resposta = await fetch("/atualizaUsuario", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(dados),
            });

            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dadosResposta = await resposta.json();

            if (!dadosResposta.sucesso) {
                alert("Houve um erro na edição de dados: " + dadosResposta.mensagem);
            } else {
                atualizaLinha(dados);
                alert(dadosResposta.mensagem);
                cancela();
            }
        } catch (erro) {
            alert("Falha na requisição:" + erro);
        }
    }
}

btnNovo.addEventListener("click", exibe);
btnCancelar.addEventListener("click", cancela);
btnInserir.addEventListener("click", envia);
btnAtualizar.addEventListener("click", editaUsuario);

let botoesDel = document.querySelectorAll('[id^="btnDel_"]');
botoesDel.forEach((botao) => {
    botao.addEventListener("click", removeUsuario);
});

let botoesEdit = document.querySelectorAll('[id^="btnEdit_"]');
botoesEdit.forEach((botao) => {
    botao.addEventListener("click", preencheForm);
});

campoLogin.addEventListener("blur", verificaLogin);
