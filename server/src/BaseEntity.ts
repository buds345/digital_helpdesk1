// server/src/entities/BaseEntity.ts
import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity as TypeOrmBase,
} from "typeorm";

export abstract class BaseEntity extends TypeOrmBase {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}
