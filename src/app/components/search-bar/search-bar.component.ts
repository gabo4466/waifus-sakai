import {Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styles: [
  ]
})
export class SearchBarComponent implements OnInit {

    @Output("term")  termEvent = new EventEmitter<string>();

    constructor() { }

    ngOnInit(): void {
    }

}
