import { AppConfigService } from "../../../config/app/config.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UtilsService } from "../utils.service";
import { AppConfigModule } from "../../../config/app/config.modeule";
import { faker } from "@faker-js/faker";
import { MailerConfigService } from "../../../config/mail/mailer/config.service";
import { ConfigService } from "@nestjs/config";

describe('UtilsService', () => {

  let appService: AppConfigService;
  let moduleRef: TestingModule;
  let utilService: UtilsService;

  beforeEach(async () => {
    jest.resetAllMocks();

    moduleRef = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [UtilsService, MailerConfigService, ConfigService],
    }).compile();

    utilService = moduleRef.get<UtilsService>(UtilsService);
    appService = moduleRef.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(utilService).toBeDefined();
  });

  it("should call the capitalizeFirstLetters method", () => {
    const capitalize = jest.spyOn(utilService, 'capitalizeFirstLetters');
    const word = faker.word.noun().toLowerCase();
    const res = utilService.capitalizeFirstLetters(word);

    expect(capitalize).toHaveBeenCalledWith(word);
    expect(res).toEqual(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  });

  it("should call the hashPassword method", async () => {
    const hashPassword = jest.spyOn(utilService, 'hashPassword');
    const password = faker.internet.password();
    const res = utilService.hashPassword(password);

    expect(hashPassword).toHaveBeenCalledWith(password);
    expect(res).not.toBeNull();
  });

  it("should call the comparePassword method", async () => {
    const comparePassword = jest.spyOn(utilService, 'compareHashedValue');
    const password = faker.internet.password();
    // has the password
    const res = await utilService.hashPassword(password);

    // compare the Passwords
    const result = await utilService.compareHashedValue(password, res);

    expect(comparePassword).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(comparePassword).toHaveBeenCalledWith(password, res);
  });

  it("should call the generateOTP method", async () => {
    const generateOTP = jest.spyOn(utilService, 'generateOTP');
    const totalLength = 4;
    const otp = utilService.generateOTP(totalLength);

    expect(generateOTP).toHaveBeenCalled();
    expect(otp).not.toBeNull();
    expect(generateOTP).toHaveBeenCalledTimes(1);
    expect(generateOTP).toHaveBeenCalledWith(totalLength);
    expect(otp.length).toEqual(totalLength);
  });
})
