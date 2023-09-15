const { format } = require('date-fns');
let { contas, saques, depositos, transferencias, numeroConta } = require('../bancodedados');

const validarCpfEEmail = (arrayDasContas, cpf, email) => {
    return arrayDasContas.some((conta) => {
        return conta.cpf === cpf || conta.email === email
    })
}
//teste do novo ubuntu
const listarContas = (req, res) => {
    return res.status(200).json(contas)
}
const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(404).json({ mensagem: "Todos os campos são obrigatórios!" })
    }
    if (validarCpfEEmail(contas, cpf, email)) {
        return res.status(404).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
    }
    conta = {
        numero: numeroConta++,
        saldo: 0,
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
    }
    contas.push(conta);
    return res.status(201).json();
}
const alterarConta = (req, res) => {
    const { numeroConta } = req.params;
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta a ser alterado para o número informado!" })
    }
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(404).json({ mensagem: "Todos os campos são obrigatórios!" })
    }
    const contas1 = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta)
    })
    if (validarCpfEEmail(contas1, cpf, email)) {

        return res.status(404).json({ mensagem: "O CPF ou Email informado já existe cadastrado!" })
    }
    if (nome && cpf && data_nascimento && telefone && email && senha) {
        contaEncontrada.nome = nome;
        contaEncontrada.cpf = cpf;
        contaEncontrada.data_nascimento = data_nascimento;
        contaEncontrada.telefone = telefone;
        contaEncontrada.email = email;
        contaEncontrada.senha = senha;
    }

    return res.status(200).json();
}
const excluirConta = (req, res) => {
    const { numeroConta } = req.params;
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    })
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta a ser excluida para o número informado!" })
    }
    if (contaEncontrada.saldo !== 0) {
        return res.status(404).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
    } else {
        contas = contas.filter((conta) => {
            return conta !== contaEncontrada;
        })
    }
    return res.status(204).json();

}
const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    if (!numero_conta || !valor) {
        return res.status(404).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
    }
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta para depositar com o número informado!" })
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O deposito não pode ser realizado para o valor informado!" })
    }
    contaEncontrada.saldo += valor;
    const data = new Date();
    const dataFormatada = format(data, "yyyy-MM-dd hh:mm:ss")
    deposito = {
        data: dataFormatada,
        numero_conta,
        valor,
    }
    depositos.push(deposito);
    return res.status(200).json();
}
const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    if (!numero_conta || !valor || !senha) {
        return res.status(404).json({ mensagem: "O número da conta o valor e a senha são obrigatórios!" })
    }
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta para sacar com o número informado!" })
    }
    if (senha !== contaEncontrada.senha) {
        return res.status(404).json({ mensagem: "A senha é inválida para a conta informada!" })
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" })
    }
    if (valor > contaEncontrada.saldo) {
        return res.status(404).json({ mensagem: "O saldo é insuficiente para saque na conta informada!" })
    }
    contaEncontrada.saldo -= valor;
    const data = new Date();
    const dataFormatada = format(data, "yyyy-MM-dd hh:mm:ss")
    saque = {
        data: dataFormatada,
        numero_conta,
        valor,
    }
    saques.push(saque);
    return res.status(200).json();
    
}
const tranferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(404).json({ mensagem: "O número da conta de origem, numero da conta de destino, valor e a senha são obrigatórios!" })
    }
    const contaDeOrigemEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })
    if (!contaDeOrigemEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta de origem com o número informado!" })
    }
    const contaDeDestinoEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })
    if (!contaDeDestinoEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta de destino com o número informado!" })
    }
    if (senha !== contaDeOrigemEncontrada.senha) {
        return res.status(404).json({ mensagem: "A senha é inválida para a conta de origem informada!" })
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" })
    }
    if (valor > contaDeOrigemEncontrada.saldo) {
        return res.status(404).json({ mensagem: "Saldo insuficiente!" })
    }
    contaDeOrigemEncontrada.saldo -= valor;
    contaDeDestinoEncontrada.saldo += valor;
    const data = new Date();
    const dataFormatada = format(data, "yyyy-MM-dd hh:mm:ss")
    transferencia = {
        data: dataFormatada,
        numero_conta_origem,
        numero_conta_destino,
        valor,
    }
    transferencias.push(transferencia);
    return res.status(200).json();

}
const saldo = (req,res)=>{
    const {numero_conta}=req.query;
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    return res.status(200).json({saldo: contaEncontrada.saldo})
}
const extrato = (req,res)=>{
    const {numero_conta}=req.query;
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    const depositos1 = depositos.filter((deposito)=>{
        return Number(deposito.numero_conta) === contaEncontrada.numero
    })
    const saques1 = saques.filter((saque)=>{
        return Number(saque.numero_conta) === contaEncontrada.numero
    })
    const transferenciasEnviadas = transferencias.filter((transferencia)=>{
        return Number(transferencia.numero_conta_origem) === contaEncontrada.numero
    })
    const transferenciasRecebidas = transferencias.filter((transferencia)=>{
        return Number(transferencia.numero_conta_destino) === contaEncontrada.numero
    })
    const extrato = {
        depositos: depositos1,
        saques: saques1,
        transferenciasEnviadas,
        transferenciasRecebidas,
    }
    return res.status(200).json(extrato);

        
    
}
module.exports = {
    listarContas,
    criarConta,
    alterarConta,
    excluirConta,
    depositar,
    sacar,
    tranferir,
    saldo,
    extrato,
}