// import {Action} from '../model/action.model';
import { PHONE_10_NUMBER, PHONE_9_NUMBER } from "../helpers/constants";
import { ValidateInput } from "../_model/validate-input.model";

export class CommonFunction {

  // Hàm validate sđt
  static validatePhoneNumber(phone: any) {
    const a = phone?.toString().slice(0, 3);
    if (PHONE_9_NUMBER.find(element => element === a)) {
      if (phone.length === 9)
        return 0;
      return 1;
    } else if (PHONE_10_NUMBER.find(element => element === a)) {
      if (phone.length === 10)
        return 0;
      return 2;
    }
    return 3;
  }


  static isEmpty(data: any): boolean {
    return data == null || data === undefined || data === ''
  }

  static isNotEmpty(data: any): boolean {
    return data !== null && data !== undefined && data !== ''
  }


  static trimText(text){
    if(text !== null && text !== undefined){
      text = text.toString()
      return text.trim()
    }else{
      return null
    }
  }

  static validateInputModel(text,maxLength,regex){
    const result:ValidateInput = new ValidateInput();
    if(this.trimText(text) === null){
      result.empty = true
      return result
    }else{
      text = text.toString()
      text = text.trim()
      if(text.length === 0){
        result.empty = true
        return result
      }
      if(maxLength !== null){
        if(text.length > maxLength){
          result.maxLength = true
          return result
        }
      }
      if(regex !== null){
        if(!text.match(regex)){
          result.regex = true
          return result
        }
      }
    }
  }
  static validateInput(text,maxLength,regex){
    let result:ValidateInput = new ValidateInput();
    if(this.validateInputModel(text,maxLength,regex) !== undefined){
      result = this.validateInputModel(text,maxLength,regex)
    }

    if(result.empty === false && result.maxLength === false && result.regex === false){
      result.done = true
    }
    return result;
  }

  static validateInput2(text,isEmpty,maxLength,regex){
    let result:ValidateInput = new ValidateInput();
    if(this.validateInputModel(text,maxLength,regex) !== undefined){
      result = this.validateInputModel(text,maxLength,regex)
    }

    if(!isEmpty){
      if(result.empty === false && result.maxLength === false && result.regex === false){
        result.done = true
      }
    }else{
      if(result.maxLength === false && result.regex === false){
        result.done = true
      }
    }
    return result;
  }

  static validateInputUTF8SpaceModel(text,maxLength,regex, hasUTF8, hasSpace){
    const result:ValidateInput = new ValidateInput();
    const regexUTF8 = /[^\u0000-\u007F]+/;

    if(this.trimText(text) === null){
      result.empty = true
      return result;
    }else{
      text = text.toString()
      text = text.trim()
      if(text.length === 0){
        result.empty = true
        return result;
      }
      if(hasUTF8){
        if (regexUTF8.test(text)) {
          result.UTF8 = true
          return result;
        }
      }
      if(hasSpace){
        if (text.includes(' ')) {
          result.space = true
          return result;
        }
      }
      if(maxLength !== null){
        if(text.length > maxLength){
          result.maxLength = true
          return result;
        }
      }
      if(regex !== null){
        if(!text.match(regex)){
          result.regex = true
          return result;
        }
      }
    }
  }

  static validateInputUTF8Space(text,maxLength,regex, hasUTF8, hasSpace){
    let result:ValidateInput = new ValidateInput()
    if(this.validateInputUTF8SpaceModel(text,maxLength,regex, hasUTF8, hasSpace)!==undefined){
      result = this.validateInputUTF8SpaceModel(text,maxLength,regex, hasUTF8, hasSpace)
    }

    if(result.empty === false && result.UTF8 ===false && result.space ===false && result.maxLength === false && result.regex === false){
      result.done = true
    }
    return result;
  }

}
