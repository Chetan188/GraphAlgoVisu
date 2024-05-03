var Data;
var Queue = [];
var visited = [];
var gotit;

// Define directions including diagonals
const directions = [
    { dx: 0, dy: -1 }, // Up
    { dx: 1, dy: 0 },  // Right
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }, // Left
    { dx: -1, dy: -1 }, // Diagonal Up Left
    { dx: 1, dy: -1 },  // Diagonal Up Right
    { dx: 1, dy: 1 },   // Diagonal Down Right
    { dx: -1, dy: 1 }   // Diagonal Down Left
];

export function Dijkstra(arrayData, startNode, endNode, SPEED) {

    Data = arrayData;
    Queue = [];
    visited = [];
    let f1, f2 = false;
    gotit = false;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if (Data[i][j].id == startNode) {
                startNode = Data[i][j];
                f1 = true;
            }
            if (Data[i][j].id == endNode) {
                endNode = Data[i][j];
                f2 = true;
            }
        }
        if (f1 && f2) {
            break;
        }
    }

    //Starting node to 0
    startNode.distance = 0;

    //Adding element to the queue
    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            Queue.push(Data[i][j]);
        }
    }

    while (Queue.length != 0) {
        var min = getMinDistance(Queue); //Getting the minimum path
        if (min == undefined) {
            break;
        }

        Queue = Queue.filter(item => item !== min); //Removing the current from Queue
        for (const dir of directions) { // Loop through all directions
            let newX = min.x + dir.dx;
            let newY = min.y + dir.dy;
            if (isValid(newX, newY)) { // Check if neighbor is valid
                let neighbor = Data[newX][newY];
                let fun = calculateDistance(min, neighbor); // Calculate distance
                if (fun < neighbor.distance) {
                    neighbor.distance = fun;
                    neighbor.path = min.id;
                    // Path-Find
                    if (neighbor.id == endNode.id) {
                        gotit = true
                        break;
                    }
                    // Animate
                    if (!gotit) {
                        visited.push(neighbor.id);
                    }
                }
            }
        }
    }

    console.log(endNode);
    console.log(startNode);
    console.log(Queue);
    console.log(visited);

    djanimate(visited, startNode, endNode, gotit, SPEED);

}

function getMinDistance(queue) {
    //Get minimum Distance
    var min = Infinity;
    var id;
    for (let i = 0; i < Queue.length; i++) {
        if (Queue[i].distance < min) {
            min = Queue[i].distance;
            id = Queue[i];
        }
    }
    return id;
}

function isValid(x, y) {
    return x >= 0 && x < Data.length && y >= 0 && y < Data[0].length;
}

function calculateDistance(currentNode, neighbor) {
    let dx = Math.abs(currentNode.x - neighbor.x);
    let dy = Math.abs(currentNode.y - neighbor.y);
    let distance = dx > dy ? dx : dy; // Assuming diagonal movement cost is 1
    return currentNode.distance + distance;
}

function djanimate(data, start, stop, get, speed) {
    // Animation logic here
    for (let i = 0; i < data.length; i++) {
        let x = data[i];
        console.log(x);
        setTimeout(function () {
            $("#" + x).addClass("animate");
        }, (i + 1) * 20 * speed);
    }
    if (!get) {
        setTimeout(function () {
            alert("Element cannot be found!");
        }, (i + 3) * 20 * speed);
    }

    if (gotit) {
        pathAnimate(start, stop, speed);
    }
}

function pathAnimate(start, stop, speed) {
  let trace = [];

  // If start and end nodes are in diagonal positions, visualize directly
  if (Math.abs(stop.x - start.x) === Math.abs(stop.y - start.y)) {
    let dx = stop.x > start.x ? 1 : -1;
    let dy = stop.y > start.y ? 1 : -1;
    let x = start.x + dx;
    let y = start.y + dy;
    while (x !== stop.x && y !== stop.y) {
      trace.push(Data[x][y].id);
      x += dx;
      y += dy;
    }
  }

  // Add start and stop nodes to the trace
  trace.push(stop.id);
  trace.push(start.id);

  // Animate the trace
  for (let i = trace.length - 1; i >= 0; i--) {
    let dir = getDirection(trace[i], trace[i - 1]);
    setTimeout(function () {
      $("#" + trace[i]).addClass("path");
      $("#" + trace[i]).addClass(dir); // Add direction class here
    }, (++i) * 20 * speed);
  }

  setTimeout(function () {
    alert("Element Found!");
  }, (++i + 2) * 20 * speed);
}

function getDirection(current, next) {
  let dx = Data[next].x - Data[current].x;
  let dy = Data[next].y - Data[current].y;

  if (dx === 1 && dy === 0) return "right";
  if (dx === -1 && dy === 0) return "left";
  if (dx === 0 && dy === 1) return "down";
  if (dx === 0 && dy === -1) return "up";
  if (dx === 1 && dy === 1) return "diag-down-right"; // Add class for diagonal down-right
  if (dx === -1 && dy === 1) return "diag-down-left"; // Add class for diagonal down-left
  if (dx === 1 && dy === -1) return "diag-up-right"; // Add class for diagonal up-right
  if (dx === -1 && dy === -1) return "diag-up-left"; // Add class for diagonal up-left
}
