import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';            // ⬅ add this
import { Storage } from '@ionic/storage-angular';

type MyDish = { name: string; category: string; instructions: string };

@Component({
  selector: 'app-my-dishes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],  // ⬅ include RouterModule
  templateUrl: './my-dishes.page.html',
  styleUrls: ['./my-dishes.page.scss'],
})
export class MyDishesPage {
  myDishes: MyDish[] = [];
  newDish: MyDish = { name: '', category: '', instructions: '' };

  private storage = new Storage({ name: '__mydb', driverOrder: ['indexeddb', 'localstorage'] });

  constructor() {
    this.init();
  }

  async init() {
    await this.storage.create();
    const stored = (await this.storage.get('myDishes')) || [];
    this.myDishes = stored;
  }

  async ionViewWillEnter() {
    const stored = (await this.storage.get('myDishes')) || [];
    this.myDishes = stored;
  }

  async addDish() {
    if (!this.newDish.name.trim()) return;
    this.myDishes.push({ ...this.newDish });
    await this.storage.set('myDishes', this.myDishes);
    this.newDish = { name: '', category: '', instructions: '' };
  }

  async removeDish(index: number) {
    this.myDishes.splice(index, 1);
    await this.storage.set('myDishes', this.myDishes);
  }
}
