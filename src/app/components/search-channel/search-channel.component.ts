import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-search-channel',
    templateUrl: './search-channel.component.html',
    styleUrls: ['./search-channel.component.scss'],
    providers: [MessageService]
})
export class SearchChannelComponent implements OnInit {

  constructor( private serviceMessage: MessageService ) {

  }

  ngOnInit(): void {
  }

}
