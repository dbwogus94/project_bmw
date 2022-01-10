import { IBmGroup } from '@bmGroup/entities/BmGroup.entity';
import { BookMarkDto } from '@bookMark/dto/response/book-mark.dto';
import { Transform, Type } from 'class-transformer';

/**
 * 응답에 사용되는 dto
 */
export class BmGroupDto {
  public bmGroupId!: number;
  public bmGroupName!: string;

  private constructor(data: any) {
    const { bmGroupId, bmGroupName } = data;
    this.bmGroupId = bmGroupId;
    this.bmGroupName = bmGroupName;
  }

  /**
   * BmGroup 엔티티를 BmGroupDto로 변환
   * @param entity
   * @returns
   */
  public static entityToDto(entity: IBmGroup): BmGroupDto {
    const { bmGroupId, bmGroupName } = entity;
    return new BmGroupDto({ bmGroupId, bmGroupName });
  }
}
