# Character Explorer

Small react app to browse and search Rick \& Morty characters using the public [Rick \& Morty API](https://rickandmortyapi.com).
You can search, filter, sort and also add characters to favorites to view later.

***

## ✨ Features

- List all characters with **infinite scroll**
- **Detail page** with full info for each character
- **Debounced search** with URL sync
- **Status filter** and **sort options** (name/species)
- **Favorites** toggle from list and detail, saved in `localStorage`
- **Persist state in URL** so page reload or sharing keeps current view
- Loading and error states with retry button
- Cancel in‑flight reqs to avoid race issues

**Some other small things:**

- Basic a11y with alt texts and buttons label
- Responsive layout with Tailwind
- Reusable components + barrel exports for cleaner imports

***

## 📂 Folder structure

```
src/
  assets/
    icons/            # all .png svg icons, exported from icons/index.ts
  components/         # reusable UI (Filter, CharacterCard, Loader, etc)
    Layout/           # Header and Footer component
    index.ts          # barrel export
  models/             # TS types for api data
  pages/              # each main page
    CharactersListPage.tsx
    CharacterDetailPage.tsx
    FavoritesPage.tsx
  services/           # api calls
    charactersService.ts
    apiClient.ts
  App.tsx
  main.tsx
```

I removed `hooks/` and `utils/` folders for now since not using them. Maybe in future can add back when there is real shared logic.

***

## ⚙️ How it works

- **Data fetching:** `services/charactersService.ts` wraps axios calls to Rick \& Morty API. `fetchCharacters` supports filters (`page`, `name`, `status`) via URLSearchParams. Supports abort via `AbortController`.
- **List page:** Reads params from URL using `useSearchParams`, triggers fetch. Infinite scroll with `IntersectionObserver`. Search input debounced to 500ms so we don't spam API.
- **Detail page:** Loads character by id, show extra details with icons and ability to fav/unfav.
- **Favorites page:** Loads list from localStorage ids, re-fetches full data, and allow filtering/sorting locally.
- **Favorites storage:** Just localStorage JSON array of char ids. Toggle instantly updates UI (optimistic).

***

## 🖥️ Run local

```bash
npm install
npm run dev
```

Open http://localhost:5173 (default vite port) in browser.

***

## ⚖️ Tradeoffs / next steps

- Currently only have status filter, API also support species/gender which can be easy add.
- Sort is client side, API doesn’t give sort param.
- No react-query cache, data refetch on revisit.
- No custom hooks for now, logic mostly inline to keep it simple.
- Could add theme toggle or notes form on detail page as extra.

***
