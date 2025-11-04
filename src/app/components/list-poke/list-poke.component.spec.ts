import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPokeComponent } from './list-poke.component';

describe('ListPokeComponent', () => {
  let component: ListPokeComponent;
  let fixture: ComponentFixture<ListPokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPokeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
