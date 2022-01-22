import { EntityRepository, Repository } from 'typeorm';
import { MetroTimetable } from '@metro/entities/MetroTimetable.entity';

export interface IMetroTimetableRepository {}

@EntityRepository(MetroTimetable)
export class MetroTimetableRepository extends Repository<MetroTimetable> implements IMetroTimetableRepository {
  //
}
