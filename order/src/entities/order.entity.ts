import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type OrderItemProps = {
  productId: number;
  quantity: number;
  totalPrice: number;
};

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  customerId: number;

  @Column()
  orderDate: Date;

  @Column({ nullable: true })
  status?: 'CONFIRMED' | 'CANCELLED';

  @Column({ type: 'jsonb' })
  items: OrderItemProps[];
}
