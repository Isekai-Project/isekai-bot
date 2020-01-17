import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    uid!: number;

    @PrimaryColumn()
    protocol!: number;

    @Column()
    from!: string;

    @Column()
    access!: number;

    @Column()
    point!: number;

    @Column()
    nickname!: string;
}