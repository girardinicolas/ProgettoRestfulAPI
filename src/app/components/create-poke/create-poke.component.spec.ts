import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePokeComponent } from './create-poke.component';

describe('CreatePokeComponent', () => {
  let component: CreatePokeComponent;
  let fixture: ComponentFixture<CreatePokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePokeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
