const canvas = document.getElementById("kanwa");
const ctx = canvas.getContext('2d');
// tileStatus 0-unclicked 1-flagged 2-clicked
const tileStatus = [];
const mapValue = [];

let tilesVertical = 8;
let tilesHorizontal = 8;
let tileSize = 32;
let bombCount = 10;

kanwa.height = tileSize*tilesVertical;
kanwa.width = tileSize*tilesHorizontal;

for(let i = 0; i < tilesHorizontal; i++)
{
    tileStatus[i] = [];
    mapValue[i] = [];
}

for (let i = 0; i < tilesHorizontal; i++)
{
    for (let j = 0; j < tilesVertical; j++)
    {
        tileStatus[i][j] = 2;
    }
}

console.log(mapValue);

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
        case 11:
            img.src = "11.png";
            break;
        case 10:
            img.src = "10.png";
            break;
        case 9:
            img.src = "9.png";
            break;
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
    }
}

function GenerateBombms()
{
    let tileCount = tilesHorizontal * tilesVertical;

    GenerateUniqueRandomNumbers(bombCount,0,tileCount-1).forEach(element =>
    {
        let y = element%tilesVertical;
        let x = Math.floor(element/tilesVertical);
        console.log(element + " X:" + x + " Y:" + y);
        mapValue[x][y] = 9;
    });
}

function CountMapValue()
{
    for (let i = 0; i < tilesHorizontal; i++) {
        for (let j = 0; j < tilesVertical; j++) {
            if(mapValue[i][j] != 9)
            {
                mapValue[i][j] = 0;
            }
        }
    }

    mapValue.forEach((innerArray, outerIndex) => {
        innerArray.forEach((element, innerIndex) => {
            if(element == 9)
            {
                console.log("Bomb found at coordinates:", outerIndex, innerIndex);

                for(let i = -1; i <= 1; i++)
                {
                    for(let j = -1; j <= 1; j++)
                    {
                        if(IsIndexInArray(mapValue, outerIndex+i,innerIndex+j) && mapValue[outerIndex+i][innerIndex+j] != 9)
                        {
                            if((i == 0 && j == 0)==false)
                            {
                                mapValue[outerIndex+i][innerIndex+j] += 1;
                                console.log("i = "+ i +" j = "+ j);
                            }
                        }
                    }
                }
            }
        });
    });
    console.log(mapValue);
}

console.log("AAAAAAAAA");
console.log(tileStatus);

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
                DrawTile(x, y, mapValue[i][j]);
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

canvas.addEventListener("click", function(event) {
    const boundingRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;

    const x = Math.floor(mouseX / tileSize);
    const y = Math.floor(mouseY / tileSize);

    console.log("Tile clicked at position (" + x + ", " + y + ")");
    if(tileStatus[x][y] != 1)
    {
        tileStatus[x][y] = 2;
        DrawBoard();
    }
    console.log(tileStatus[x][y]);
    event.preventDefault();
});

canvas.addEventListener("contextmenu", function(event) {
    const boundingRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;

    const x = Math.floor(mouseX / tileSize);
    const y = Math.floor(mouseY / tileSize);

    console.log("Tile flagged at position (" + x + ", " + y + ")");
    switch(tileStatus[x][y])
    {
        case 0:
            tileStatus[x][y] = 1;
            break;
        case 1:
            tileStatus[x][y] = 0;
            break;
    }
    DrawBoard();
    console.log(tileStatus[x][y]);
    event.preventDefault();
});

GenerateBombms();
CountMapValue();

DrawBoard();

// zrobić mapę liczb i od tego zrobic klikanie czyli po kliknieciu patrzy co tam jest i wykonuje odpowiednia akcje