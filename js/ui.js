import { t } from './i18n.js';

export function updateUI() {
    // Placeholder for future updates
}

export function renderRoutes(routes, onSaveFavorite, onRouteClick) {
    const container = document.getElementById('routes-list');
    if (!routes.length) {
        container.innerHTML = `<p class="no-results">${t('no_routes')}</p>`;
        return;
    }
    
    container.innerHTML = routes.map(route => `
        <div class="route-card" data-route-id="${route.originId}-${route.destId}">
            <div class="route-card__header">
                <span class="route-card__mode">${route.modes.join(', ')}</span>
                <span class="route-card__transfers">🔄 ${route.transfers} ${t('transfers')}</span>
            </div>
            <div class="route-card__time">⏱️ ${t('time')}: ${route.totalTime} min</div>
            <div class="route-card__cost">💰 ${t('cost')}: RD$ ${route.totalCost}</div>
            <div class="route-card__details">
                ${route.path.map(seg => `<small>${seg.from} → ${seg.to} (${seg.mode}, ${seg.time} min, RD$${seg.cost})</small><br>`).join('')}
            </div>
            <div class="route-card__actions">
                <button class="btn btn--small save-favorite" data-route='${JSON.stringify(route).replace(/'/g, "&apos;")}'>⭐ ${t('save_favorite')}</button>
                <button class="btn btn--small view-details" data-route='${JSON.stringify(route).replace(/'/g, "&apos;")}'>🔍 ${t('details')}</button>
            </div>
        </div>
    `).join('');
    
    // Attach event listeners
    document.querySelectorAll('.save-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const route = JSON.parse(btn.dataset.route);
            onSaveFavorite(route);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const route = JSON.parse(btn.dataset.route);
            onRouteClick(route);
        });
    });
}

export function renderFavorites(favorites, onFavoriteClick, onRemove) {
    const container = document.getElementById('favorites-list');
    if (!favorites.length) {
        container.innerHTML = `<p class="no-results">${t('no_favorites')}</p>`;
        return;
    }
    
    container.innerHTML = favorites.map(fav => `
        <div class="favorite-card" data-id="${fav.id}">
            <div class="route-card__header">
                <span class="route-card__mode">${fav.modes.join(', ')}</span>
                <span class="route-card__transfers">🔄 ${fav.transfers} ${t('transfers')}</span>
            </div>
            <div class="route-card__time">⏱️ ${t('time')}: ${fav.totalTime} min</div>
            <div class="route-card__cost">💰 ${t('cost')}: RD$ ${fav.totalCost}</div>
            <div class="route-card__actions">
                <button class="btn btn--small load-favorite">🚌 ${t('load')}</button>
                <button class="btn btn--small remove-favorite">🗑️ ${t('remove')}</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.load-favorite').forEach((btn, idx) => {
        btn.addEventListener('click', () => onFavoriteClick(favorites[idx]));
    });
    document.querySelectorAll('.remove-favorite').forEach((btn, idx) => {
        btn.addEventListener('click', () => onRemove(favorites[idx].id));
    });
}

export function renderAlerts(conditions, onToggle) {
    const container = document.getElementById('alerts-container');
    container.innerHTML = conditions.map(cond => `
        <label class="alert-item alert-item--${cond.id}">
            <input type="checkbox" data-id="${cond.id}" ${cond.active ? 'checked' : ''}>
            <span>⚠️ ${cond.name} (${cond.time_pct > 0 ? `+${cond.time_pct}% tiempo` : ''} ${cond.cost_extra > 0 ? `+RD$${cond.cost_extra}` : ''})</span>
        </label>
    `).join('');
    
    document.querySelectorAll('.alert-item input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = input.dataset.id;
            onToggle(id, input.checked);
        });
    });
}

export function updateLanguage() {
    // This is handled by i18n.js, but we trigger a UI update
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
}