import config from "config";
import app from "./app.js";

const startServer = async () => {
    const PORT = config.get("server.port") ?? 8082;

    try {
        app.listen(PORT, () => {
            console.log(`Server up and listening on PORT ${PORT}`);
        });
    } catch (error) {
        process.exit(1);
    }
}

startServer();