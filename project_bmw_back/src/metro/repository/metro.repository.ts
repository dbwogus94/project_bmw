import { CreateMetroDto } from '@metro/dto/request/create-metro.dto';
import { IMetro, Metro } from '@metro/entities/Metro.entity';
import { MetroStation } from '@metro/entities/MetroStation.entity';
import { EntityRepository, InsertResult, Like, Repository } from 'typeorm';

export interface IMetroRepository {
  insertMay(metros: CreateMetroDto[]): Promise<InsertResult>;
  findMetros(): Promise<IMetro[]>;
  findMetrosByStationName(stationName: string): Promise<IMetro[]>;
  findOneByIdToEntityTree(metroId: number): Promise<IMetro | undefined>;
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
   * @param metroId
   * @returns
   */
  async findOneByIdToEntityTree(metroId: number): Promise<IMetro | undefined> {
    return this.createQueryBuilder('m')
      .leftJoinAndSelect('m.metroStations', 'ms')
      .where('m.metroId = :metroId', { metroId })
      .orderBy('ms.stationSeq', 'ASC')
      .getOne();
  }
}
