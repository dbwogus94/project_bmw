import { StationDto } from './station.dto';

export class SeoulStationDto extends StationDto {
  constructor(data: any) {
    const { stId, stNm, arsId } = data;
    super(
      stId, // 정류소 ID
      stNm, // 정류소 명
      arsId, // mobileNo 정류소 고유번호
      1,
      '서울',
      'seoul',
    );
  }
}
