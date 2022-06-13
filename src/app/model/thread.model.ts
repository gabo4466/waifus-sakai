export class ThreadModel{
    public _dateThread:string;
    public _name: string;
    public _content:string;
    public _idThread:number;
    public _idChannel:number;
    public _idUser:number;


    constructor() {
        this._dateThread = "";
        this._name = "";
        this._content = "";
        this._idThread = 0;
        this._idChannel =0;
        this._idUser = 0;
    }

    constructorCreateThread(dateThread:string, name:string, content:string){
        this._dateThread = dateThread;
        this._name = name.trim();
        this._content = content.trim();
    }
    constructorShowThread(dateThread:string, name:string, content:string, idThread:number, idChannel:number, idUser:number) {
        this._dateThread = dateThread;
        this._name = name.trim();
        this._content = content.trim();
        this._idThread = idThread;
        this._idChannel = idChannel;
        this._idUser = idUser;
    }
}
