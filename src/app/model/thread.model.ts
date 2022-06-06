export class ThreadModel{
    public _dateThread:string;
    public _name: string;
    public _content:string;


    constructor(dateThread: string, name: string, content: string) {
        this._dateThread = dateThread;
        this._name = name;
        this._content = content;
    }
}
