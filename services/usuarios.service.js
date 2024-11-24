import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;
import { Usuario } from "../models/usuarios.model.js";

const getUsuarioByEmail = async (email) => {
    try {
        const usuario = await Usuario.findOne({
            where: {
                email: email,
            },
        });
        return usuario || null
    }
    catch (error) {
        throw error;
    }
};

const getUsuarioById = async (id) => {
    try {
        const usuario = await Usuario.findOne({
            where: {
                id:id,
            },
        });
        return usuario || null
    }
    catch (error) {
        throw error
    }
}

const createUsuario = async (usuario) => {
    try {
        await Usuario.create({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        password: usuario.password,
        })
    }
    catch (error) {
        throw error
    }
};

export default { getUsuarioByEmail, getUsuarioById, createUsuario };
