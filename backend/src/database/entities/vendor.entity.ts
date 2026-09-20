import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ServiceEntity } from './service.entity';
import { PaymentEntity } from './payment.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'vendor' })
export class VendorEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 20 })
  fname: string;

  @Column({ name: 'last_name', type: 'varchar', length: 20 })
  lname: string;

  @Column({ type: 'varchar', length: 500 })
  location: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'business_name', type: 'varchar', length: 50 })
  busname: string;

  @Column({ type: 'varchar', length: 12 })
  phone: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  profile_pic_url: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  about: string;

  @Column({ name: 'expo_push_token', type: 'varchar', length: 255, nullable: true })
  expoPushToken?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: false })
  updatedAt: Date;

  @OneToMany(() => ServiceEntity, (o) => o.vendor, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  service: ServiceEntity[];

  @OneToMany(() => PaymentEntity, payment => payment.vendor)
  payments: PaymentEntity[];
}
