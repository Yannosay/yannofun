const container=document.getElementById("gameContainer");
const text=document.getElementById("turnText");
container.innerHTML="";
container.style.display="grid";
container.style.gridTemplateColumns="repeat(3, auto)";
container.style.gridTemplateRows="repeat(3, auto)";
container.style.gap="10px";

let turn="X";
let bigBoard=Array(9).fill(null).map(()=>Array(9).fill(""));
let miniWins=Array(9).fill("");
let nextMini=-1; // -1 = free choice

// create mini boards
function createMiniBoard(index){
  const mini=document.createElement("div");
  mini.className="mini-board";
  mini.style.display="grid";
  mini.style.gridTemplateColumns="repeat(3,80px)";
  mini.style.gridTemplateRows="repeat(3,80px)";
  mini.style.gap="3px";
  mini.style.border="2px solid #999";
  mini.style.borderRadius="12px";
  mini.dataset.index=index;
  mini.style.background="#ddd";

  for(let i=0;i<9;i++){
    const cell=document.createElement("div");
    cell.className="cell";
    cell.style.background="#eee";
    cell.style.borderRadius="10px";
    cell.style.display="flex";
    cell.style.justifyContent="center";
    cell.style.alignItems="center";
    cell.style.fontSize="36px";
    cell.style.cursor="pointer";
    cell.addEventListener("click",()=>makeMove(index,i,cell));
    mini.appendChild(cell);
  }
  container.appendChild(mini);
}

for(let i=0;i<9;i++) createMiniBoard(i);

// highlight active mini-grid
function highlightActive(){
  container.querySelectorAll(".mini-board").forEach((mini,idx)=>{
    if(nextMini===-1 || nextMini==idx){
      mini.style.boxShadow="0 0 15px limegreen inset";
    } else mini.style.boxShadow="none";
  });
}
highlightActive();

function makeMove(miniIndex,cellIndex,cell){
  if(nextMini!==-1 && miniIndex!==nextMini){flash(cell); return;}
  if(bigBoard[miniIndex][cellIndex]){flash(cell); return;}
  if(miniWins[miniIndex]){flash(cell); return;}

  bigBoard[miniIndex][cellIndex]=turn;
  cell.innerText=turn;

  // check mini win
  if(checkWin(bigBoard[miniIndex])){
    miniWins[miniIndex]=turn;
    const miniDiv=container.children[miniIndex];
    miniDiv.style.background=turn==="X"?"#aaf":"#faa";
  }

  // check big win
  if(checkWin(miniWins)){
    alert(turn+" wins Ultimate Tic-Tac-Toe!");
    location.reload();
    return;
  }

  // set next mini
  nextMini=miniWins[cellIndex] ? -1 : cellIndex;
  highlightActive();

  turn=turn==="X"?"O":"X";
  text.innerText="Turn: "+turn;
}

function flash(cell){
  cell.classList.add("invalid");
  setTimeout(()=>cell.classList.remove("invalid"),300);
}

function checkWin(b){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(line=>line.every(idx=>b[idx]===b[line[0]] && b[idx]));
}
