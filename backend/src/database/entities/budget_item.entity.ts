import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BudgetToolEntity } from './budget_tool.entity';

@Entity({ name: 'budget_item' })
export class BudgetItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'item_name', type: 'varchar', length: 100 })
  itemName: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ name: 'estimated_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  amountPaid?: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  specialNotes?: string;

  @Column({ name: 'is_paid_in_full', type: 'boolean', default: false })
  isPaidInFull: boolean;

  @ManyToOne(() => BudgetToolEntity, (budgetTool) => budgetTool.budgetItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'budget_tool_id' })
  budgetTool: BudgetToolEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
