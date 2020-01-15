import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-well-list',
  templateUrl: './pad-list.component.html',
  styleUrls: ['./pad-list.component.css']
})
export class PadListComponent {
  height = 15;
  positionY = 0;
  work = [
    [{color: '#ffa500', startTime: 850, duration: 10}, {color: '#6495ed', startTime: 900, duration: 40},
      {color: '#aaaaaa', startTime: 1020, duration: 60}, {color: '#696969', startTime: 1150, duration: 60}]
    , [{color: '#ffa500', startTime: 850, duration: 10}, {color: '#6495ed', startTime: 860, duration: 20},
      {color: '#aaaaaa', startTime: 1020, duration: 60}, {color: '#696969', startTime: 1225, duration: 35}]
    , [{color: '#ffa500', startTime: 860, duration: 10}, {color: '#6495ed', startTime: 900, duration: 40},
      {color: '#aaaaaa', startTime: 1020, duration: 60}, {color: '#696969', startTime: 1135, duration: 40}]
    , [{color: '#ffa500', startTime: 880, duration: 10}, {color: '#6495ed', startTime: 900, duration: 40},
      {color: '#aaaaaa', startTime: 1020, duration: 60}, {color: '#696969', startTime: 1095, duration: 35},
      {color: '#f08080', startTime: 950, duration: 20}]
  ];
  items  = [
    {id: 0, name: '01 US-24062', interval: '5m', type: 'Prod.', RRSU: 64, oil: 40, rate: 100, WC : 60, works: this.work[0]},
    {id: 1, name: '02 US-24072', interval: '10m', type: 'Inj.', RRSU: 81, oil: 20, rate: 250, WC : 100, works: this.work[1]},
    {id: 2, name: '03 US-3028', interval: '15m', type: 'W/S', RRSU: 42, oil: 'N/A', rate: 1200, WC : 100, works: this.work[2]},
    {id: 3, name: '04 US-24061', interval: '20m', type: 'Prod.', RRSU: 25, oil: 157.5, rate: 225, WC : 30, works: this.work[3]}
  ];

  constructor() {}
}
