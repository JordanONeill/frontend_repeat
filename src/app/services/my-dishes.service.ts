import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

export type MyDish = { name: string; category: string; instructions: string };

@Injectable({ providedIn: 'root' })
export class MyDishesService {
  private readonly KEY = 'myDishes';

  // Storage with driver fallback (IndexedDB → LocalStorage)
  private storage = new Storage({
    name: '__mydb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });

  // Resolves when storage is ready
  private ready: Promise<void>;

  // Reactive list of user-created dishes
  private _dishes$ = new BehaviorSubject<MyDish[]>([]);
  dishes$ = this._dishes$.asObservable();

  constructor() {
    // Initialize storage and load saved dishes
    this.ready = this.storage.create()
      .catch(async () => {
        // Force LocalStorage driver if primary fails
        this.storage = new Storage({
          name: '__mydb',
          driverOrder: [Drivers.LocalStorage],
        });
        await this.storage.create();
      })
      .then(() => this.refresh());
  }

  /** Reload from storage into the BehaviorSubject */
  async refresh() {
    await this.ready;
    const list: MyDish[] = (await this.storage.get(this.KEY)) || [];
    this._dishes$.next(list);
  }

  /** Add a dish and persist */
  async add(dish: MyDish) {
    await this.ready;
    const list: MyDish[] = (await this.storage.get(this.KEY)) || [];
    list.push(dish);
    await this.storage.set(this.KEY, list);
    this._dishes$.next(list);
  }

  /** Remove a dish at index and persist */
  async removeAt(index: number) {
    await this.ready;
    const list: MyDish[] = (await this.storage.get(this.KEY)) || [];
    list.splice(index, 1);
    await this.storage.set(this.KEY, list);
    this._dishes$.next(list);
  }

  /** Immediate snapshot for synchronous reads */
  get snapshot(): MyDish[] {
    return this._dishes$.value;
  }
}
