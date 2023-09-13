const express = require('express');
const { validarSenha, validarSaldoEExtrato } = require('./intermediario');
const { listarContas, criarConta, alterarConta, excluirConta, depositar, sacar, tranferir, saldo, extrato } = require('./controladores/banco');

const rotas = express();


rotas.get("/contas", validarSenha, listarContas);
rotas.post("/contas", criarConta);
rotas.put("/contas/:numeroConta/usuario", alterarConta);
rotas.delete("/contas/:numeroConta", excluirConta);
rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", sacar);
rotas.post("/transacoes/transferir", tranferir);
rotas.get("/contas/saldo", validarSaldoEExtrato, saldo);
rotas.get("/contas/extrato", validarSaldoEExtrato, extrato);

module.exports = rotas;