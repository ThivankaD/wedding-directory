import { DataSource } from "typeorm";
import { PackageEntity } from "../entities/package.entity";
import { ServiceEntity } from '../entities/service.entity';
import { PackageFeatureEntity } from '../entities/package-feature.entity';

export const PackageRepository = (dataSource: DataSource) =>
  dataSource.getRepository(PackageEntity).extend({

    async createPackage(
      input: Partial<PackageEntity>,
      serviceId: string
    ): Promise<PackageEntity> {
      const service = await dataSource.getRepository(ServiceEntity).findOne({ where: { id: serviceId } });

      if (!service) {
        throw new Error("No service found");
      }

      const _package = this.create({ ...input, service });
      const savedPackage = await this.save(_package);

      if (Array.isArray(input.features)) {
        const featureRepo = dataSource.getRepository(PackageFeatureEntity);
        const featureEntities = input.features
          .filter(f => typeof f === 'string' && f.trim().length > 0)
          .map((text, idx) =>
            featureRepo.create({
              package: savedPackage,
              text: text.trim(),
              sortOrder: idx,
            })
          );
        if (featureEntities.length > 0) {
          await featureRepo.save(featureEntities);
        }
      }

      const result = await this.findOne({
        where: { id: savedPackage.id },
        relations: ['service', 'packageFeatures'],
      });
      if (result && result.packageFeatures) {
        result.features = result.packageFeatures.map(f => f.text);
      }
      return result || savedPackage;
    },

    async updatePackage(input: Partial<PackageEntity>): Promise<PackageEntity> {
      const { id } = input;
      if (!id) {
        throw new Error("Package ID is required for update");
      }
      const _package = await this.findOne({ where: { id } });

      if (!_package) {
        throw new Error(`Package with id ${id} not found`);
      }

      const saved = await this.save({
        ..._package,
        ...input,
      });

      if (Array.isArray(input.features)) {
        const featureRepo = dataSource.getRepository(PackageFeatureEntity);
        await featureRepo.delete({ package: { id } });
        const featureEntities = input.features
          .filter(f => typeof f === 'string' && f.trim().length > 0)
          .map((text, idx) =>
            featureRepo.create({
              package: saved,
              text: text.trim(),
              sortOrder: idx,
            })
          );
        if (featureEntities.length > 0) {
          await featureRepo.save(featureEntities);
        }
      }

      const result = await this.findOne({
        where: { id },
        relations: ['service', 'packageFeatures'],
      });
      if (result && result.packageFeatures) {
        result.features = result.packageFeatures.map(f => f.text);
      }
      return result || saved;
    },

    async deletePackage(id: string): Promise<PackageEntity> {
        const _package = await this.findOne({ where: { id } });

        if (!_package) {
          throw new Error(`Package with id ${id} not found`);
        }

        await this.remove(_package);
        return _package;
    },

    async findPackageByService(serviceId: string): Promise<PackageEntity[]> {
        const packages = await this.find({
          where: { service: { id: serviceId } },
          relations: ['service', 'packageFeatures'],
          order: {
            createdAt: 'ASC',
          },
        });

        return packages.map(pkg => {
          if (pkg.packageFeatures && pkg.packageFeatures.length > 0) {
            pkg.packageFeatures.sort((a, b) => a.sortOrder - b.sortOrder);
            pkg.features = pkg.packageFeatures.map(f => f.text);
          }
          return pkg;
        });
    }
        
  });