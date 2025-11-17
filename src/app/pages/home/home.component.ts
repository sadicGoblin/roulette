import { Component, ElementRef, AfterViewInit, ViewChild, inject, platformCore } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseDatabaseService } from '../../firebase-database-service';
import moment from 'moment';
import { WhatsappService } from '../../services/wp-service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  formStatus = false;
  buttonStatus = true;
  isLoading = false;
  generatedCode = '';

  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private firebaseService: FirebaseDatabaseService,
    private whatsappService: WhatsappService) {

    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      empresa: ['', Validators.required],
      create: [moment().toISOString()],
      code: '-',
      codeStatus: 'P'
    });
  }

  ngAfterViewInit(): void {

    
  }


  async onSubmit(event: Event) {

    event.preventDefault();
    this.isLoading = true;
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
      
      try {
        // Generar código y guardar directamente
        const code = await this.firebaseService.generateCode();
        this.registrationForm.get('code')?.setValue(code);
        this.saveData();
        
      } catch (error) {
        console.error('Error al guardar:', error);
        this._snackBar.open('Error al guardar el formulario. Por favor intente nuevamente.', 'Cerrar', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 5000
        });
        this.isLoading = false;
      }
    } else {
      this.registrationForm.markAllAsTouched();
      this.isLoading = false;
    }
  }

  saveData() {

    this.buttonStatus = false;
    let obj:any = this.normalizeFormGroup(this.registrationForm);
    console.log('obj', obj)
    this.firebaseService.pushData('records', obj)
      .then(key => {
        console.log('Dato agregado con clave:', key);
        let name = obj['firstName'];
        let code = obj['code'];
        let to = '569' + obj['phone'];
        // this.sendWhatsappMessage(name, code, to);

        this.generatedCode = code;
        this.registrationForm.reset();
        this.formStatus = true;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error al agregar el dato:', error);
        this._snackBar.open('Error al agregar el dato: ' + error, "Listo", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        this.buttonStatus = true;
        this.isLoading = false;
        // Muestra un mensaje de error al usuario
      });
  }

  

  normalizeFormGroup(formGroup: FormGroup): any {
    const formValue = formGroup.value;
    const normalizedData: any = {};

    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        let value = formValue[key];
        if (key !== 'create' && key !== 'mail') {
          if (typeof value === 'string') {
            normalizedData[key] = this.normalizeName(value);
          } else {
            normalizedData[key] = value;
          }
        } else {
          normalizedData[key] = value;
        }
      }
    }
    return normalizedData;
  }

  normalizeName(name: string): string {
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // Eliminar acentos
    return name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()); // Capitalizar cada palabra
  }

  // services

  sendWhatsappMessage(name:string, code:string, to:string): void {
    console.log('sendWhatsappMessage', name, code, to)
    this.whatsappService.sendMessage(name, code, to).subscribe(
      (response: any) => { // <--- Especifica el tipo aquí
        console.log('Respuesta del servidor:', response);
        // Maneja la respuesta.  Puedes acceder a response.message, response.response, etc.
      },
      (error: any) => { // <--- Especifica el tipo aquí
        console.error('Error al enviar el mensaje:', error);
        // Maneja el error. Puedes acceder a error.error para obtener detalles del error.
      }
    );
  }

}
