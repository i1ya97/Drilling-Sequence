import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.css']
})


export class ClusterListComponent {
  height = 15;
  positionY = 0;
  work = [
    [{color: '#6496f0', startTime: 500, duration: 50}, {color: '#f08080', startTime: 550, duration: 20},
      {color: '#aaaaaa', startTime: 570, duration: 350}]
    , [{color: '#6496f0', startTime: 600, duration: 50}, {color: '#f08080', startTime: 650, duration: 40},
      {color: '#aaaaaa', startTime: 690, duration: 350}]
    , [{color: '#6496f0', startTime: 750, duration: 50}, {color: '#f08080', startTime: 800, duration: 20},
      {color: '#aaaaaa', startTime: 820, duration: 350}]
    , [{color: '#6496f0', startTime: 850, duration: 100}, {color: '#f08080', startTime: 950, duration: 20},
      {color: '#aaaaaa', startTime: 970, duration: 290}]
  ];
  items  = [
    {id: 0, name: 'CY_k116', interval: 'N/A', type: 'N/A', RRSU: 212, oil: 280, rate: 1500, WC : 81.1, hide: false, works: this.work[0] },
    {id: 1, name: 'CY_k111', interval: 'N/A', type: 'N/A', RRSU: 212, oil: 217.5, rate: 1675, WC : 87, hide: false, works: this.work[1] },
    {id: 2, name: 'CY_k117', interval: 'N/A', type: 'N/A', RRSU: 212, oil: 150, rate: 800, WC : 81.2, hide: false, works: this.work[2] },
    {id: 3, name: 'CY_k118', interval: 'N/A', type: 'N/A', RRSU: 212, oil: 300, rate: 600, WC : 50, hide: true, works: this.work[3] }
  ];

  constructor() {
  }


  onChange(id: number) {
    const idx = this.items.findIndex(t => t.id === id);
    this.items[idx].hide = !this.items[idx].hide;
  }
}
