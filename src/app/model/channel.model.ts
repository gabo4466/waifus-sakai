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

    constructorCreateChannel(dateChannel: string, description: string, photo: string, banner: string, name: string) {
        this._dateChannel = dateChannel;
        this._description = description;
        this._photo = photo;
        this._banner = banner;
        this._name = name;
    }


}
