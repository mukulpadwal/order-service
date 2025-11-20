import config from "config";
import app from "./app.js";
import { initDb, logger } from "./config/index.js";
import type { Broker } from "./common/types/broker.js";
import createBroker from "./common/factories/brokerFactory.js";

const startServer = async () => {
    const PORT = config.get("server.port") ?? 8082;
    let broker: Broker | null = null;

    try {
        await initDb();

        logger.info("Connected to database successfully.");

        broker = createBroker();
        await broker.connectConsumer();
        await broker.consumeMessage(
            [
                config.get("kafka.topic.product"),
                config.get("kafka.topic.topping"),
            ],
            false
        );

        app.listen(PORT, () => {
            logger.info("Server up and listening on PORT", { PORT: PORT });
        });
    } catch (error) {
        if (broker) {
            await broker.disconnectConsumer();
        }
        logger.error("Something went wrong while starting the server", error);
        logger.on("close", () => {
            process.exit(1);
        });
    }
};

startServer().catch(async (error) => {
    logger.error(error);
});
