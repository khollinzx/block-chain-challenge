import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AppConfigService } from "../../config/app/config.service";
import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose";

@Injectable()
export class UtilsService {

  /**
   *
   * @param appService
   */
  constructor(private readonly appService: AppConfigService) {}

  /**
   *
   * @param str
   */
  public capitalizeFirstLetters(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  /**
   *
   * @param passwordToBeHashed
   */
  public async hashPassword(passwordToBeHashed: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.appService.saltOrRounds); // this enables unique salt per User
    return await bcrypt.hash(passwordToBeHashed, salt);
  }

  /**
   *
   * @param len
   */
  generatePassword(len: number = 8) {
    let length = (len)?(len):(10);
    let string = "abcdefghijklmnopqrstuvwxyz"; //to upper
    let numeric = '0123456789';
    let punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    let password = "";
    let character = "";
    let crunch = true;

    while( password.length<length ) {
      const entity1 = Math.ceil(string.length * Math.random()*Math.random());
      const entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
      const entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
      let hold = string.charAt( entity1 );
      hold = (password.length % 2 == 0)?(hold.toUpperCase()):(hold);
      character += hold;
      character += numeric.charAt( entity2 );
      character += punctuation.charAt( entity3 );
      password = character;
      crunch = false;
    }

    password = password.split('').sort(function(){
      return 0.5 - Math.random();
    }).join('');
    return password.substr(0, len);
  }

  /**
   *
   * @param value
   * @param keys
   */
  getObjectKeyByValue = (value, keys) => {
    return Object.keys(keys).find(key => keys[key] === value);
  }

  /**
   *
   * @param pwd
   * @param hashedPwd
   */
  async compareHashedValue(pwd: string, hashedPwd:string): Promise<boolean> {
    return await bcrypt.compare(pwd, hashedPwd);
  }

  /**
   *
   * @param password
   */
  public async getHashedPwd(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  /**
   *
   * @param objectId
   */
  matchObjectId(objectId: string): boolean {
    return mongoose.isValidObjectId(objectId);
  }

  /**
   *
   * @param length
   */
  generateRandomString(length: number = 20): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  // Function to generate OTP
  generateOTP(totalNumber: number = 4): string {
    // Declare a digits variable
    // which stores all digits
    let digits = '0123456789';
    let OTP = '';

    for (let i = 0; i < totalNumber; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
  }

  /**
   *
   * @param queryObject
   * @param collectionKey
   * @param value
   */
  convertToQueryObject (queryObject: object, collectionKey: string, value: any) : object {
    // add exempted keys here
    const exception = [ '_id', 'id', 'userId', 'adminId' ];

    return exception.includes(collectionKey) ?
      {
        ...queryObject,
        ...{ [collectionKey]: `${ value }`}
      }
      :
      {
        ...queryObject,
        ...{ [collectionKey]: { '$regex': `${ value }`} }
      };
  }

  /**
   * This is used to load a Class dynamically
   *
   * @param absoluteClassFile
   * @param externalService
   * @param configService
   * @param otherService
   */
  public dynamicallyLoadClassImplementation = async (
    absoluteClassFile: string,
    externalService: any = null,
    configService: any = null,
    otherService: any = null,
  ): Promise<any> => {
    if (!absoluteClassFile) return null;
    try {
      // get the implementation path
      let provider = await import(`${ absoluteClassFile }`);
      if (typeof provider !== 'object') return null;

      return externalService ?
        await new provider[Object.keys(provider)[0]](externalService, configService, otherService)
        :
        await new provider[Object.keys(provider)[0]]();

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   *
   * @param letters
   */
  public createAlias(letters: string): string {
    letters = letters.replace(/\s+/g, '-');

    return letters.toLowerCase();
  }

  /**
   *
   * @param codes
   * @param columnKey
   */
  generateUUID(codes: any = [], columnKey: string): string {
    let uuid: any;
    let started: boolean = true;
    if (!codes.length) return uuidv4();

    while (started) {
      uuid = uuidv4();
      const isFound = codes.some((element): boolean => {
        return element[columnKey] === uuid;
      });

      if (!isFound) started = false;
    }

    return uuid;
  }

  /**
   *
   * @param codes
   * @param columnKey
   * @param length
   * @param prefix
   */
  generateTransactionReference(
    codes: any = [],
    columnKey: string,
    length: number = 10,
    prefix: string = null
  ): string {
    let refCode: string = '';
    let started: boolean = true;

    if (!codes.length) {
      return prefix + this.generateRandomString(length).toUpperCase();
    }

    while (started) {
      refCode = prefix + this.generateRandomString(length).toUpperCase();
      const isFound = codes.some((element) => {
        return element[columnKey] === refCode;
      });

      if (!isFound) started = false;
    }

    return refCode.toUpperCase();
  }
}
