import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FirebaseDatabaseService } from '../../firebase-database-service';
import { DateFormatPipe } from '../../pipes/date-format-pipe';
import { CommonModule } from '@angular/common';
import { CodeTemplateComponent } from '../../utils/code-template/code-template.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import * as moment_ from 'moment-timezone';


@Component({
  selector: 'app-admin',
  imports: [MatTableModule, MatPaginatorModule, DateFormatPipe, CommonModule, CodeTemplateComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements AfterViewInit {
  displayedColumns: string[] = ['create', 'firstName', 'lastName', 'rut', 'phone', 'address', 'code', 'url'];

  datos: any[] = [];
  dataSource!: MatTableDataSource<any>; // Define el tipo de datos de tus filas

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private firebaseService: FirebaseDatabaseService) {

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

}

// Definir el tipo de archivo de Excel
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


