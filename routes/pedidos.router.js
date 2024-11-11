import Router from "express";
import PedidosController from "../controllers/pedidos.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyAdmin, PedidosController.getPedidos);
router.get("/usuario", verifyToken, PedidosController.getPedidosByUser); // IMPORTANTE QUE ESTE RUTA VAYA ANTES DE LA DE ABAJO
router.get("/:id", verifyAdmin, PedidosController.getPedidoById);
router.post("/", verifyToken, PedidosController.createPedido);
router.put("/:id/aceptar", verifyAdmin, PedidosController.aceptarPedido);
router.put("/:id/comenzar", verifyAdmin, PedidosController.comenzarPedido);
router.put("/:id/entregar", verifyAdmin, PedidosController.entregarPedido);
router.delete("/:id", verifyAdmin, PedidosController.deletePedido);

export default router;
