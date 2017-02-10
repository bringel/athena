import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { PromiseHttpService } from './promise-http.service';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    PromiseHttpService
  ]
})
export class PromiseHttpModule { }
