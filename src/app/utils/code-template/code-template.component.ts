import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-code-template',
  standalone: true,
  imports: [CommonModule],
  template: `
  <ng-container *ngIf="isLink">
  <a href="/ticket/{{code}}" target="_blank" >
      <b>{{ code }}</b>
    </a>
  </ng-container>

  <ng-container *ngIf="!isLink">
  <b>{{ code }}</b>
  </ng-container> 
  `,
  styles: [`
    .tachado {
      text-decoration: line-through;
      color: gray;
    }
    a{
    color: #1135F5;
    font-weight: 500;
  }
  `]
})
export class CodeTemplateComponent {
  @Input() codeStatus!: string;
  @Input() code!: string;

  isLink = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['codeStatus']) {
      if (this.codeStatus) {
        if (this.codeStatus === 'O') {
          this.isLink = false;
        }
      }
    }
  }

}