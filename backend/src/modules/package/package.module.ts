import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../../database/entities/service.entity';
import { PackageEntity } from '../../database/entities/package.entity';
import { PackageViewEntity } from '../../database/entities/package-view.entity';
import { PackageFeatureEntity } from '../../database/entities/package-feature.entity';
import { PackageService } from './package.service';
import { PackageResolver } from '../../graphql/resolvers/package.resolver';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ 
      PackageEntity,
      ServiceEntity,
      PackageViewEntity,
      PackageFeatureEntity,
    ]),
    PaymentModule
  ],
  providers: [PackageResolver, PackageService],
  exports: [PackageService]
})

export class PackageModule {}