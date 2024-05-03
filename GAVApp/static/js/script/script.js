// //Importing Algorithm
// import './dijkstra.js'
// import './bfs.js'
// import './dfs.js'
// import Astar from './astar.js'



//SCRIPT FILE-----------------------------------------------------

$(document).ready(function () {
  //Set pevious State
  var SIZE = 22;
  var SPEED = 3;
  var ALGORITHM = 1;
  var startid, endid;
  var isDown = false;
  var wall = [];
  var uniqueId;
  var data = new Array(2);

  //Initial Function
  displayGrid(SIZE);

  //sIZE SPEED AND SIZE
  $("[type=range]").change(function () {
    var newval = $(this).val();
    //console.log(newval);
    if (this.id == "speed") {
      $("#speed_dis").text(newval);
      SPEED = newval;
    } else {
      $("#size_dis").text(newval);
      SIZE = newval;
      startid = undefined;
      endid = undefined;
      displayGrid(SIZE);
    }
  });

  //Display grid Function
  function displayGrid(x) {
    $(".screen").html(" ");
    let screenWidth = $(".screen").innerWidth() / SIZE;

    for (let i = 0; i < x * x; i++) {
      $(".screen").append('<div class="unit" id="' + i + '"></div>');
    }

    $(".unit").css("width", screenWidth + "px");
    $(".unit").css("height", screenWidth + "px");
  }

  //Resize Event Handler
  $(window).on("resize", function () {
    displayGrid(SIZE);
    startid = undefined;
    endid = undefined;
  });

  //cHOOSE aLGORITHm
  $('select').on('change', function() {
      //console.log( this.value );
      let choice = this.value;
      if (choice == 1) {
        $(".title h1").text("Breadth First Search");
      } else if (choice == 2) {
        $(".title h1").text("Depth First Search");
      } else if (choice == 3) {
        $(".title h1").text("Dijkstra Algorithm");
      } else {
        $(".title h1").text("A* Algorithm");
      }
      ALGORITHM = choice;
  });

  //oNCLICK HAndle Visualization [[[[[[Start]]]]]]]
  $("#start").on("click", function () {
    if (startid == undefined || endid == undefined) {
      alert("Select the starting and ending point.");
    } else {
      wallGenerate();
      connectArray(SIZE);
      //Disable input field
      $("#wall").prop("disabled", true);
      $("#clear").prop("disabled", true);
      $("#size").prop("disabled", true);
      $("#speed").prop("disabled", true);
      $("#start").prop("disabled", true);
      decoder(ALGORITHM);
    }
  });

  //Handle algorithm visualization
  function decoder(algo) {
    SPEED = 6 - SPEED;
    if (algo == 1) {
      BreadthFirstSearch(data,startid,endid,SPEED);
    } else if (algo == 2) {
      DepthFirstSearch(data,startid,endid,SPEED);
    } else if (algo == 3) {
      Dijkstra(data,startid,endid,SPEED);
    } else {
     Astar(data,startid,endid,SPEED);
    }
  }

  //Display---Animation---Onclick
  $("body").on("dblclick", ".unit", function () {
    //console.log(startid);
    //console.log(endid);
    if (startid == undefined) {
      $(this).addClass("target");
      startid = $(this).attr("id");
    } else if (endid == undefined) {
      $(this).addClass("target");
      endid = $(this).attr("id");
    } else {
      //pass;
    }
  });

  //Clear Cell
  $("#clear").on("click", function () {
    startid = undefined;
    endid = undefined;
    wall = [];
    $(".unit").addClass("restore");
    data = new Array(2);
    $(".unit").removeClass("animate");
    $(".unit").removeClass("target");
    $(".unit").removeClass("wall");
    $(".unit").removeClass("path");
  });

  //Double Click Custom WALL Mouse Event
  $("body").on("mousedown", ".unit", function () {
    isDown = true;
  });

  $("body").on("mouseup", ".unit", function () {
    isDown = false;
  });

  $("body").on("mouseover", ".unit", function () {
    if (isDown && $(this).css("background-color") != "rgb(38, 38, 38)") {
      if ($(this).css("background-color") === "rgb(1, 110, 253)") {
        $(this).addClass("restore");
        $(this).removeClass("wall");
      } else {
        $(this).addClass("wall");
        $(this).removeClass("restore");
      }
      //console.log($(this).css("background-color"));
    }
  });

  //Making Wall on button Press
  $("#wall").on("click", function () {
    wall = 0;
    for (let i = 0; i < SIZE * SIZE; i++) {
      if (i == startid || i == endid) {
        //pass
      } else {
        let x = Math.round(Math.random() * 10);
        if (x == 0 || x == 1 || x == 2) {
          $("#" + i).addClass("wall");
        }
      }
    }
    //console.log(wall);
  });

  //generating wall array on click
  function wallGenerate() {
    wall = [];
    for (let i = 0; i < SIZE * SIZE; i++) {
      let x = $("#" + i).css("background-color");
      if (x == "rgb(1, 110, 253)") {
        wall.push(i);
      }
    }
    //console.log(wall);
  }

  //Generate Array of Given Size//Conerting Array to Graph
  function connectArray(size) {
    uniqueId = 0;

    //Making 2-D Array
    for (let i = 0; i < size; i++) {
      data[i] = new Array(2);
    }

    //Initializing 2-D Array
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        //console.log(wall.indexOf(uniqueId))
        if(wall.indexOf(uniqueId)==-1){
          data[i][j] = new Spot(i, j, false, uniqueId++);
        }else{
          data[i][j] = new Spot(i, j, true, uniqueId++);
        }
      }
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        data[i][j].connectFrom(data);
      }
    }
    //console.log(data);
  }

    //Function to make neighbors
    function Spot(i,j,isWall,id){
      this.i = i;
      this.j = j;
      this.id = id;
      this.isWall = isWall;
      this.neighbors = [];
      this.path = [];
      this.visited = false;
      this.distance = Infinity;
      this.heuristic = 0;
      this.function = this.distance + this.heuristic;
      this.source = "";

      this.connectFrom = function(data){
          var i = this.i;
          var j = this.j;
          if(i>0 && !(data[i-1][j].isWall)){
              this.neighbors.push(data[i-1][j])
          }
          if(i<SIZE-1 && !(data[i+1][j].isWall)){
              this.neighbors.push(data[i+1][j])
          }
          if(j>0 && !(data[i][j-1].isWall)){
              this.neighbors.push(data[i][j-1])
          }
          if(j<SIZE-1 && !(data[i][j+1].isWall)){
              this.neighbors.push(data[i][j+1])
          }
      }

  }


  //Make bfs dfs work ===> visual animate and path animate
  //Scope for the dijistra and algorithm
  //Scope of the the other algorithm to work

  //Applying Algorithm one-by-one

  //===============================
});
















