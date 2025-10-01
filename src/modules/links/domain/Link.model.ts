import { Column, DataType, IsUrl, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'links', timestamps: true })
export default class LinkModel extends Model{

    @Column(DataType.TEXT)
    slug!: string

    @IsUrl
    @Column(DataType.TEXT)
    url!: string

}