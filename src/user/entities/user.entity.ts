import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../user-role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  pseudo: string;

  @Column({ unique: true })
  email: string;

  @Column() // Empêche la sélection par défaut
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  register_date: Date
}