//BFS-------------------------------------------------------------------------------

var Data;
var Queue = [];
var visited = [];

//Implementing BFS Traversal
function BreadthFirstSearch(arrayData,startNode,endNode,SPEED){

    Data = new Array(2);
    Data = arrayData;
    Queue = [];
    visited = [];
    //console.log(Data[0][0]);
    let found = false;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if(Data[i][j].id==startNode){
                startNode = Data[i][j];
                found = true;
                break;
            }
            if(found){
                break;
            }
        }
    }
    //console.log(startNode)

    Queue.push(startNode);
    visited.push(startNode);
    //console.log(Queue);
    //console.log(visited);

    while(Queue.length != 0){
        let x = Queue.shift();
        //console.log(x);
        for (let i = 0; i < x.neighbors.length; i++) {
            if (checkVisitedNode(x.neighbors[i])){
                Queue.push(x.neighbors[i]);
                visited.push(x.neighbors[i]);
            }
        }
    }

    bfsAnimate(visited,endNode,SPEED)
}

//Check Visited Node
function checkVisitedNode(node){
    for (let i = 0; i < visited.length; i++) {
        if(node == visited[i]){
            return false;
        }   
    }
    return true;
}

//function Animate
function bfsAnimate(data,stop,speed){
    //console.log(data);
    //console.log(stop);
    let notfound = true;

    for (var i = 1; i < data.length; i++) {
        let x = data[i].id;
        if(x!=stop){
            setTimeout(function(){
                $("#"+x).addClass("animate");
                //console.log(x);
            },(i+1)*20*speed);
        }else{
            notfound = false;
            setTimeout(function(){
                alert("Element Found! \nNode visited after searching "+(i-1)+" nodes.");
                $("#wall").removeAttr('disabled');
                $("#clear").removeAttr('disabled');
                $("#size").removeAttr('disabled');
                $("#speed").removeAttr('disabled');
                $("#start").removeAttr('disabled');
            },(i+3)*20*speed);
            break
        }
    }
    if(notfound){
        setTimeout(function(){
            alert("Element cannot be found!");
            $("#wall").removeAttr('disabled');
            $("#clear").removeAttr('disabled');
            $("#size").removeAttr('disabled');
            $("#speed").removeAttr('disabled');
            $("#start").removeAttr('disabled');
        },(i+3)*20*speed);
    }
}

