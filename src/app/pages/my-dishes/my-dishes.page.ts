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
  newDish = {
    name: '',
    category: '',
    instructions: ''
  };

  constructor(private storage: Storage) {}

  async ionViewWillEnter() {
    // Load existing custom dishes from storage
    const stored = await this.storage.get('myDishes');
    this.myDishes = stored || [];
  }

  async addDish() {
    if (!this.newDish.name.trim()) return;

    // Save new dish to array + storage
    this.myDishes.push({ ...this.newDish });
    await this.storage.set('myDishes', this.myDishes);

    // Clear form
    this.newDish = { name: '', category: '', instructions: '' };
  }

  async removeDish(index: number) {
    this.myDishes.splice(index, 1);
    await this.storage.set('myDishes', this.myDishes);
  }
}
