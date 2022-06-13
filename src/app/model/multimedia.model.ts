export class MultimediaModel{
    public _directory:string;


    constructor() {
        this._directory = "";
    }

    constructorCreateMultimedia(directory: string) {
        this._directory = directory;
    }
}
