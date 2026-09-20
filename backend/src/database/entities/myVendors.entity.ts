import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { VisitorEntity } from './visitor.entity';
import { ServiceEntity } from './service.entity';

@Entity({ name: 'saved_vendor' })
export class MyVendorsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceEntity, (service) => service.myVendors, {
    nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;

  @ManyToOne(() => VisitorEntity, (visitor) => visitor.myVendors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'visitor_id' })
  visitor: VisitorEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}