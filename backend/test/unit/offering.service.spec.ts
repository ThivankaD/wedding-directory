import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ServiceEntity } from 'src/database/entities/service.entity';
import { ServiceService } from 'src/modules/service/service.service';
import { VendorEntity } from 'src/database/entities/vendor.entity';
import { CreateServiceInput } from 'src/graphql/inputs/createService.input';
import { UpdateServiceInput } from 'src/graphql/inputs/updateService.input';
import { ServiceFilterInput } from 'src/graphql/inputs/serviceFilter.input';

// Mock the OfferingRepository methods
const mockOfferingRepository = {
  createService: jest.fn(),
  updateService: jest.fn(),
  deleteService: jest.fn(),
  findServiceById: jest.fn(),
  findServicesByFilters: jest.fn(),
  findServicesByVendor: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const createService = (): ServiceEntity => ({
  id: '1',
  name: 'Test Offering',
  category: 'Test Category',
  visible: true,
  description: 'Test Description',
  banner: 'test-banner.jpg',
  video_showcase: [],
  photo_showcase: [],
  website: 'https://example.com',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  x: 'https://x.com',
  tiktok: 'https://tiktok.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  vendor: {
    id: 'vendor-id',
    email: 'vendor@example.com',
    password: 'password',
    fname: 'John',
    lname: 'Doe',
    location: 'Test Location',
    city: 'Test City',
    busname: 'Test Business',
    phone: '1234567890',
    profile_pic_url: 'profile.jpg',
    about: 'Test About',
    createdAt: new Date(),
    updatedAt: new Date(),
    service: [],
  } as VendorEntity,
  review: [],
  myVendors: [],
  packages: [],
});

// Mock the VendorRepository methods
const mockVendorRepository = {
  findOne: jest.fn(),
};

// Mock the DataSource
const mockDataSource = {
  getRepository: jest.fn().mockImplementation((entity) => {
    if (entity === ServiceEntity) {
      // Mock the repository with the `extend` method
      return {
        extend: jest.fn().mockReturnValue(mockOfferingRepository),
      };
    } else if (entity === VendorEntity) {
      return mockVendorRepository;
    }
    return null;
  }),
};

// Mock the HttpService
const mockHttpService = {
  request: jest.fn(),
};

describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: DataSource, useValue: mockDataSource }, // Provide the mock DataSource
        { provide: HttpService, useValue: mockHttpService }, // Provide the mock HttpService
        {
          provide: 'VendorEntityRepository', // Provide the mock VendorRepository
          useValue: mockVendorRepository,
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createService', () => {
    it('should create and return an service', async () => {
      const createServiceInput: CreateServiceInput = {
        vendor_id: 'vendor-id',
        name: 'Test Offering',
        category: 'Test Category',
      };

      const vendor = { id: 'vendor-id' } as VendorEntity;
      const serviceEntity = createService();

      mockVendorRepository.findOne.mockResolvedValue(vendor);
      mockOfferingRepository.createService.mockResolvedValue(serviceEntity);

      const result = await service.createService(createServiceInput);

      expect(result).toEqual(serviceEntity);
      expect(mockVendorRepository.findOne).toHaveBeenCalledWith({
        where: { id: createServiceInput.vendor_id },
      });
      expect(mockOfferingRepository.createService).toHaveBeenCalledWith(
        createServiceInput,
        vendor,
      );
    });

    it('should throw an error if vendor is not found', async () => {
      const createServiceInput: CreateServiceInput = {
        vendor_id: 'vendor-id',
        name: 'Test Offering',
        category: 'Test Category',
      };

      mockVendorRepository.findOne.mockResolvedValue(null);

      await expect(service.createService(createServiceInput)).rejects.toThrow(
        'Vendor not found',
      );
    });
  });

  describe('updateService', () => {
    it('should update and return an service', async () => {
      const id = '1';
      const updateServiceInput: UpdateServiceInput = {
        category: 'Updated Category',
        visible: true,
        bus_phone: '1234567890',
        bus_email: 'test@example.com',
        description: 'Updated Description',
        banner: 'updated-banner.jpg',
        photo_showcase: ['image1.jpg', 'image2.jpg'],
        video_showcase: ['video1.mp4', 'video2.mp4'],
        pricing: 'Updated Pricing',
        website: 'https://updated.com',
        instagram: 'https://instagram.com/updated',
        facebook: 'https://facebook.com/updated',
        x: 'https://x.com/updated',
        tiktok: 'https://tiktok.com/updated',
      };

      const updatedOffering = { id, ...updateServiceInput } as ServiceEntity;

      mockOfferingRepository.updateService.mockResolvedValue(updatedOffering);

      const result = await service.updateService(id, updateServiceInput);

      expect(result).toEqual(updatedOffering);
      expect(mockOfferingRepository.updateService).toHaveBeenCalledWith(
        id,
        updateServiceInput,
      );
    });
  });

  describe('deleteService', () => {
    it('should delete an service and return true', async () => {
      const id = '1';

      mockOfferingRepository.deleteService.mockResolvedValue(true);

      const result = await service.deleteService(id);

      expect(result).toBe(true);
      expect(mockOfferingRepository.deleteService).toHaveBeenCalledWith(id);
    });
  });

  describe('findServiceById', () => {
    it('should return an service by ID', async () => {
      const id = '1';
      const serviceEntity = { id } as ServiceEntity;

      mockOfferingRepository.findServiceById.mockResolvedValue(serviceEntity);

      const result = await service.findServiceById(id);

      expect(result).toEqual(serviceEntity);
      expect(mockOfferingRepository.findServiceById).toHaveBeenCalledWith(id);
    });
  });

  describe('findServicesByFilters', () => {
    it('should return offerings based on filters', async () => {
      const filterInput: ServiceFilterInput = {
        category: 'Test Category',
        city: 'Test City',
      };

      const offerings = [
        { id: '1', category: 'Test Category' },
      ] as ServiceEntity[];

      mockOfferingRepository.findServicesByFilters.mockResolvedValue(
        offerings,
      );

      const result = await service.findServicesByFilters(filterInput);

      expect(result).toEqual(offerings);
      expect(
        mockOfferingRepository.findServicesByFilters,
      ).toHaveBeenCalledWith(filterInput.category, filterInput.city);
    });
  });

  describe('findServicesByVendor', () => {
    it('should return offerings by vendor ID', async () => {
      const vendorId = 'vendor-id';
      const offerings = [
        { id: '1', vendor: { id: vendorId } },
      ] as ServiceEntity[];

      mockOfferingRepository.findServicesByVendor.mockResolvedValue(offerings);

      const result = await service.findServicesByVendor(vendorId);

      expect(result).toEqual(offerings);
      expect(mockOfferingRepository.findServicesByVendor).toHaveBeenCalledWith(
        vendorId,
      );
    });
  });

  describe('updateServiceBanner', () => {
    it('should update the banner and return the service', async () => {
      const id = '1';
      const fileUrl = 'banner.jpg';
      const serviceEntity = { id, banner: fileUrl } as ServiceEntity;

      mockOfferingRepository.findOne.mockResolvedValue(serviceEntity);
      mockOfferingRepository.save.mockResolvedValue(serviceEntity);

      const result = await service.updateServiceBanner(id, fileUrl);

      expect(result).toEqual(serviceEntity);
      expect(mockOfferingRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockOfferingRepository.save).toHaveBeenCalledWith(service);
    });

    it('should throw an error if service is not found', async () => {
      const id = '1';
      const fileUrl = 'banner.jpg';

      mockOfferingRepository.findOne.mockResolvedValue(null);

      await expect(service.updateServiceBanner(id, fileUrl)).rejects.toThrow(
        'Offering not found',
      );
    });
  });

  describe('updateServiceShowcaseImages', () => {
    // it('should update the showcase images and return the service', async () => {
    //   const id = '1';
    //   const fileUrls = ['image1.jpg', 'image2.jpg'];
    //   const service = { id, photo_showcase: fileUrls } as ServiceEntity;

    //   mockOfferingRepository.findOne.mockResolvedValue(serviceEntity);
    //   mockOfferingRepository.save.mockResolvedValue(serviceEntity);

    //   const result = await service.updateServiceShowcaseImages(id, fileUrls);

    //   expect(result).toEqual(serviceEntity);
    //   expect(mockOfferingRepository.findOne).toHaveBeenCalledWith({
    //     where: { id },
    //   });
    //   expect(mockOfferingRepository.save).toHaveBeenCalledWith(service);
    // });

    it('should throw an error if service is not found', async () => {
      const id = '1';
      const fileUrls = ['image1.jpg', 'image2.jpg'];

      mockOfferingRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateServiceShowcaseImages(id, fileUrls),
      ).rejects.toThrow('Offering not found');
    });
  });

  describe('updateServiceVideos', () => {
    //   it('should update the videos and return the service', async () => {
    //     const id = '1';
    //     const fileUrls = ['video1.mp4', 'video2.mp4'];
    //     const service = { id, video_showcase: fileUrls } as ServiceEntity;

    //     mockOfferingRepository.findOne.mockResolvedValue(serviceEntity);
    //     mockOfferingRepository.save.mockResolvedValue(serviceEntity);

    //     const result = await service.updateServiceVideos(id, fileUrls);

    //     expect(result).toEqual(serviceEntity);
    //     expect(mockOfferingRepository.findOne).toHaveBeenCalledWith({
    //       where: { id },
    //     });
    //     expect(mockOfferingRepository.save).toHaveBeenCalledWith(service);
    //   });

    it('should throw an error if service is not found', async () => {
      const id = '1';
      const fileUrls = ['video1.mp4', 'video2.mp4'];

      mockOfferingRepository.findOne.mockResolvedValue(null);

      await expect(service.updateServiceVideos(id, fileUrls)).rejects.toThrow(
        'Offering not found',
      );
    });
  });
});
