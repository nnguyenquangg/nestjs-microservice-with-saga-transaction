import { InventoryEntity } from 'src/entities/inventory.entity';
import { EntityRepository } from 'typeorm';
@EntityRepository(InventoryEntity)
export class InventoryRepository {}
