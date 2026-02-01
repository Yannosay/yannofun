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
const winLine=document.createElement("div");
winLine.className="win-line";
container.appendChild(winLine);

function createMiniBoard(index){
  const mini=document.createElement("div");
  mini.style.display="grid";
  mini.style.gridTemplateColumns="repeat(3,100px)";
  mini.style.gridTemplateRows="repeat(3,100px)";
  mini.style.gap="3px";
  mini.style.border="2px solid #999";
  mini.style.borderRadius="12px";
  mini.dataset.index=index;
  
  for(let i=0;i<9;i++){
    const cell=document.createElement("div");
    cell.className="cell";
    cell.addEventListener("click",()=>makeMove(index,i,cell));
    mini.appendChild(cell);
  }
  container.appendChild(mini);
}

for(let i=0;i<9;i++) createMiniBoard(i);

function makeMove(miniIndex,cellIndex,cell){
  if(turn!==turn){} // always X/O local
  if(nextMini!==-1 && miniIndex!==nextMini){flash(cell); return;}
  if(bigBoard[miniIndex][cellIndex]){flash(cell); return;}
  if(miniWins[miniIndex]){flash(cell); return;}

  bigBoard[miniIndex][cellIndex]=turn;
  cell.innerText=turn;

  // check mini win
  if(checkWin(bigBoard[miniIndex])){
    miniWins[miniIndex]=turn;
    drawMiniWinLine(miniIndex,bigBoard[miniIndex]);
    checkBigWin();
  }

  nextMini=miniWins[cellIndex]?"-1":cellIndex;
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

function drawMiniWinLine(miniIndex,mini){
  const miniDiv=container.children[miniIndex];
  const line=document.createElement("div");
  line.className="win-line";
  miniDiv.appendChild(line);

  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let l of wins){
    if(l.every(idx=>mini[idx]===mini[l[0]] && mini[idx])){
      const size=miniDiv.children[0].offsetWidth+3;
      let top=0,left=0,width=size*3,angle=0;
      if(l[0]==0 && l[1]==1){top=0;angle=0;}
      else if(l[0]==3){top=size;angle=0;}
      else if(l[0]==6){top=size*2;angle=0;}
      else if(l[0]==0 && l[1]==3){angle=90;width=size*3;}
      else if(l[0]==1){left=size;angle=90;width=size*3;}
      else if(l[0]==2){left=size*2;angle=90;width=size*3;}
      else if(l[0]==0 && l[1]==4){angle=45;}
      else if(l[0]==2 && l[1]==4){angle=-45;}
      line.style.top=top+"px";
      line.style.left=left+"px";
      line.style.width="0px";
      line.style.transform=`rotate(${angle}deg)`;
      setTimeout(()=>line.style.width=width+"px",50);
    }
  }
}

function checkBigWin(){
  if(checkWin(miniWins)){
    alert(turn+" wins the Ultimate Tic-Tac-Toe!");
    location.reload();
  }
}
