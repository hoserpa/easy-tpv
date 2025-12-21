import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Articulo } from './articulo.entity';

@Entity('ticket_lineas')
export class TicketLine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  ticket_id: number;

  @Column({ type: 'int', unsigned: true })
  item_id: number;

  @Column({ type: 'int', unsigned: true, default: 1 })
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00 })
  unit_price: number;

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

  @ManyToOne(() => Ticket, ticket => ticket.ticketLines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => Articulo, articulo => articulo.ticketLines, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'item_id' })
  articulo: Articulo;
}