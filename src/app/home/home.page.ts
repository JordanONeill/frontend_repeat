import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

import { Subject, of, EMPTY } from 'rxjs';
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
  // bound to the searchbar (optional to show current text)
  searchTerm = '';
  // results shown under the searchbar
  recipes: any[] = [];
  // simple loading flag for UX
  loading = false;

  // internal subjects for reactive search + teardown
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    // reactive pipeline for debounced search
    this.search$
      .pipe(
        map((v) => (v ?? '').trim()),
        debounceTime(250),                 // ← debounce here
        distinctUntilChanged(),
        tap((q) => (this.loading = !!q)),
        switchMap((query) => {
          if (!query) {
            // empty query clears results and stops loading
            this.recipes = [];
            this.loading = false;
            return EMPTY;
          }
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // fired by (ionInput); pushes text into the debounced stream
  onInput(ev: CustomEvent) {
    // ionInput emits { detail: { value: string } }
    const value = (ev as any)?.detail?.value ?? '';
    this.searchTerm = value;
    this.search$.next(value);
  }
}
