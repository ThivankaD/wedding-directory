import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ServiceService } from 'src/modules/service/service.service';
import { VendorService } from 'src/modules/vendor/vendor.service';
import { ServiceEntity } from 'src/database/entities/service.entity';
import { VendorEntity } from 'src/database/entities/vendor.entity';
import { CreateServiceInput } from 'src/graphql/inputs/createService.input';
import { getEntities } from '../../src/database/entities/index';
import { of } from 'rxjs';
import { UpdateServiceInput } from 'src/graphql/inputs/updateService.input';

describe('ServiceService Integration Tests', () => {
  let app: INestApplication;
  let offeringService: ServiceService;
  let vendorService: VendorService;
  let httpService: HttpService;
  let testOfferingId: string;
  let testVendorId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        HttpModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            url: configService.get('TEST_DATABASE_URL'),
            entities: getEntities(),
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([ServiceEntity, VendorEntity]),
      ],
      providers: [ServiceService, VendorService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    offeringService = moduleFixture.get<ServiceService>(ServiceService);
    vendorService = moduleFixture.get<VendorService>(VendorService);
    httpService = moduleFixture.get<HttpService>(HttpService);

    // Mock HTTP requests if needed
    jest
      .spyOn(httpService, 'request')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation(() => of({ data: {} } as any));
  });

  afterAll(async () => {
    if (testOfferingId) {
      try {
        await offeringService.deleteService(testOfferingId);
      } catch (e) {
        console.log('Error cleaning up test service:', e);
      }
    }
    if (testVendorId) {
      try {
        await vendorService.deleteVendor(testVendorId);
      } catch (e) {
        console.log('Error cleaning up test vendor:', e);
      }
    }
    await app.close();
  });

  describe('Setup Test Vendor', () => {
    it('should create a test vendor', async () => {
      const vendor = await vendorService.createVendor({
        email: `testvendor_${Date.now()}@example.com`,
        password: 'TestVendor123!',
        fname: 'Integration',
        lname: 'Test',
        busname: 'Test Business',
        phone: '1234567890',
        city: 'Test City',
        location: 'Test Location',
      });

      testVendorId = vendor.id;
      expect(vendor).toBeDefined();
    });
  });

  describe('Create Offering', () => {
    it('should create a new service in the database', async () => {
      const createServiceInput: CreateServiceInput = {
        vendor_id: testVendorId,
        name: 'Test Offering',
        category: 'Test Category',
      };

      const result = await offeringService.createService(createServiceInput);
      testOfferingId = result.id;

      expect(result).toBeDefined();
      expect(result.name).toBe(createServiceInput.name);
      expect(result.category).toBe(createServiceInput.category);
      expect(result.vendor.id).toBe(testVendorId);
    });
  });

  describe('Find Offerings', () => {
    it('should find an service by ID', async () => {
      expect(testOfferingId).toBeDefined();

      const service = await offeringService.findServiceById(testOfferingId);
      expect(service).toBeDefined();
      expect(service.id).toBe(testOfferingId);
    });

    it('should find offerings by vendor', async () => {
      expect(testVendorId).toBeDefined();

      const offerings =
        await offeringService.findServicesByVendor(testVendorId);
      expect(Array.isArray(offerings)).toBe(true);
      expect(offerings.length).toBeGreaterThan(0);
      expect(offerings[0].vendor.id).toBe(testVendorId);
    });

    it('should return null when finding non-existent service', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const service = await offeringService.findServiceById(nonExistentId);
      expect(service).toBeNull();
    });
  });

  describe('Update Offering', () => {
    it('should update service information', async () => {
      expect(testOfferingId).toBeDefined();

      const updateServiceInput: UpdateServiceInput = {
        description: 'Updated description for testing',
        website: 'https://updated-test.com',
        visible: true,
        banner: 'https://example.com/updated-banner.jpg',
        photo_showcase: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
        ],
        video_showcase: [
          'https://example.com/video1.mp4',
          'https://example.com/video2.mp4',
        ],
      };

      const updatedOffering = await offeringService.updateService(
        testOfferingId,
        updateServiceInput,
      );

      expect(updatedOffering).toBeDefined();
      expect(updatedOffering.description).toBe(updateServiceInput.description);
      expect(updatedOffering.website).toBe(updateServiceInput.website);
      expect(updatedOffering.visible).toBe(updateServiceInput.visible);
    });

    it('should update service banner', async () => {
      expect(testOfferingId).toBeDefined();

      const bannerUrl = 'https://example.com/banners/test.jpg';
      const updatedOffering = await offeringService.updateServiceBanner(
        testOfferingId,
        bannerUrl,
      );

      expect(updatedOffering).toBeDefined();
      expect(updatedOffering.banner).toBe(bannerUrl);
    });
  });

  describe('Delete Offering', () => {
    it('should delete an service from the database', async () => {
      // Create a separate service for deletion test
      const createServiceInput: CreateServiceInput = {
        vendor_id: testVendorId,
        name: 'Delete Test Offering',
        category: 'Test Category',
      };

      const service =
        await offeringService.createService(createServiceInput);
      expect(service).toBeDefined();

      // Delete the service
      const deleteResult = await offeringService.deleteService(service.id);
      expect(deleteResult).toBe(true);

      // Verify it was deleted
      const findResult = await offeringService.findServiceById(service.id);
      expect(findResult).toBeNull();
    });
  });
});
