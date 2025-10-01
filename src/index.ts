import "dotenv/config";
import app from "./app";
import Database from "./shared/config/database";

async function main(): Promise<void> {
  try {
    // sincronización con la base de datos s
    const newapp = new app();
    await Database.sync();

    // Solo levantar servidor si NO estamos en producción en Vercel
    if (process.env.NODE_ENV !== "production") {
      const port = Number(process.env.PORT || 3100);
      
      newapp.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.error("Error durante la ejecución:", error);
    process.exit(1);
  }
}

main();

// Exportar app como handler para Vercel
export default app;
