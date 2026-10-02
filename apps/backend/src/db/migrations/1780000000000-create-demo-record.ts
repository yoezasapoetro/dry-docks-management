import type { DataSource, MigrationInterface, QueryRunner } from 'typeorm'

// TypeORM requires a class exposing `up` and `down`. It is individually
// reversible so the schema can be restored without a code change (Principle VII).
// v1 is additive only: no DROP COLUMN, RENAME, or type narrowing appears here.
export class CreateDemoRecord1780000000000 implements MigrationInterface {
  name = 'CreateDemoRecord1780000000000'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`demo_record\` (
        \`id\` CHAR(36) NOT NULL,
        \`label\` VARCHAR(120) NOT NULL,
        \`note\` VARCHAR(500) NULL,
        \`attachment_key\` VARCHAR(512) NULL,
        \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    await queryRunner.query(
      'CREATE INDEX `idx_demo_record_created_at` ON `demo_record` (`created_at`)'
    )
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `idx_demo_record_created_at` ON `demo_record`')
    await queryRunner.query('DROP TABLE `demo_record`')
  }
}