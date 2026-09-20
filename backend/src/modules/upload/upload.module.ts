import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { VisitorModule } from '../visitor/visitor.module';
import { VendorModule } from '../vendor/vendor.module';
import { ServiceModule } from '../service/service.module';
@Module({
  imports: [VisitorModule, VendorModule, ServiceModule
    // implement rate limiter
  ],

  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
