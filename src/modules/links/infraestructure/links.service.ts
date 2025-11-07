import { Op } from "sequelize";
import LinkModel from "../domain/Link.model";

export default class LinksService {
    
    async create(url: string, slug?: string) {
        const newLink = await LinkModel.create({ url, slug });
        return newLink;
    }
    
    async getAll() {
        const links = await LinkModel.findAll();
        return links;
    }
    
    async getAllPaginated(limit: number, offset: number, search: string) {
        const whereClause = search 
            ? {
                [Op.or]: [
                    { slug: { [Op.like]: `%${search}%` } },
                    { url: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};
        
        const { count, rows } = await LinkModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        
        return {
            links: rows,
            total: count
        };
    }
    
    async update(id: number, url: string, slug: string) {
        const link = await LinkModel.findByPk(id);
        if (link) {
            link.url = url;
            link.slug = slug;
            await link.save();
            return link;
        }
        return null;
    }
    
    async delete(id: number) {
        const link = await LinkModel.findByPk(id);
        if (link) {
            await link.destroy();
            return true;
        }
        return false;
    }
    
    async getBySlug(slug: string) {
        const link = await LinkModel.findOne({ where: { slug } });
        return link;
    }
}