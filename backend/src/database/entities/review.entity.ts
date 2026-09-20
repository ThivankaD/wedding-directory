import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ServiceEntity } from './service.entity';
import { VisitorEntity } from './visitor.entity';

@Entity({ name: 'review' })
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @Column({ type: 'integer' })
  rating: number;

  @Column('text', { array: true, nullable: true })
  image_urls?: string[];

  @ManyToOne(() => ServiceEntity, (service) => service.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: ServiceEntity;
  
  @ManyToOne(() => VisitorEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'visitor_id' })
  visitor: VisitorEntity;

  @ManyToOne(() => ServiceEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mentioned_service_id' })
  mentionedService?: ServiceEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
