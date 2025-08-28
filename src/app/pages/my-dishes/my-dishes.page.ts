import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MyDishesService, MyDish } from '../../services/my-dishes.service';

@Component({
  selector: 'app-my-dishes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './my-dishes.page.html',
  styleUrls: ['./my-dishes.page.scss'],
})
export class MyDishesPage {
  // Bound to form inputs for new dish creation
  myDishes: MyDish[] = [];
  newDish: MyDish = { name: '', category: '', instructions: '' };

  constructor(private dishesSvc: MyDishesService) {
    // Keep UI in sync with storage updates
    this.dishesSvc.dishes$.subscribe(list => (this.myDishes = list));
    // Ensure initial data is available on first render
    this.dishesSvc.refresh().catch(() => {});
  }

  /** Validate and persist the new dish */
  async addDish() {
    if (!this.newDish.name.trim()) return;
    await this.dishesSvc.add({ ...this.newDish });
    this.newDish = { name: '', category: '', instructions: '' };
  }

  /** Remove dish by index */
  async removeDish(index: number) {
    await this.dishesSvc.removeAt(index);
  }
}
