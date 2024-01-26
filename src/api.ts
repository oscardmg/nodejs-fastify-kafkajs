import Fastify from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import { kafkaPlugin } from './kafkaPlugin';
const User = Type.Object({
  email: Type.String({ format: 'email' }),
  firstName: Type.String(),
  lastName: Type.String(),
});

type UserType = Static<typeof User>;
const server = Fastify({
  logger: true,
});
// register plugin
server.register(kafkaPlugin);

server.post<{
  Body: UserType;
}>('/user', async (request, reply) => {
  const { email, firstName, lastName } = request.body;
  // get producer and send event
  const producer = server.getProducer();
  const eventSent = await producer.send({
    topic: 'test-topic',
    messages: [{ value: JSON.stringify({ email, firstName, lastName }) }],
  });

  return { recordSent: eventSent };
});

const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
// import fastify from 'fastify'

// const server = fastify()

// server.get('/ping', async (request, reply) => {
//   return 'pong\n'
// })

// server.listen({ port: 8080 }, (err, address) => {
//   if (err) {
//     console.error(err)
//     process.exit(1)
//   }
//   console.log(`Server listening at ${address}`)
// })
