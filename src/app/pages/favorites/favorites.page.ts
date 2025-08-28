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
  private storage: Storage;

  constructor() {
    this.storage = new Storage({ name: '__mydb', driverOrder: ['indexeddb', 'localstorage'] });
    this.init();
  }

  async init() {
    await this.storage.create();
    const favs = await this.storage.get('favorites');
    this.favorites = favs || [];
  }

  async removeFavorite(index: number) {
    this.favorites.splice(index, 1);
    await this.storage.set('favorites', this.favorites);
  }
}
