import config from "config";

import KafkaBroker from "../../config/kafka.js";
import type { Broker } from "../types/broker.js";

let broker: Broker | null = null;

const createBroker = (): Broker => {
    if (!broker) {
        broker = new KafkaBroker(config.get("kafka.clientId"), [
            config.get("kafka.broker"),
        ]);
    }

    return broker;
};

export default createBroker;
