import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `payment_client${randomUUID()}`,
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: `${process.env.KAFKA_PREFIX}ESG_MAIN`,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap().then(() => console.log('Payment Service'));
