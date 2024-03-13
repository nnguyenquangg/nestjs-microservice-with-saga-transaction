import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type OrderItemProps = {
  productId: string;
  quantity: number;
  totalPrice: number;
};

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  customerId: number;

  @Column()
  orderDate: Date;

  @Column()
  status: string;

  @Column({ type: 'jsonb' })
  items: OrderItemProps[];
}
