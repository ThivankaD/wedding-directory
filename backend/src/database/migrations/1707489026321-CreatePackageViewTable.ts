import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class CreatePackageViewTable1707489026321 implements MigrationInterface {
    name = 'CreatePackageViewTable1707489026321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create package_view table
        await queryRunner.createTable(
            new Table({
                name: "package_view",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "package_id",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "visitor_id",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "session_id",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "ip_address",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Create index on package_id for faster queries
        await queryRunner.createIndex(
            "package_view",
            new TableIndex({
                name: "IDX_PACKAGE_VIEW_PACKAGE_ID",
                columnNames: ["package_id"],
            })
        );

        // Create index on created_at for date-based queries
        await queryRunner.createIndex(
            "package_view",
            new TableIndex({
                name: "IDX_PACKAGE_VIEW_CREATED_AT",
                columnNames: ["created_at"],
            })
        );

        // Create foreign key to package table
        await queryRunner.createForeignKey(
            "package_view",
            new TableForeignKey({
                columnNames: ["package_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "package",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key
        const table = await queryRunner.getTable("package_view");
        const foreignKey = table?.foreignKeys.find(
            fk => fk.columnNames.indexOf("package_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("package_view", foreignKey);
        }

        // Drop indexes
        await queryRunner.dropIndex("package_view", "IDX_PACKAGE_VIEW_PACKAGE_ID");
        await queryRunner.dropIndex("package_view", "IDX_PACKAGE_VIEW_CREATED_AT");

        // Drop table
        await queryRunner.dropTable("package_view");
    }
}
