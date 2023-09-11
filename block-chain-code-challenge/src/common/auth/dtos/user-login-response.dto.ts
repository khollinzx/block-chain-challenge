import { User } from "../../../models/user/schemas/user.schema";

export class UserLoginResponseDto {
  message: string;
  accessToken: string;
  profile: User;

  constructor(message: string, user: User, token: string) {
    this.message = message;
    this.accessToken = token;
    this.profile = user;
  }
}
