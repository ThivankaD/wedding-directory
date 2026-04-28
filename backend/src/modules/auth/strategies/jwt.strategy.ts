import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt,Strategy } from "passport-jwt";
import { VisitorService } from "../../../modules/visitor/visitor.service";
import { jwtSecret } from "../constants";
import { VisitorEntity } from "../../../database/entities/visitor.entity";
import { VendorService } from '../../vendor/vendor.service';
import { VendorEntity } from '../../../database/entities/vendor.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly visitorService: VisitorService, private readonly vendorService: VendorService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        })
    }

    async validateVisitor(validationPayload: { email: string, sub: string} ): Promise<VisitorEntity | null > {
        return await this.visitorService.getVisitorByEmail(validationPayload.email);
    }

    async validateVendor(validationPayload: { email: string, sub: string} ): Promise<VendorEntity | null > {
        return await this.vendorService.getVendorByEmail(validationPayload.email);
    }

    async validate(payload: { email: string; sub: string; role?: 'visitor' | 'vendor' }) {
        if (!payload?.email) {
            throw new UnauthorizedException('Invalid token payload');
        }

        if (payload.role === 'visitor') {
            const visitor = await this.validateVisitor(payload);
            if (!visitor) {
                throw new UnauthorizedException('Visitor not found');
            }
            return { id: visitor.id, email: visitor.email, userType: 'visitor' as const };
        }

        if (payload.role === 'vendor') {
            const vendor = await this.validateVendor(payload);
            if (!vendor) {
                throw new UnauthorizedException('Vendor not found');
            }
            return { id: vendor.id, email: vendor.email, userType: 'vendor' as const };
        }

        const visitor = await this.validateVisitor(payload);
        if (visitor) {
            return { id: visitor.id, email: visitor.email, userType: 'visitor' as const };
        }

        const vendor = await this.validateVendor(payload);
        if (vendor) {
            return { id: vendor.id, email: vendor.email, userType: 'vendor' as const };
        }

        throw new UnauthorizedException('User not found');
    }
}