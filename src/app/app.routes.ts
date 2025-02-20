import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BurnTicketComponent } from './burn-ticket/burn-ticket.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ticket', component: BurnTicketComponent },
];
