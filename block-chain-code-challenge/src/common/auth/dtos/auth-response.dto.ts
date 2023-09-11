import { User } from "../../../models/user/schemas/user.schema";

export class AuthResponseDto {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
