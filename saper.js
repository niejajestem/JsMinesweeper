const canvas = document.getElementById("kanwa");
const ctx = canvas.getContext('2d');
// tileStatus 0-unclicked 1-flagged 2-clicked
const tileStatus = [];
const tileValue = [];
const borderWidth = parseInt(canvas.style.borderWidth);
const tileSize = 48;

let tilesVertical = 8;
let tilesHorizontal = 8;
let bombCount = 10;
let firstDefuse;
let alive = true;

kanwa.height = tileSize*tilesVertical;
kanwa.width = tileSize*tilesHorizontal;

for(let i = 0; i < tilesHorizontal; i++)
{
    tileStatus[i] = [];
    tileValue[i] = [];
}

function ResetBoard()
{
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
    img.src = "tiles2.png";
}

function GenerateBombms()
{
    let tileCount = tilesHorizontal * tilesVertical;

    GenerateUniqueRandomNumbers(bombCount,0,tileCount-1).forEach(element =>
    {
        let y = element%tilesVertical;
        let x = Math.floor(element/tilesVertical);
        // console.log(element + " X:" + x + " Y:" + y);
        tileValue[x][y] = 9;
    });
}

function CountTileValue()
{
    for (let i = 0; i < tilesHorizontal; i++) {
        for (let j = 0; j < tilesVertical; j++) {
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

function DrawBoard()
{
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
                    Defuse(x+i,y+j);
                }
            }
        }
    }

}

function Defuse(x,y)
{
    if(firstDefuse == true && tileValue[x][y] != 0)
    {
        console.log("REGENERATE");
        Regenerate(x,y);
    }
    else if(tileValue[x][y] == 9)
    {
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
                break;
            case 1:
                tileStatus[x][y] = 0;
                break;
        }
        // console.log(tileStatus[x][y]);
        DrawBoard();
    }
});
    
function StartNewGame()
{
    firstDefuse = true;
    alive = true;
    ResetBoard();
    GenerateBombms();
    CountTileValue();
    DrawBoard();
    document.getElementById("face").innerHTML = "o o<br>__";
}

function Regenerate(x, y)
{
    ResetBoard();
    GenerateBombms();
    CountTileValue();
    DrawBoard();
    Defuse(x,y);
}

StartNewGame();