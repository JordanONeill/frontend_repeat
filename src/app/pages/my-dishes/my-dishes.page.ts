import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-my-dishes',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './my-dishes.page.html',
  styleUrls: ['./my-dishes.page.scss'],
})
export class MyDishesPage {
  myDishes: any[] = [];
  newDish = { name: '', category: '', instructions: '' };
  private storage: Storage;

  constructor() {
    this.storage = new Storage({ name: '__mydb', driverOrder: ['indexeddb', 'localstorage'] });
    this.init();
  }

  async init() {
    await this.storage.create();
    const stored = await this.storage.get('myDishes');
    this.myDishes = stored || [];
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
