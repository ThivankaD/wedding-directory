import { ServiceEntity } from "src/database/entities/service.entity";
import { VendorEntity } from "src/database/entities/vendor.entity";
import { Repository } from "typeorm";

export type ServiceRepositoryType = Repository<ServiceEntity> & {
    createService(
      createServiceInput: Partial<ServiceEntity>,
      vendor: VendorEntity,
    ): Promise<ServiceEntity>;

    updateService(
      id: string,
      updateServiceInput: Partial<ServiceEntity>
    ): Promise<ServiceEntity>;

    deleteService(id: string): Promise<boolean>;

    findServiceById(id: string): Promise<ServiceEntity>;
  
    findServicesByFilters(category?: string, city?: string): Promise<ServiceEntity[]>;

    findServicesByVendor(id: string): Promise<ServiceEntity[]>;
};