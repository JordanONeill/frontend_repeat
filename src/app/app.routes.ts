import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { RecipeDetailPage } from './pages/recipe-detail/recipe-detail.page';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'recipe/:id', component: RecipeDetailPage },
];
