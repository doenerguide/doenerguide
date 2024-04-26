import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoeneraccountPage } from './doeneraccount.page';

describe('DoeneraccountPage', () => {
  let component: DoeneraccountPage;
  let fixture: ComponentFixture<DoeneraccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DoeneraccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
