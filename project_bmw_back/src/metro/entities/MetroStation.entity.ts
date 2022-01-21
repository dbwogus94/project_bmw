import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Metro } from './Metro.entity';
import { MetroTimetable } from './MetroTimetable.entity';

export interface IMetroStation {
  id: number;
  metro: Metro;
  stationName: string;
  stationCd: string; // 지하철 역 코드
  stationFrCode: string; // 지하철 역 외부 코드
  stationSeq: number;
  createdAt: Date;
  updatedAt: Date;
}

@Entity({ name: 'metro_station' })
export class MetroStation implements IMetroStation {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'metro_station pk',
  })
  id!: number;

  // FK: metro 테이블과 metro_station 테이블 N:1 관계설정
  @ManyToOne(type => Metro, metro => metro.metroStations)
  @JoinColumn({ name: 'metro_id' })
  metro!: Metro;

  @Column('varchar', {
    name: 'station_name',
    length: 120,
    comment: '지하철역 명',
  })
  stationName!: string;

  @Column('varchar', {
    name: 'station_cd',
    length: 10,
    unique: true,
    nullable: false,
    comment: '지하철역 코드',
  })
  stationCd!: string;

  @Column('varchar', {
    name: 'station_fr_Code',
    length: 20,
    unique: true,
    nullable: false,
    comment: '지하철역 외부 코드',
  })
  stationFrCode!: string;

  @Column('int', {
    name: 'station_seq',
    comment: '노선별 정류장 순서',
  })
  stationSeq!: number;

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

  @OneToMany(type => MetroTimetable, metroTimetable => metroTimetable.metroStation)
  metroTimetables!: MetroTimetable[];
}
