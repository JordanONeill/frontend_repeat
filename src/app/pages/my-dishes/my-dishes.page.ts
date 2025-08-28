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
  myDishes: MyDish[] = [];
  newDish: MyDish = { name: '', category: '', instructions: '' };

  constructor(private dishesSvc: MyDishesService) {
    // subscribe so UI stays in sync
    this.dishesSvc.dishes$.subscribe(list => (this.myDishes = list));
    // ensure initial load
    this.dishesSvc.refresh().catch(() => {});
  }

  async addDish() {
    if (!this.newDish.name.trim()) return;
    await this.dishesSvc.add({ ...this.newDish });
    this.newDish = { name: '', category: '', instructions: '' };
  }

  async removeDish(index: number) {
    await this.dishesSvc.removeAt(index);
  }
}
