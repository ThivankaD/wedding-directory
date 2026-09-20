import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type UserRole = 'visitor' | 'vendor';

@Entity({ name: 'password_reset_otp' })
export class PasswordResetOtpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ name: 'user_type', type: 'varchar', length: 20 })
  userType: UserRole;

  @Column({ name: 'otp_hash', type: 'varchar', length: 255 })
  otpHash: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ name: 'is_used', type: 'boolean', default: false })
  isUsed: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
