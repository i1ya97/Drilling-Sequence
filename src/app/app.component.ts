import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cube';
  width = 100;
  height = 100;

  inputWidth(event: any) {
    this.width = event.target.value;
  }

  inputHeight(event: any) {
    this.height = event.target.value;
  }
}
