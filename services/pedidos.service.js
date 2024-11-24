import { config } from "../db.js";
import pkg from "pg";
const { Client } = pkg;
import { Pedido } from "../models/pedidos.model.js";
import { Plato } from "../models/platos.model.js";
import platosService from "./platos.service.js";

const getPedidos = async () => await Pedido.findAll();

const getPedidoById = async (idPedido) => 
    await Pedido.findAll({
        where: {
            id: idPedido
        }
    })

const getPlatosByPedido = async (idPedido) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM pedidos_platos WHERE id_pedido = $1",
            [idPedido]
        );

        if (rows.length < 1) throw new Error("Pedido no encontrado");

        const result = await Promise.all(
            rows.map(async (plato) => {
                const { rows } = await client.query(
                    "SELECT * FROM platos WHERE id = $1",
                    [plato.id_plato]
                );

                if (rows.length < 1) throw new Error("Plato no encontrado");

                return {
                    ...rows[0],
                    cantidad: plato.cantidad,
                };
            })
        );

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const createPedido = async (pedido, platos) => {
    for (let plato of platos) {
        await platosService.getPlatoById(plato.id)
    }
    Pedido.create({
        id_usuario: pedido.id_usuario,
        fecha: pedido.fecha,
        estado: pedido.estado, 
    })
}
const CreatePedido = async (idUsuario, platos) => {
    const client = new Client(config);
    await client.connect();

    try {
        // ACÁ SE PODRÍA HACER EN ETAPAS
        // 1. Validar que los platos existan
        // 2. Crear el pedido
        // 3. Agregar los platos al pedido

        // Así, no hace falta introducir el concepto de transacciones o rollback

        const { rows } = await client.query(
            "INSERT INTO pedidos (id_usuario, fecha, estado) VALUES ($1, $2, 'pendiente') RETURNING id",
            [idUsuario, new Date()]
        );

        const idPedido = rows[0].id;

        for (let plato of platos) {
            const { rows } = await client.query(
                "SELECT * FROM platos WHERE id = $1",
                [plato.id]
            );

            if (rows.length < 1) {
                await client.query("DELETE FROM pedidos WHERE id = $1", [
                    idPedido,
                ]);
                await client.query(
                    "DELETE FROM pedidos_platos WHERE id_pedido = $1",
                    [idPedido]
                );
                throw new Error("Plato no encontrado");
            }

            await client.query(
                "INSERT INTO pedidos_platos (id_pedido, id_plato, cantidad) VALUES ($1, $2, $3)",
                [idPedido, plato.id, plato.cantidad]
            );
        }

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const updatePedido = async (id, estado) => {};
const UpdatePedido = async (id, estado) => {
    if (
        estado !== "aceptado" &&
        estado !== "en camino" &&
        estado !== "entregado"
    )
        throw new Error("Estado inválido");

    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "UPDATE pedidos SET estado = $1 WHERE id = $2",
            [estado, id]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const deletePedido = async (id) => {
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
    //getPedidosByUser,
    createPedido,
    updatePedido,
    deletePedido,
};
