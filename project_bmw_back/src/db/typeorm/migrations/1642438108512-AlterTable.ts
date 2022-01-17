import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTable1642438108512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE bmgroup_bookmark_map ADD UNIQUE \`UIX-bmgroup_bookmark_map-bm_group_id-book_mark_id\` (bm_group_id, book_mark_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
