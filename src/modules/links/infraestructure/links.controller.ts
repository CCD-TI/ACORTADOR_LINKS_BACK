import { Request, Response } from "express";
import LinksService from "../application/links.service";

export default class LinksController {
    private linksService: LinksService
    constructor() {
        this.linksService = new LinksService();
    }

    create = async (req: Request, res: Response) => {
        const { url, slug } = req.body;
        if (!url) {
            return res.status(400).json({ message: "La URL es obligatoria" });
        }
        try {
            const newLink = await this.linksService.create(url, slug);
            res.status(201).json(newLink);
        }
        catch (error) {
            console.error("Error al crear el enlace:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const links = await this.linksService.getAll();
            res.status(200).json(links);
        } catch (error) {
            console.error("Error al obtener los enlaces:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    getBySlug = async (req: Request, res: Response) => {
        const { slug } = req.params;
        try {
            const link = await this.linksService.getBySlug(slug);
            if (link) {
                res.redirect(link.url);
            } else {
                res.status(200).send("No existe el enlace");
            }
        } catch (error) {
            console.error(`Error al obtener el enlace con slug ${slug}:`, error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}