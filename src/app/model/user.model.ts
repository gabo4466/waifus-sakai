export class UserModel {
  public _email:string;
  public _password:string;
  public _nickname:string;
  public _name:string;
  public _repPass:string;
  public _birthday:string;
  public _adultContent:boolean;
  public _terms:boolean;
  public _idUser:number;
  public _karma:number;
  public _activated: boolean;
  public _admin: boolean;
  public _banned: boolean;
  public _country: string;
  public _description: string;
  public _gender: string;
  public _theme: string;




    constructor() {
        this._email = "";
        this._password = "";
        this._nickname = "";
        this._name = "";
        this._repPass = "";
        this._adultContent = false;
        this._terms = false;
        this._birthday = "";
        this._idUser= 0;
        this._karma= 0;
        this._activated= false;
        this._admin= false;
        this._banned= false;
        this._country= "";
        this._description= "";
        this._gender= "";
        this._theme= "";

    }
    constructorProfile(activated:boolean, admin:boolean, adultContent: boolean, banned:boolean, birthday: string, country: string, description: string, email: string, gender: string, idUser: number, karma: number, name: string, nickname:string, theme: string){

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
}
