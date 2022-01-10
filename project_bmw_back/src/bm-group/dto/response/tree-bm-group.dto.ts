import { IBmGroup } from '@bmGroup/entities/BmGroup.entity';
import { BookMarkDto } from '@bookMark/dto/response/book-mark.dto';
import { Transform, Type } from 'class-transformer';
import { transformAndValidate } from 'class-transformer-validator';

/**
 * 응답에 사용되는 dto
 */
export class TreeBmGroupDto {
  public bmGroupId!: number;
  public bmGroupName!: string;
  public bookMarks!: BookMarkDto[];

  private constructor(data: any) {
    const { bmGroupId, bmGroupName, bookMarks } = data;
    this.bmGroupId = bmGroupId;
    this.bmGroupName = bmGroupName;
    this.bookMarks = bookMarks;
  }

  /**
   * Entity Tree형태의 BmGroup를 BmGroupTreeDto 인스턴스로 변환
   * @param entity
   * @returns
   */
  public static entityTreeToDto(entity: IBmGroup): TreeBmGroupDto {
    const { bmGroupId, bmGroupName, bmGroupBookMarks } = entity;
    const bookMarks = bmGroupBookMarks.map(bmGroupBookMark => {
      const { bookMark } = bmGroupBookMark;
      return bookMark //
        ? bmGroupBookMark.bookMark
        : [];
    });
    return new TreeBmGroupDto({ bmGroupId, bmGroupName, bookMarks });
  }

  /**
   * rawData로 리턴된 쿼리 결과를 BmGroupTreeDto 인스턴스로 변환
   * @param rawDatas
   * @returns
   */
  public static async rawDataToDto(rawData: any): Promise<TreeBmGroupDto> {
    const { bmGroupId, bmGroupName } = rawData;
    const bookMarks = rawData.bookMarkId //
      ? [await transformAndValidate(BookMarkDto, rawData)]
      : [];
    return new TreeBmGroupDto({ bmGroupId, bmGroupName, bookMarks });
  }
}
