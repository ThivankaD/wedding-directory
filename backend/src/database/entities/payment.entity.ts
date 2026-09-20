import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VisitorEntity } from './visitor.entity';
import { VendorEntity } from './vendor.entity';
import { PackageEntity } from './package.entity';

@Entity({ name: 'payment' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VisitorEntity, visitor => visitor.payments)
  @JoinColumn({ name: 'visitor_id' })
  visitor: VisitorEntity;

  @ManyToOne(() => VendorEntity, vendor => vendor.payments)
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorEntity;

  @ManyToOne(() => PackageEntity, pkg => pkg.payments, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'payment_reference', nullable: true })
  paymentReference?: string;

  @Column({ default: 'payhere' })
  gateway: string;

  @Column({ name: 'gateway_payment_id', nullable: true })
  gatewayPaymentId?: string;

  @Column({ type: 'varchar', default: 'LKR', nullable: true })
  currency?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  })
  status: 'pending' | 'completed' | 'failed';

  @Column({ name: 'booking_date', type: 'timestamp', nullable: true })
  bookingDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
