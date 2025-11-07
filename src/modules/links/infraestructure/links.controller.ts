import { Request, Response } from "express";
import LinksService from "./links.service";

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
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            
            const offset = (page - 1) * limit;
            
            const { links, total } = await this.linksService.getAllPaginated(
                limit, 
                offset, 
                search
            );
            
            res.status(200).json({
                data: links,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error("Error al obtener los enlaces:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { url, slug } = req.body;
        
        try {
            const updatedLink = await this.linksService.update(parseInt(id), url, slug);
            if (updatedLink) {
                res.status(200).json(updatedLink);
            } else {
                res.status(404).json({ message: "Enlace no encontrado" });
            }
        } catch (error) {
            console.error("Error al actualizar el enlace:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
    
    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        try {
            const deleted = await this.linksService.delete(parseInt(id));
            if (deleted) {
                res.status(200).json({ message: "Enlace eliminado correctamente" });
            } else {
                res.status(404).json({ message: "Enlace no encontrado" });
            }
        } catch (error) {
            console.error("Error al eliminar el enlace:", error);
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
                res.status(404).send("No existe el enlace");
            }
        } catch (error) {
            console.error(`Error al obtener el enlace con slug ${slug}:`, error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}