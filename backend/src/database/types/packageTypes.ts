import { Repository } from "typeorm";
import { PackageEntity } from "../entities/package.entity";

export type PackageRepositoryType = Repository<PackageEntity> & {
    createPackage: (input: Partial<PackageEntity>, serviceId: string) => Promise<PackageEntity>;
    updatePackage: (input: Partial<PackageEntity>) => Promise<PackageEntity>;
    deletePackage: (id: string) => Promise<PackageEntity>;
    findPackageByService: (serviceId: string) => Promise<PackageEntity[]>;
}