import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage'; // <-- use official driver IDs

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly KEY = 'favorites';

  // Use Drivers.* constants; fall back to LocalStorage if IndexedDB blocked
  private storage = new Storage({
    name: '__mydb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });

  private ready: Promise<void>;

  private _favorites$ = new BehaviorSubject<any[]>([]);
  favorites$ = this._favorites$.asObservable();

  constructor() {
    // Initialize storage; if a driver fails, try LocalStorage explicitly
    this.ready = this.storage.create()
      .catch(async (err) => {
        console.error('[Favorites] storage init error (first attempt):', err);
        // try forcing LocalStorage driver
        this.storage = new Storage({
          name: '__mydb',
          driverOrder: [Drivers.LocalStorage],
        });
        await this.storage.create();
      })
      .then(() => this.loadFromStorage())
      .catch(err => console.error('[Favorites] storage final init error:', err));
  }

  private async loadFromStorage() {
    const data = (await this.storage.get(this.KEY)) || [];
    this._favorites$.next(data);
  }

  async refresh() {
    await this.ready;
    await this.loadFromStorage();
  }

  async add(recipe: any) {
    await this.ready;
    const list = (await this.storage.get(this.KEY)) || [];
    if (!list.some((r: any) => r.idMeal === recipe.idMeal)) {
      list.push(recipe);
      await this.storage.set(this.KEY, list);
      this._favorites$.next(list);
      console.log('[Favorites] added:', recipe.idMeal);
    }
  }

  async remove(idMeal: string) {
    await this.ready;
    const list: any[] = (await this.storage.get(this.KEY)) || [];
    const next = list.filter(r => r.idMeal !== idMeal);
    await this.storage.set(this.KEY, next);
    this._favorites$.next(next);
  }

  get snapshot(): any[] {
    return this._favorites$.value;
  }
}