//DFS-------------------------------------------------------------------------------
var Data;
var visited = [];
var spotted = false

//Implementing BFS Traversal
function DepthFirstSearch(arrayData,startNode,endNode,SPEED){

    Data = new Array(2);
    Data = arrayData;
    visited = [];
    //console.log(Data[0][0]);
    let found = false;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if(Data[i][j].id==startNode){
                startNode = Data[i][j];
                found = true;
                break;
            }
            if(found){
                break;
            }
        }
    }
    //console.log(startNode)
    graphTraversal(startNode,endNode);
    dfsanimate(visited,endNode,SPEED);
}
//Recursion
function graphTraversal(node,stop){
    //console.log(node);
    if(spotted){
        //pass
    }else{
        node.visited = true;
        visited.push(node.id);
        for (let i = 0; i < node.neighbors.length; i++) {
            if(!node.neighbors[i].visited){
                graphTraversal(node.neighbors[i]);
            }  
        }
        if(node==stop){
            spotted = true;
        }
    }
}

//Animate
function dfsanimate(data,stop,speed){
    //console.log(data);
    //console.log(stop);
    let notfound = true;

    for (var i = 1; i < data.length; i++) {
        let x = data[i];
        if(x!=stop){
            setTimeout(function(){
                $("#"+x).addClass("animate");
                //console.log(x);
            },(i+1)*20*speed);
        }else{
            notfound = false;
            setTimeout(function(){
                alert("Element Found! \nNode visited after searching "+(i-1)+" nodes.");
                $("#wall").removeAttr('disabled');
                $("#clear").removeAttr('disabled');
                $("#size").removeAttr('disabled');
                $("#speed").removeAttr('disabled');
                $("#start").removeAttr('disabled');
            },(i+3)*20*speed);
            break
        }
    }
    if(notfound){
        setTimeout(function(){
            alert("Element cannot be found!");
            $("#wall").removeAttr('disabled');
            $("#clear").removeAttr('disabled');
            $("#size").removeAttr('disabled');
            $("#speed").removeAttr('disabled');
            $("#start").removeAttr('disabled');
        },(i+3)*20*speed);
    }
}


//Dijkstra-----------------------------------------------------------------------
var Data;
var Queue = [];
var visited = [];
var gotit;

