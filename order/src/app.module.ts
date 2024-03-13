import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { PlaceOrderStep } from './sagas/steps/place-order.step';
import { CreateOrderSaga } from './sagas/create-order.saga';
import { AuthorizePaymentStep } from './sagas/steps/authorize-payment.step';
import { CheckProductsAvailabilityStep } from './sagas/steps/check-product-availability.step';
import { ConfirmOrderStep } from './sagas/steps/confirm-order.step';
import { UpdateStockStep } from './sagas/steps/update-stock.step';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'inventory_client',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'inventory_client' + randomUUID(),
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'inventory_client',
          },
        },
      },
      {
        name: 'payment_client',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payment_client' + randomUUID(),
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'payment_client',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([OrderRepository, OrderEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5437,
      username: 'postgres',
      password: 'postgres',
      database: 'order',
      entities: [OrderEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController, OrderController],
  providers: [
    AppService,
    OrderService,
    PlaceOrderStep,
    CreateOrderSaga,
    AuthorizePaymentStep,
    CheckProductsAvailabilityStep,
    ConfirmOrderStep,
    UpdateStockStep,
  ],
})
export class AppModule {}
