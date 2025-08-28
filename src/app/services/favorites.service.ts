import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage'; // use official driver IDs

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly KEY = 'favorites';

  // Storage instance with driver fallback (IndexedDB → LocalStorage)
  private storage = new Storage({
    name: '__mydb',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
  });

  // Ensures consumers can await storage readiness
  private ready: Promise<void>;

  // Reactive favorites stream (BehaviorSubject keeps latest value)
  private _favorites$ = new BehaviorSubject<any[]>([]);
  favorites$ = this._favorites$.asObservable();

  constructor() {
    // Initialize storage and load persisted data
    this.ready = this.storage.create()
      .catch(async (err) => {
        console.error('[Favorites] storage init error (first attempt):', err);
        // Fallback to LocalStorage driver if IndexedDB is blocked
        this.storage = new Storage({
          name: '__mydb',
          driverOrder: [Drivers.LocalStorage],
        });
        await this.storage.create();
      })
      .then(() => this.loadFromStorage())
      .catch(err => console.error('[Favorites] storage final init error:', err));
  }

  /** Internal: read list from storage into subject */
  private async loadFromStorage() {
    const data = (await this.storage.get(this.KEY)) || [];
    this._favorites$.next(data);
  }

  /** Public: force re-read from storage */
  async refresh() {
    await this.ready;
    await this.loadFromStorage();
  }

  /** Add a recipe if not already present (by idMeal) */
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

  /** Remove a recipe by id */
  async remove(idMeal: string) {
    await this.ready;
    const list: any[] = (await this.storage.get(this.KEY)) || [];
    const next = list.filter(r => r.idMeal !== idMeal);
    await this.storage.set(this.KEY, next);
    this._favorites$.next(next);
  }

  /** Synchronous snapshot (useful in guards or one-off checks) */
  get snapshot(): any[] {
    return this._favorites$.value;
  }
}
