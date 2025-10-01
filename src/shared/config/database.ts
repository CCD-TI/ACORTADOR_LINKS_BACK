import { Sequelize } from "sequelize-typescript";
import { models } from "../models/models";

class Database {
    private connection: Sequelize | null;

    constructor() {
        this.connection = null;
        this.init();
    }

    init() {
        try {
            const DB_HOST = process.env.DB_HOST || 'localhost';
            const DB_PORT = process.env.DB_PORT || '3306';
            const DB_NAME = process.env.DB_NAME || 'acortador';
            const DB_USER = process.env.DB_USER || 'root';
            const DB_PASSWORD = process.env.DB_PASSWORD || '';
            console.log("📦 Configurando conexión a la base de datos...")
            console.log(DB_HOST, DB_PORT, DB_NAME, DB_USER);
            this.connection = new Sequelize({
                dialect: "mysql",
                host: DB_HOST,
                port: parseInt(DB_PORT),
                database: DB_NAME,
                username: DB_USER,
                password: DB_PASSWORD,
                logging: console.log,
                retry: { max: 3 },
                models: models,
            });
            // No additional code needed here; addModels is correctly called after Sequelize initialization.
            console.log("🔗 Conectando a MySQL en:", DB_HOST);
        } catch (e) {
            console.error("❌ Error al configurar la conexión con la base de datos", e);
        }
    }

    async sync() {
        try {
            await this.connection?.authenticate();
            console.log("✅ Conexión a MySQL establecida correctamente.");

            if (process.env.NODE_ENV !== 'production') {
                const alter = process.env.ALTER === 'true';
                const force = process.env.FORCE === 'true';
                await this.connection?.sync({ alter, force });
                console.log("✅ Base de datos sincronizada correctamente.");
            } else {
                console.log("ℹ️ Sincronización omitida en producción. Usa migraciones.");
            }

            console.log("✅ Base de datos sincronizada correctamente.");
        } catch (err) {
            console.error("❌ Error al conectar o sincronizar con la base de datos:", err);
        }
    }

    public getConnection() {
        return this.connection;
    }
}

export default new Database();