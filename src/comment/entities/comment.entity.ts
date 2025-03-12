import { Hero } from "src/hero/entities/hero.entity";
import { Jdr } from "src/jdr/entities/jdr.entity";
import { News } from "src/news/entities/news.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('comment')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    content: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    creation_date: Date;

    @Column({ default: false })
    is_report: boolean;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' }) // Définit le nom de la colonne
    user: User;

    @ManyToOne(() => Hero, (hero) => hero.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hero_id' })
    hero: Hero;

    @ManyToOne(() => News, (news) => news.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'news_id' })
    news: News;

    @ManyToOne(() => Jdr, (jdr) => jdr.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jdr_id' })
    jdr: Jdr;
}