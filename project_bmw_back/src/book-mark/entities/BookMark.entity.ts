import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';

export interface IBookMark {
  bookMarkId: number;
  checkColumn: string;

  /* client 사용 */
  routeId: number;
  stationSeq: number;
  stationId: number;
  label: 'B' | 'M';
  routeName: string;
  stationName: string;
  direction: string;
  type: 'seoul' | 'gyeonggi';

  /* 선택 */
  startStationName: string;
  endStationName: string;
  routeTypeCd: number;
  routeTypeName: string;
  regionName: string;
  districtCd: number;
  districtName: string;
  minTerm: number;
  maxTerm: number;
  companyId: number;
  companyName: string;
  companyTel: string;

  /* */
  createdAt: Date;
  updatedAt: Date;
  bmGroupBookMarks: BmGroupBookMark[];
}

@Entity({ name: 'book_mark' })
export class BookMark implements IBookMark {
  @PrimaryGeneratedColumn({ comment: 'bookMark PK' })
  bookMarkId!: number;

  @Column('varchar', {
    length: 100,
    unique: true,
    nullable: false,
    comment: '중복된 데이터 체크용 컬럼:  String(routeId) + String(stationSeq) + String(stationId)',
  })
  checkColumn!: string;

  @Column('int', { comment: '노선ID' })
  routeId!: number;

  @Column('int', { comment: '경유정류소(역) 순서' })
  stationSeq!: number;

  @Column('int', { comment: '정유소(역) ID' })
  stationId!: number;

  @Column('varchar', { length: 2, comment: '버스(B), 지하철(M) 구분용 라벨' })
  label!: 'B' | 'M';

  @Column('varchar', { length: 60, comment: '노선이름' })
  routeName!: string;

  @Column('varchar', { length: 300, comment: '정류소(역) 이름' })
  stationName!: string;

  @Column('varchar', { length: 200, comment: '노선진행방향' })
  direction!: string;

  @Column('varchar', { length: 20, comment: 'Open API 종류' })
  type!: 'seoul' | 'gyeonggi';

  /* 데이터 저장용  
  - select: false가 부여된 컬럼은 typeOrm 사용시 일반적인 방법으로는 조회하지 못한다.
  - createQueryBuilder()에서 select()나 addSelect()을 사용하여 명시적으로 선언해야 사용이 가능하다.
  */
  @Column('varchar', { length: 300, comment: '기점정류소명', select: false })
  startStationName!: string;

  @Column('varchar', { length: 300, comment: '종점정류소명', select: false })
  endStationName!: string;

  @Column('int', { comment: '노선종류코드' })
  routeTypeCd!: number;

  @Column('varchar', { length: 60, comment: '노선종류이름', select: false })
  routeTypeName!: string;

  @Column('varchar', { length: 60, comment: '노선운행지역명', select: false })
  regionName!: string;

  @Column('int', { comment: '관할지역코드(1: 서울, 2: 경기, 3: 인천)', select: false })
  districtCd!: number;

  @Column('varchar', { length: 6, comment: '관할지역명', select: false })
  districtName!: string;

  @Column('int', { comment: '최소배차시간', select: false })
  minTerm!: number;

  @Column('int', { comment: '최대배차시간', select: false })
  maxTerm!: number;

  @Column('int', { nullable: true, comment: '운수업체ID', select: false })
  companyId!: number;

  @Column('varchar', { length: 200, comment: '운수업체명', select: false })
  companyName!: string;

  @Column('varchar', { length: 50, comment: '운수업체 전화번호', select: false })
  companyTel!: string;

  /* 시스템 사용 */
  @CreateDateColumn({ comment: '생성일' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정일' })
  updatedAt!: Date;

  @OneToMany(type => BmGroupBookMark, bmGroupBookMark => bmGroupBookMark.bookMark)
  bmGroupBookMarks!: BmGroupBookMark[];
}
