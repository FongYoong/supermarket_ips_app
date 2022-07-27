import { Graph, astar } from "javascript-astar";
import { gridDimensions, sections } from "./supermarket_layout";

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

export const getThreeCoordinate = (x, y) => {
    return {
        x: gridDimensions.initialX + gridDimensions.deltaX * x,
        z: gridDimensions.initialZ + gridDimensions.deltaZ * y
    }
}