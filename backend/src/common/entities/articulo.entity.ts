import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Familia } from './familia.entity';
import { TicketLine } from './ticket-line.entity';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'familia_id', type: 'int', unsigned: true })
  familia_id: number;

  @Column({ type: 'varchar', length: 150, name: 'name' })
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: 0.0,
    name: 'price',
  })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Familia, (familia) => familia.articulos)
  @JoinColumn({ name: 'familia_id' })
  familia: Familia;

  @OneToMany(() => TicketLine, (ticketLine) => ticketLine.articulo)
  ticketLines: TicketLine[];
}
