import {Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styles: [
  ]
})
export class SearchBarComponent implements OnInit {

    @Output("term")  termEvent = new EventEmitter<string>();
    fg: FormGroup;

    constructor( private fb: FormBuilder, ) {
        this.createForm();

    }

    ngOnInit(): void {
    }

    keyPress(){
        this.termEvent.emit(this.fg.get("term").value);
    }

    createForm(){
        this.fg = this.fb.group({
            term: [""]
        });
    }

}
