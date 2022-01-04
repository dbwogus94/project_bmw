import { User } from '@user/entities/User.entity';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IBmGroup {
  bmGroupId: number;
  user: User;
  bmGroupName: string;
  createdAt: Date;
  updatedAt: Date;
  bmGroupBookMarks: BmGroupBookMark[];
}

@Entity({ name: 'bm_group' })
export class BmGroup implements IBmGroup {
  @PrimaryGeneratedColumn({ comment: 'bmGroup PK' })
  bmGroupId!: number;

  @ManyToOne(type => User, user => user.bmGroups, { nullable: false }) // FK: user 테이블과 bmGroup 테이블 N:1 관계설정
  user!: User;

  @Column('varchar', { length: 90, comment: 'BM그룹명' })
  bmGroupName!: string;

  @CreateDateColumn({ comment: '생성일' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정일' })
  updatedAt!: Date;

  @OneToMany(type => BmGroupBookMark, bmGroupBookMark => bmGroupBookMark.bmGroup)
  bmGroupBookMarks!: BmGroupBookMark[];
}
