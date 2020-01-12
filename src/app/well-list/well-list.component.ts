import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-well-list',
  templateUrl: './well-list.component.html',
  styleUrls: ['./well-list.component.css']
})
export class WellListComponent {
  colorBlur = '#6496f0';
  colorRed = '#f08080';
  colorGray = '#aaaaaa';
  positionY = 0;
  height = 15;
  items  = [
    {oneX: 500, oneWidth: 50, twoX: 550, twoWidth: 20, threeX: 570, threeWidth: 280, name: 'CY_k116'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 280, rate: 1500, WC : 81.1},
    {oneX: 600, oneWidth: 50, twoX: 650, twoWidth: 40, threeX: 690, threeWidth: 280, name: 'CY_k111'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 217.5, rate: 1675, WC : 87},
    {oneX: 750, oneWidth: 50, twoX: 800, twoWidth: 20, threeX: 820, threeWidth: 280, name: 'CY_k117'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 150, rate: 800, WC : 81.2},
    {oneX: 850, oneWidth: 100, twoX: 950, twoWidth: 20, threeX: 970, threeWidth: 220, name: 'CY_k118'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 300, rate: 600, WC : 50}
  ];

  constructor() { }

}
