import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;
import { Pedido } from "../models/pedidos.model.js";
import { Plato } from "../models/platos.model.js";
import { PedidosPlatos } from "../models/platosPedidos.model.js";
import platosService from "./platos.service.js";

const getPedidos = async () => await Pedido.findAll();

const getPedidoById = async (idPedido) => {
    const pedido = await Pedido.findByPk(idPedido);
    return pedido
}

const getPlatosByPedido = async (idPedido) => {
    const pedido = await Pedido.findByPk(idPedido);
    if(!pedido) {
        throw new Error("Pedido no encontrado");
    }

    const platosPedidos = await PedidosPlatos.findAll({
        where: {
            PedidoId:idPedido,
        },
    })

    if (!platosPedidos.length) {
        throw new Error("No se encontraron platos para este pedido");
    }

    const platos = [];
    platosPedidos.forEach((platoPedido) => {
        platos.push(platoPedido.plato);
    });

    return platos
}

const getPedidosByUser = async (id) => {
    try {
        const pedidosUsuario = await Pedido.findAll({
            where: {
                id_usuario: id
            }
        });
        return pedidosUsuario;
    }
    catch(error) {
        throw error
    }
}

const createPedido = async (idUsuario, platos) => {

    try {
        for (let plato of platos) {
            const platoExistente = await platosService.getPlatoById(plato.id);
            if (!platoExistente) {
                throw new Error(`El plato con id ${plato.id} no existe`);
            }
        };
        const newPedido = await Pedido.create({
            id_usuario: idUsuario,
            fecha: new Date(),
            estado: "pendiente", 
        });
        for (let plato of platos) {
            const pedidoPlato = await PedidosPlatos.create({
                id_pedido: newPedido.id,
                id_plato: plato.id,
                cantidad: plato.cantidad,
            });
        }
    }
    catch(error){
        throw error;
    }
    
}

const updatePedido = async (id, estado) => {
    try {
        if (estado !== "aceptado" && estado !== "en camino" && estado !== "entregado") {
        throw new Error("Estado inválido");
        }
        
        const pedido = await Pedido.findByPk(id);
        if(!pedido){
            throw new Error("Pedido no encontrado")
        }
        
        const updatePedido = await Pedido.update (
            {
                estado: estado,
            },
            {
                where: {
                    id: id,
                },
            }
        )
        return updatePedido;
    }
    catch(error){
        throw error;
    }
    
};

const deletePedido = async (id) => {
    try {
        const pedido = await Pedido.findByPk(id);
        if(!pedido){
            throw new Error("Pedido no encontrado")
        }

        const borrarPedido = await Pedido.destroy({
            where: { id },
        });
    }
    catch(error) {
        throw error
    }
}

const DeletePedido = async (id) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "DELETE FROM pedidos WHERE id = $1",
            [id]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

export default {
    getPedidos,
    getPedidoById,
    getPlatosByPedido, 
    getPedidosByUser,
    createPedido,
    updatePedido,
    deletePedido,
};
