import { IMetro } from '@metro/entities/Metro.entity';
import { plainToClass } from 'class-transformer';
import { MetroStationDto } from './metro-station.dto';

export class MetroDto {
  routeId!: number;
  metroName!: string;
  metroCd!: string;
  districtCd!: number;
  metroStations?: MetroStationDto[];

  // constructor(entity: IMetro) {
  //   const { routeId, metroName, metroCd, districtCd, metroStations } = entity;
  //   this.routeId = routeId;
  //   this.metroName = metroName;
  //   this.metroCd = metroCd;
  //   this.districtCd = districtCd;
  //   this.metroStations = metroStations //
  //     ? plainToClass(MetroStationDto, metroStations)
  //     : undefined;
  // }
}
