import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';

export interface IBookMark {
  bookMarkId: number;
  checkColumn: string;

  /* client 사용 */
  arsId: string;
  routeId: number;
  stationSeq: number;
  stationId: number;
  label: 'B' | 'M';
  routeName: string;
  stationName: string;
  direction: string;
  regionName: string;
  districtCd: number;
  inOutTag: '1' | '2'; // 상행(1)/ 하행(2)
  type: 'seoul' | 'gyeonggi' | 'data.seoul';

  /* */
  createdAt: Date;
  updatedAt: Date;
  bmGroupBookMarks: BmGroupBookMark[];
}

@Entity({ name: 'book_mark' })
@Unique('UIX-book_mark-route_id-station_seq-station_id', ['routeId', 'stationSeq', 'stationId'])
export class BookMark implements IBookMark {
  @PrimaryGeneratedColumn({ comment: 'bookMark PK', name: 'id' })
  bookMarkId!: number;

  @Column('varchar', {
    name: 'check_column',
    length: 100,
    unique: true,
    nullable: false,
    comment: '조회, 중복체크용 컬럼:  String(routeId) + String(stationSeq) + String(stationId)',
  })
  checkColumn!: string;

  @Column('varchar', {
    name: 'ars_id',
    length: 10,
    comment:
      '경기도 버스: 고유모바일번호(mobileNo) / 서울시 버스: 정류소 고유번호(arsId), 서울시 지하철: 외부 코드(stationFrCode)를 통합으로 관리하는 컬럼',
  })
  arsId!: string;

  @Column('int', {
    name: 'route_id',
    comment: '노선ID',
  })
  routeId!: number;

  @Column('int', {
    name: 'station_seq',
    comment: '경유정류소(역) 순서',
  })
  stationSeq!: number;

  @Column('int', {
    name: 'station_id',
    comment: '정유소(역) ID',
  })
  stationId!: number;

  @Column('varchar', {
    name: 'label',
    length: 2,
    comment: '버스(B), 지하철(M) 구분용 라벨',
  })
  label!: 'B' | 'M';

  @Column('varchar', {
    name: 'route_name',
    length: 60,
    comment: '노선이름',
  })
  routeName!: string;

  @Column('varchar', {
    name: 'station_name',
    length: 300,
    comment: '정류소(역) 이름',
  })
  stationName!: string;

  @Column('varchar', {
    name: 'direction',
    length: 200,
    comment: '진행방향 기준 종점 정류장 이름',
  })
  direction!: string;

  @Column('varchar', {
    name: 'region_name',
    length: 60,
    comment: '노선운행지역명',
  })
  regionName!: string;

  @Column('int', {
    name: 'district_cd',
    comment: '관할지역코드(1: 서울, 2: 경기, 3: 인천)',
  })
  districtCd!: number;

  @Column('varchar', {
    name: 'in_out_tag',
    length: 2,
    comment: '노선 상행(1) 하행(2) 구분 태그',
  })
  inOutTag!: '1' | '2';

  @Column('varchar', {
    name: 'type',
    length: 20,
    comment: 'Open API 종류',
  })
  type!: 'seoul' | 'gyeonggi' | 'data.seoul';

  /* 시스템 사용 */
  @CreateDateColumn({
    name: 'created_at',
    select: false,
    comment: '생성일',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    select: false,
    comment: '수정일',
  })
  updatedAt!: Date;

  @OneToMany(type => BmGroupBookMark, bmGroupBookMark => bmGroupBookMark.bookMark)
  bmGroupBookMarks!: BmGroupBookMark[];
}
