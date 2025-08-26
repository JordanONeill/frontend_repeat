import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
})
export class HomePage {
  query = '';
  results: any[] = [];

  constructor(private recipeService: RecipeService, private router: Router) {}

  search() {
    this.recipeService.searchRecipes(this.query).subscribe((data: any) => {
      this.results = data.meals || [];
    });
  }

  openRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }
}
