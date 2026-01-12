import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeService],
    });
    service = TestBed.inject(RecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate structured recipes when ingredients exist', () => {
    const ideas = service.generateFakeRecipes(['pomodoro', 'basilico']);
    expect(ideas.length).toBe(3);
    expect(ideas[0].title).toContain('pomodoro');
    expect(ideas[0].steps.length).toBeGreaterThan(0);
    expect(ideas[0].ingredients[0].quantity).toContain('g');
    expect(ideas[0].servings).toBe(service.getServings());
  });
});
