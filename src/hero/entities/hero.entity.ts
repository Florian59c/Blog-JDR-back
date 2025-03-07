import { Comment } from "src/comment/entities/comment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('hero')
export class Hero {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    title: string;

    @Column({ unique: true, nullable: false })
    link: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column()
    tag: string;

    @OneToMany(() => Comment, (comment) => comment.hero, { cascade: true })
    comments: Comment[];
}