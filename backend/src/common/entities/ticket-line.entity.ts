import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { Articulo } from './articulo.entity';

@Entity('tickets_lineas')
export class TicketLine {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'int', unsigned: true, name: 'ticket_id' })
  ticket_id: number;

  @Column({ type: 'int', unsigned: true, name: 'articulo_id' })
  articulo_id: number;

  @Column({ type: 'int', unsigned: true, default: 1, name: 'qty' })
  qty: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: 0.0,
    name: 'unit_price',
  })
  unit_price: number;

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

  @ManyToOne(() => Ticket, (ticket) => ticket.ticketLines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => Articulo, (articulo) => articulo.ticketLines, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;
}
