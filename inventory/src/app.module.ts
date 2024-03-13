import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryRepository } from './repositories/inventory.respositoy';
import { InventoryEntity } from './entities/inventory.entity';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryRepository, InventoryEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5437,
      username: 'postgres',
      password: 'postgres',
      database: 'inventory',
      entities: [InventoryEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController, InventoryController],
  providers: [AppService, InventoryService],
})
export class AppModule {}
