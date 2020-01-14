import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.css']
})
export class ClusterListComponent {
  height = 15;
  colorBlur = '#6496f0';
  colorRed = '#f08080';
  colorGray = '#aaaaaa';
  positionY = 0;
  items  = [
    {startX: 500, startWidth: 50, criticalX: 550, criticalWidth: 20, finalX: 570, finalWidth: 350, name: 'CY_k116'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 280, rate: 1500, WC : 81.1},
    {startX: 600, startWidth: 50, criticalX: 650, criticalWidth: 40, finalX: 690, finalWidth: 350, name: 'CY_k111'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 217.5, rate: 1675, WC : 87},
    {startX: 750, startWidth: 50, criticalX: 800, criticalWidth: 20, finalX: 820, finalWidth: 350, name: 'CY_k117'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 150, rate: 800, WC : 81.2},
    {startX: 850, startWidth: 100, criticalX: 950, criticalWidth: 20, finalX: 970, finalWidth: 290, name: 'CY_k118'
      , interval: 'N/A', type: 'N/A', RRSU: 212, oil: 300, rate: 600, WC : 50}
  ];

  constructor() { }

}
