export class ThreadModel{
    public _dateThread:string;
    public _name: string;
    public _content:string;


    constructor() {
        this._dateThread = "";
        this._name = "";
        this._content = "";
    }

    constructorCreateThread(dateThread:string, name:string, content:string){
        this._dateThread = dateThread;
        this._name = name.trim();
        this._content = content.trim();
    }
}
