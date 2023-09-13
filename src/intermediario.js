const { banco, contas } = require("./bancodedados")
const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;
    if (!senha_banco) {
        return res.status(401).json({ mensagem: "A senha do banco não foi informada" })
    }
    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }
    next()
}
const validarSaldoEExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query;
    if(!numero_conta){
        return res.status(401).json({mensagem: "O numero da conta não foi informado!"})
    }
    const contaEncontrada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" })
    }
    if(!senha){
        return res.status(401).json({mensagem: "A senha da conta não foi informado!"})
    }
    if(senha !== contaEncontrada.senha){
        return res.status(401).json({mensagem: "A senha está incorreta para a conta informado!"})
    }
    next()
}

module.exports = {
    validarSenha,
    validarSaldoEExtrato,
}