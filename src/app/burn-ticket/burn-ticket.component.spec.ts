import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnTicketComponent } from './burn-ticket.component';

describe('BurnTicketComponent', () => {
  let component: BurnTicketComponent;
  let fixture: ComponentFixture<BurnTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BurnTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BurnTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
