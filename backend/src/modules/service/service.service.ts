import { Injectable, NotFoundException } from "@nestjs/common";
import { ServiceEntity } from "../../database/entities/service.entity";
import { ServiceMediaEntity } from "../../database/entities/service-media.entity";
import { CreateServiceInput } from "../../graphql/inputs/createService.input";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { VendorEntity } from "../../database/entities/vendor.entity";
import { ServiceFilterInput } from "../../graphql/inputs/serviceFilter.input";
import { ServiceRepository } from "../../database/repositories/service.repository";
import { ServiceRepositoryType } from "../../database/types/serviceTypes";
import { UpdateServiceInput } from "../../graphql/inputs/updateService.input";

@Injectable()
export class ServiceService {
  private serviceRepository: ServiceRepositoryType;
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>
  ) {
    this.serviceRepository = ServiceRepository(this.dataSource);
  }

  async createService(
    createServiceInput: CreateServiceInput
  ): Promise<ServiceEntity> {
    const vendor = await this.vendorRepository.findOne({
      where: { id: createServiceInput.vendor_id },
    });

    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return this.serviceRepository.createService(createServiceInput, vendor);
  }

  async updateService(
    id: string,
    input: UpdateServiceInput
  ): Promise<ServiceEntity> {
    return this.serviceRepository.updateService(id, input);
  }

  async deleteService(id: string): Promise<boolean> {
    return this.serviceRepository.deleteService(id);
  }

  async findServiceById(id: string): Promise<ServiceEntity> {
    return this.serviceRepository.findServiceById(id);
  }

  async findServicesByFilters(
    filterInput: ServiceFilterInput
  ): Promise<ServiceEntity[]> {
    const { category, city } = filterInput;
    return this.serviceRepository.findServicesByFilters(category, city);
  }

  async findServicesByVendor(vendorId: string): Promise<ServiceEntity[]> {
    return this.serviceRepository.findServicesByVendor(vendorId);
  }

  async updateServiceBanner(
    id: string,
    fileUrl: string
  ): Promise<ServiceEntity> {
    // Find the service by ID
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error("Service not found");
    }

    const newService = { ...service, banner: fileUrl };
    return await this.serviceRepository.save(newService);
  }

  async updateServiceShowcaseImages(
    id: string,
    fileUrls: string[],
    slotIndex?: number,
  ): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error("Service not found");
    }
    const existingShowcaseImages = [...(service.photo_showcase || [])];

    if (
      typeof slotIndex === "number" &&
      slotIndex >= 0 &&
      slotIndex < 5 &&
      fileUrls.length === 1
    ) {
      if (slotIndex < existingShowcaseImages.length) {
        existingShowcaseImages[slotIndex] = fileUrls[0];
      } else {
        existingShowcaseImages.push(fileUrls[0]);
      }
      service.photo_showcase = existingShowcaseImages.slice(0, 5);
    } else {
      const updatedShowcaseImages = [
        ...existingShowcaseImages,
        ...fileUrls,
      ].slice(0, 5);
      service.photo_showcase = updatedShowcaseImages;
    }

    const savedService = await this.serviceRepository.save(service);
    await this.syncServiceMedia(savedService, 'photo', savedService.photo_showcase);
    return savedService;
  }

  async updateServiceVideos(
    id: string,
    fileUrls: string[]
  ): Promise<ServiceEntity> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error("Service not found");
    }
    const existingVideos = service.video_showcase || [];
    const updatedVideos = [...existingVideos, ...fileUrls];
    const newService = { ...service, video_showcase: updatedVideos };
    const savedService = await this.serviceRepository.save(newService);
    await this.syncServiceMedia(savedService, 'video', savedService.video_showcase);
    return savedService;
  }

  async deleteServiceBanner(id: string): Promise<boolean> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    try {
      service.banner = null;
      await this.serviceRepository.save(service);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete banner: ${error.message}`);
    }
  }

  async deleteServiceShowcaseImage(
    id: string,
    index: number
  ): Promise<boolean> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    try {
      if (!service.photo_showcase || !Array.isArray(service.photo_showcase)) {
        throw new Error("No showcase images found");
      }

      if (index < 0 || index >= service.photo_showcase.length) {
        throw new Error("Invalid image index");
      }

      // Remove the image at the specified index
      service.photo_showcase.splice(index, 1);

      const savedService = await this.serviceRepository.save(service);
      await this.syncServiceMedia(savedService, 'photo', savedService.photo_showcase);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete showcase image: ${error.message}`);
    }
  }

  async deleteServiceVideo(id: string): Promise<boolean> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    try {
      service.video_showcase = null;
      const savedService = await this.serviceRepository.save(service);
      await this.syncServiceMedia(savedService, 'video', null);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }

  private async syncServiceMedia(
    service: ServiceEntity,
    mediaType: 'photo' | 'video',
    urls: string[] | null
  ): Promise<void> {
    try {
      const mediaRepo = this.dataSource.getRepository(ServiceMediaEntity);
      await mediaRepo.delete({ service: { id: service.id }, mediaType });
      if (Array.isArray(urls) && urls.length > 0) {
        const rows = urls
          .filter((u) => typeof u === 'string' && u.trim().length > 0)
          .map((url, idx) =>
            mediaRepo.create({
              service,
              mediaType,
              url: url.trim(),
              slotIndex: idx,
            })
          );
        if (rows.length > 0) {
          await mediaRepo.save(rows);
        }
      }
    } catch (error) {
      // Non-blocking sync error logging to maintain backwards-compatibility
      console.error(`Failed to sync service media (${mediaType}):`, error);
    }
  }
}
