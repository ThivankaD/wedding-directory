import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddReviewImagesAndMentions1762000000000 implements MigrationInterface {
  name = "AddReviewImagesAndMentions1762000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "review",
      new TableColumn({
        name: "image_urls",
        type: "text",
        isArray: true,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      "review",
      new TableColumn({
        name: "mentioned_service_id",
        type: "uuid",
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      "review",
      new TableForeignKey({
        columnNames: ["mentioned_service_id"],
        referencedTableName: "service",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("review");
    const mentionFk = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes("mentioned_service_id"),
    );

    if (mentionFk) {
      await queryRunner.dropForeignKey("review", mentionFk);
    }

    await queryRunner.dropColumn("review", "mentioned_service_id");
    await queryRunner.dropColumn("review", "image_urls");
  }
}
