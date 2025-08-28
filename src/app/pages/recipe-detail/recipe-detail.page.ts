import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss']
})
export class RecipeDetailPage implements OnInit {
  // The selected recipe, populated from API by id from the route
  recipe: any = null;
  // Error message shown when data fails to load
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private favorites: FavoritesService,
    private toastCtrl: ToastController // used to notify user actions
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'No recipe id in route.';
      return;
    }
    // Load details for the given id
    this.recipeService.getRecipeById(id).subscribe({
      next: (data: any) => {
        this.recipe = data?.meals?.[0] || null;
        if (!this.recipe) this.errorMsg = 'Recipe not found.';
      },
      error: (err) => {
        console.error('[RecipeDetail] API error:', err);
        this.errorMsg = 'Failed to load recipe.';
      }
    });
  }

  /** Build "Ingredient - Measure" list out of numbered fields */
  getIngredients(): string[] {
    if (!this.recipe) return [];
    const out: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ing = this.recipe[`strIngredient${i}`];
      const meas = this.recipe[`strMeasure${i}`];
      if (ing && String(ing).trim()) out.push(`${ing}${meas ? ' - ' + meas : ''}`);
    }
    return out;
  }

  /** Helper: show a short toast */
  private async showToast(message: string, color: 'primary' | 'success' | 'warning' | 'danger' = 'primary') {
    const t = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await t.present();
  }

  /** Add current recipe to favorites if not already present */
  async addToFavourites() {
    if (!this.recipe) return;

    const exists = this.favorites.snapshot.some(r => r.idMeal === this.recipe.idMeal);
    if (exists) {
      await this.showToast('Already in favourites', 'warning');
      return;
    }

    await this.favorites.add(this.recipe);
    await this.showToast('Saved to favourites!', 'success');
  }
}
