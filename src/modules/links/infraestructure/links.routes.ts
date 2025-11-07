import { Router } from "express";
import LinksController from "./links.controller";

const linksRoutes = Router();
const linksController = new LinksController();

linksRoutes.get("/api/links", linksController.getAll);
linksRoutes.post("/api/links", linksController.create);
linksRoutes.put("/api/links/:id", linksController.update);
linksRoutes.delete("/api/links/:id", linksController.delete);
linksRoutes.get("/:slug", linksController.getBySlug);

export default linksRoutes;