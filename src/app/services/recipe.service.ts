import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  // Base URL for TheMealDB API
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  /** Search recipes by name (free-text) */
  searchRecipes(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search.php?s=${query}`);
  }

  /** Fetch full details for a single recipe by ID */
  getRecipeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lookup.php?i=${id}`);
  }

  /** Fetch a single random recipe */
  getRandomRecipe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/random.php`);
  }
}
