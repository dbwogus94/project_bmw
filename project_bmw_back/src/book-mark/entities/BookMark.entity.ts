import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';

export interface IBookMark {
  bookMarkId: number;
  routeId: number;
  stationSeq: number;
  stationId: number;
  label: 'B' | 'M';
  routeName: string;
  stationName: string;
  direction: string;
  routeTypeName: string;
  type: 'seoul' | 'gyeonggi';
  createdAt: Date;
  updatedAt: Date;
  bmGroupBookMarks: BmGroupBookMark[];
}

@Entity({ name: 'book_mark' })
export class BookMark implements IBookMark {
  @PrimaryGeneratedColumn({ comment: 'bookMark PK' })
  bookMarkId!: number;

  @Column('int', { comment: '노선 ID' })
  routeId!: number;

  @Column('int', { comment: '경유 정류소(역) 순서' })
  stationSeq!: number;

  @Column('int', { comment: '정유소(역) ID' })
  stationId!: number;

  @Column('varchar', { length: 2, comment: '버스(B), 지하철(M) 구분용 라벨' })
  label!: 'B' | 'M';

  @Column('varchar', { length: 60, comment: '노선 이름' })
  routeName!: string;

  @Column('varchar', { length: 300, comment: '정류소(역) 이름' })
  stationName!: string;

  @Column('varchar', { length: 200, comment: '노선 진행 방향' })
  direction!: string;

  @Column('varchar', { length: 60, comment: '노선 종류(타입)' })
  routeTypeName!: string;

  @Column('varchar', { length: 20, comment: 'Open API 종류' })
  type!: 'seoul' | 'gyeonggi';

  @CreateDateColumn({ comment: '생성일' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정일' })
  updatedAt!: Date;

  @OneToMany(type => BmGroupBookMark, bmGroupBookMark => bmGroupBookMark.bookMark)
  bmGroupBookMarks!: BmGroupBookMark[];
}
