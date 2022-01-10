import { UserRepository } from '@user/repository/user.repositroy';
import { getCustomRepository } from 'typeorm';
import { TreeBmGroupDto } from './dto/response/tree-bm-group.dto';
import { BmGroupDto } from './dto/response/bm-group.dto';
import { IBmGroup } from './entities/BmGroup.entity';
import { BmGroupRepository } from './repository/bm-group.repository';

export interface IBmGroupService {
  findById(userId: number): Promise<BmGroupDto[]>;
  findBmGroupsWithEntityTree(userId: number): Promise<TreeBmGroupDto[]>;
  searchBmGroupsWithEntityTree(userId: number, checkColumn: string): Promise<TreeBmGroupDto[]>;
  findOneById(userId: number, bmGroupId: number): Promise<BmGroupDto | undefined>;
  findOneByIdWithEntityTree(userId: number, bmGroupId: number): Promise<TreeBmGroupDto | undefined>;
  createBmGroup(userId: number, bmGroupName: string): Promise<BmGroupDto>;
}

export class BmGroupService implements IBmGroupService {
  constructor() {}

  /**
   * 로그인한 유저의 BmGroup 리스트를 조회
   * - 연관관계 미포함
   * @param userId
   * @returns
   * - BmGroupDto[]
   ```
   [
     { bmGroupId, bmGroupName }
     { bmGroupId, bmGroupName },
     ...
   ]
   ```
   */
  public async findById(userId: number): Promise<BmGroupDto[]> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const entities = await bmGroupRepository.findById(userId);
    return entities.map(entity => BmGroupDto.entityToDto(entity));
  }

  /**
   * 로그인한 유저의 BmGroup 리스트 리턴
   * - 연관관계 포함
   * @param userId
   * @returns
   * - TreeBmGroupDto[]
   ```
    [
      { bmGroupId, bmGroupName, bookMarks: BookMarkDto[] }
      { bmGroupId, bmGroupName, bookMarks: BookMarkDto[] }
    ]
   ```
   */
  public async findBmGroupsWithEntityTree(userId: number): Promise<TreeBmGroupDto[]> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const entities = await bmGroupRepository.gatBmGroupsWithEntityTree(userId);
    return entities.map((entity): any => TreeBmGroupDto.entityTreeToDto(entity));
  }

  /**
   * 로그인한 유저의 모든 bmGroup 리스트 + checkColumn와 일치하는 bookMark를 포함하여 조회
   * - 연관관계 포함
   * @param userId
   * @param checkColumn
   * @returns
   * - TreeBmGroupDto[]
   ```
    [
      { bmGroupId, bmGroupName, bookMarks: BookMarkDto[] },
      { bmGroupId, bmGroupName, bookMarks: BookMarkDto[] }
    ]
   ```
   */
  public async searchBmGroupsWithEntityTree(userId: number, checkColumn: string): Promise<TreeBmGroupDto[]> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const rawDatas = await bmGroupRepository.searchBmGroupsWithEntityRowData(userId, checkColumn);
    return Promise.all(rawDatas.map((rowData: IBmGroup) => TreeBmGroupDto.rawDataToDto(rowData)));
  }

  /**
   * 로그인한 유저Id + bmGroupId를 사용하여 BM 그룹을 조회
   * - 연관관계 미포함
   * @param userId
   * @param bmGroupId
   * @returns
   * - BmGroupDto
   ```
   { bmGroupId, bmGroupName }
   ```
   */
  public async findOneById(userId: number, bmGroupId: number): Promise<BmGroupDto | undefined> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const entity: IBmGroup | undefined = await bmGroupRepository.findOneById(userId, bmGroupId);
    return entity //
      ? BmGroupDto.entityToDto(entity)
      : undefined;
  }

  /**
   * 로그인한 유저Id + bmGroupId를 사용하여 BmGroup을 조회
   * - 연관관계 포함
   * @param userId
   * @param bmGroupId
   * @returns
   * - TreeBmGroupDto
   ```
   { bmGroupId, bmGroupName, bookMarks: BookMarkDto[] }
   ```
   */
  public async findOneByIdWithEntityTree(userId: number, bmGroupId: number): Promise<TreeBmGroupDto | undefined> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const entity = await bmGroupRepository.findOneByIdWithEntityTree(userId, bmGroupId);
    return entity //
      ? TreeBmGroupDto.entityTreeToDto(entity)
      : undefined;
  }

  /**
   * 로그인한 유저의 bmGroup 생성
   * - 연관관계 미포함
   * @param userId
   * @param bmGroupName
   * @returns
   * - BmGroupDto
   ```
   { bmGroupId, bmGroupName }
   ```
   */
  public async createBmGroup(userId: number, bmGroupName: string): Promise<BmGroupDto> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const userRepository: UserRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findByUserId(userId);
    const bmGroup = bmGroupRepository.create({
      user,
      bmGroupName,
    });
    await bmGroupRepository.save(bmGroup);
    return BmGroupDto.entityToDto(bmGroup);
  }
}
