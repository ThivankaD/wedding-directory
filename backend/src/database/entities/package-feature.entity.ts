import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PackageEntity } from './package.entity';

@Entity({ name: 'package_feature' })
export class PackageFeatureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PackageEntity, (p) => p.packageFeatures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity;

  @Column({ type: 'varchar', length: 500 })
  text: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