//Implementing Dijkstra Visualization
function Dijkstra(arrayData,startNode,endNode,SPEED){

    Data = new Array(2);
    Data = arrayData;
    Queue = [];
    visited = [];
    let f1,f2 = false;
    gotit = false;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if(Data[i][j].id==startNode){
                startNode = Data[i][j];
                f1=true;
            }
            if(Data[i][j].id==endNode){
                endNode = Data[i][j];
                f2 = true;
            }
        }
        if(f1 && f2){
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

    while(Queue.length!=0){
        var min = getMinDistance(Queue); //Getting the minimum path
        if(min == undefined){
            break;
        }

        Queue = Queue.filter(item => item !== min); //Removing the current from Queue
        for (let i = 0; i < min.neighbors.length ; i++) { //Looping through the neighbours of min
            if(Queue.indexOf(min.neighbors[i])>=0){         //Checking if it's neighbour is in the queue
                let fun = min.distance + 1                  //1 is the weighted
                if(fun<min.neighbors[i].distance){
                    min.neighbors[i].distance = fun;
                    min.neighbors[i].path = min.id;
                    //Path-Find
                    if(min.neighbors[i].id == endNode.id){
                        gotit = true
                        break;
                    }
                    //====================Animate
                    if(!gotit){
                        visited.push(min.neighbors[i].id);
                    }
                    //=========================
                }
            }
        }
    }

    console.log("END-NODE=",endNode);
    console.log("START-NODE=",startNode);
    console.log("QUEUE=",Queue);
    console.log("VISITED=",visited);

    djanimate(visited,startNode,endNode,gotit,SPEED);

}

function getMinDistance(queue){
    //Get minimum Distance
    var min = Infinity;
    var id;
    for (let i = 0; i < Queue.length; i++) {
        if(Queue[i].distance<min){
            min = Queue[i].distance;
            id = Queue[i];
        }
    }
    return id;
}


//Animate
function djanimate(data,start,stop,get,speed){
    //console.log(data);
    //console.log(stop);
    //console.log(stop);

    for (var i = 0; i < data.length; i++) {
        let x = data[i];
        console.log(x+"==="+stop);
            setTimeout(function(){
                $("#"+x).addClass("animate");
                //console.log(x);
            },(i+1)*20*speed);
    }
    if(!get){
        setTimeout(function(){
            alert("Element cannot be found!");
            $("#wall").removeAttr('disabled');
            $("#clear").removeAttr('disabled');
            $("#size").removeAttr('disabled');
            $("#speed").removeAttr('disabled');
            $("#start").removeAttr('disabled');
        },(i+3)*20*speed);
    }

    if(gotit){
        pathAnimate(start,stop,i,speed)
    }
}

function pathAnimate(start,stop,frames,speed){
    let nodes = frames;
    // console.log(start);
    // console.log(stop);
    // console.log(frames);
    var x = stop;
    var trace = [];
    console.log("*********"+x.path)
    while (x != start) {
      let path = x.path;
      trace.push(path);
      for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
          if (Data[i][j].id == path) {
            x = Data[i][j];
          }
        }
      }
    }

    console.log(trace);
    for (let i = trace.length - 2; i >= 0; i--) {
        setTimeout(function () {
          $("#" + trace[i]).addClass("path");
          console.log("Trace = " + trace[i]);
        }, ++frames * 20*speed);
    }

    //console.log("Entered");
    setTimeout(function(){
        alert("Element Found! \nPath Distance : "+ (trace.length - 1) +"\nNode visited after searching "+(nodes)+" nodes.");
        $("#wall").removeAttr('disabled');
        $("#clear").removeAttr('disabled');
        $("#size").removeAttr('disabled');
        $("#speed").removeAttr('disabled');
        $("#start").removeAttr('disabled');
    },(++frames+2)*20*speed);


}




//astar--------------------------------------------------------------------
var Data;
var Queue = [];
var visited = [];
var found = false;
var totalPath = [];

