import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseDatabaseService } from '../../firebase-database-service';
import { DateFormatPipe } from '../../pipes/date-format-pipe';
import { CommonModule } from '@angular/common';
import { CodeTemplateComponent } from '../../utils/code-template/code-template.component';
import { BurnTicketModalComponent } from '../../utils/burn-ticket-modal/burn-ticket-modal.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import * as moment_ from 'moment-timezone';


@Component({
  selector: 'app-admin',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, DateFormatPipe, CommonModule, CodeTemplateComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements AfterViewInit {
  displayedColumns: string[] = ['create', 'firstName', 'lastName', 'rut', 'phone', 'address', 'code', 'url'];

  datos: any[] = [];
  dataSource!: MatTableDataSource<any>; // Define el tipo de datos de tus filas

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private firebaseService: FirebaseDatabaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

  }

  ngAfterViewInit(): void {
    this.getData();

  }



  getData() {
    console.log('get data!');
    this.firebaseService.getData('records').subscribe(data => {
      if (data) {
        let datos: any[] = [];
        datos = Object.values(data); //  si la base de datos es un JSON
        const uniqueItems = datos.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.create === item.create // Ajusta esta condición según los atributos que consideres para verificar duplicados
          ))
        );

        this.datos = uniqueItems;
        this.dataSource = new MatTableDataSource(this.datos.reverse());
        this.dataSource.paginator = this.paginator;
        console.log('data', this.datos);
      }
    });
  }

  exportarAExcel(): void {

    this.datos.forEach(item => {
      // Convierte la fecha en formato ISO a un objeto Moment.js.
      const originalDate = moment(item.create);

      // Resta 3 horas
      const adjustedDate = originalDate.subtract(3, 'hours');

      // Asigna la fecha ajustada de nuevo en formato ISO
      item.create = adjustedDate.toISOString();
    });
    // Convertir los datos a un formato que Excel pueda entender
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datos);

    // Crear un libro de trabajo y agregar la hoja de cálculo
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mis Datos');

    // Generar el archivo Excel
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Crear un Blob para el archivo
    const blob: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });

    // Usar file-saver para guardar el archivo
    saveAs(blob, 'datos.xlsx');
  }

  eliminarBaseDatos(): void {
    // Mostrar prompt para la clave
    const password = prompt('Ingresa la clave para eliminar la base de datos:');
    
    if (password === '357357') {
      // Si la clave es correcta, mostrar confirmación
      const confirmacion = confirm('¿Estás seguro de que quieres eliminar toda la base de datos? Esta acción no se puede deshacer.');
      
      if (confirmacion) {
        this.ejecutarEliminacionBaseDatos();
      }
    } else if (password !== null) {
      // Solo mostrar error si no fue cancelado (password !== null)
      alert('Clave incorrecta. No se puede eliminar la base de datos.');
    }
  }

  ejecutarEliminacionBaseDatos(): void {
    this.firebaseService.deleteAllData('records').subscribe({
      next: () => {
        this.snackBar.open('Base de datos eliminada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        // Actualizar la tabla
        this.getData();
        window.location.reload();
      },
      error: (error: any) => {
        console.error('Error al eliminar la base de datos:', error);
        this.snackBar.open('Error al eliminar la base de datos', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirModalQuemar(codigo?: string) {
    const dialogRef = this.dialog.open(BurnTicketModalComponent, {
      width: 'auto',
      data: { code: codigo }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Actualizar la tabla después de cerrar el modal
      this.getData();
    });
  }

}

// Definir el tipo de archivo de Excel
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


