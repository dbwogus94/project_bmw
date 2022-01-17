import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';

/**
 * typeorm key 명명규칙 변경에 사용되는 Strategy class
 */
export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  // 인식인됨
  // primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
  //   const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
  //   const columnsSnakeCase = columnNames.join('-');
  //   return `PK-${table}-${columnsSnakeCase}`;
  // }
  // 인식인됨
  // uniqueConstraintName(tableOrName: Table | string, columnNames: string[]) {
  //   const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
  //   const columnsSnakeCase = columnNames.join('-');
  //   return `UIX-${table}-${columnsSnakeCase}`;
  // }

  /**
   * FK명 전략
   * @param tableOrName 자식_테이블명
   * @param columnNames 자식_테이블_FK_컬럼명 배열
   * @param referencedTablePath 부모_테이블명
   * @param referencedColumnNames 부모_테이블명_PK_컬럼명 배열
   * @returns
   * ex)'FK-${부모_테이블명}-${자식_테이블명}'
   */
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ) {
    // FK-${부모_테이블명}-${자식_테이블명}
    return `FK-${referencedTablePath}-${tableOrName}`;
  }

  /**
   * 인덱스명 전략
   * @param tableOrName 테이블명
   * @param columns 인덱스로 지정된 컬럼명 배열
   * @param where
   * @returns
   * ex) 유니크 index 명: UIX-${테이블명}-${컬럼명1}-${컬럼명2}...
   */
  indexName(tableOrName: Table | string, columns: string[], where?: string) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columns.join('-');
    // 유니크 index 명: UIX-${테이블명}-${컬럼명1}-${컬럼명2}...
    return `UIX-${table}-${columnsSnakeCase}`;
  }
}
