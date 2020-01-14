import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-well-list',
  templateUrl: './well-list.component.html',
  styleUrls: ['./well-list.component.css']
})
export class WellListComponent {
  height = 15;
  colorYellow = '#ffa500';
  colorBlue = '#6495ed';
  colorGray = '#aaaaaa';
  colorDark = '#696969';
  colorRed = '#f08080';
  positionY = 0;
  items  = [
    {NKX: 850, NKWidth: 10, PX: 900, PWidth: 40, hookupX: 1020, hookupWidth: 60, fracX: 1150, fracWidth: 60
      , name: '01 US-24062', interval: '5m', type: 'Prod.', RRSU: 64, oil: 40, rate: 100, WC : 60},
    {NKX: 850, NKWidth: 10, PX: 860, PWidth: 20, hookupX: 1020, hookupWidth: 60, fracX: 1225, fracWidth: 35
      , name: '02 US-24072', interval: '10m', type: 'Inj.', RRSU: 81, oil: 20, rate: 250, WC : 100},
    {NKX: 860, NKWidth: 10, PX: 900, PWidth: 40, hookupX: 1020, hookupWidth: 60, fracX: 1135, fracWidth: 40
      , name: '03 US-3028', interval: '15m', type: 'W/S', RRSU: 42, oil: 'N/A', rate: 1200, WC : 100},
    {NKX: 880, NKWidth: 10, PX: 900, PWidth: 40, hookupX: 1020, hookupWidth: 60, fracX: 1095, fracWidth: 35
      , criticalX: 950, criticalWidth: 20
      , name: '04 US-24061', interval: '20m', type: 'Prod.', RRSU: 25, oil: 157.5, rate: 225, WC : 30}
  ];

  constructor() { }
}
