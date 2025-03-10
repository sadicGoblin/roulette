import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDatabaseService } from '../firebase-database-service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-burn-ticket',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './burn-ticket.component.html',
  styleUrl: './burn-ticket.component.scss'
})
export class BurnTicketComponent {
  code!: string;
  ticketForm!: FormGroup;

  buttonStatus = true;

  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private firebaseService: FirebaseDatabaseService) { }

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      codigoTicket: ['', Validators.required] // Crea el FormGroup con control de validación
    });
    // Obtener el valor del parámetro 'id'
    this.route.paramMap.subscribe(params => {
      this.code = params.get('code') || '';
      console.log('CODE recibido:', this.code);
      this.ticketForm.get('codigoTicket')?.setValue(this.code);
      // this.ticketForm.get('codigoTicket')?.disabled;
      // Aquí puedes utilizar el id para cargar datos, etc.
    });
  }

  onSubmit(): void {
    this.buttonStatus = false;
    if (this.ticketForm.valid) {
      console.log('Formulario enviado:', this.ticketForm.get('codigoTicket')?.value);
      const code: string = this.ticketForm.get('codigoTicket')?.value;
      this.firebaseService.updateCodeStatus(code, 'O') // Reemplaza 12345 por el código que deseas buscar.
        .then(() => {
          console.log('Registro actualizado con éxito');
          this.snackBar('Registro actualizado con éxito');
          this.ticketForm.get('codigoTicket')?.setValue("");
          window.close();
        })
        .catch(error => {
          console.error(error); // Manejo del error.
        });
      // Aquí puedes manejar la lógica para quemar el ticket
    }
  }

  snackBar(msg:string){
    this._snackBar.open(msg, "Listo", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

}
