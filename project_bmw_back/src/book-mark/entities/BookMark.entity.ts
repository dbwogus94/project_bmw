import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';

export interface IBookMark {
  bookMarkId: number;
  checkColumn: string;

  /* client 사용 */
  arsId: number;
  routeId: number;
  stationSeq: number;
  stationId: number;
  label: 'B' | 'M';
  routeName: string;
  stationName: string;
  direction: string;
  regionName: string;
  districtCd: number;
  districtName: string;
  type: 'seoul' | 'gyeonggi';

  /* 선택 */
  startStationName: string;
  endStationName: string;
  routeTypeCd: number;
  routeTypeName: string;
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

  @Column('int', {
    name: 'ars_id',
    comment: '경기도: 고유모바일번호(mobileNo) / 서울시: 정류소 고유번호(arsId)',
  })
  arsId!: number;

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
    comment: '노선진행방향',
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
    name: 'district_name',
    length: 6,
    comment: '관할지역명',
  })
  districtName!: string;

  @Column('varchar', {
    name: 'type',
    length: 20,
    comment: 'Open API 종류',
  })
  type!: 'seoul' | 'gyeonggi';

  /* 데이터 저장용  
  - select: false가 부여된 컬럼은 typeOrm 사용시 일반적인 방법으로는 조회하지 못한다.
  - createQueryBuilder()에서 select()나 addSelect()을 사용하여 명시적으로 선언해야 사용이 가능하다.
  */
  @Column('varchar', {
    name: 'start_station_name',
    length: 300,
    select: false,
    comment: '기점정류소명',
  })
  startStationName!: string;

  @Column('varchar', {
    name: 'end_station_name',
    length: 300,
    select: false,
    comment: '종점정류소명',
  })
  endStationName!: string;

  @Column('int', {
    name: 'route_type_cd',
    select: false,
    comment: '노선종류코드',
  })
  routeTypeCd!: number;

  @Column('varchar', {
    name: 'route_type_name',
    length: 60,
    select: false,
    comment: '노선종류이름',
  })
  routeTypeName!: string;

  @Column('int', {
    name: 'min_term',
    select: false,
    comment: '최소배차시간',
  })
  minTerm!: number;

  @Column('int', {
    name: 'max_term',
    select: false,
    comment: '최대배차시간',
  })
  maxTerm!: number;

  @Column('int', {
    name: 'company_id',
    nullable: true,
    select: false,
    comment: '운수업체ID',
  })
  companyId!: number;

  @Column('varchar', {
    name: 'company_name',
    length: 200,
    select: false,
    comment: '운수업체명',
  })
  companyName!: string;

  @Column('varchar', {
    name: 'company_tel',
    length: 50,
    select: false,
    comment: '운수업체 전화번호',
  })
  companyTel!: string;

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
