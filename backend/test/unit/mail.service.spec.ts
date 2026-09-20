import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '../../src/modules/mail/mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Fallback mode (without live transporter)', () => {
    it('should handle sendPackagePurchaseUserEmail in fallback mode', async () => {
      const result = await service.sendPackagePurchaseUserEmail({
        to: 'user@example.com',
        visitorName: 'Kasun & Anuki',
        packageName: 'Gold Wedding Photography',
        serviceName: 'Photography & Videography',
        vendorName: 'Dream Moments Studio',
        vendorEmail: 'studio@example.com',
        vendorPhone: '+94771234567',
        amount: 150000,
        bookingDate: new Date('2026-12-15'),
        paymentReference: 'PAY-123456',
      });

      expect(result).toBe(true);
    });

    it('should handle sendPackagePurchaseVendorEmail in fallback mode', async () => {
      const result = await service.sendPackagePurchaseVendorEmail({
        to: 'studio@example.com',
        vendorName: 'Dream Moments Studio',
        visitorName: 'Kasun & Anuki',
        visitorEmail: 'user@example.com',
        visitorPhone: '+94779876543',
        packageName: 'Gold Wedding Photography',
        serviceName: 'Photography & Videography',
        amount: 150000,
        bookingDate: new Date('2026-12-15'),
        paymentReference: 'PAY-123456',
      });

      expect(result).toBe(true);
    });

    it('should handle sendPackageApprovalRequestVendorEmail in fallback mode', async () => {
      const result = await service.sendPackageApprovalRequestVendorEmail({
        to: 'studio@example.com',
        vendorName: 'Dream Moments Studio',
        visitorName: 'Kasun & Anuki',
        visitorEmail: 'user@example.com',
        visitorPhone: '+94779876543',
        packageName: 'Gold Wedding Photography',
        serviceName: 'Photography & Videography',
        bookingDate: new Date('2026-12-15'),
        userNote: 'We would love to book your team for our wedding day!',
        requestId: 'req-uuid-123',
      });

      expect(result).toBe(true);
    });

    it('should handle sendVisitorSignupWelcomeEmail in fallback mode', async () => {
      const result = await service.sendVisitorSignupWelcomeEmail({
        to: 'user@example.com',
        visitorName: 'Kasun & Anuki',
      });

      expect(result).toBe(true);
    });

    it('should handle sendVendorSignupWelcomeEmail in fallback mode', async () => {
      const result = await service.sendVendorSignupWelcomeEmail({
        to: 'studio@example.com',
        vendorName: 'Amal Perera',
        businessName: 'Dream Moments Studio',
      });

      expect(result).toBe(true);
    });

    it('should handle sendAdminNewVendorAlertEmail in fallback mode', async () => {
      const result = await service.sendAdminNewVendorAlertEmail({
        adminEmail: 'admin@sayido.lk',
        vendorName: 'Amal Perera',
        businessName: 'Dream Moments Studio',
        vendorEmail: 'studio@example.com',
        phone: '+94771234567',
        city: 'Colombo',
        location: 'Colombo 07',
      });

      expect(result).toBe(true);
    });
  });

  describe('Transporter mode (with mocked nodemailer transporter)', () => {
    let mockSendMail: jest.Mock;

    beforeEach(() => {
      mockSendMail = jest.fn().mockResolvedValue({ messageId: 'msg-123' });
      (service as any).transporter = {
        sendMail: mockSendMail,
      };
    });

    it('should send package purchase email to user via transporter', async () => {
      const result = await service.sendPackagePurchaseUserEmail({
        to: 'user@example.com',
        visitorName: 'Kasun & Anuki',
        packageName: 'Gold Wedding Photography',
        serviceName: 'Photography & Videography',
        vendorName: 'Dream Moments Studio',
        vendorEmail: 'studio@example.com',
        vendorPhone: '+94771234567',
        amount: 150000,
        bookingDate: new Date('2026-12-15'),
        paymentReference: 'PAY-123456',
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('user@example.com');
      expect(callArgs.subject).toContain('Booking Confirmed: Gold Wedding Photography');
      expect(callArgs.html).toContain('Dream Moments Studio');
      expect(callArgs.html).toContain('150,000');
    });

    it('should send package purchase email to vendor via transporter', async () => {
      const result = await service.sendPackagePurchaseVendorEmail({
        to: 'studio@example.com',
        vendorName: 'Dream Moments Studio',
        visitorName: 'Kasun & Anuki',
        visitorEmail: 'user@example.com',
        visitorPhone: '+94779876543',
        packageName: 'Gold Wedding Photography',
        serviceName: 'Photography & Videography',
        amount: 150000,
        bookingDate: new Date('2026-12-15'),
        paymentReference: 'PAY-123456',
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('studio@example.com');
      expect(callArgs.subject).toContain('New Package Purchase: Gold Wedding Photography');
      expect(callArgs.html).toContain('Dream Moments Studio');
    });

    it('should send approval request email to vendor via transporter', async () => {
      const result = await service.sendPackageApprovalRequestVendorEmail({
        to: 'studio@example.com',
        vendorName: 'Dream Moments Studio',
        visitorName: 'Kasun & Anuki',
        visitorEmail: 'user@example.com',
        packageName: 'Gold Wedding Photography',
        bookingDate: new Date('2026-12-15'),
        userNote: 'Special request note',
        requestId: 'req-123',
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('studio@example.com');
      expect(callArgs.subject).toContain('New Package Approval Request');
      expect(callArgs.html).toContain('Special request note');
    });

    it('should send visitor welcome email via transporter', async () => {
      const result = await service.sendVisitorSignupWelcomeEmail({
        to: 'visitor@example.com',
        visitorName: 'Nuwan & Chamari',
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('visitor@example.com');
      expect(callArgs.subject).toContain('Welcome to Say I Do!');
      expect(callArgs.html).toContain('Nuwan & Chamari');
    });

    it('should send vendor welcome email via transporter', async () => {
      const result = await service.sendVendorSignupWelcomeEmail({
        to: 'vendor@example.com',
        vendorName: 'Saman',
        businessName: 'Royal Florists',
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('vendor@example.com');
      expect(callArgs.subject).toContain('Welcome to Say I Do!');
      expect(callArgs.html).toContain('Royal Florists');
    });

    it('should send admin new vendor alert email via transporter', async () => {
      const result = await service.sendAdminNewVendorAlertEmail({
        adminEmail: 'admin@sayido.lk',
        vendorName: 'Saman',
        businessName: 'Royal Florists',
        vendorEmail: 'vendor@example.com',
        phone: '+94770000000',
        city: 'Kandy',
      });

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const callArgs = mockSendMail.mock.calls[0][0];
      expect(callArgs.to).toBe('admin@sayido.lk');
      expect(callArgs.subject).toContain('New Vendor Signup: Royal Florists');
    });

    it('should catch sendMail errors and return false without crashing', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Connection Failed'));
      const result = await service.sendPackagePurchaseUserEmail({
        to: 'user@example.com',
        visitorName: 'Kasun',
        packageName: 'Package A',
        vendorName: 'Vendor A',
        amount: 10000,
        paymentReference: 'PAY-1',
      });

      expect(result).toBe(false);
    });
  });
});
