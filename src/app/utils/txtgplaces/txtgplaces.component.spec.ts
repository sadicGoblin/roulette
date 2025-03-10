import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxtgplacesComponent } from './txtgplaces.component';

describe('TxtgplacesComponent', () => {
  let component: TxtgplacesComponent;
  let fixture: ComponentFixture<TxtgplacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TxtgplacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxtgplacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
