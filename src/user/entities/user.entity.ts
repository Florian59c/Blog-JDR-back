import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from '../user-role.enum';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  pseudo: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Empêche la sélection par défaut
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  register_date: Date

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];
}