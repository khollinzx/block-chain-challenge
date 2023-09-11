import {Controller, Post, Body, UsePipes, ValidationPipe, Get, Param} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user/create-user.dto";
import {UserService} from "./user.service";
import {UserLoginResponseDto} from "../../common/auth/dtos/user-login-response.dto";


@Controller('user')
export class UserController {

    /**
     *
     * @param service
     */
    constructor(private readonly service: UserService) { }

    @Post('add')
    @UsePipes(ValidationPipe)
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.service.createUser(createUserDto);
    }
}
