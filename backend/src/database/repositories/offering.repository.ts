import { DataSource } from 'typeorm';
import { VendorEntity } from '../entities/vendor.entity';
import { OfferingRepositoryType } from 'src/database/types/offeringTypes';
import { OfferingEntity } from '../entities/offering.entity';

// Use the DataSource to get the base repository and extend it
export const OfferingRepository = (dataSource: DataSource): OfferingRepositoryType =>
  dataSource.getRepository(OfferingEntity).extend({

    async createOffering(
      createOfferingInput: Partial<OfferingEntity>,
      vendor: VendorEntity,
    ): Promise<OfferingEntity> {
      const offering = this.create({
        ...createOfferingInput,
        vendor,
      });
      return this.save(offering);
    },

    async updateOffering(
      id: string,
      updateOfferingInput: Partial<OfferingEntity>,
    ): Promise<OfferingEntity> {
      const offering = await this.findOne({ where: { id } });
      if (!offering) {
        throw new Error('Service not found');
      }
      return this.save({
        ...offering,
        ...updateOfferingInput
      });
    },

    async deleteOffering(id: string): Promise<boolean> {
      const result = await this.delete({ id });
      return result.affected > 0;
    },

    async findOfferingById(id: string): Promise<OfferingEntity> {
      const offering = await this.findOne({ 
        relations: ['vendor', 'media'], 
        where: { id } 
      });
      if (offering && offering.media && offering.media.length > 0) {
        const photos = offering.media
          .filter(m => m.mediaType === 'photo')
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map(m => m.url);
        const videos = offering.media
          .filter(m => m.mediaType === 'video')
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map(m => m.url);
        if (photos.length > 0) offering.photo_showcase = photos;
        if (videos.length > 0) offering.video_showcase = videos;
      }
      return offering;
    },

    async findOfferingsByFilters(category?: string, city?: string): Promise<OfferingEntity[]> {
      const query = this.createQueryBuilder('offering')
        .leftJoinAndSelect('offering.vendor', 'vendor') // Join with vendor
        .andWhere('offering.visible = :visible', { visible: true }); // Only public offerings

      if (category && category.trim()) {
        query.andWhere(
          '(LOWER(TRIM(offering.category)) = LOWER(TRIM(:category)) OR offering.category ILIKE :catPattern)',
          {
            category: category.trim(),
            catPattern: `%${category.trim()}%`,
          }
        );
      }

      if (city && city.trim()) {
        query.andWhere(
          '(LOWER(TRIM(vendor.city)) = LOWER(TRIM(:city)) OR vendor.city ILIKE :cityPattern)',
          {
            city: city.trim(),
            cityPattern: `%${city.trim()}%`,
          }
        );
      }

      return query.getMany();
    },

    async findOfferingsByVendor(id: string): Promise<OfferingEntity[]> {
      return this.createQueryBuilder('offering')
        .leftJoinAndSelect('offering.vendor', 'vendor') // Include vendor details
        .where('vendor.id = :id', { id })
        .getMany();
    }
  });
