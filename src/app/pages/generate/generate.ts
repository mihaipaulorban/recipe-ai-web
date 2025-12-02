import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-generate',
  imports: [NgFor],
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
}
