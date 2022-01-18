import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreCompComponent } from './core-comp/core-comp.component';
import{HttpClientModule} from '@angular/common/http'
import { NgApexchartsModule } from "ng-apexcharts";
@NgModule({
  declarations: [
    AppComponent,
    CoreCompComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
