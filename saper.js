const canvas = document.getElementById("kanwa");
const ctx = canvas.getContext('2d');
const plane = [];

let tilesVertical = 9;
let tilesHorizontal = 9;
let tileSize = 32;
let bombCount = 10;

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

function drawImageWithSrc(x, y, src) {
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y);
    };
    img.src = src;
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
        case "bomb":
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


function DrawImageWithSrc(x, y, src)
{
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y);
    };
    img.src = src;
}

function GenerateBombms()
{
    for(let i = 0; i < tilesHorizontal; i++)
    {
        plane[i] = [];
    }
    let bombLeft = bombCount;
    let tileCount = tilesHorizontal * tilesVertical;

    GenerateUniqueRandomNumbers(bombCount,0,tileCount-1).forEach(element => {
        let y = element%10;
        let x = Math.floor(element/10);
        console.log(element + " X:" + x + " Y:" + y);
        plane[x][y] = "bomb";
    });
    console.log(plane);
}

function CountBombsAround()
{
    return true;
}

function DrawBoard() {
    for (let i = 0; i < tilesHorizontal; i++) {
        for (let j = 0; j < tilesVertical; j++) {
            const x = i * tileSize;
            const y = j * tileSize;
            DrawTile(x, y, "unclicked");
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
DrawBoard();

// zrobić mapę liczb i od tego zrobic klikanie czyli po kliknieciu patrzy co tam jest i wykonuje odpowiednia akcje