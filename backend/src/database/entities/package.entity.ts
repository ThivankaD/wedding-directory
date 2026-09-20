import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServiceEntity } from "./service.entity";
import { PaymentEntity } from './payment.entity';
import { PackageApprovalRequestEntity } from './package-approval-request.entity';
import { PackageFeatureEntity } from './package-feature.entity';

@Entity({ name: 'package' })
export class PackageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @Column({ 
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0
    })
    pricing: number;

    // Virtual property — populated at read-time from packageFeatures child rows.
    // Not persisted; source of truth is the package_feature table.
    features?: string[];

    @Column({ type: 'boolean', default: false })
    visible: boolean;

    @Column({ name: 'requires_reservation', type: 'boolean', default: false })
    requiresReservation: boolean;

    @Column({ name: 'requires_approval', type: 'boolean', default: false })
    requiresApproval: boolean;

    @Column({ type: 'varchar', length: 500, nullable: true })
    image?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => ServiceEntity, o => o.packages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: ServiceEntity;


    @OneToMany(() => PaymentEntity, payment => payment.package)
    payments: PaymentEntity[];

    @OneToMany(() => PackageApprovalRequestEntity, req => req.package)
    approvalRequests: PackageApprovalRequestEntity[];

    @OneToMany(() => PackageFeatureEntity, (f) => f.package, { cascade: true })
    packageFeatures?: PackageFeatureEntity[];
}