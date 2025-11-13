import config from "config";
import app from "./app.js";
import { initDb, logger } from "./config/index.js";

const startServer = async () => {
    const PORT = config.get("server.port") ?? 8082;

    try {
        await initDb();

        logger.info("Connected to database successfully.");

        app.listen(PORT, () => {
            logger.info("Server up and listening on PORT", { PORT: PORT });
        });
    } catch (error) {
        logger.error("Something went wrong while starting the server", error);
        logger.on("close", () => {
            process.exit(1);
        });
    }
}

startServer().catch(async (error) => {
    logger.error(error);
});