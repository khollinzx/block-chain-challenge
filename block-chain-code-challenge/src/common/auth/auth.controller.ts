import {Body, Controller, Post, UsePipes, ValidationPipe, Param, Get} from '@nestjs/common';
import { AuthService } from "./auth.service";
import {CreateUserDto} from "../../models/user/dto/create-user/create-user.dto";
import {UserLoginResponseDto} from "./dtos/user-login-response.dto";
import {AuthResponseDto} from "./dtos/auth-response.dto";

@Controller('auth')
export class AuthController {

  /**
   *
   * @param service
   */
  constructor(private readonly service: AuthService) { }

  /**
   *
   * @param createUserDto
   */
  @Post('login')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const payload = await this.service.signIn(createUserDto);

    if(!payload)
      return new AuthResponseDto("account created, kindly click again to login");

    else return new UserLoginResponseDto("successfully logged in", payload.user, payload.access_token)
  }
}
