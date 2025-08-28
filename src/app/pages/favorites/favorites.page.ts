import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  constructor(public favs: FavoritesService, private router: Router) {
    // Ensure initial load is available
    this.favs.refresh().catch(() => {});
  }

  openRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  async removeFavorite(id: string, ev?: Event) {
    if (ev) ev.stopPropagation();
    await this.favs.remove(id);
  }
}
