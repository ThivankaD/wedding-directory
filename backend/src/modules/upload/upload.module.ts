import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { VisitorModule } from '../visitor/visitor.module';
import { VendorModule } from '../vendor/vendor.module';
import { ServiceModule } from '../service/service.module';

@Module({
  imports: [
    VisitorModule,
    VendorModule,
    ServiceModule,
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.UPLOAD_RATE_TTL ?? '60000', 10),
        limit: parseInt(process.env.UPLOAD_RATE_LIMIT ?? '3', 10),
      },
    ]),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
