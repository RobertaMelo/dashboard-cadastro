import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgxMaskModule} from 'ngx-mask';
import { AppComponent } from './app.component';
import { FormularioCadastroComponent } from './formulario-cadastro/formulario-cadastro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './app.router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplateComponent } from './template/template.component';
import { FormsModule, ReactiveFormsModule } from '../../node_modules/@angular/forms';
import { DadosService } from './services/dados.service';
import { StorageService } from './services/storage.service';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    FormularioCadastroComponent,
    DashboardComponent,
    TemplateComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers: [
    DadosService,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
