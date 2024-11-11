import jwt from "jsonwebtoken";
import UsuariosService from "../services/usuarios.service.js";

export const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization)
        return res
            .status(401)
            .json({ message: "Se necesita estar autenticado" });

    const token = req.headers.authorization.split(" ")[1];

    if (!token)
        return res
            .status(401)
            .json({ message: "Se necesita estar autenticado" });

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        if (!decoded.id)
            return res.status(401).json({ message: "Token inválido" });

        req.idUsuario = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

export const verifyAdmin = async (req, res, next) => {
    if (!req.headers.authorization)
        return res
            .status(401)
            .json({ message: "Se necesita estar autenticado" });

    const token = req.headers.authorization.split(" ")[1];

    if (!token)
        return res
            .status(401)
            .json({ message: "Se necesita estar autenticado" });

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        if (!decoded.id)
            return res.status(401).json({ message: "Token inválido" });

        req.idUsuario = decoded.id;

        const usuario = await UsuariosService.getUsuarioById(req.idUsuario);

        if (!usuario.admin)
            return res.status(403).json({ message: "No autorizado" });

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Token inválido" });
    }
};
