import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss']
})
export class RecipeDetailPage implements OnInit {
  recipe: any = null;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('[RecipeDetail] route id =', id);

    if (!id) {
      this.errorMsg = 'No recipe id in route.';
      return;
    }

    this.recipeService.getRecipeById(id).subscribe({
      next: (data: any) => {
        console.log('[RecipeDetail] API returned:', data);
        this.recipe = data?.meals?.[0] || null;
        if (!this.recipe) this.errorMsg = 'Recipe not found.';
      },
      error: (err) => {
        console.error('[RecipeDetail] API error:', err);
        this.errorMsg = 'Failed to load recipe.';
      }
    });
  }

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
}
