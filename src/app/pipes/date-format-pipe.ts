import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): string {
    if (!value) {
      return ''; //Maneja el caso de valor nulo o indefinido
    }
    if (typeof value === "string"){
        return moment(value).format('DD/MM/YYYY');
    }
    if (typeof value === "number"){
        return moment(value).format('DD/MM/YYYY');
    }
    return moment(value).format('DD/MM/YYYY');
  }
}