import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { randomUUID } from 'crypto';
import { KafkaOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<KafkaOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `inventory_client${randomUUID()}`,
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: `inventory_client${randomUUID()}`,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap().then(() => console.log('Inventory Service'));
