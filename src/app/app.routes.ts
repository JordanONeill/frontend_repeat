import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { FavoritesPage } from './favorites/favorites.page';
import { MyDishesPage } from './my-dishes/my-dishes.page';
import { RecipeDetailPage } from './recipe-detail/recipe-detail.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'favorites', component: FavoritesPage },
  { path: 'my-dishes', component: MyDishesPage },
  { path: 'recipe/:id', component: RecipeDetailPage },
];
