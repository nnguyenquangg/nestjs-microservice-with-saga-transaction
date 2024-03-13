import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InventoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  isStockSufficient(demandedQuantity: number): boolean {
    return this.quantity >= demandedQuantity;
  }
}
