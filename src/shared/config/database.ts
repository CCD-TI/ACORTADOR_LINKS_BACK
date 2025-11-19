import { Sequelize } from "sequelize-typescript";
import { models } from "../models/models";
import pg from 'pg';
class Database {
    private connection: Sequelize | null;

    constructor() {
        this.connection = null;
        this.init();
    }

    init() {
        try {
            const databaseUrl = process.env.POSTGRES_URL;
            if (!databaseUrl) {
                throw new Error("DATABASE_URL no está definido en el entorno.");
            }
            console.log("📦 Configurando conexión a la base de datos...")
            this.connection = new Sequelize(databaseUrl, {
                dialect: "postgres",
                dialectModule: pg,
                logging: console.log,
                retry: { max: 3 },
                models: models,
                /*
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false, // para evitar errores con certificados autofirmados
                    },
                },*/
            });
            // No additional code needed here; addModels is correctly called after Sequelize initialization.
            console.log("🔗 Conectando a PostgreSQL en:", databaseUrl);
        } catch (e) {
            console.error("❌ Error al configurar la conexión con la base de datos", e);
        }
    }

    async sync() {
        try {
            await this.connection?.authenticate();
            console.log("✅ Conexión a PostgreSQL establecida correctamente.");

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