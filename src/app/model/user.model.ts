export class UserModel {
  public _email:string;
  public _password:string;
  public _nickname:string;
  public _name:string;
  public _repPass:string;
  public _birthday:string;
  public _adultContent:boolean;
  public _terms:boolean;
  public _date:Date;

    constructor() {
        this._email = "";
        this._password = "";
        this._nickname = "";
        this._name = "";
        this._repPass = "";
        this._date = new Date(0);
        this._adultContent = false;
        this._terms = false;
        this._birthday = "";
    }
    constructorLogIn(email:string, password:string){
        this._email = email;
        this._password = password;
    }
}
