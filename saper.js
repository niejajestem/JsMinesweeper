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
let alive;

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

function DrawTile(x, y, tileType) {
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y, tileSize, tileSize);
    };

    switch(tileType) {
        
        case 0:
            img.src = "0.png";
            break;
        case 1:
            img.src = "1.png";
            break;
        case 2:
            img.src = "2.png";
            break;
        case 3:
            img.src = "3.png";
            break;
        case 4:
            img.src = "4.png";
            break;
        case 5:
            img.src = "5.png";
            break;
        case 6:
            img.src = "6.png";
            break;
        case 7:
            img.src = "7.png";
            break;
        case 8:
            img.src = "8.png";
            break;
        case 9:
            img.src = "9.png";
            break;
        case 10:
            img.src = "10.png";
            break;
        case 11:
            img.src = "11.png";
            break;
    }
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

function CounttileValue()
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

function Defuse(x,y)
{
    if(firstDefuse == true && tileValue[x][y] != 0)
    {
        console.log("REGENERATE");
        Regenerate(x,y);
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
                    // Why tf this wont work
                    // if(tileStatus[x + i][y + j] == 0 && IsIndexInArray(tileValue, x+i, y+j))
                    // {
                    //     console.warn("X: "+(x+i)+" Y: "+(y+j));
                    //     Defuse(x+i, y+j);
                    // }
                    // BUT THIS DOES??!?!?!??
                    if(IsIndexInArray(tileValue, x+i, y+j) && tileStatus[x + i][y + j] == 0)
                    {
                        // console.warn("X: "+(x+i)+" Y: "+(y+j));
                        Defuse(x+i, y+j);
                    }
                }
            }
        }
        else if(tileValue[x][y] == 9)
        {
            alert("BUM!");
        }
    }
}

canvas.addEventListener("click", function(event) {
    const boundingRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left - borderWidth;
    const mouseY = event.clientY - boundingRect.top - borderWidth;

    const x = Math.floor(mouseX / tileSize);
    const y = Math.floor(mouseY / tileSize);

    // console.log("Tile clicked at position (" + x + ", " + y + ")");
    if(tileStatus[x][y] == 0)
    {
        if(tileValue[x][y] == 9)
        {
            EndGame();
        }
        Defuse(x,y);
    }
    // console.log(tileStatus[x][y]);
    event.preventDefault();
    DrawBoard();

});

canvas.addEventListener("contextmenu", function(event) {
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
    event.preventDefault();
    DrawBoard();
});

function StartNewGame()
{
    firstDefuse = true;
    alive = true;
    ResetBoard();
    GenerateBombms();
    CounttileValue();
    DrawBoard();
}

function Regenerate(x, y)
{
    ResetBoard();
    GenerateBombms();
    CounttileValue();
    DrawBoard();
    Defuse(x,y);
}

StartNewGame();