import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BurnTicketComponent } from './burn-ticket/burn-ticket.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'ticket/:code', component: BurnTicketComponent },
];
