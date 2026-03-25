const FAVORITES_KEY = 'guaguatime_favorites';

export function saveFavorite(favorite) {
    const favorites = loadFavorites();
    favorites.push(favorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function loadFavorites() {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function removeFavorite(id) {
    let favorites = loadFavorites();
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}