import { Router } from "express";
import * as productsCtrl from "../controllers/products.controller.js";
import { isAdmin, isModerator, verifyToken } from "../middlewares/authJwt.js";

const productsRouter = Router();

productsRouter.get("/", verifyToken, productsCtrl.getProducts);

productsRouter.get("/:productId", verifyToken, productsCtrl.getProductsById);

productsRouter.post("/", [verifyToken, isModerator], productsCtrl.createProducts);

productsRouter.put("/:productId", [verifyToken, isModerator], productsCtrl.updateProducts);

productsRouter.delete("/:productId", [verifyToken, isModerator], productsCtrl.deleteProducts);

export { productsRouter };
