import { loadSectors, loadRoutes, loadConditions, loadTranslations } from './dataLoader.js';
import { calculateRoutes, applyConditions } from './routeCalculator.js';
import { updateUI, renderRoutes, renderFavorites, renderAlerts, updateLanguage } from './ui.js';
import { saveFavorite, loadFavorites, removeFavorite } from './storage.js';
import { initMap } from './map.js';
import { debounce } from './debounce.js';
import { t, setLanguage, getCurrentLanguage } from './i18n.js';

let sectors = [];
let routesData = [];
let conditions = [];
let currentRoutes = [];
let currentSort = 'time';
let activeAlerts = [];

// DOM Elements
const originSelect = document.getElementById('origin');
const destSelect = document.getElementById('destination');
const searchBtn = document.getElementById('search-btn');
const sortSelect = document.getElementById('sort-by');
const langToggle = document.getElementById('lang-toggle');
const darkToggle = document.getElementById('darkmode-toggle');
const savingsToggle = document.getElementById('savings-toggle');

// Initialize app
async function init() {
    // Load data
    sectors = await loadSectors();
    routesData = await loadRoutes();
    conditions = await loadConditions();
    const translations = await loadTranslations();
    
    // Setup i18n
    window.translations = translations;
    updateLanguage();
    
    // Populate dropdowns
    populateDropdowns();
    
    // Load favorites and render
    renderFavorites(loadFavorites(), handleFavoriteClick, removeFavoriteHandler);
    
    // Render alerts
    renderAlerts(conditions, handleAlertToggle);
    
    // Initialize map
    initMap(sectors, routesData);
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        if (currentRoutes.length) {
            sortAndRenderRoutes(currentRoutes, currentSort);
        }
    });
    
    langToggle.addEventListener('click', () => {
        const newLang = getCurrentLanguage() === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        updateLanguage();
        // Re-render with new language
        if (currentRoutes.length) {
            sortAndRenderRoutes(currentRoutes, currentSort);
        }
        renderFavorites(loadFavorites(), handleFavoriteClick, removeFavoriteHandler);
        renderAlerts(conditions, handleAlertToggle);
        updateLanguageOnUI();
    });
    
    darkToggle.addEventListener('click', toggleDarkMode);
    savingsToggle.addEventListener('click', toggleSavingsMode);
    
    // Check saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Savings mode
    if (localStorage.getItem('savingsMode') === 'true') {
        document.body.classList.add('savings-mode');
    }
}

function populateDropdowns() {
    sectors.forEach(sector => {
        const option1 = document.createElement('option');
        option1.value = sector.id;
        option1.textContent = sector.name;
        originSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = sector.id;
        option2.textContent = sector.name;
        destSelect.appendChild(option2);
    });
}

async function handleSearch(e) {
    e.preventDefault();
    const originId = parseInt(originSelect.value);
    const destId = parseInt(destSelect.value);
    
    if (isNaN(originId) || isNaN(destId)) {
        alert(t('select_both'));
        return;
    }
    
    if (originId === destId) {
        alert(t('same_origin_dest'));
        return;
    }
    
    // Get active alerts
    activeAlerts = conditions.filter(c => c.active);
    
    // Calculate routes
    const routes = calculateRoutes(originId, destId, routesData, sectors);
    
    // Apply conditions
    const processedRoutes = routes.map(route => ({
        ...route,
        ...applyConditions(route, activeAlerts)
    }));
    
    currentRoutes = processedRoutes;
    sortAndRenderRoutes(processedRoutes, currentSort);
}

function sortAndRenderRoutes(routes, sortBy) {
    let sorted = [...routes];
    if (sortBy === 'time') {
        sorted.sort((a, b) => a.totalTime - b.totalTime);
    } else if (sortBy === 'cost') {
        sorted.sort((a, b) => a.totalCost - b.totalCost);
    } else if (sortBy === 'transfers') {
        sorted.sort((a, b) => a.transfers - b.transfers);
    }
    
    renderRoutes(sorted, handleSaveFavorite, handleRouteClick);
}

function handleSaveFavorite(route) {
    const favorite = {
        id: Date.now(),
        originId: route.originId,
        destId: route.destId,
        path: route.path,
        totalTime: route.totalTime,
        totalCost: route.totalCost,
        transfers: route.transfers,
        modes: route.modes
    };
    saveFavorite(favorite);
    renderFavorites(loadFavorites(), handleFavoriteClick, removeFavoriteHandler);
}

function handleFavoriteClick(fav) {
    // Load this favorite route details and show
    originSelect.value = fav.originId;
    destSelect.value = fav.destId;
    handleSearch(new Event('submit'));
}

function removeFavoriteHandler(id) {
    removeFavorite(id);
    renderFavorites(loadFavorites(), handleFavoriteClick, removeFavoriteHandler);
}

function handleRouteClick(route) {
    // Show details in console or alert, could expand
    console.log('Route details:', route);
}

function handleAlertToggle(conditionId, isActive) {
    const condition = conditions.find(c => c.id === conditionId);
    if (condition) {
        condition.active = isActive;
        // Recalculate current search if exists
        if (originSelect.value && destSelect.value && originSelect.value !== destSelect.value) {
            handleSearch(new Event('submit'));
        }
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function toggleSavingsMode() {
    document.body.classList.toggle('savings-mode');
    localStorage.setItem('savingsMode', document.body.classList.contains('savings-mode'));
}

function updateLanguageOnUI() {
    // Update all text elements with data-i18n attributes or specific IDs
    document.getElementById('origin-label').textContent = t('origin');
    document.getElementById('dest-label').textContent = t('destination');
    document.getElementById('search-btn').textContent = t('search');
    document.getElementById('alerts-title').textContent = t('active_alerts');
    document.getElementById('sort-label').textContent = t('sort_by');
    document.getElementById('routes-title').textContent = t('routes_found');
    document.getElementById('favorites-title').textContent = t('favorites');
    document.getElementById('map-title').textContent = t('schematic_map');
    document.getElementById('footer-text').textContent = t('footer');
    langToggle.textContent = getCurrentLanguage() === 'es' ? '🌐 ES' : '🌐 EN';
}

// Start app
init();