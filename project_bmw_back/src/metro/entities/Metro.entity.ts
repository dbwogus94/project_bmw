import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MetroStation } from './MetroStation.entity';

export interface IMetro {
  metroId: number;
  metroName: string;
  districtCd: number;
  company: string;
  createdAt: Date;
  updatedAt: Date;
}

@Entity({ name: 'metro' })
export class Metro implements IMetro {
  @PrimaryGeneratedColumn({
    name: 'id',
    comment: 'metro pk',
  })
  metroId!: number;

  @Column('varchar', {
    name: 'metro_name',
    length: 30,
    comment: '지하철 이름',
  })
  metroName!: string;

  @Column('int', {
    name: 'district_cd',
    comment: '지하철 운행 지역',
  })
  districtCd!: number;

  @Column('varchar', {
    name: 'company',
    length: 30,
    comment: '지하철 운행사',
  })
  company!: string;

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

  // 연관관계 설정: Metro(1): MetroStation(N)
  @OneToMany(type => MetroStation, metroStation => metroStation.metro)
  metroStations!: MetroStation[];
}
