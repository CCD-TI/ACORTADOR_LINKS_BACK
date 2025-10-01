import express from "express";
import cors from "cors";
import type { Application } from "express";
import linksRoutes from "./modules/links/infraestructure/links.routes";

export default class App {
  private server: Application;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.server.use(express.json());
    //this.server.use(express.urlencoded({ extended: true }));
    // Aquí puedes agregar CORS, morgan, helmet, etc.
    this.server.use(cors());
    // this.server.use(morgan("dev"));
  }

  private routes(): void {

    // aquí podrías importar y usar tus rutas
    this.server.use("/", linksRoutes);

  }

  public listen(port: number, callback?: (error?: Error) => void): void {
    this.server.listen(port, callback);
  }

  public getServer(): Application {
    return this.server;
  }
}
