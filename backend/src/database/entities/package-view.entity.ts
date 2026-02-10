import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PackageEntity } from "./package.entity";

@Entity({ name: 'package_view' })
export class PackageViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PackageEntity)
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity;

  @Column({ name: 'visitor_id', type: 'varchar', nullable: true })
  visitorId?: string;

  @Column({ name: 'session_id', type: 'varchar', nullable: true })
  sessionId?: string;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
