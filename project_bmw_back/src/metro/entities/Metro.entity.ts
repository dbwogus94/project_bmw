import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MetroStation } from './MetroStation.entity';

export interface IMetro {
  metroId: number;
  metroName: string;
  metroCd: string;
  districtCd: number;
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

  @Column('varchar', {
    name: 'metro_cd',
    length: 30,
    unique: true,
    comment: '노선 구분 코드',
  })
  metroCd!: string;

  @Column('int', {
    name: 'district_cd',
    comment: '지하철 운행 지역',
  })
  districtCd!: number;

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
  @OneToMany(type => MetroStation, metroStation => metroStation.metro, {
    cascade: true, // 부모를 통해 자식 entity 추가 가능하도록 설정
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  metroStations!: MetroStation[];
}
