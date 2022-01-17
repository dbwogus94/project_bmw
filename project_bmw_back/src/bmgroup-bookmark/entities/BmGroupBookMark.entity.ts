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
 * - ALTER TABLE bmgroup_bookmark_map ADD UNIQUE `UIX-bmgroup_bookmark_map-bm_group_id-book_mark_id` (bm_group_id, book_mark_id);
 */
@Entity({ name: 'bmgroup_bookmark_map' })
export class BmGroupBookMark implements IBmGroupBookMark {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'bmGroupBookMark 테이블 PK',
  })
  bmGroupBookMarkId!: number;

  @ManyToOne(type => BmGroup, bmGroup => bmGroup.bmGroupBookMarks, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bm_group_id' })
  // FK: bmGroup(N) : bmGroupBookMark(1)
  bmGroup!: BmGroup;

  @ManyToOne(type => BookMark, bookMark => bookMark.bmGroupBookMarks, { nullable: false })
  @JoinColumn({ name: 'book_mark_id' })
  // FK: bookMark(N) bmGroupBookMark(1)
  bookMark!: BookMark;

  @CreateDateColumn({
    name: 'created_at',
    select: false,
    comment: '생성일',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_ad',
    select: false,
    comment: '수정일',
  })
  updatedAt!: Date;
}
