import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCardsTable1681000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('cards');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'cards',
          columns: [
            {
              name: 'card_id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'title', type: 'varchar' },
            { name: 'description', type: 'text', isNullable: true },
            { name: 'due_date', type: 'datetime', isNullable: true },
            { name: 'position', type: 'int' },
            { name: 'file_path', type: 'varchar', isNullable: true },
            { name: 'list_id', type: 'int' },
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
        'cards',
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
    /*await queryRunner.dropTable('cards');*/
  }
}
