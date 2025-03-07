import { Comment } from "src/comment/entities/comment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('news')
export class News {
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

    @OneToMany(() => Comment, (comment) => comment.news, { cascade: true })
    comments: Comment[];
}