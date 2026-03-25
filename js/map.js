export function initMap(sectors, routesData) {
    const container = document.getElementById('schematic-map');
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "300");
    svg.setAttribute("viewBox", "0 0 800 300");
    
    // Create a simple schematic based on sector positions (simulate coordinates)
    const positions = generatePositions(sectors);
    
    // Draw lines (routes)
    routesData.forEach(route => {
        const fromPos = positions[route.from];
        const toPos = positions[route.to];
        if (fromPos && toPos) {
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", fromPos.x);
            line.setAttribute("y1", fromPos.y);
            line.setAttribute("x2", toPos.x);
            line.setAttribute("y2", toPos.y);
            line.setAttribute("stroke", "#888");
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);
        }
    });
    
    // Draw nodes
    sectors.forEach(sector => {
        const pos = positions[sector.id];
        if (pos) {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", pos.x);
            circle.setAttribute("cy", pos.y);
            circle.setAttribute("r", "8");
            circle.setAttribute("fill", "#1e3c72");
            svg.appendChild(circle);
            
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", pos.x + 10);
            text.setAttribute("y", pos.y + 5);
            text.setAttribute("fill", "currentColor");
            text.setAttribute("font-size", "10");
            text.textContent = sector.name;
            svg.appendChild(text);
        }
    });
    
    container.innerHTML = '';
    container.appendChild(svg);
}

function generatePositions(sectors) {
    // Generate random positions for demo, but deterministic based on id
    const positions = {};
    sectors.forEach(sector => {
        const angle = (sector.id * 37) % 360;
        const radius = 100 + (sector.id % 100);
        positions[sector.id] = {
            x: 400 + radius * Math.cos(angle * Math.PI / 180),
            y: 150 + radius * 0.6 * Math.sin(angle * Math.PI / 180)
        };
    });
    return positions;
}