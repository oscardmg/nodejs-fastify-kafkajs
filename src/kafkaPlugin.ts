import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

import { Kafka, Producer, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-api',
  brokers: ['127.0.0.1:9092'],
  logLevel: logLevel.DEBUG,
})

const createProducer = async (app: FastifyInstance): Promise<Producer> => {
  const producer = kafka.producer()
  await producer.connect()
  app.log.info("Kafka producer ready");
  return producer
}

declare module 'fastify' {
  interface FastifyInstance {
      getProducer(): Producer;
  }
}

export const kafkaPlugin = fastifyPlugin(async (app: FastifyInstance) => {
  // Cuando este lista la aplicacion crear ese producer
  let producer: Producer;

  app.decorate("getProducer", () => producer);
  app.log.info("kafkaPlugin");
  app.addHook("onReady", async () => {
    producer = await createProducer(app);
  });
});

