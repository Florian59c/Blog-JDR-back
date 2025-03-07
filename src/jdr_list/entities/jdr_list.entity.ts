import { Jdr } from "src/jdr/entities/jdr.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('jdr_list')
export class JdrList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    name: string

    @OneToMany(() => Jdr, (jdr) => jdr.jdr_list, { cascade: true })
    jdr: Jdr[];
}