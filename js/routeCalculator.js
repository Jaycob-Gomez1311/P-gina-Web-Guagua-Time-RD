// Graph search for routes (BFS up to 3 transfers)
export function calculateRoutes(originId, destId, routesData, sectors) {
    const adjacency = buildAdjacency(routesData);
    const paths = findAllPaths(originId, destId, adjacency, 3); // max 3 transfers
    return paths.map(path => buildRouteObject(path, routesData, sectors));
}

function buildAdjacency(routesData) {
    const adj = {};
    routesData.forEach(route => {
        if (!adj[route.from]) adj[route.from] = [];
        adj[route.from].push({ to: route.to, mode: route.mode, baseTime: route.baseTime, baseCost: route.baseCost, routeId: route.id });
        // Also add reverse for undirected? Assuming routes are bidirectional
        if (!adj[route.to]) adj[route.to] = [];
        adj[route.to].push({ to: route.from, mode: route.mode, baseTime: route.baseTime, baseCost: route.baseCost, routeId: route.id });
    });
    return adj;
}

function findAllPaths(start, end, adj, maxTransfers) {
    const paths = [];
    const queue = [{ node: start, path: [start], transfers: 0, modes: [], segments: [] }];
    
    while (queue.length) {
        const { node, path, transfers, modes, segments } = queue.shift();
        
        if (node === end) {
            paths.push({ path, transfers, modes, segments });
            continue;
        }
        
        if (transfers >= maxTransfers) continue;
        
        const neighbors = adj[node] || [];
        for (const neighbor of neighbors) {
            if (!path.includes(neighbor.to)) {
                const newModes = [...modes, neighbor.mode];
                const newSegments = [...segments, neighbor];
                queue.push({
                    node: neighbor.to,
                    path: [...path, neighbor.to],
                    transfers: transfers + 1,
                    modes: newModes,
                    segments: newSegments
                });
            }
        }
    }
    return paths;
}

function buildRouteObject(pathObj, routesData, sectors) {
    const { path, segments, transfers, modes } = pathObj;
    let totalTime = 0;
    let totalCost = 0;
    const pathDetails = [];
    
    segments.forEach(seg => {
        totalTime += seg.baseTime;
        totalCost += seg.baseCost;
        pathDetails.push({
            from: sectors.find(s => s.id === seg.from)?.name,
            to: sectors.find(s => s.id === seg.to)?.name,
            mode: seg.mode,
            time: seg.baseTime,
            cost: seg.baseCost
        });
    });
    
    return {
        originId: path[0],
        destId: path[path.length-1],
        path: pathDetails,
        totalTime: Math.round(totalTime),
        totalCost: Math.round(totalCost),
        transfers,
        modes: [...new Set(modes)]
    };
}

export function applyConditions(route, activeConditions) {
    let adjustedTime = route.totalTime;
    let adjustedCost = route.totalCost;
    let extraCost = 0;
    
    activeConditions.forEach(cond => {
        adjustedTime *= (1 + cond.time_pct / 100);
        extraCost += cond.cost_extra;
    });
    
    adjustedCost += extraCost;
    
    return {
        totalTime: Math.round(adjustedTime),
        totalCost: Math.round(adjustedCost),
        alertsApplied: activeConditions.map(c => c.name)
    };
}