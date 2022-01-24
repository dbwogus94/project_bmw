import { plainToClass } from 'class-transformer';
import { getCustomRepository } from 'typeorm';
import { MetroDto } from './dto/response/metro.dto';
import { MetroRepository } from './repository/metro.repository';

export interface IMetroService {
  findMetros(): Promise<MetroDto[]>;
  searchMetrosByStationName(stationName: string): Promise<MetroDto[]>;
  findOneByIdToEntityTree(metroId: number): Promise<MetroDto | undefined>;
}

export class MetroService implements IMetroService {
  /**
   * 모든 지하철 노선 조회
   * @returns
   */
  async findMetros(): Promise<MetroDto[]> {
    const metroRepository: MetroRepository = getCustomRepository(MetroRepository);
    const metros = await metroRepository.findMetros();
    return plainToClass(MetroDto, metros);
  }

  /**
   * 역 이름으로 역을 검색하고, 검색된 역을 가지는 노선을 조회한다.
   * - 노선에 검색된 역이 포함된 결과로 리턴한다.
   * @param stationName
   * @returns
   */
  async searchMetrosByStationName(stationName: string): Promise<MetroDto[]> {
    const metroRepository: MetroRepository = getCustomRepository(MetroRepository);
    const metros = await metroRepository.findMetrosByStationName(stationName);
    return plainToClass(MetroDto, metros);
  }

  /**
   * metroId와 일치하는 노선을 조회한다. 이때 노선에 포함되는 역을 함께 조회한다.
   * @param metroId
   * @returns
   */
  async findOneByIdToEntityTree(metroId: number): Promise<MetroDto> {
    const metroRepository: MetroRepository = getCustomRepository(MetroRepository);
    const metro = await metroRepository.findOneByIdToEntityTree(metroId);
    return plainToClass(MetroDto, metro);
  }
}
