import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClusterListComponent } from './cluster-list/cluster-list.component';
import { PadListComponent } from './pad-list/pad-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ClusterListComponent,
    PadListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
