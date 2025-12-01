import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  pageTitle = 'Cook smarter, not harder!';
  userIngredient = '';
  ingredients: string[] = [];
  deleteMode = false;

  addIngredient() {
    //Se la stringa è vuota o contiene solo spazi bianchi, non fare nulla
    if (!this.userIngredient.trim()) return;
    //Il push aggiunge l'ingrediente nell'array
    this.ingredients.push(this.userIngredient.trim());
    //Svuota il campo di input
    this.userIngredient = '';
  }

  //Delete Mode
  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
  }
  removeIngredient(index: number) {
    //Rimuovi l'ingrediente dall'array in base all'indice
    this.ingredients.splice(index, 1);
  }
  //Anteprima della richiesta inviata all'AI
  get promptPreview(): string {
    if (this.ingredients.length === 0) {
      return 'Aggiungi almeno un ingrediente per vedere la richiesta che manderemo all’AI.';
    }
    const list = this.ingredients.join(', ');
    return `Ho questi ingredienti: ${list}. Suggerisci 3 ricette semplici, gustose e facili da preparare.`;
  }
}
