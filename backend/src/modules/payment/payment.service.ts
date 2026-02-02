import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../database/entities/payment.entity';
import { VisitorEntity } from '../../database/entities/visitor.entity';
import { VendorEntity } from '../../database/entities/vendor.entity';
import { PackageEntity } from '../../database/entities/package.entity';
import { MyVendorsEntity } from '../../database/entities/myVendors.entity';
import { OfferingEntity } from '../../database/entities/offering.entity';

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
    @InjectRepository(MyVendorsEntity)
    private myVendorsRepository: Repository<MyVendorsEntity>,
    @InjectRepository(OfferingEntity)
    private offeringRepository: Repository<OfferingEntity>,
  ) {}

  async createPayment(
    visitorId: string,
    vendorId: string,
    packageId: string,
    offeringId: string,
    amount: number, // amount in USD
    stripeSessionId: string,
    bookingDate?: Date, 
  ) {
    const visitor = await this.visitorRepository.findOneBy({ id: visitorId });
    const vendor = await this.vendorRepository.findOneBy({ id: vendorId });
    const package_ = await this.packageRepository.findOneBy({ id: packageId });
    const offering = await this.offeringRepository.findOneBy({ id: offeringId });

    // Convert USD to LKR and round to 2 decimal places
    const amountInLKR = Number((amount * USD_TO_LKR_RATE).toFixed(2));

    const payment = this.paymentRepository.create({
      visitor,
      vendor,
      package: package_,
      amount: amountInLKR, // Save the LKR amount
      stripeSessionId,
      status: 'pending',
      bookingDate
    });

    // Add to myVendors if not already added
    const existingMyVendor = await this.myVendorsRepository.findOne({
      where: {
        visitor: { id: visitorId },
        offering: { id: offeringId }
      }
    });

    if (!existingMyVendor && offering) {
      const myVendor = this.myVendorsRepository.create({
        visitor,
        offering
      });
      await this.myVendorsRepository.save(myVendor);
    }

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
    // If status is completed, ensure vendor is added to myVendors
    if (status === 'completed') {
      const payment = await this.paymentRepository.findOne({
        where: { stripeSessionId },
        relations: {
          visitor: true,
          package: {
            offering: true
          }
        }
      });

      if (payment && payment.package?.offering) {
        // Check if already in myVendors
        const existingMyVendor = await this.myVendorsRepository.findOne({
          where: {
            visitor: { id: payment.visitor.id },
            offering: { id: payment.package.offering.id }
          }
        });

        // Add to myVendors if not already added
        if (!existingMyVendor) {
          const myVendor = this.myVendorsRepository.create({
            visitor: payment.visitor,
            offering: payment.package.offering
          });
          await this.myVendorsRepository.save(myVendor);
        }
      }
    }

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

  // Utility method to sync completed payments to myVendors
  async syncCompletedPaymentsToMyVendors() {
    try {
      const completedPayments = await this.paymentRepository.find({
        where: { status: 'completed' },
        relations: {
          visitor: true,
          package: {
            offering: true
          }
        }
      });

      console.log(`Found ${completedPayments.length} completed payments`);

      let syncedCount = 0;
      for (const payment of completedPayments) {
        if (payment.package?.offering) {
          const existingMyVendor = await this.myVendorsRepository.findOne({
            where: {
              visitor: { id: payment.visitor.id },
              offering: { id: payment.package.offering.id }
            }
          });

          if (!existingMyVendor) {
            const myVendor = this.myVendorsRepository.create({
              visitor: payment.visitor,
              offering: payment.package.offering
            });
            await this.myVendorsRepository.save(myVendor);
            syncedCount++;
            console.log(`Added offering ${payment.package.offering.id} to myVendors for visitor ${payment.visitor.id}`);
          }
        } else {
          console.log(`Payment ${payment.id} is missing package or offering relation`);
        }
      }

      console.log(`Synced ${syncedCount} payments to myVendors`);
      return { message: `Synced ${syncedCount} payments to myVendors`, syncedCount };
    } catch (error) {
      console.error('Error in syncCompletedPaymentsToMyVendors:', error);
      throw error;
    }
  }
}