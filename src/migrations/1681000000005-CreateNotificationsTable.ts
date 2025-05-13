import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateNotificationsTable1681000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('notifications');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'notifications',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'user_id',
              type: 'int',
            },
            {
              name: 'message',
              type: 'varchar',
            },
            {
              name: 'type',
              type: 'varchar',
              default: `'info'`,
            },
            {
              name: 'is_seen',
              type: 'boolean',
              default: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'notifications',
        new TableForeignKey({
          columnNames: ['list_id'],
          referencedTableName: 'lists',
          referencedColumnNames: ['list_id'],
          onDelete: 'CASCADE',
        }),
      );
    }




  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*await queryRunner.dropTable('notifications');*/
  }
}
