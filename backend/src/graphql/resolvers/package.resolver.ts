import { Args, Mutation, Resolver } from "@nestjs/graphql/dist";
import { PackageService } from "../../modules/package/package.service";
import { PackageModel } from "../models/package.model";
import { CreatePackageInput } from "../inputs/createPackage.input";
import { UpdatePackageInput } from "../inputs/updatePackage.input";import { PackageEntity } from "src/database/entities/package.entity";
import { Query, ResolveField, Parent } from "@nestjs/graphql";
import { PaymentService } from "../../modules/payment/payment.service";

@Resolver(() => PackageModel)

export class PackageResolver {
  constructor(
    private readonly packageService: PackageService,
    private readonly paymentService: PaymentService,
  ) {}

  @Query(() => [PackageModel])
  async findPackagesByOffering(@Args('offeringId') offeringId: string): Promise<PackageEntity[]> {
    return this.packageService.findPackageByOffering(offeringId);
  }

  @Mutation(() => PackageModel)
  async createPackage(
    @Args('input') input: CreatePackageInput,
    @Args('offeringId') offeringId: string): Promise<PackageEntity> {
    return this.packageService.createPackage(input, offeringId);
  }

  @Mutation(() => PackageModel)
  async updatePackage(
    @Args('input') input: UpdatePackageInput
  ): Promise<PackageEntity> {
    return this.packageService.updatePackage(input);
  }

  @Mutation(() => Boolean)
  async deletePackage(@Args('id') id: string): Promise<boolean> {
    return this.packageService.deletePackage(id);
  }

  @ResolveField(() => [Date], { nullable: true })
  async bookedDates(@Parent() pkg: PackageEntity): Promise<Date[]> {
    if (!pkg.requiresReservation) return [];
    return this.paymentService.findBookedDatesByPackage(pkg.id);
  }
}