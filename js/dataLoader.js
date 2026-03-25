export async function loadSectors() {
    const response = await fetch('data/sectors.json');
    return await response.json();
}

export async function loadRoutes() {
    const response = await fetch('data/routes.json');
    return await response.json();
}

export async function loadConditions() {
    const response = await fetch('data/conditions.json');
    const conditions = await response.json();
    // Add active flag for each
    return conditions.map(c => ({ ...c, active: false }));
}

export async function loadTranslations() {
    const response = await fetch('data/translations.json');
    return await response.json();
}