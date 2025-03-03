import { Comment } from "src/comment/entities/comment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('news')
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    link: string;

    @Column()
    date: Date;

    @Column()
    tag: string;

    @OneToMany(() => Comment, (comment) => comment.news, { cascade: true })
    comments: Comment[];
}