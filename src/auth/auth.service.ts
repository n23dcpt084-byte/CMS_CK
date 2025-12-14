import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    // Hardcoded Admin Credentials for Student Project Simplified Scope
    private readonly ADMIN_USER = {
        email: 'admin@cms.com',
        password: 'admin', // Simple password for demo
        role: 'admin',
        _id: 'admin_id_001', // Mock ID
    };

    /**
     * Validates user credentials against hardcoded admin.
     * In a real app, this would check the database and hash passwords.
     */
    async validateUser(email: string, pass: string): Promise<any> {
        if (email === this.ADMIN_USER.email && pass === this.ADMIN_USER.password) {
            // Return user without password
            const { password, ...result } = this.ADMIN_USER;
            return result;
        }
        return null;
    }

    /**
     * Generates a JWT token for the admin.
     */
    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Payload for the JWT
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