//Implementing Dijkstra Visualization
function Astar(arrayData,startNode,endNode,SPEED){

    //Initialization
    Data = new Array(2);
    Data = arrayData;
    Queue = [];
    visited = [];
    found = false;
    totalPath = [];

    //console.log(Data[0][0]);
    let f1,f2 = false;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if(Data[i][j].id==startNode){
                startNode = Data[i][j];
                f1=true;
            }
            if(Data[i][j].id==endNode){
                endNode = Data[i][j];
                f2 = true;
            }
        }
        if(f1 && f2){
            break;
        }
    }

    //Calculating Heuristic
    calculateHeuristic(Data, startNode, endNode)
    //console.log(Data);

    //Astar
    Astarcode(Data,startNode,endNode, totalPath, visited);
    //console.log(Data);
    //console.log(visited);
    //console.log(totalPath);
    for (var i = 0; i < visited.length; i++) {
        let x = visited[i];
        //console.log(x+"==="+stop);
        if(x!=endNode.id){
            setTimeout(function(){
                $("#"+x).addClass("animate");
            },(i+1)*20*SPEED);
        }
    }
    if(!found){
        setTimeout(function(){
            alert("Not Found");
            $("#wall").removeAttr('disabled');
            $("#clear").removeAttr('disabled');
            $("#size").removeAttr('disabled');
            $("#speed").removeAttr('disabled');
            $("#start").removeAttr('disabled');
        },(i+2)*20*SPEED);
    }else{
        AstarPath(totalPath,i,visited.length,SPEED);
    }

}

//Trace Path
function tracePath(prevSource, currentNode, startNode, totalPath, Data){
    let val = currentNode;
    while(val.source != startNode.id){
        totalPath.push(val.source);
        val = val.neighbors.filter(item => item.id == val.source)
        val = val[0];
    }
    //console.log(totalPath);
}

//Calculate Heuristic
function calculateHeuristic(Data, startNode, endNode){
    //console.log(startNode.i+","+startNode.j);
    //console.log(endNode.i+","+endNode.j);
    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
           Data[i][j].heuristic = Math.abs(Data[i][j].i-endNode.i) + Math.abs(Data[i][j].j-endNode.j);
        }
        
    }
}

function Astarcode(Data, startNode, endNode, totalPath, visited){

    //Astar
    //Setting Starting Node distance to 0
    startNode.distance = 0;

    //Pushing startNode to the Queue
    Queue.push(startNode);

    while(Queue.length!=0){
        //console.log(Queue);
        //Calculating minimum f-score
        var current;
        var min = Infinity;
        for (let i = 0; i < Queue.length; i++) {
            if((Queue[i].distance + Queue[i].heuristic) < min){
                min = Queue[i].distance + Queue[i].heuristic;
                current = Queue[i]
            }
        }

        //If element is finished
        //console.log(current)
        //console.log(endNode)
        if(current === endNode){
            found = true;
            return tracePath(current.source, current, startNode, totalPath, Data);
        }

        //Popping the element current from the Queue
        Queue = Queue.filter(item => item.id != current.id);
        //console.log(current.neighbors);

        for (let i = 0; i < current.neighbors.length; i++) {
            var f = current.distance + 1 //Storing the distance
            if(f < current.neighbors[i].distance){
                current.neighbors[i].source = current.id;
                current.neighbors[i].distance = f;
                current.neighbors[i].function = current.neighbors[i].distance + current.neighbors[i].heuristic;
                if(Queue.indexOf(current.neighbors[i]) == -1){
                    Queue.push(current.neighbors[i]);
                }
                //Animate
                visited.push(current.neighbors[i].id);
            }

        }
        //console.log(visited);

    }
    return false;
}

function AstarPath(path, frames, nodes, speed){
    for (var i = path.length-1; i >=0; i--) {
        let x = path[i];
        //console.log(x+"==="+stop);
        setTimeout(function(){
            $("#"+x).addClass("path");
        },++frames*20*speed);
    }

    setTimeout(function(){
        alert("Path Found\nDistance : "+path.length+"\nNode visited after searching "+(nodes)+" nodes.");
        $("#wall").removeAttr('disabled');
        $("#clear").removeAttr('disabled');
        $("#size").removeAttr('disabled');
        $("#speed").removeAttr('disabled');
        $("#start").removeAttr('disabled');
    },(++frames+2)*20*speed);

}

