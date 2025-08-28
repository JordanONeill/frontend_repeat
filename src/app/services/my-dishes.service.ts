import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

export type MyDish = { name: string; category: string; instructions: string };

@Injectable({ providedIn: 'root' })
export class MyDishesService {
  private readonly KEY = 'myDishes';

  // storage with driver fallback (IndexedDB → LocalStorage)
  private storage = new Storage({
    name: '__mydb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });

  private ready: Promise<void>;
  private _dishes$ = new BehaviorSubject<MyDish[]>([]);
  dishes$ = this._dishes$.asObservable();

  constructor() {
    this.ready = this.storage.create()
      .catch(async (err) => {
        console.error('[MyDishes] storage init error (first attempt):', err);
        // fallback: force LocalStorage
        this.storage = new Storage({
          name: '__mydb',
          driverOrder: [Drivers.LocalStorage],
        });
        await this.storage.create();
      })
      .then(() => this.loadFromStorage())
      .catch(err => console.error('[MyDishes] storage final init error:', err));
  }

  private async loadFromStorage() {
    const data: MyDish[] = (await this.storage.get(this.KEY)) || [];
    this._dishes$.next(data);
  }

  async refresh() {
    await this.ready;
    await this.loadFromStorage();
  }

  async add(dish: MyDish) {
    await this.ready;
    const list: MyDish[] = (await this.storage.get(this.KEY)) || [];
    list.push(dish);
    await this.storage.set(this.KEY, list);
    this._dishes$.next(list);
  }

  async removeAt(index: number) {
    await this.ready;
    const list: MyDish[] = (await this.storage.get(this.KEY)) || [];
    list.splice(index, 1);
    await this.storage.set(this.KEY, list);
    this._dishes$.next(list);
  }

  get snapshot(): MyDish[] {
    return this._dishes$.value;
  }
}
