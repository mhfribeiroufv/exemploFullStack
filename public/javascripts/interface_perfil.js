const btnSelfEdit = document.getElementById("btnSelfEdit");
const btnCancelar = document.getElementById("btnCancelar");
const btnAtualizar = document.getElementById("btnAtualizar");

let nomeOriginal = undefined;
const campoNome = document.getElementById("nome");
const campoNovoNome = document.getElementById("novo_nome");

const campoSenhaAtual = document.getElementById("senha_atual");
const campoNovaSenha = document.getElementById("nova_senha");
const campoConfirmacao = document.getElementById("confirmacao");

const painel = document.getElementById("painelEdit");

function exibe() {
    if (painel.classList.contains("oculto")) {
        nomeOriginal = campoNome.innerText;
        campoNovoNome.value = nomeOriginal;
        painel.classList.remove("oculto");
    }
}

function cancela() {
    if (!painel.classList.contains("oculto")) {
        campoNovoNome.value = nomeOriginal;
        campoSenhaAtual.value = "";
        campoNovaSenha.value = "";
        campoConfirmacao.value = "";
        painel.classList.add("oculto");
    }
}

function validaForm() {
    let valido = true;
    let mensagens = [];
    const novo_nome = campoNovoNome.value.trim();

    if (novo_nome == "") {
        valido = false;
        mensagens.push("O campo de nome não pode estar vazio");
    }

    const senha_atual = campoSenhaAtual.value;
    const nova_senha = campoNovaSenha.value;
    const confirmacao = campoConfirmacao.value;

    if (senha_atual != "" || nova_senha != "" || confirmacao != "") {
        if (senha_atual == nova_senha) {
            valido = false;
            mensagens.push("A nova senha não pode ser a mesma da atual");
        } else if (nova_senha == "") {
            valido = false;
            mensagens.push("A nova senha não pode estar em branco");
        } else if (nova_senha != confirmacao) {
            valido = false;
            mensagens.push("As novas senhas digitadas não conferem");
        }
    }

    if (senha_atual == "" && nova_senha == "" && confirmacao == "" && novo_nome == nomeOriginal) {
        valido = false;
        mensagens.push("Não houve alteração nos dados");
    }

    if (!valido) {
        const texto = "Erro no Preenchimento do Formulário:\n" + mensagens.join("\n");
        alert(texto);

        return false;
    }

    return true;
}

async function envia() {
    if (validaForm()) {
        const senha_atual = campoSenhaAtual.value;
        const nova_senha = campoNovaSenha.value;

        let dados = {};
        const novo_nome = campoNovoNome.value.trim();
        if (novo_nome != nomeOriginal) {
            dados.nome = novo_nome;
        } else {
            dados.nome = null;
        }

        if (senha_atual != "") {
            dados["senha_atual"] = senha_atual;
            dados["nova_senha"] = nova_senha;
        } else {
            dados["senha_atual"] = null;
            dados["nova_senha"] = null;
        }

        try {
            const resposta = await fetch("/atualizaPerfil", {
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
                alert("Houve um erro na atualização de dados: " + dadosResposta.mensagem);
            } else {
                if (dadosResposta.novo_nome !== null) {
                    campoNome.innerText = dadosResposta.novo_nome;
                }
                alert(dadosResposta.mensagem);
                cancela();
            }
        } catch (erro) {
            alert("Falha na requisição:" + erro);
        }
    }
}

btnSelfEdit.addEventListener("click", exibe);
btnCancelar.addEventListener("click", cancela);
btnAtualizar.addEventListener("click", envia);
