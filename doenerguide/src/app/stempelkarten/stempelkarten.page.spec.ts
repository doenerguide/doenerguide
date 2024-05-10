import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StempelkartenPage } from './stempelkarten.page';

describe('StempelkartenPage', () => {
  let component: StempelkartenPage;
  let fixture: ComponentFixture<StempelkartenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StempelkartenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
