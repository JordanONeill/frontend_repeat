import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { RecipeDetailPage } from './pages/recipe-detail/recipe-detail.page';
import { FavoritesPage } from './pages/favorites/favorites.page';
import { MyDishesPage } from './pages/my-dishes/my-dishes.page';

/**
 * Defines Angular application routes
 */

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'recipe/:id', component: RecipeDetailPage },
  { path: 'favorites', component: FavoritesPage },
  { path: 'my-dishes', component: MyDishesPage },
];
