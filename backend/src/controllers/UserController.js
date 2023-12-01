//controllers/UserController.js

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PRIVATEKEY = process.env.PRIVATEKEY;


async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, PRIVATEKEY); //Chave secreta para verificar o token
        return { valid: true, userId: decoded.userId };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

async function getUserById(req, res) {
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ mensagem: 'Não aitorizado' });
    }

    const tokenValue = token.split(' ')[0];
    const tokenValidation = verifyToken(tokenValue);

    if (!tokenValidation.valid) {
        if (tokenValidation.message === 'jwt expired') {
            return res.status(401).json({ mensagem: 'Sessão inválida' })
        }
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }

    const { userId } = tokenValidation;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.status(200).json({ mensagem: 'Usuário encontrado', user });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuário', error: error.message })
    }
}

async function signUp(req, res) {
    if(!req.body || !req.body.nome || !req.body.email || req.body.senha|| !req.body.telefoneDDD || !req.body.telefoneNumero){
        return res.status(400).json({error:'Está faltando campos na requisição'});
    }

    const { nome, email, senha, telefoneDDD, telefoneNumero } = req.body;

    try {
        // Verificar se o email já está cadastrado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ mensagem: 'Email já cadastrado' });
        }

        // Hashear a senha antes de salvar no banco de dados
        const hashedPassword = await bcrypt.hash(senha);

        // Criar um novo usuário no banco de dados
        const newUser = await User.create({
            nome,
            email,
            senha: hashedPassword, // Salvar a senha hasheada no banco de dados
            telefoneDDD,
            telefoneNumero,
            dataCriacao: new Date(), // Definir a data de criação como o momento atual
        });

        res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
    }
}

async function signIn(req, res){
    const {email, senha} = req.body;

    try{
        //Buscar usuário pelo email
        const user = await User.findOne({where: {email}});

        if(!user){
            return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos'});
        }

        //Verificar se a senha está correta
        const isPasswordValid = await bcrypt.compare(senha,user.senha);

        if(!isPasswordValid){
            return res.status(401).json({mensagem: 'Usuário e/ou senha inválidos'});
        }

        //Atualizar informações de login (data de última autenticação)
        user.ultimoLogin = new Date();
        await user.save();

        
        //Gerar token JWT
        
        const payload = { userId: user.id };
        const secretOrPrivateKey = PRIVATEKEY;
        const options = { expiresIn: '30m' };

        const token = jwt.sign(payload, secretOrPrivateKey, options);

        //Preparar os dados do usuário a serem retornados

        const userData = {
            id: user.id,
            dataCriacao: user.dataCriacao,
            dataAtualizacao: user.dataAtualizacao,
            ultimoLogin: user.ultimoLogin,
            token,
        };

        res.status(200).json(userData);
    }catch(error){
        res.status(500).json({ mensagem: 'Erro ao realizar autenticação', error:error.mensage});
    }
}


module.exports = {
    getUserById,
    verifyToken,
    signUp,
    signIn,
    
};