import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

import { Subject, of, EMPTY, firstValueFrom } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  tap,
  catchError,
  takeUntil
} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  // Search state bound to <ion-searchbar>
  searchTerm = '';
  recipes: any[] = [];
  loading = false;

  // Suggested random recipes (displayed as cards)
  suggested: any[] = [];
  suggestedLoading = false;

  // Internal streams
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // Debounced live search pipeline
    this.search$
      .pipe(
        map((v) => (v ?? '').trim()),
        debounceTime(250),
        distinctUntilChanged(),
        tap((q) => (this.loading = !!q)),
        switchMap((query) => {
          if (!query) {
            this.recipes = [];
            this.loading = false;
            return EMPTY;
          }
          // Call API for the current query
          return this.recipeService.searchRecipes(query).pipe(
            tap(() => (this.loading = false)),
            catchError((err) => {
              console.error('Search error:', err);
              this.recipes = [];
              this.loading = false;
              return of({ meals: [] });
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data: any) => {
        this.recipes = data?.meals || [];
      });

    // Load an initial set of suggestions
    this.loadSuggested(3);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Handle text input changes from the search bar */
  onInput(ev: CustomEvent) {
    const value = (ev as any)?.detail?.value ?? '';
    this.searchTerm = value;
    this.search$.next(value);
  }

  /** Fetch N unique random recipes for the "Suggested" section */
  private async loadSuggested(n: number) {
    this.suggestedLoading = true;
    const picked = new Set<string>();
    const list: any[] = [];
    let tries = 0;

    while (list.length < n && tries < n * 4) {
      tries++;
      try {
        const data = await firstValueFrom(this.recipeService.getRandomRecipe());
        const meal = data?.meals?.[0];
        if (meal && !picked.has(meal.idMeal)) {
          picked.add(meal.idMeal);
          list.push(meal);
        }
      } catch (e) {
        console.error('Random fetch error', e);
      }
    }

    this.suggested = list;
    this.suggestedLoading = false;
  }

  /** Public refresh handler for the "Refresh" button */
  refreshSuggestions() {
    if (this.suggestedLoading) return; // prevent rapid taps
    this.loadSuggested(3);
  }
}
