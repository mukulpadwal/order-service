import config from "config";
import mongoose from "mongoose";

const initDb = async () => {
    await mongoose.connect(config.get("database.url"));
};

export default initDb;
