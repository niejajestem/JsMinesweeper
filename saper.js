const canvas = document.getElementById("kanwa");
const ctx = canvas.getContext('2d');
const isClicked = [];
const mapValue = [];

let tilesVertical = 8;
let tilesHorizontal = 8;
let tileSize = 32;
let bombCount = 10;

kanwa.height = tileSize*tilesVertical;
kanwa.width = tileSize*tilesHorizontal;

for(let i = 0; i < tilesHorizontal; i++)
{
    isClicked[i] = [];
    mapValue[i] = [];
}

for (let i = 0; i < tilesHorizontal; i++) {
    for (let j = 0; j < tilesVertical; j++) {
        isClicked[i][j] = "unclicked";
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

function DrawTile(x, y, tileType) {
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y, tileSize, tileSize);
    };

    switch(tileType) {
        case "unclicked":
            img.src = "unclicked.png";
            break;
        case 9:
            img.src = "bomb.png";
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
                if(outerIndex)
                {
                    
                }

                // mapValue[outerIndex-1][innerIndex-1] += 1;
            }
        });
    });
    console.log(mapValue);
}

console.log("AAAA");
console.log(isClicked);

function DrawBoard()
{
    for (let i = 0; i < tilesHorizontal; i++)
    {
        for (let j = 0; j < tilesVertical; j++)
        {
            const x = i * tileSize;
            const y = j * tileSize;
            
            // draws map (numbers, bombs)
            DrawTile(x, y, mapValue[i][j]);
            // draws "unclicked"
            DrawTile(x, y, isClicked[i][j])
        }
    }
}

function Defuse()
{

}

canvas.addEventListener('click', function(event) {
    const boundingRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;

    const tileX = Math.floor(mouseX / tileSize);
    const tileY = Math.floor(mouseY / tileSize);

    console.log('Tile clicked at position (' + tileX + ', ' + tileY + ')');
});

GenerateBombms();
CountMapValue();

DrawBoard();

// zrobić mapę liczb i od tego zrobic klikanie czyli po kliknieciu patrzy co tam jest i wykonuje odpowiednia akcje