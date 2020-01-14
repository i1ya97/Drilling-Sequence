import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClusterListComponent } from './cluster-list/cluster-list.component';
import { WellListComponent } from './well-list/well-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ClusterListComponent,
    WellListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
