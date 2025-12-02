import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './generate.html',
  styleUrl: './generate.css',
})
export class GenerateComponent implements OnInit {
  ingredients: string[] = [];
  fakeResults: string[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.ingredients = this.recipeService.getIngredients();
    this.fakeResults = this.recipeService.getFakeResults();
  }

  regenerate() {
    // niente loader per ora: rigeneriamo e basta
    this.fakeResults = this.recipeService.generateFakeRecipes(this.ingredients);
    this.recipeService.setFakeResults(this.fakeResults);
  }
}
