import { Kafka, type Consumer, type EachMessagePayload } from "kafkajs";
import type { Broker } from "../common/types/broker.js";
import handleProductUpdate from "../productCache/productUpdateHandler.js";

export default class KafkaBroker implements Broker {
    private consumer: Consumer;

    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({ clientId, brokers });
        this.consumer = kafka.consumer({ groupId: clientId });
    }

    /**
     * Connect the consumer
     */
    async connectConsumer(): Promise<void> {
        await this.consumer.connect();
    }

    /**
     * Disonnect the consumer
     */
    async disconnectConsumer(): Promise<void> {
        if (this.consumer) {
            await this.consumer.disconnect();
        }
    }

    /**
     *
     * @param topic
     * @param fromBeginning
     */
    async consumeMessage(
        topics: string[],
        fromBeginning: boolean = false
    ): Promise<void> {
        await this.consumer.subscribe({ topics, fromBeginning });

        await this.consumer.run({
            eachMessage: async ({
                topic,
                partition,
                message,
            }: EachMessagePayload) => {
                switch (topic) {
                    case "product":
                        await handleProductUpdate(message.value?.toString());
                        return;
                    default:
                        return;
                }
            },
        });
    }
}
