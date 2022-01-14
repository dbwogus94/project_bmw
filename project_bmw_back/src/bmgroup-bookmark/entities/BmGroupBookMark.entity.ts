import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
 * TODO: 마이그레이션 설정시 아래 코드 추가, 그 전까지는 수동으로 추가해야 한다.
 * - ALTER TABLE bmgroup_bookmark ADD UNIQUE(bmGroupId, bookMarkId)
 */
@Entity({ name: 'bmgroup_bookmark' })
export class BmGroupBookMark implements IBmGroupBookMark {
  @PrimaryGeneratedColumn({ comment: 'bmGroupBookMark 테이블 PK' })
  bmGroupBookMarkId!: number;

  @ManyToOne(type => BmGroup, bmGroup => bmGroup.bmGroupBookMarks, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bmGroupId' })
  // FK: bmGroup(N) : bmGroupBookMark(1)
  bmGroup!: BmGroup;

  @ManyToOne(type => BookMark, bookMark => bookMark.bmGroupBookMarks, { nullable: false })
  @JoinColumn({ name: 'bookMarkId' })
  // FK: bookMark(N) bmGroupBookMark(1)
  bookMark!: BookMark;

  @CreateDateColumn({ comment: '생성일', select: false })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정일', select: false })
  updatedAt!: Date;
}
