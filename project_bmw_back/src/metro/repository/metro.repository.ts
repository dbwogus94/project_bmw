import { CreateMetroDto } from '@metro/dto/request/create-metro.dto';
import { Metro } from '@metro/entities/Metro.entity';
import { EntityRepository, InsertResult, Repository } from 'typeorm';

export interface IMetroRepository {
  insertMay(metros: CreateMetroDto[]): Promise<InsertResult>;
}

@EntityRepository(Metro)
export class MetroRepository extends Repository<Metro> implements IMetroRepository {
  //
  async insertMay(metros: CreateMetroDto[]) {
    return this.createQueryBuilder().insert().into(Metro).values(metros).execute();
  }
}
