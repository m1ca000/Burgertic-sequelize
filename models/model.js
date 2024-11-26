import { sequelize } from "../db.js";
import { Pedido } from "./pedidos.model.js"
import { Plato } from "./platos.model.js";
import { PedidosPlatos } from "./platosPedidos.model.js";
import { Usuario } from "./usuarios.model.js"

export const defModelos = async()=>{
    Pedido.belongsTo(Usuario);
    Usuario.hasMany(Pedido);
    Pedido.belongsToMany(Plato, {through: PedidosPlatos});
    Plato.belongsToMany(Pedido, {through: PedidosPlatos});
}  