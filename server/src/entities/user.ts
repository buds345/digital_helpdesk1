import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// Role enum
export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
  SUPPORT = "support",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  // ✅ Soft delete flag
  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;

  // 🆕 Email verification fields
  @Column({ type: "boolean", default: false })
  emailVerified!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  emailVerificationToken!: string | null;

  @Column({ type: "timestamp", nullable: true })
  emailVerificationExpires!: Date | null;

  // 🆕 Password reset fields
  @Column({ type: "varchar", length: 255, nullable: true })
  resetToken!: string | null;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpiry!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at!: Date;
}