import { UserRepository } from '@user/repository/user.repositroy';
import { getCustomRepository } from 'typeorm';
import { TreeBmGroupDto } from './dto/response/tree-bm-group.dto';
import { BmGroupDto } from './dto/response/bm-group.dto';
import { IBmGroup } from './entities/BmGroup.entity';
import { BmGroupRepository } from './repository/bm-group.repository';
import { HttpError } from '@shared/http.error';

export interface IBmGroupService {
  findById(userId: number): Promise<BmGroupDto[]>;
  findBmGroupsToEntityTree(userId: number): Promise<TreeBmGroupDto[]>;
  searchBmGroupsToEntityTree(userId: number, checkColumn: string): Promise<TreeBmGroupDto[]>;
  findOneById(userId: number, bmGroupId: number): Promise<BmGroupDto | undefined>;
  findOneByIdToEntityTree(userId: number, bmGroupId: number): Promise<TreeBmGroupDto | undefined>;
  createBmGroup(userId: number, bmGroupName: string): Promise<BmGroupDto>;
  deleteBmGroup(userId: number, bmGroupId: number): Promise<void>;
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
  public async findBmGroupsToEntityTree(userId: number): Promise<TreeBmGroupDto[]> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const entities = await bmGroupRepository.gatBmGroupsToEntityTree(userId);
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
  public async searchBmGroupsToEntityTree(userId: number, checkColumn: string): Promise<TreeBmGroupDto[]> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const rawDatas = await bmGroupRepository.searchBmGroupsToEntityRowData(userId, checkColumn);
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
  public async findOneByIdToEntityTree(userId: number, bmGroupId: number): Promise<TreeBmGroupDto | undefined> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);
    const entity = await bmGroupRepository.findOneByIdToEntityTree(userId, bmGroupId);
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

  /**
   * 로그인 유저의 bmGroup 삭제
   * @param userId
   * @param bmGroupId
   */
  public async deleteBmGroup(userId: number, bmGroupId: number): Promise<void> {
    const bmGroupRepository: BmGroupRepository = getCustomRepository(BmGroupRepository);

    const result = await bmGroupRepository.deleteOne(userId, bmGroupId);
    const { affected } = result!;
    if (!affected) {
      throw new HttpError(404, 'deleteBmGroup');
    }
  }
}
