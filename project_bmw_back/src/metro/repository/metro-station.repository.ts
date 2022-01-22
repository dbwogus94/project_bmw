import { CreateMetroStationDto } from '@metro/dto/request/create-metro-station-dto';
import { Metro } from '@metro/entities/Metro.entity';
import { MetroStation } from '@metro/entities/MetroStation.entity';
import { EntityRepository, Repository } from 'typeorm';

export interface IMetroStationRepository {}

@EntityRepository(MetroStation)
export class MetroStationRepository extends Repository<MetroStation> implements IMetroStationRepository {}
