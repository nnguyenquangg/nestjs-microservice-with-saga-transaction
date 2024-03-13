import { OrderEntity } from 'src/entities/order.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {}
