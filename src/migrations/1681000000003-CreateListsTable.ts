import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateListsTable1681000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('lists');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'lists',
          columns: [
            {
              name: 'list_id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'title', type: 'varchar' },
            { name: 'position', type: 'int' },
            { name: 'board_id', type: 'int' },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'lists',
        new TableForeignKey({
          columnNames: ['board_id'],
          referencedTableName: 'boards',
          referencedColumnNames: ['board_id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /*await queryRunner.dropTable('lists');*/
  }
}
