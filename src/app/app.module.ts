import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WellListComponent } from './well-list/well-list.component';

@NgModule({
  declarations: [
    AppComponent,
    WellListComponent,
    WellListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
