import { getCustomRepository } from 'typeorm';
import { MetroDto } from './dto/response/metro.dto';
import { Metro } from './entities/Metro.entity';
import { MetroRepository } from './repository/metro.repository';

export interface IMetroService {
  findMetros(): Promise<MetroDto[]>;
  searchMetrosByStationName(stationName: string): Promise<MetroDto[]>;
  findOneByIdToEntityTree(routeId: number): Promise<MetroDto | undefined>;
}

export class MetroService implements IMetroService {
  /**
   * 모든 지하철 노선 조회
   * @returns
   */
  async findMetros(): Promise<MetroDto[]> {
    const metroRepository: MetroRepository = getCustomRepository(MetroRepository);
    const metros: Metro[] = await metroRepository.findMetros();
    return metros.map(metro => MetroDto.entityToDto(metro));
    // return plainToClass(MetroDto, metros, { exposeDefaultValues: true });
  }

  /**
   * 역 이름으로 역을 검색하고, 검색된 역을 가지는 노선을 조회한다.
   * - 노선에 검색된 역이 포함된 결과로 리턴한다.
   * @param stationName
   * @returns
   */
  async searchMetrosByStationName(stationName: string): Promise<MetroDto[]> {
    const metroRepository: MetroRepository = getCustomRepository(MetroRepository);
    const metros: Metro[] = await metroRepository.findMetrosByStationName(stationName);
    return metros.map(metro => MetroDto.entityToDto(metro));
    // return plainToClass(MetroDto, metros, { exposeDefaultValues: true });
  }

  /**
   * metroId와 일치하는 노선을 조회한다. 이때 노선에 포함되는 역을 함께 조회한다.
   * @param routeId
   * @returns
   */
  async findOneByIdToEntityTree(routeId: number): Promise<MetroDto | undefined> {
    const metroRepository: MetroRepository = getCustomRepository(MetroRepository);
    const metro: Metro | undefined = await metroRepository.findOneByIdToEntityTree(routeId);
    return metro ? MetroDto.entityTreeToDto(metro) : undefined;
  }
}
