import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BmGroup } from '@bmGroup/entities/BmGroup.entity';
import { BookMark } from '@bookMark/entities/BookMark.entity';

export interface IBmGroupBookMark {
  bmGroupBookMarkId: number;
  bmGroup: BmGroup;
  bookMark: BookMark;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * bmGroup테이블과 bookBark테이블 N:M 관계 매핑용 테이블
 */
@Entity({ name: 'bmgroup_bookmark' })
export class BmGroupBookMark implements IBmGroupBookMark {
  @PrimaryGeneratedColumn({ comment: 'bmGroupBookMark 테이블 PK' })
  bmGroupBookMarkId!: number;

  @ManyToOne(type => BmGroup, bmGroup => bmGroup.bmGroupBookMarks, { nullable: false })
  // FK: bmGroup테이블과 bmGroupBookMark 테이블 N:1 관계설정
  bmGroup!: BmGroup;

  @ManyToOne(type => BookMark, bookMark => bookMark.bmGroupBookMarks, { nullable: false })
  // FK: bookMark테이블과 bmGroupBookMark 테이블 N:1 관계설정
  bookMark!: BookMark;

  @CreateDateColumn({ comment: '생성일' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정일' })
  updatedAt!: Date;
}
