import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeIdea, RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './generate.html',
  styleUrl: './generate.css',
})
export class GenerateComponent implements OnInit {
  ingredients: string[] = [];
  fakeResults: RecipeIdea[] = [];
  savedRecipes: RecipeIdea[] = [];
  newIngredient = '';
  servings = 2;
  isGenerating = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.syncState();
  }

  get promptPreview(): string {
    if (this.ingredients.length === 0) {
      return 'Aggiungi almeno un ingrediente per generare ricette.';
    }
    return `Crea 3 ricette con ${this.ingredients.join(
      ', '
    )} per ${this.servings} persone. Voglio piatti veloci, equilibrati e con ingredienti di base.`;
  }

  addIngredient() {
    if (!this.newIngredient.trim()) return;
    this.recipeService.addIngredient(this.newIngredient);
    this.newIngredient = '';
    this.syncPantry();
  }

  removeIngredient(index: number) {
    this.recipeService.removeIngredient(index);
    this.syncPantry();
  }

  updateServings(value: number | string) {
    const next = typeof value === 'string' ? Number(value) : value;
    this.servings = Math.max(1, Math.min(12, Math.round(next || 1)));
    this.recipeService.setServings(this.servings);
  }

  regenerate() {
    if (!this.ingredients.length) return;
    this.isGenerating = true;
    const results = this.recipeService.generateFakeRecipes(this.ingredients, this.servings);
    this.recipeService.setFakeResults(results);
    this.fakeResults = results;
    setTimeout(() => {
      this.isGenerating = false;
    }, 400);
  }

  saveRecipe(recipe: RecipeIdea) {
    this.recipeService.saveRecipe(recipe);
    this.syncAfterSave();
  }

  toggleFavorite(recipe: RecipeIdea) {
    this.recipeService.toggleFavorite(recipe.id);
    this.savedRecipes = this.recipeService.getSavedRecipes();
  }

  removeSaved(id: string) {
    this.recipeService.removeSavedRecipe(id);
    this.savedRecipes = this.recipeService.getSavedRecipes();
  }

  clearSaved() {
    this.recipeService.clearSavedRecipes();
    this.savedRecipes = [];
  }

  clearPantry() {
    this.recipeService.clearIngredients();
    this.ingredients = [];
  }

  private syncPantry() {
    this.ingredients = this.recipeService.getIngredients();
  }

  private syncAfterSave() {
    this.fakeResults = this.recipeService.getFakeResults();
    this.savedRecipes = this.recipeService.getSavedRecipes();
  }

  private syncState() {
    this.syncPantry();
    this.fakeResults = this.recipeService.getFakeResults();
    this.savedRecipes = this.recipeService.getSavedRecipes();
    this.servings = this.recipeService.getServings();
  }
}
