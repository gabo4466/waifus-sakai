export class UserModel {
  public _email:string;
  public _password:string;
  public _nickname:string;
  public _name:string;
  public _repPass:string;
  public _birthday:string;
  public _adultContent:boolean;
  public _terms:boolean;

    constructor() {
        this._email = "";
        this._password = "";
        this._nickname = "";
        this._name = "";
        this._repPass = "";
        this._adultContent = false;
        this._terms = false;
        this._birthday = "";
    }
    constructorLogIn(email:string, password:string){
        this._email = email;
        this._password = password;
    }
    constructorRegister(email:string, password:string, nickname:string, name:string, repPass:string, birthday:string, adultContent:boolean, terms:boolean) {
        this._email = email;
        this._password = password;
        this._nickname = nickname;
        this._name = name;
        this._repPass = repPass;
        this._adultContent = adultContent;
        this._terms = terms;
        this._birthday = birthday;
    }
    constructorEmail(email:string) {
        this._email = email;
    }
    constructorNickname(nickname:string) {
        this._nickname = nickname;
    }
}
