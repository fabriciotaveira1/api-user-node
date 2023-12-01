// models/User.js
//Definição de Modelo de Usuário

const DataTypes =  require('sequelize');
const  sequelize = require('./conn');


const user = sequelize.define('user', {
    id: {
        type: DataTypes.UUID, //GUID(Globally Unique Identifier, gerado automaticamente
        primaryKey: true,
        defaultValue: DataTypes.UUIpoDV4, //Valor padrão gerado automaticamente usando UUID v4
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNulll: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },

    telefoneDDD: {
        type: DataTypes.STRING(2),
        allowNull: false,
    },

    telefoneNumero: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    dataCriacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    dataAtualizacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    ultimoLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    timestamps: false, //Desativa os timestamps automáticos do sequelize
});

module.exports = {
    user
};