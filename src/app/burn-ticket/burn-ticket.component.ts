import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-burn-ticket',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './burn-ticket.component.html',
  styleUrl: './burn-ticket.component.scss'
})
export class BurnTicketComponent {

}
