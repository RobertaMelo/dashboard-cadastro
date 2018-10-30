import { Routes, RouterModule } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormularioCadastroComponent } from './formulario-cadastro/formulario-cadastro.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'cadastro',
        component: FormularioCadastroComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },    
    { 
    path: '**', 
    redirectTo: ''
  } 
];
export const RoutingModule = RouterModule.forRoot(routes, {useHash: true});