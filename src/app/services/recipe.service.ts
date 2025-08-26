import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private storageReady = this.storage.create();

  constructor(private http: HttpClient, private storage: Storage) {}

  searchRecipes(query: string): Observable<any> {
    return this.http.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  }

  getRecipeById(id: string): Observable<any> {
    return this.http.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  }

  async addFavorite(recipe: any) {
    await this.storageReady;
    let favs = (await this.storage.get('favorites')) || [];
    favs.push(recipe);
    await this.storage.set('favorites', favs);
  }

  async getFavorites() {
    await this.storageReady;
    return (await this.storage.get('favorites')) || [];
  }
}
