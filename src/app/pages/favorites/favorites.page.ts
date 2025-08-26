import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  favorites: any[] = [];

  constructor(private storage: Storage) {}

  async ionViewWillEnter() {
    // Fetch saved favorites every time page opens
    const favs = await this.storage.get('favorites');
    this.favorites = favs || [];
  }

  async removeFavorite(index: number) {
    // Remove a recipe from favorites
    this.favorites.splice(index, 1);
    await this.storage.set('favorites', this.favorites);
  }
}
