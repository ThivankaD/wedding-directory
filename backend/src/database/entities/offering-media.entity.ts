import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OfferingEntity } from './offering.entity';

@Entity({ name: 'offering_media' })
export class OfferingMediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OfferingEntity, (o) => o.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'offering_id' })
  offering: OfferingEntity;

  @Column({ name: 'media_type', type: 'varchar', length: 20 })
  mediaType: string; // 'photo' | 'video' | 'banner'

  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @Column({ name: 'slot_index', type: 'int', default: 0 })
  slotIndex: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
