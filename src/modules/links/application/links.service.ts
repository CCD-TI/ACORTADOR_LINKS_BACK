import LinkModel from "../domain/Link.model"

export default class LinksService {

    constructor() {}
    create = async (url: string, slug: string | null) => {
        if(!slug){
            slug = Math.random().toString(36).substring(2, 8);
        }
        const newLink = await LinkModel.create({ url, slug });
        return newLink;
    }

    getAll = () =>{
        const links = LinkModel.findAll({attributes: {exclude: ['createdAt', 'updatedAt']}})
        return links;
    }

    getBySlug = (slug: string) =>{
        const link = LinkModel.findOne({where: {slug}, attributes: {exclude: ['createdAt', 'updatedAt']}})
        return link;
    }

}