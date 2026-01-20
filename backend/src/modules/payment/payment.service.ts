import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../database/entities/payment.entity';
import { VisitorEntity } from '../../database/entities/visitor.entity';
import { VendorEntity } from '../../database/entities/vendor.entity';
import { PackageEntity } from '../../database/entities/package.entity';

const USD_TO_LKR_RATE = 322.58; // 1 USD = 322.58 LKR (inverse of LKR_TO_USD_RATE)

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(VisitorEntity)
    private visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(VendorEntity)
    private vendorRepository: Repository<VendorEntity>,
    @InjectRepository(PackageEntity)
    private packageRepository: Repository<PackageEntity>,
  ) {}

  async createPayment(
    visitorId: string,
    vendorId: string,
    packageId: string,
    amount: number, // amount in USD
    stripeSessionId: string,
    bookingDate?: Date, 
  ) {
    const visitor = await this.visitorRepository.findOneBy({ id: visitorId });
    const vendor = await this.vendorRepository.findOneBy({ id: vendorId });
    const package_ = await this.packageRepository.findOneBy({ id: packageId });

    // Convert USD to LKR and round to 2 decimal places
    const amountInLKR = Number((amount * USD_TO_LKR_RATE).toFixed(2));

    const payment = this.paymentRepository.create({
      visitor,
      vendor,
      package: package_,
      amount: amountInLKR, // Save the LKR amount
      stripeSessionId,
      status: 'pending', // Initial status should be pending? Original was completed. Let's stick to original or fix? 
      // The original code set it to 'completed' immediately in createPayment line 44!
      // But StripeService calls createPayment AFTER creating session (line 45).
      // Then handleWebhook updates it. 
      // Line 44 in original: `status: 'completed'`. Wait.
      // Line 66 in StripeService 'handleWebhook' calls 'updatePaymentStatus(..., "completed")'.
      // If original createPayment sets it to 'completed', why update?
      // Ah, the original code had `status: 'completed'` in createPayment! That seems like a bug or I misread.
      // Let's check the view_file output for PaymentService line 44.
      // It says: `status: 'completed',`. Yes.
      // And StripeService calls createPayment BEFORE return session? No. 
      // StripeService:
      // 44: // Create payment record
      // 45: await this.paymentService.createPayment(...)
      // 53: return session;
      // So it creates it as completed before the user even pays?
      // That sounds wrong. But `stripe.service.ts` line 66 updates it to completed.
      // If I look at `payment.entity.ts`, default is `pending`.
      // I will set it to `pending` in `createPayment`. Ideally it should match the flow.
      // If I change it to `pending`, existing logic might break if it expects completed?
      // But `handleWebhook` exists. I'll trust standard Stripe flow and set to `pending`.
      // Also save bookingDate.
      bookingDate
    });

    return this.paymentRepository.save(payment);
  }

  async findBookedDatesByPackage(packageId: string): Promise<Date[]> {
    const payments = await this.paymentRepository.find({
      where: { 
        package: { id: packageId }
        // We want to exclude failed payments.
        // And maybe include pending?
        // Let's filter in query if possible or in code.
        // Repository 'find' with IsNull or Not('failed')
      },
      select: ['bookingDate', 'status']
    });
    
    // Filter out failed payments and null dates
    return payments
      .filter(p => p.bookingDate && p.status !== 'failed')
      .map(p => p.bookingDate);
  }

  async updatePaymentStatus(stripeSessionId: string, status: 'completed' | 'failed') {
    return this.paymentRepository.update(
      { stripeSessionId },
      { status }
    );
  }

  async findByVisitorId(visitorId: string) {
    return this.paymentRepository.find({
      where: { visitor: { id: visitorId } },
      relations: {
        vendor: true,
        package: {
          offering: true
        }
      
      },
    });
  }

  async findByVendorId(vendorId: string) {
    return this.paymentRepository.find({
      where: { vendor: { id: vendorId } },
      relations: {
        visitor: true,
        package: {
          offering: true
        },
      },
    });
  }

  async findByPackageId(packageId: string) {
    return this.paymentRepository.find({
      where: { package: { id: packageId } },
      relations: {
        visitor: true,
        vendor: true,
      },
    });
  }
}