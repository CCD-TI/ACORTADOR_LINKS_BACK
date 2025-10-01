import { Router } from "express";
import LinksController from "./links.controller";

const linksRoutes = Router();
const linksController = new LinksController();

linksRoutes.get("/api/links", linksController.getAll);
linksRoutes.post("/api/links", linksController.create);
linksRoutes.get("/:slug", linksController.getBySlug);


export default linksRoutes;