import { BmGroup } from '@bmGroup/entities/BmGroup.entity';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
  bmGroups: BmGroup[];
}

@Entity({ name: 'user' })
export class User implements IUser {
  @PrimaryGeneratedColumn({ comment: 'user PK' })
  id!: number;

  @Column('varchar', { length: 100, unique: true, comment: '로그인 id' })
  username!: string;

  @Column('varchar', { length: 100, comment: '이름' })
  name!: string;

  @Column('varchar', { length: 200, comment: 'hash 비밀번호' })
  hashPassword!: string;

  @Column('varchar', { length: 100, comment: '이메일' })
  email!: string;

  @Exclude()
  @Column('varchar', { length: 300, nullable: true, comment: '엑세스 토큰' })
  public accessToken?: string;

  @Exclude()
  @Column('varchar', { length: 300, nullable: true, comment: '재발급 토큰' })
  public refreshToken?: string;

  @CreateDateColumn({ comment: '생성일' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정일' })
  updatedAt!: Date;

  @Column('varchar', { length: 2, default: 'Y', comment: '계정 활성화 여부' })
  active!: active;

  @OneToMany(type => BmGroup, bmGroup => bmGroup.user)
  bmGroups!: BmGroup[];
}
