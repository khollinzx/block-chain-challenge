import {Injectable, UnauthorizedException} from '@nestjs/common';
import { UserRepo } from 'src/models/user/repositories/user.repo';
import {UtilsService} from "../utils/utils.service";
import {CreateUserDto} from "../../models/user/dto/create-user/create-user.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    /**
     *
     * @param repo
     * @param utils
     * @param jwtService
     */
    constructor(
        private readonly repo: UserRepo,
        private readonly utils: UtilsService,
        private jwtService: JwtService
    ) { }

    /**
     *
     * @param createUserDto
     */
    async signIn(createUserDto: CreateUserDto) {
        // console.log(createUserDto)
        const user = await this.repo.findByAttribute({walletAddress: createUserDto.walletAddress});

        if(!user) {
            await this.repo.createUser(createUserDto);

            return null
        } else if (user) {
            const payload = { sub: user.walletAddress, walletAddress: user.walletAddress };
            return {
                access_token: await this.jwtService.signAsync(payload),
                user: user
            };
        }

    }

}
