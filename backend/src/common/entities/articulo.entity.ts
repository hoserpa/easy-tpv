import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Familia } from './familia.entity';
import { TicketLine } from './ticket-line.entity';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'familia_id', type: 'int', unsigned: true })
  family_id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true, default: 0.00 })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Familia, familia => familia.articulos)
  @JoinColumn({ name: 'family_id' })
  familia: Familia;

  @OneToMany(() => TicketLine, ticketLine => ticketLine.articulo)
  ticketLines: TicketLine[];
}