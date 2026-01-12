import { Injectable } from '@angular/core';

export interface RecipeIdea {
  id: string;
  title: string;
  summary: string;
  time: string;
  difficulty: 'Facile' | 'Media' | 'Rapida';
  servings: number;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  tags: string[];
  favorite?: boolean;
  saved?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private storageKey = 'recipe-ai-web';
  ingredients: string[] = [];
  fakeResults: RecipeIdea[] = [];
  savedRecipes: RecipeIdea[] = [];
  servings = 2;

  constructor() {
    this.loadState();
  }

  private canUseStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private persistState() {
    if (!this.canUseStorage()) return;

    const payload = {
      ingredients: this.ingredients,
      fakeResults: this.fakeResults,
      savedRecipes: this.savedRecipes,
      servings: this.servings,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }

  private loadState() {
    if (!this.canUseStorage()) return;

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      this.ingredients = parsed.ingredients ?? [];
      this.servings = parsed.servings ?? 2;

      const normalizeIngredients = (ings: any[]) =>
        (ings ?? []).map((ing: any) =>
          typeof ing === 'string' ? { name: ing, quantity: '' } : ing
        );

      this.fakeResults = (parsed.fakeResults ?? []).map((r: any) => ({
        ...r,
        servings: r?.servings ?? this.servings,
        ingredients: normalizeIngredients(r?.ingredients),
      }));

      this.savedRecipes = (parsed.savedRecipes ?? []).map((r: any) => ({
        ...r,
        servings: r?.servings ?? this.servings,
        ingredients: normalizeIngredients(r?.ingredients),
      }));
    } catch {
      // in caso di dati corrotti ripartiamo da zero
      this.ingredients = [];
      this.fakeResults = [];
      this.savedRecipes = [];
    }
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10);
  }

  setServings(servings: number) {
    this.servings = Math.max(1, Math.min(12, Math.round(servings)));
    this.persistState();
  }

  getServings(): number {
    return this.servings;
  }

  private estimateQuantity(name: string, servings: number): string {
    const lower = name.toLowerCase();
    const base = 80;
    if (lower.includes('pasta') || lower.includes('riso')) {
      return `${Math.round(90 * servings)} g`;
    }
    if (lower.includes('pollo') || lower.includes('carne')) {
      return `${Math.round(120 * servings)} g`;
    }
    if (lower.includes('olio')) {
      return `${Math.max(2, Math.round(servings))} cucchiai`;
    }
    if (lower.includes('uovo')) {
      return `${Math.max(1, servings)} uova`;
    }
    if (lower.includes('mozzarella') || lower.includes('formaggio')) {
      return `${Math.round(80 * servings)} g`;
    }
    if (lower.includes('patate')) {
      return `${Math.round(150 * servings)} g`;
    }
    return `${Math.round(base * servings)} g`;
  }

  private buildIngredientsList(ingredients: string[], servings: number) {
    return ingredients.map((name, idx) => ({
      name,
      quantity: this.estimateQuantity(name, servings) + (idx === 0 ? '' : ' (circa)'),
    }));
  }

  generateFakeRecipes(ingredients: string[], servings = this.servings): RecipeIdea[] {
    if (ingredients.length === 0) return [];

    const combos = [
      ['cremoso', 'croccante'],
      ['leggero', 'comfort'],
      ['speziato', 'delicato'],
    ];
    const times = ['20 minuti', '35 minuti', '15 minuti'];
    const tagsList = [
      ['Veloce', 'Meal-prep'],
      ['Vegetariano', 'Settimana'],
      ['Economico', 'One-pot'],
    ];

    return combos.map((pair, idx) => {
      const main = ingredients[idx % ingredients.length];
      const secondary = ingredients[(idx + 1) % ingredients.length];
      const portions = Math.max(1, servings);
      const ingredientList = this.buildIngredientsList(
        [main, secondary, 'olio EVO', 'sale e pepe'],
        portions
      );
      return {
        id: this.createId(),
        title: `Idea ${idx + 1}: ${main} ${pair[0]}`,
        summary: `Un piatto ${pair[0]} e ${pair[1]} con ${main} e ${secondary}, perfetto per una cena veloce.`,
        time: times[idx % times.length],
        difficulty: idx === 2 ? 'Rapida' : idx === 1 ? 'Media' : 'Facile',
        servings: portions,
        ingredients: ingredientList,
        steps: [
          `Prepara la mise en place: taglia ${main} e ${secondary} in pezzi regolari, scalda una padella capiente con un filo di olio.`,
          `Soffriggi ${main} con sale e pepe per 4-5 minuti, poi unisci ${secondary} e continua a cuocere finché non diventa ${pair[1]}.`,
          'Sfuma con un goccio d’acqua di cottura o brodo leggero e lascia ridurre per 2 minuti.',
          'Manteca con olio EVO a fuoco spento per legare la salsa, assaggia e aggiusta di sale.',
          `Impiatta in ${portions} porzioni e guarnisci con erbette fresche o scorza di agrumi.`,
        ],
        tags: tagsList[idx % tagsList.length],
        favorite: false,
        saved: false,
      } satisfies RecipeIdea;
    });
  }

  setIngredients(ings: string[]) {
    this.ingredients = [...ings];
    this.persistState();
  }

  getIngredients(): string[] {
    return [...this.ingredients];
  }

  addIngredient(ing: string) {
    const trimmed = ing.trim();
    if (!trimmed) return;
    this.ingredients = [...this.ingredients, trimmed];
    this.persistState();
  }

  removeIngredient(index: number) {
    this.ingredients = this.ingredients.filter((_, i) => i !== index);
    this.persistState();
  }

  clearIngredients() {
    this.ingredients = [];
    this.persistState();
  }

  setFakeResults(results: RecipeIdea[]) {
    this.fakeResults = [...results];
    this.persistState();
  }

  getFakeResults(): RecipeIdea[] {
    return [...this.fakeResults];
  }

  saveRecipe(recipe: RecipeIdea) {
    const alreadySaved = this.savedRecipes.some((r) => r.id === recipe.id);
    if (alreadySaved) return;

    this.savedRecipes = [...this.savedRecipes, { ...recipe, saved: true }];
    this.fakeResults = this.fakeResults.map((r) =>
      r.id === recipe.id ? { ...r, saved: true } : r
    );
    this.persistState();
  }

  removeSavedRecipe(id: string) {
    this.savedRecipes = this.savedRecipes.filter((r) => r.id !== id);
    this.fakeResults = this.fakeResults.map((r) =>
      r.id === id ? { ...r, saved: false } : r
    );
    this.persistState();
  }

  toggleFavorite(id: string) {
    this.savedRecipes = this.savedRecipes.map((r) =>
      r.id === id ? { ...r, favorite: !r.favorite } : r
    );
    this.persistState();
  }

  clearSavedRecipes() {
    this.savedRecipes = [];
    this.fakeResults = this.fakeResults.map((r) => ({ ...r, saved: false }));
    this.persistState();
  }

  getSavedRecipes(): RecipeIdea[] {
    return [...this.savedRecipes];
  }
}
