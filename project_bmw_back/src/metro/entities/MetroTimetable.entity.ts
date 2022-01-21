import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MetroStation } from './MetroStation.entity';

export interface IMetroTimetable {
  timetableId: number;
  metroStation: MetroStation;
  trainNo: string;

  arriveTime: string;
  leftTime: string;

  originStationCd: string;
  originStationName: string;
  destStationCd: string;
  destStationName: string;

  weekTag: string;
  inOutTag: string;
  expressTag: string;
  //
  flFlag: string;
  destStationCd2: string;
  branchLine: string;

  createdAt: Date;
  updatedAt: Date;
}

@Entity({ name: 'metro_timetable' })
export class MetroTimetable implements IMetroTimetable {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'metro_timetable pk',
  })
  timetableId!: number;

  @ManyToOne(type => MetroStation, metroStation => metroStation.metroTimetables)
  @JoinColumn({ name: 'metro_station_id' })
  metroStation!: MetroStation;

  @Column('varchar', {
    name: 'train_no',
    length: 10,
    comment: '열차번호',
  })
  trainNo!: string;

  @Column('varchar', {
    name: 'arrive_time',
    length: 12,
    comment: '역 도착시간',
  })
  arriveTime!: string;

  @Column('varchar', {
    name: 'left_time',
    length: 12,
    comment: '역 출발시간',
  })
  leftTime!: string;

  @Column('varchar', {
    name: 'origin_station_cd',
    length: 10,
    comment: '기점 지하철역 코드',
  })
  originStationCd!: string;

  @Column('varchar', {
    name: 'origin_station_name',
    length: 120,
    comment: '기점 지하철역 명',
  })
  originStationName!: string;

  @Column('varchar', {
    name: 'dest_station_cd',
    length: 10,
    comment: '종점 지하철역 코드',
  })
  destStationCd!: string;

  @Column('varchar', {
    name: 'dest_station_name',
    length: 120,
    comment: '종점 지하철역 명',
  })
  destStationName!: string;

  @Column('varchar', {
    name: 'week_tag',
    length: 2,
    comment: '요일 구분 태그(평일:1, 토요일:2, 휴일/일요일:3)',
  })
  weekTag!: string;

  @Column('varchar', {
    name: 'in_out_tag',
    length: 2,
    comment: '운행방향 구분 태그(상행,내선:1, 하행,외선:2)',
  })
  inOutTag!: string;

  @Column('varchar', {
    name: 'express_tag',
    length: 2,
    comment: '급행선 구분 태그(G:일반(general) D: 급행(direct))',
  })
  expressTag!: string;

  @Column('varchar', {
    name: 'fl_flag',
    length: 30,
    nullable: true,
    comment: '플러그',
  })
  flFlag!: string;

  @Column('varchar', {
    name: 'dest_station_cd2',
    length: 30,
    nullable: true,
    comment: '도착역 코드2',
  })
  destStationCd2!: string;

  @Column('varchar', {
    name: 'branch_line',
    length: 30,
    nullable: true,
    comment: '지선',
  })
  branchLine!: string;

  @CreateDateColumn({
    name: 'created_at',
    comment: '생성일',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '수정일',
  })
  updatedAt!: Date;
}
