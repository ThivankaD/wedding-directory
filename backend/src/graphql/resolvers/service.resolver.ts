import { Resolver, Args, Mutation, Query, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ServiceService } from '../../modules/service/service.service';
import { ServiceModel } from '../models/service.model';
import { ServiceEntity } from '../../database/entities/service.entity';
import { CreateServiceInput } from '../inputs/createService.input';
import { ServiceFilterInput } from '../inputs/serviceFilter.input';
import { UpdateServiceInput } from '../inputs/updateService.input';
import { ReviewModel } from '../models/review.model';
import { ReviewService } from '../../modules/review/review.service';
import { VendorModel } from '../models/vendor.model';

@Resolver(() => ServiceModel)
export class ServiceResolver {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly reviewService: ReviewService,
  ) {}

  @Mutation(() => ServiceModel)
  async createService(
    @Args('input') input: CreateServiceInput,
  ): Promise<ServiceEntity> {
    return this.serviceService.createService(input);
  }

  @Mutation(() => ServiceModel)
  async updateService(
    @Args('id') id: string,
    @Args('input') input: UpdateServiceInput,
  ): Promise<ServiceEntity> {
    return this.serviceService.updateService(id, input);
  }

  @Mutation(() => Boolean)
  async deleteService(@Args('id') id: string): Promise<boolean> {
    return this.serviceService.deleteService(id);
  }

  @Mutation(() => ServiceModel)
  async updateServiceBanner(
    @Args('id') id: string,
    @Args('fileUrl') fileUrl: string,
  ): Promise<ServiceEntity> {
    return this.serviceService.updateServiceBanner(id, fileUrl);
  }

  @Query(() => ServiceModel)
  async findServiceById(@Args('id') id: string): Promise<ServiceEntity> {
    return this.serviceService.findServiceById(id);
  }

  @Query(() => [ServiceModel])
  async findServices(
    @Args('filter', { nullable: true }) filter?: ServiceFilterInput
  ): Promise<ServiceEntity[]> {
    return this.serviceService.findServicesByFilters(filter || {});
  }

  @Query(() => [ServiceModel])
  async findServicesByVendor(
    @Args('id') id: string,
  ): Promise<ServiceEntity[]> {
    return this.serviceService.findServicesByVendor(id);
  }

  @Mutation(() => Boolean)
  async deleteServiceBanner(
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.serviceService.deleteServiceBanner(id);
  }

  @Mutation(() => Boolean)
  async deleteServiceShowcaseImage(
    @Args('id') id: string,
    @Args('index', { type: () => Int }) index: number,
  ): Promise<boolean> {
    return this.serviceService.deleteServiceShowcaseImage(id, index);
  }

  @Mutation(() => Boolean)
  async deleteServiceVideo(
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.serviceService.deleteServiceVideo(id);
  }

  @ResolveField(() => [ReviewModel])
  async reviews(@Parent() service: ServiceModel) {
    const { id } = service;
    return this.reviewService.findReviewsByService(id);
  }

  @ResolveField(() => VendorModel)
  async vendor(@Parent() service: ServiceModel) {
    if (service.vendor) {
      return service.vendor;
    }
    const fullService = await this.serviceService.findServiceById(service.id);
    return fullService.vendor;
  }

  @ResolveField(() => String, { nullable: true })
  async bus_phone(@Parent() service: ServiceEntity) {
    if (service.vendor?.phone) return service.vendor.phone;
    if (service.id) {
      const fullService = await this.serviceService.findServiceById(service.id);
      return fullService?.vendor?.phone || null;
    }
    return null;
  }

  @ResolveField(() => String, { nullable: true })
  async bus_email(@Parent() service: ServiceEntity) {
    if (service.vendor?.email) return service.vendor.email;
    if (service.id) {
      const fullService = await this.serviceService.findServiceById(service.id);
      return fullService?.vendor?.email || null;
    }
    return null;
  }
}
