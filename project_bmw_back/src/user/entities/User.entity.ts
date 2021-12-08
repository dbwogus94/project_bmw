import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum active {
  Y,
  N,
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  hashPassword: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  active: active;
}

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 100, unique: true })
  username!: string;

  @Column('varchar', { length: 100 })
  name!: string;

  @Column('varchar', { length: 200 })
  hashPassword!: string;

  @Column('varchar', { length: 100 })
  email!: string;

  @Exclude()
  @Column('varchar', { length: 300, nullable: true })
  public accessToken?: string;

  @Exclude()
  @Column('varchar', { length: 300, nullable: true })
  public refreshToken?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('varchar', { length: 2, default: 'Y' })
  active!: active;
}
