import { IMetroStation } from '@metro/entities/MetroStation.entity';

export class MetroStationDto {
  stationId!: number;
  stationName!: string;
  stationCd!: string; // 지하철 역 코드
  stationFrCode!: string; // 지하철 역 외부 코드
  stationSeq!: number;
  label: 'M' = 'M';

  // constructor(entity: IMetroStation) {
  //   const { stationId, stationName, stationCd, stationFrCode, stationSeq } = entity;
  //   this.stationId = stationId;
  //   this.stationName = stationName;
  //   this.stationCd = stationCd;
  //   this.stationFrCode = stationFrCode;
  //   this.stationSeq = stationSeq;
  // }
}
