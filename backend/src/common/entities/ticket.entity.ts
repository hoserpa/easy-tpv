import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TicketLine } from './ticket-line.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: 0.0,
    name: 'subtotal',
  })
  subtotal: number;

  @Column({
    type: 'enum',
    enum: ['fixed', 'percent'],
    nullable: true,
    name: 'discount_type',
  })
  discount_type: 'fixed' | 'percent' | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    nullable: true,
    name: 'discount_value',
  })
  discount_value: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: 0.0,
    name: 'total',
  })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => TicketLine, (ticketLine) => ticketLine.ticket)
  ticketLines: TicketLine[];
}
