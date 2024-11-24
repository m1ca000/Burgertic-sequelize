import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Pedido extends Model {}

Pedido.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_usuario: {
            type: DataTypes.STRING,
        },
        fecha: {
            type: DataTypes.DATE,
        },
        estado: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: "pedidos",
        timestamps: false,
    }
)
