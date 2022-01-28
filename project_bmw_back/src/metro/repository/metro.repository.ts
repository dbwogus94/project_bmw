import { CreateMetroDto } from '@metro/dto/request/create-metro.dto';
import { IMetro, Metro } from '@metro/entities/Metro.entity';
import { DateUtil } from '@shared/util';
import { EntityRepository, InsertResult, Repository } from 'typeorm';

const { dateToString, getDayNum } = DateUtil;

export interface IMetroRepository {
  insertMay(metros: CreateMetroDto[]): Promise<InsertResult>;
  findMetros(): Promise<IMetro[]>;
  findMetrosByStationName(stationName: string): Promise<IMetro[]>;
  findOneByIdToEntityTree(routeId: number): Promise<IMetro | undefined>;
  findArrivalInfo(routeId: number, stationId: number, inOutTag: string): Promise<IMetro | undefined>;
}

@EntityRepository(Metro)
export class MetroRepository extends Repository<Metro> implements IMetroRepository {
  /**
   *  Metro와 자식 entity인 metroStations를 모두 insert
   * - one to many 관계에서 부모객체에 포함되는 자식 entity를 모두 insert한다.
   * - QueryBuilder를 사용
   * @param metros
   * @returns
   */
  async insertMay(metros: CreateMetroDto[]): Promise<InsertResult> {
    return this.createQueryBuilder().insert().into(Metro).values(metros).execute();
  }

  /**
   * 순수 Metro 모두 조회
   * @returns
   */
  async findMetros(): Promise<Metro[]> {
    return this.find();
  }

  /**
   * stationName과 일치하는 MetroStation을 찾고, 찾은 MetroStation을 가지는 Metro를 Entity Tree 형태로 조회한다.
   * @param stationName - 검색할 역이름, Like를 사용하여 조회
   * @returns
   */
  async findMetrosByStationName(stationName: string): Promise<IMetro[]> {
    return this.createQueryBuilder('m')
      .leftJoinAndSelect('m.metroStations', 'ms')
      .where('ms.stationName Like :stationName', { stationName: `%${stationName}%` })
      .orderBy('m.id', 'ASC')
      .getMany();
  }

  /**
   * metroId에 일치하는 Metro를 Entity Tree 형태로 조회한다.
   * @param routeId
   * @returns
   */
  async findOneByIdToEntityTree(routeId: number): Promise<IMetro | undefined> {
    return this.createQueryBuilder('m')
      .leftJoinAndSelect('m.metroStations', 'ms')
      .where('m.routeId = :routeId', { routeId })
      .orderBy('ms.stationSeq', 'ASC')
      .getOne();
  }

  async findArrivalInfo(routeId: number, stationId: number, inOutTag: string): Promise<IMetro | undefined> {
    // 공휴일 체크
    const iskorHoliday = false;
    // 주말/공휴일(3), 토요일(2), 평일(1)
    const weekTag = getDayNum() === 0 || iskorHoliday ? 3 : getDayNum() === 6 ? 2 : 1;
    return this.createQueryBuilder('m')
      .leftJoinAndSelect('m.metroStations', 'ms')
      .leftJoinAndSelect('ms.metroTimetables', 'mt')
      .where('m.routeId = :routeId', { routeId })
      .andWhere('ms.stationId = :stationId', { stationId })
      .andWhere('mt.inOutTag = :inOutTag', { inOutTag })
      .andWhere('mt.weekTag = :weekTag', { weekTag })
      .andWhere('mt.arriveTime > :arriveTime', { arriveTime: dateToString('HH:mm:ss') })
      .orderBy('mt.arriveTime', 'ASC')
      .limit(2)
      .offset(0)
      .getOne();
  }
}
