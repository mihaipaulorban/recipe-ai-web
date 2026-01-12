import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RecipeIdea, RecipeService } from '../../services/recipe.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  pageTitle = 'Cook smarter, not harder!';
  userIngredient = '';
  ingredients: string[] = [];
  deleteMode = false;
  fakeResults: RecipeIdea[] = [];
  savedPreview: RecipeIdea[] = [];
  servings = 2;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.ingredients = this.recipeService.getIngredients();
    this.fakeResults = this.recipeService.getFakeResults();
    this.savedPreview = this.recipeService.getSavedRecipes().slice(0, 2);
    this.servings = this.recipeService.getServings();
  }

  addIngredient() {
    if (!this.userIngredient.trim()) return;
    this.recipeService.addIngredient(this.userIngredient);
    this.ingredients = this.recipeService.getIngredients();
    this.userIngredient = '';
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
  }

  removeIngredient(index: number) {
    this.recipeService.removeIngredient(index);
    this.ingredients = this.recipeService.getIngredients();
  }

  get promptPreview(): string {
    if (this.ingredients.length === 0) {
      return 'Aggiungi almeno un ingrediente per vedere la richiesta che manderemo all’AI.';
    }
    const list = this.ingredients.join(', ');
    return `Ho questi ingredienti: ${list}. Suggerisci 3 ricette semplici, gustose e facili da preparare per ${this.servings} porzioni.`;
  }

  generateRecipes() {
    this.fakeResults = this.recipeService.generateFakeRecipes(this.ingredients, this.servings);
    this.recipeService.setFakeResults(this.fakeResults);
    this.savedPreview = this.recipeService.getSavedRecipes().slice(0, 2);
  }

  clearIngredients() {
    this.recipeService.clearIngredients();
    this.ingredients = [];
  }

  viewRecipe(recipe: RecipeIdea) {
    this.recipeService.saveRecipe(recipe);
    this.savedPreview = this.recipeService.getSavedRecipes().slice(0, 2);
  }

  goToGenerate() {
    this.recipeService.setIngredients(this.ingredients);
    if (this.fakeResults.length) {
      this.recipeService.setFakeResults(this.fakeResults);
    }
  }
}
