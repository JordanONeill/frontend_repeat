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
    // Ensure data is loaded for the async pipe
    this.favs.refresh().catch(() => {});
  }

  /** Navigate to the detail page for a selected favorite */
  openRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  /** Remove a favorite; stopPropagation prevents card click navigation */
  async removeFavorite(id: string, ev?: Event) {
    if (ev) ev.stopPropagation();
    await this.favs.remove(id);
  }
}
