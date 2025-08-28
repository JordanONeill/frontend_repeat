import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  searchTerm: string = '';
  recipes: any[] = [];

  constructor(private recipeService: RecipeService) {}

  searchRecipes() {
    if (!this.searchTerm.trim()) {
      this.recipes = [];
      return;
    }
    this.recipeService.searchRecipes(this.searchTerm).subscribe({
      next: (data: any) => {
        this.recipes = data?.meals || [];
      },
      error: (err) => {
        console.error('Error fetching recipes:', err);
        this.recipes = [];
      }
    });
  }
}
