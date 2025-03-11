import { Comment } from "src/comment/entities/comment.entity";
import { JdrList } from "src/jdr_list/entities/jdr_list.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('jdr')
export class Jdr {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    title: string;

    @Column({ unique: true, nullable: false })
    link: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ nullable: false })
    is_scenario: boolean;

    @OneToMany(() => Comment, (comment) => comment.jdr, { cascade: true })
    comments: Comment[];

    @ManyToOne(() => JdrList, (jdr_list) => jdr_list.jdr, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jdr_list_id' }) // Définit le nom de la colonne
    jdr_list: JdrList;
}