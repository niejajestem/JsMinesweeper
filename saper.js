const canvas = document.getElementById("kanwa");
const ctx = canvas.getContext('2d');
// tileStatus 0-unclicked 1-flagged 2-clicked
const tileStatus = [];
const tileValue = [];
const borderWidth = parseInt(canvas.style.borderWidth);
const tileSize = 48;

let tilesVertical;
let tilesHorizontal;
let bombCount;
let firstDefuse;
let flags;
let time;
let timePassed;
let unDefused = 0;
let alive = true;

kanwa.height = tileSize*tilesVertical;
kanwa.width = tileSize*tilesHorizontal;

function RandomNumber(min, max)
{
    //inclusive both sides
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GenerateUniqueRandomNumbers(count, min, max)
{
    const uniqueNumbers = [];
    while(uniqueNumbers.length < count)
    {
        const randomNumber = RandomNumber(min, max);
        if(!uniqueNumbers.includes(randomNumber))
        {
            uniqueNumbers.push(randomNumber);
        }
    }
    return uniqueNumbers;
}

function IsIndexInArray(array, rowIndex, colIndex) {
    return (
        rowIndex >= 0 &&
        colIndex >= 0 &&
        rowIndex < array.length &&
        colIndex < array[rowIndex].length
    );
}

function ResetBoard()
{
    for(let i = 0; i < tilesHorizontal; i++)
    {
        tileStatus[i] = [];
        tileValue[i] = [];
    }

    for (let i = 0; i < tilesHorizontal; i++)
    {
        for (let j = 0; j < tilesVertical; j++)
        {
            tileStatus[i][j] = 0;
            tileValue[i][j] = 0;
        }
    }
    console.log(tileStatus);
}

function GenerateBombms()
{
    let tileCount = tilesHorizontal * tilesVertical;

    GenerateUniqueRandomNumbers(bombCount,0,tileCount-1).forEach(element =>
    {
        let x = Math.floor(element / tilesVertical);
        let y = element % tilesVertical;
        // console.log(element + " X:" + x + " Y:" + y);
        tileValue[x][y] = 9;
    });
}

function CountTileValue()
{
    for (let i = 0; i < tilesHorizontal; i++)
    {
        for (let j = 0; j < tilesVertical; j++)
        {
            if(tileValue[i][j] != 9)
            {
                tileValue[i][j] = 0;
            }
        }
    }

    tileValue.forEach((innerArray, outerIndex) => {
        innerArray.forEach((element, innerIndex) => {
            if(element == 9)
            {
                // console.log("Bomb found at coordinates:", outerIndex, innerIndex);
                for(let i = -1; i <= 1; i++)
                {
                    for(let j = -1; j <= 1; j++)
                    {
                        if(IsIndexInArray(tileValue, outerIndex+i,innerIndex+j) && tileValue[outerIndex+i][innerIndex+j] != 9)
                        {
                            if((i == 0 && j == 0)==false)
                            {
                                tileValue[outerIndex+i][innerIndex+j] += 1;
                                // console.log("i = "+ i +" j = "+ j);
                            }
                        }
                    }
                }
            }
        });
    });
}

function DrawTile(x, y, tileValue)
{
    let column = tileValue%4;
    let row = Math.floor(tileValue/4);
    // console.log(tileValue+1+"   "+column+"   "+row);
    const img = new Image();
    img.onload = function()
    {
        ctx.drawImage(img, column*128, row*128, 128, 128, x, y, tileSize, tileSize);
    };
    img.src = "tiles.png";
}

function DrawBoard()
{
    if(flags < 0)
    {
        document.getElementById("flags").innerHTML = "Flags: "+ flags + "?";
    }else
    {
        document.getElementById("flags").innerHTML = "Flags: "+ flags;
    }
    
    for (let i = 0; i < tilesHorizontal; i++)
    {
        for (let j = 0; j < tilesVertical; j++)
        {
            const x = i * tileSize;
            const y = j * tileSize;

            if(tileStatus[i][j] == 2)
            {
                DrawTile(x, y, tileValue[i][j]);
            }
            else if(tileStatus[i][j] == 1)
            {
                DrawTile(x, y, 11);
            }
            else
            {
                DrawTile(x, y, 10);
            }
        }
    }
}

function RevealBombs()
{
    for (let i = 0; i < tilesHorizontal; i++)
    {
        for (let j = 0; j < tilesVertical; j++)
        {
            if(tileValue[i][j] == 9)
            {
                if(tileStatus[i][j] == 1)
                {
                    tileStatus[i][j] = 2;
                    tileValue[i][j] = 12;
                }else if(tileStatus[i][j] == 2)
                {
                    tileValue[i][j] = 13;
                    console.log("Bomba");
                }else
                {
                    tileStatus[i][j] = 2;
                }
            }
        }
    }
}

function Defuse(x,y,isFromDefuseAround)
{
    if(firstDefuse == true && tileValue[x][y] != 0)
    {
        CountPlayTime();
        console.log("REGENERATE");
        Regenerate(x,y);
    }
    else if(tileValue[x][y] == 9)
    {
        clearInterval(timePassed);
        tileStatus[x][y] = 2;
        alive = false;
        RevealBombs();
        document.getElementById("face").innerHTML = "x x<br>__";
    }
    else
    {
        // console.warn("DO NOT");
        firstDefuse = false;
        tileStatus[x][y] = 2;
    
        if(tileValue[x][y] == 0)
        {
            for(let i = -1; i <= 1; i++)
            {
                for(let j = -1; j <= 1; j++)
                {
                    if(IsIndexInArray(tileValue, x+i, y+j) && tileStatus[x + i][y + j] == 0)
                    {
                        // console.warn("X: "+(x+i)+" Y: "+(y+j));
                        Defuse(x+i, y+j);
                    }
                }
            }
        }
    }
    CheckForWin();
}

function DefuseAround(x,y)
{
    let flagAround = 0;
    for(let i = -1; i <= 1; i++)
    {
        for(let j = -1; j <= 1; j++)
        {
            if(IsIndexInArray(tileValue, x+i, y+j) && tileStatus[x+i][y+j] == 1)
            {
                flagAround++;
            }
        }
    }

    if(tileValue[x][y] == flagAround)
    {
        for(let i = -1; i <= 1; i++)
        {
            for(let j = -1; j <= 1; j++)
            {
                if(IsIndexInArray(tileValue, x+i, y+j) && tileStatus[x+i][y+j] != 1)
                {
                    Defuse(x+i,y+j,true);
                }
            }
        }
    }
}

function CountPlayTime()
{
    clearInterval(timePassed);
    timePassed = setInterval(() =>
    {
        time++;
        document.getElementById("time").innerHTML = "Time: " + time;
    }, 1000);
}

function CheckForWin()
{
    for (let i = 0; i < tilesHorizontal; i++)
    {
        for (let j = 0; j < tilesVertical; j++)
        {
            if(tileStatus[i][j] != 2)
            {
                unDefused++;
                console.log("flaged" + unDefused);
            }
        }
    }
    if(unDefused == bombCount)
    {
        Win();
    }
    unDefused = 0;
}

function Win()
{
    for (let i = 0; i < tilesHorizontal; i++)
    {
        for (let j = 0; j < tilesVertical; j++)
        {
            if(tileStatus[i][j] != 2)
            {
                tileStatus[i][j] = 2;
                tileValue[i][j] = 12;
            }
        }
    }
    clearTimeout(timePassed);
    flags = 0;
    alert("You win!");
}

function StartNewGame()
{
    tilesVertical = document.getElementById("height").value;
    tilesHorizontal = document.getElementById("width").value;
    bombCount = document.getElementById("bombs").value;
    if(bombCount >= tilesHorizontal*tilesVertical)
    {
        alert("There are "+bombCount+" bombs\nUnfortunatelly they can not fit inside this map that has only "+tilesHorizontal*tilesVertical+" tiles");
        return 0;
    }
    flags = bombCount;
    canvas.width = tilesHorizontal * 48;
    canvas.height = tilesVertical * 48;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    firstDefuse = true;
    alive = true;
    ResetBoard();
    GenerateBombms();
    CountTileValue();
    DrawBoard();
    document.getElementById("face").innerHTML = "o o<br>__";
    clearInterval(timePassed);
    time = 0;
    document.getElementById("time").innerHTML = "Time: " + time;
}

function Regenerate(x, y)
{
    ResetBoard();
    GenerateBombms();
    CountTileValue();
    DrawBoard();
    Defuse(x,y);
}

canvas.addEventListener("click", function(event)
{
    event.preventDefault();
    if(alive)
    {
        const boundingRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - boundingRect.left - borderWidth;
        const mouseY = event.clientY - boundingRect.top - borderWidth;
        
        const x = Math.floor(mouseX / tileSize);
        const y = Math.floor(mouseY / tileSize);
        
        // console.log("Tile clicked at position (" + x + ", " + y + ")");
        if(tileStatus[x][y] == 0)
        {
            Defuse(x,y);
        }else if(tileStatus[x][y] == 2)
        {
            DefuseAround(x,y);
        }
        // console.log(tileStatus[x][y]);
        DrawBoard();
    }
});
    
canvas.addEventListener("contextmenu", function(event)
{
    event.preventDefault();
    if(alive)
    {
        const boundingRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - boundingRect.left - borderWidth;
        const mouseY = event.clientY - boundingRect.top - borderWidth;
        
        const x = Math.floor(mouseX / tileSize);
        const y = Math.floor(mouseY / tileSize);
        
        // console.log("Tile flagged at position (" + x + ", " + y + ")");
        if(firstDefuse)
        {
            Defuse(x,y);
        }

        switch(tileStatus[x][y])
        {
            case 0:
                tileStatus[x][y] = 1;
                flags--;
                break;
            case 1:
                tileStatus[x][y] = 0;
                flags++;
                break;
        }
        // console.log(tileStatus[x][y]);
        DrawBoard();
    }
});

StartNewGame();