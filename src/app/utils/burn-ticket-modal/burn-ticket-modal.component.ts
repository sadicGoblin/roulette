import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseDatabaseService } from '../../firebase-database-service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export interface BurnTicketData {
  code?: string;
}

@Component({
  selector: 'app-burn-ticket-modal',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './burn-ticket-modal.component.html',
  styleUrl: './burn-ticket-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BurnTicketModalComponent {
  ticketForm!: FormGroup;
  buttonStatus = true;

  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public dialogRef: MatDialogRef<BurnTicketModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BurnTicketData,
    private fb: FormBuilder,
    private firebaseService: FirebaseDatabaseService
  ) {
    this.ticketForm = this.fb.group({
      codigoTicket: [data.code || '', Validators.required]
    });
  }

  onSubmit(): void {
    this.buttonStatus = false;
    if (this.ticketForm.valid) {
      const code: string = this.ticketForm.get('codigoTicket')?.value;
      this.firebaseService.updateCodeStatus(code, 'O')
        .then(() => {
          console.log('Registro actualizado con éxito');
          this.snackBar('Ticket quemado exitosamente');
          this.ticketForm.get('codigoTicket')?.setValue("");
          this.buttonStatus = true;
        })
        .catch(error => {
          console.error(error);
          this.snackBar('Ticket ya fue quemado o no fue encontrado');
          this.buttonStatus = true;
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  snackBar(msg: string) {
    this._snackBar.open(msg, "Listo", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
