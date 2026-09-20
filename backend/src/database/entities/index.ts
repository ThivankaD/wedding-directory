import { BudgetItemEntity } from './budget_item.entity';
import { BudgetToolEntity } from './budget_tool.entity';
import { ChecklistEntity } from './checklist.entity';
import { GuestListEntity } from './guestlist.entity';
import { MyVendorsEntity } from './myVendors.entity';
import { OfferingEntity } from './offering.entity';
import { PackageEntity } from './package.entity';
import { PaymentEntity } from './payment.entity';
import { ReviewEntity } from './review.entity';
import { VendorEntity } from './vendor.entity';
import { VisitorEntity } from './visitor.entity';

import { PasswordResetOtpEntity } from './password_reset_otp.entity';
import { PackageApprovalRequestEntity } from './package-approval-request.entity';
import { OfferingMediaEntity } from './offering-media.entity';
import { PackageFeatureEntity } from './package-feature.entity';
import { PackageViewEntity } from './package-view.entity';

export function getEntities() {
  return [
    VisitorEntity,
    ReviewEntity,
    BudgetItemEntity,
    BudgetToolEntity,
    ChecklistEntity,
    GuestListEntity,
    MyVendorsEntity,
    OfferingEntity,
    OfferingMediaEntity,
    PackageEntity,
    PackageFeatureEntity,
    PackageViewEntity,
    PaymentEntity,
    VendorEntity,
    PasswordResetOtpEntity,
    PackageApprovalRequestEntity,
  ];
}