# Recipe Finder (Ionic Angular PWA)

Recipe Finder is a Progressive Web App built with Ionic 7 and Angular (standalone components).  
It allows you to search meals from TheMealDB API, view detailed recipes, save favourites, and add your own custom dishes.

---

## Features

- Search Recipes - live search with debounce
- Recipe Detail - images, ingredients, and instructions
- Favourites - save any recipe and manage your personal list
- My Dishes - create and manage your own custom recipes
- Suggested Recipes - three random meals shown on the home page, refreshable
- Responsive UI - built with Ionic, works on mobile and desktop
- Persistent Storage - favourites and dishes are saved locally using Ionic Storage
- PWA Ready - installable and offline-ready

---

## Tech Stack

- Ionic 7 with Angular standalone components
- Capacitor + Ionic Storage for persistence
- RxJS for reactive search and state management
- TheMealDB API for recipe data

---

## Project Structure

src/  
├─ app/  
│ ├─ home/ # Home page (search + suggested recipes)  
│ ├─ pages/  
│ │ ├─ favorites/ # Favourites list  
│ │ ├─ my-dishes/ # User-added dishes  
│ │ └─ recipe-detail/ # Recipe detail view  
│ ├─ services/ # RecipeService + FavoritesService + MyDishesService  
│ ├─ app.routes.ts # App routes  
│ └─ app.component.ts # App shell  
├─ assets/ # Logo (recipe_finder.png) and static files  
├─ theme/ # variables.scss for theming  

---

## Running Locally

Make sure you have:

- Node.js (18+)
- Ionic CLI 7+
- Angular 16+

```bash
# Clone repository
git clone https://github.com/JordanONeill/frontend_repeat.git
cd frontend_repeat

# Install dependencies
npm install

# Run in browser
ionic serve
