import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TicketLine } from './ticket-line.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00 })
  subtotal: number;

  @Column({ type: 'enum', enum: ['fixed', 'percent'], nullable: true })
  discount_type: 'fixed' | 'percent' | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true, nullable: true })
  discount_value: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00 })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => TicketLine, ticketLine => ticketLine.ticket)
  ticketLines: TicketLine[];
}