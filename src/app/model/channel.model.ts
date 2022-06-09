export class ChannelModel{
    public _dateChannel: string;
    public _description: string;
    public _photo: string;
    public _banner: string;
    public _name: string;


    constructor() {
        this._dateChannel = "";
        this._description = "";
        this._photo = "";
        this._banner = "";
        this._name = "";
    }

    constructorCreateChannel(dateChannel: string, description: string, name: string) {
        this._dateChannel = dateChannel;
        this._description = description.trim();
        this._name = name.trim();
    }

    constructorShowChannel(dateChannel: string, description: string, name: string, photo:string) {
        this._dateChannel = dateChannel;
        this._description = description.trim();
        this._name = name.trim();
        this._photo = photo;
    }




}
