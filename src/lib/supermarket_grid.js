import { Graph, astar } from "javascript-astar";
import { physicalDimensions, threeDimensions, gridDimensions, sections } from "./supermarket_layout";

export const rawGrid = Array.from({length: gridDimensions.yLength}, (_, y) => {
    const row =  Array.from({length: gridDimensions.xLength}, (_, x) => {
        return 1
    });
    return row;
});


for (const section of sections) {
    for (const model of section.models) {
        if (model.gridBoundary) {
            const bounds = model.gridBoundary;
            for (let j = bounds.startY; j <= bounds.endY; j++) {
                for (let i = bounds.startX; i <= bounds.endX; i++) {
                    rawGrid[j][i] = 0;
                }
            }
        }
    }
}

export const physicalGrid = rawGrid.map((row, j) => row.map((value, i) => {
    const x = gridDimensions.initialX + gridDimensions.deltaX * i;
    const z = gridDimensions.initialZ + gridDimensions.deltaZ * j;
    return {
        valid: value === 1,
        threeCoordinates: {
            x, z
        }
    }
}))

export const graph = new Graph(rawGrid);

export const getGraphNode = (x, y) => {
    return graph.grid[y][x];
}

export const searchGraph = (startNode, endNode) => {
    const result = [startNode, ...astar.search(graph, startNode, endNode)].map((node) => {
        return {
            x: node.y,
            y: node.x
        }
    });
    return result;
}

export const gridToThreeCoordinates = (x, y) => {
    return {
        x: gridDimensions.initialX + gridDimensions.deltaX * x,
        z: gridDimensions.initialZ + gridDimensions.deltaZ * y
    }
}

export const stringToPhysicalCoordinates = (value) => {
    const coords = value ? value.split(',') : ['0', '0'];
    return {
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1])
    }
}

export const physicalCoordinatesToThreeCoordinates = (x, y) => {
    let ratioX = Math.max(x/physicalDimensions.length, 0);
    ratioX = ratioX <= 1 ? ratioX : 1;
    let ratioY = Math.max(y/physicalDimensions.width, 0);
    ratioY = ratioY <= 1 ? ratioY : 1;

    return {
        x: ratioX * threeDimensions.length - threeDimensions.length/2,
        z: ratioY * threeDimensions.width - threeDimensions.width/2
    }
}

export const gridToPhysicalCoordinates = (x, y) => {
    const threeCoords = gridToThreeCoordinates(x, y);
    return {
        x: (threeCoords.x + threeDimensions.length/2) * physicalDimensions.length / threeDimensions.length,
        y: (threeCoords.z + threeDimensions.width/2) * physicalDimensions.width / threeDimensions.width,
    }
}
// export const findPhysicalDistanceBetweenGridNodes = (startNode, endNode) => {
//     const startC = gridToThreeCoordinates(startNode.x, startNode.y);
//     const endC = gridToThreeCoordinates(endNode.x, endNode.y);
//     const distance = Math.sqrt(Math.pow(endC.x - startC.x, 2) + Math.pow(endC.z - startC.z, 2)) * physicalDimensions.length / threeDimensions.length;
//     return distance;
// }

export const findNearestNode = (x, z) => {
    let nearestNode;
    let nearestNodeDistance = Infinity;
    physicalGrid.forEach((row, j) => {
      row.forEach((point, i) => {
        const coords = point.threeCoordinates;
        if (point.valid) {
            const distance = Math.pow(coords.x - x, 2) + Math.pow(coords.z - z, 2);
            if (distance < nearestNodeDistance) {
                nearestNode = { x: i, y: j };
                nearestNodeDistance = distance;
            }
        }
      })
    })
    return nearestNode;
}

