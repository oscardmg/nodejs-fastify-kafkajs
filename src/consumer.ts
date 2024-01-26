
import { Kafka,  logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-api',
  brokers: ['127.0.0.1:9092'],
  logLevel: logLevel.DEBUG,
})

const consumer = kafka.consumer({ groupId: 'test-group' })

async function consume() {

  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message?.value?.toString(),
      })
    },
  })
}

consume().catch((err) => {
  console.error(err)
})