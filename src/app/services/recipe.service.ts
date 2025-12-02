import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  ingredients: string[] = [];
  fakeResults: string[] = [];

  generateFakeRecipes(ingredients: string[]): string[] {
    if (ingredients.length === 0) return [];

    return [
      `Ricetta con ${ingredients[0]}`,
      `Piatto rapido con ${ingredients.join(', ')}`,
      `Idea creativa usando ${ingredients[ingredients.length - 1]}`,
    ];
  }
  setIngredients(ings: string[]) {
    this.ingredients = [...ings];
  }

  getIngredients(): string[] {
    return this.ingredients;
  }

  setFakeResults(results: string[]) {
    this.fakeResults = [...results];
  }

  getFakeResults(): string[] {
    return this.fakeResults;
  }
}
