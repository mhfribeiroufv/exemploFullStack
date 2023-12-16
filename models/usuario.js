const config = require("../config/config");
const { param } = require("../routes");

const sqlite3 = require("sqlite3").verbose();

class Usuario {
    constructor(dbname) {
        this.db = new sqlite3.Database("./models/" + dbname);
    }

    async lista() {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM usuario;";
                this.db.all(query, [], (erro, usuarios) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        resolve(usuarios);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async checkBd() {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT name FROM sqlite_master WHERE type='table';";
                this.db.all(query, [], (erro, tabelas) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        resolve(tabelas);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async getId(login) {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT id FROM usuario WHERE login = ?;";
                this.db.get(query, [login], (erro, resultado) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        resolve(resultado ? resultado.id : null);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async getNome(id) {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT nome FROM usuario WHERE id = ?;";
                this.db.get(query, [id], (erro, resultado) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        resolve(resultado ? resultado.nome : null);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async getDados(id) {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM usuario WHERE id = ?;";
                this.db.get(query, [id], (erro, resultado) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        resolve(resultado ? resultado : null);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async autentica(id, tentativa) {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT senha FROM usuario WHERE id = ?;";
                this.db.get(query, [id], (erro, resultado) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        if (resultado.senha == tentativa) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async superUsuario(id) {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT admin FROM usuario WHERE id = ?;";
                this.db.get(query, [id], (erro, resultado) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        if (resultado.admin == 1) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async existeLogin(login) {
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT COUNT(login) as qtd FROM usuario WHERE login = ?;";
                this.db.get(query, [login], (erro, resultado) => {
                    if (erro) {
                        reject(erro);
                    } else {
                        if (resultado.qtd > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async mudaSenha(id, antiga, nova, confirmacao) {
        try {
            return await new Promise((resolve, reject) => {
                if (nova != confirmacao) {
                    resolve(false);
                } else {
                    const query = "SELECT senha FROM usuario WHERE id = ?;";
                    this.db.get(query, [id], (erro, resultado) => {
                        if (erro) {
                            reject(erro);
                        } else {
                            if (resultado && resultado.senha == antiga) {
                                const queryUpdate = "UPDATE usuario SET senha = ? WHERE id = ?;";
                                this.db.run(queryUpdate, [nova, id], (erroUpdate) => {
                                    if (erroUpdate) {
                                        reject(erroUpdate);
                                    } else {
                                        resolve(true);
                                    }
                                });
                            } else {
                                resolve(false);
                            }
                        }
                    });
                }
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async mudaNome(id, nome) {
        try {
            return await new Promise((resolve, reject) => {
                const queryUpdate = "UPDATE usuario SET nome = ? WHERE id = ?;";
                this.db.run(queryUpdate, [nome, id], (erroUpdate) => {
                    if (erroUpdate) {
                        reject(erroUpdate);
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async insere(dados) {
        try {
            return await new Promise((resolve, reject) => {
                const queryInsert = "INSERT INTO usuario (login, nome, senha, admin) VALUES (?, ?, ?, ?);";

                const parametros = [dados.login, dados.nome, dados.senha, dados.admin];

                this.db.run(queryInsert, parametros, (erroInsert) => {
                    if (erroInsert) {
                        reject(erroInsert);
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async atualiza(dados) {
        try {
            return await new Promise((resolve, reject) => {
                let admin = dados.admin ? "1" : "0";

                const parametros = [dados.nome, admin];
                let queryUpdate = "UPDATE usuario SET nome = ?, admin = ?";
                if (dados.senha) {
                    queryUpdate += ", senha = ?";
                    parametros.push(dados.senha);
                }
                queryUpdate += " WHERE id = ?;";
                parametros.push(dados.id);

                this.db.run(queryUpdate, parametros, (erroInsert) => {
                    if (erroInsert) {
                        reject(erroInsert);
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async remove(id) {
        try {
            return await new Promise((resolve, reject) => {
                const queryDelete = "DELETE FROM usuario WHERE id = ?;";

                const parametros = [id];

                this.db.run(queryDelete, parametros, (erroDelete) => {
                    if (erroDelete) {
                        reject(erroDelete);
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (erro) {
            console.error("Erro:", erro.message);
            throw erro;
        }
    }

    async closeConnection() {
        return await new Promise((resolve, reject) => {
            this.db.close((erro) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve("Conexão encerrada com sucesso.");
                }
            });
        });
    }
}

module.exports = new Usuario(config.db);
