const jwt = require("jsonwebtoken");
const db = require("../models/");
const { Sequelize, Op, where } = require("sequelize");
const sequelize = db.sequelize;

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Usuario = db.Usuario;

const EstadoEncuestaMaestraService = {
  async listarEstadoEncuestasMaestra() {
    return await db.EstadoEncuestaMaestra.findAll();
  },
};

module.exports = EstadoEncuestaMaestraService;
