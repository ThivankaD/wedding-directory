import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferingEntity } from '../../database/entities/offering.entity';
import { PackageEntity } from '../../database/entities/package.entity';
import { PackageService } from './package.service';
import { PackageResolver } from '../../graphql/resolvers/package.resolver';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ 
      PackageEntity,
      OfferingEntity
    ]),
    PaymentModule
  ],
  providers: [PackageResolver, PackageService],
  exports: [PackageService]
})

export class PackageModule {}