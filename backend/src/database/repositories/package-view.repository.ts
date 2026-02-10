import { DataSource } from "typeorm";
import { PackageViewEntity } from "../entities/package-view.entity";

export const PackageViewRepository = (dataSource: DataSource) =>
  dataSource.getRepository(PackageViewEntity).extend({

    async createView(input: Partial<PackageViewEntity>, packageId: string): Promise<PackageViewEntity> {
      const repo = this as any;
      const view = repo.create({ ...input, package: { id: packageId } });
      return repo.save(view);
    },

    async countUniqueViewsByPackage(packageId: string): Promise<number> {
      // Use raw SQL to count distinct identifiers (visitorId, sessionId, ipAddress)
      const sql = `SELECT COUNT(DISTINCT COALESCE(visitor_id, session_id, ip_address)) AS count FROM package_view WHERE package_id = $1`;
      const result: any = await (this.manager.query as any)(sql, [packageId]);
      return parseInt(result[0]?.count || 0, 10);
    },

    async countUniqueViewsByPackages(packageIds: string[]): Promise<number> {
      // Count unique visitors across multiple packages (same person viewing multiple packages = 1 unique visitor)
      if (packageIds.length === 0) return 0;
      const sql = `SELECT COUNT(DISTINCT COALESCE(visitor_id, session_id, ip_address)) AS count FROM package_view WHERE package_id = ANY($1)`;
      const result: any = await (this.manager.query as any)(sql, [packageIds]);
      return parseInt(result[0]?.count || 0, 10);
    },

    async findMonthlyViews(packageId: string, monthsBack = 6) {
      const since = new Date();
      since.setMonth(since.getMonth() - monthsBack + 1);
      const sql = `
        SELECT to_char(created_at, 'Mon') as month, COUNT(*) as views
        FROM package_view
        WHERE package_id = $1 AND created_at >= $2
        GROUP BY month, date_trunc('month', created_at)
        ORDER BY date_trunc('month', created_at)
      `;
      const rows: any[] = await (this.manager.query as any)(sql, [packageId, since.toISOString()]);
      return rows.map(r => ({ month: r.month, views: parseInt(r.views, 10) }));
    }

  });
