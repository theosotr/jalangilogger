

// TODO: Added support for Array.sort
Array.prototype.sort = function (callback) {
    for (var i = 1; i < this.length; i++) {
        callback(this[i - 1], this[i]);
    }
    return this;
};

function $(a) {
    return document.getElementById(a)
}
function randInt(a, b) {
    return Math.round(Math.random() * (b - a) + a)
}
CanvasRenderingContext2D.prototype.circle = function(x, y, a) {
    this.beginPath();
    this.arc(x, y, a, 0, Math.PI * 2, true);
    this.closePath();
    this.fill();
    this.stroke()
};
var canvas = $('canvas');
var c = canvas.getContext('2d');
var balls = [];
var bullets = [];
var fms = 0;
var nextBallInterval = 90;
var nextBallAt = 30;
var nextBulletInterval = 3;
var nextBulletIntervalEmpty = 9;
var nextBulletAt = false;
var mouseIsDown = false;
var spacebarDown = false;
var gameHeight = 480;
var gameWidth = 640;
var bufferZone = 140;
var originX = gameWidth / 2;
var originY = gameHeight - 75;
var targetX;
var targetY;
var ammo = gameWidth;
var ammoUnit = 5;
var windSpeed = 0;
var ballFill = '#374c6f';
var ballStroke = '#0c1018';
var bulletFill = '#ccF';
var bulletStroke = 'transparent';
var gameBG = '#17202f';
var timeStart = (new Date()).getTime();
var totalBalls = 0;
var totalBullets = 0;
if (window.localStorage) {
    var hS = localStorage.getItem('high_scores');
    var highScores = [];
    if (hS) {
        hS = hS.split(',');
        for (var i = 0; i < hS.length; i++) {
            highScores.push(parseInt(hS[i], 10))
        }
    } else {
        highScores = []
    }
}
var Ball = function(x, y, a, b, c, d, e) {
    this.x = x;
    this.y = y;
    this.ra = a;
    this.vx = b;
    this.vy = c;
    this.stroke = d;
    this.fill = e
};
Ball.prototype = {draw:function() {
    c.save();
    c.fillStyle = this.fill;
    c.strokeStyle = this.stroke;
    c.lineWidth = 2;
    c.circle(this.x, this.y, this.ra);
    c.restore()
},move:function() {
    this.x += this.vx;
    this.y += this.vy
},wind:function() {
    if (fms > 2000) {
        var f = Math.floor(fms / 2000);
        if (f % 2 == 0) {
            windSpeed = 0.2
        } else {
            windSpeed = -0.2
        }
    }
    this.vx += windSpeed
}};
canvas.width = gameWidth;
canvas.height = gameHeight;
function mousedown(e) {
    mouseIsDown = true
}
function mouseup(e) {
    mouseIsDown = false
}
function mousemove(e) {
    targetX = e.pageX - document.getElementById('content').offsetLeft - 35;
    targetY = e.pageY - document.getElementById('content').offsetTop - 35
}
function keydown(e) {
    if (e.keyCode == 32) {
        spacebarDown = true;
        return false
    }
}
function keyup(e) {
    spacebarDown = false;
    return false
}
canvas.addEventListener('mousedown', mousedown, false);
canvas.addEventListener('mouseup', mouseup, false);
document.body.addEventListener('mousemove', mousemove, false);
document.body.addEventListener('keydown', keydown, false);
document.body.addEventListener('keyup', keyup, false);
function bg() {
    c.fillStyle = gameBG;
    c.fillRect(0, 0, gameWidth, gameHeight)
}
function addBall() {
    if (fms == nextBallAt) {
        var x = randInt(70, gameWidth - 70);
        var y = randInt(-bufferZone, -70);
        var a = randInt(originX - 50, originX + 50) - x;
        var b = randInt(originY - 50, originY + 50) - y;
        var c = Math.sqrt(a * a + b * b);
        var r = randInt(1, 4);
        var d = (a / c) * r;
        var e = (b / c) * r;
        balls.push(new Ball(x, y, randInt(15, 70), d, e, ballStroke, ballFill));
        nextBallAt = fms + randInt(nextBallInterval - (nextBallInterval / 2), nextBallInterval + (nextBallInterval / 2))
    }
}
function addBullet() {
    var a = false;
    if (mouseIsDown || spacebarDown) {
        if (!nextBulletAt || fms == nextBulletAt) {
            var b = targetX - originX;
            var c = targetY - originY;
            var d = Math.sqrt(b * b + c * c);
            var x = (b / d) * 10;
            var y = (c / d) * 10;
            if (spacebarDown) {
                if (ammo > ammoUnit * 50) {
                    bullets.push(new Ball(originX, originY, 10, x, y, bulletStroke, bulletFill));
                    a = true
                }
            } else {
                bullets.push(new Ball(originX, originY, 4, x, y, bulletStroke, bulletFill));
                a = true
            }
            totalBullets++;
            if (ammo === 0) {
                nextBulletAt = fms + nextBulletIntervalEmpty
            } else {
                nextBulletAt = fms + nextBulletInterval
            }
        }
        if (a && spacebarDown) {
            ammo -= ammoUnit * 50;
            spacebarDown = false
        } else if (!spacebarDown) {
            ammo -= ammoUnit
        }
        if (ammo < 0) {
            ammo = 0
        }
    } else {
        nextBulletAt = false;
        ammo += ammoUnit;
        if (ammo > gameWidth) {
            ammo = gameWidth
        }
    }
}
function drawBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].move();
        balls[i].vy += 0.01;
        balls[i].draw()
    }
}
function drawScene() {
    c.fillStyle = '#3e2d1e';
    c.strokeStyle = 'black';
    c.lineWidth = 10;
    c.save();
    c.scale(1, 0.2);
    c.beginPath();
    c.arc(gameWidth / 2, 2500, 400, Math.PI, 0, false);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
    c.lineWidth = 1;
    c.fillStyle = '#444';
    c.beginPath();
    c.moveTo(gameWidth / 2 - 50, gameHeight - 40);
    c.bezierCurveTo(gameWidth / 2 - 50, gameHeight - 100, gameWidth / 2 + 50, gameHeight - 100, gameWidth / 2 + 50, gameHeight - 40);
    c.quadraticCurveTo(gameWidth / 2, gameHeight - 20, gameWidth / 2 - 50, gameHeight - 40);
    c.fill();
    c.stroke();
    c.fillStyle = 'black';
    c.beginPath();
    c.moveTo(gameWidth / 2 - 15, gameHeight - 85);
    c.quadraticCurveTo(gameWidth / 2, gameHeight - 70, gameWidth / 2 + 15, gameHeight - 85);
    c.fill()
}
function drawBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].move();
        bullets[i].wind();
        bullets[i].draw()
    }
}
function drawAmmo() {
    c.fillStyle = '#1a1a1a';
    c.strokeStyle = '#555';
    c.lineWidth = 0.5;
    c.fillRect(0, gameHeight - 10, ammo, 10);
    c.strokeRect(0, gameHeight - 10, ammo, 10)
}
function drawScore() {
    c.fillStyle = 'white';
    c.font = '12px Consolas';
    var a = totalBullets ? totalBullets : 1;
    c.fillText(Math.ceil(((new Date().getTime()) - timeStart) * (totalBalls / a)), 5, 17)
}
function outOfBounds() {
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + balls[i].ra < 0 || balls[i].x - balls[i].ra > gameWidth || balls[i].y + balls[i].ra < -bufferZone || balls[i].y - balls[i].ra > gameWidth) {
            balls.splice(i, 1);
            totalBalls++
        }
    }
    for (var j = 0; j < bullets.length; j++) {
        if (bullets[j].x + bullets[j].ra < 0 || bullets[j].x - bullets[j].ra > gameWidth || bullets[j].y + bullets[j].ra < 0 || bullets[j].y - bullets[j].ra > gameWidth) {
            bullets.splice(j, 1)
        }
    }
}
function collide(a, b) {
    var c = 1;
    if (b.ra == 10) {
        c = 5
    }
    var d = a.x - a.vx - b.x;
    var e = a.y - a.vy - b.y;
    if (Math.sqrt(d * d + e * e) > a.ra + b.ra + 5) {
        return
    }
    d /= Math.sqrt(d * d + e * e);
    e /= Math.sqrt(d * d + e * e);
    var f = a.vx * d + a.vy * e;
    var g = b.vx * d + b.vy * e;
    var h = (2.0 * (f - g)) / (a.ra * 5 + b.ra * c);
    a.vx = a.vx - h * b.ra * d * c;
    a.vy = a.vy - h * b.ra * e * c;
    b.vx = -(b.vx - h * a.ra * d);
    b.vy = -(b.vy - h * a.ra * e);
    b.move()
}
function testEndGame() {
    var x = gameWidth / 2;
    var y = gameHeight - 35;
    var a = 50;
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i].x - x;
        var c = balls[i].y - y;
        var r = balls[i].ra + a;
        if (balls[i].y > gameHeight - 60) {
            continue
        }
        if ((b * b + c * c) < r * r) {
            return true
        }
    }
}
function updateScoreChart() {
    highScores.sort(function(a, b) {
        return(b - a)
    });
    var c = $('highscores');
    if (c.hasChildNodes()) {
        while (c.childNodes.length >= 1) {
            c.removeChild(c.firstChild)
        }
    }
    for (var i = 0; i < highScores.length && i < 5; i++) {
        var d = document.createElement('li');
        d.innerHTML = highScores[i];
        c.appendChild(d)
    }
    if (highScores.length === 0) {
        var d = document.createElement('li');
        d.innerHTML = 'No high scores yet.';
        c.appendChild(d)
    }
}
function saveHighScore(a) {
    highScores.push(a);
    if (window.localStorage) {
        window.localStorage.setItem('high_scores', highScores.join(','))
    }
    updateScoreChart()
}
function endGame() {
    $('score').style.display = 'block';
    var a = (new Date().getTime()) - timeStart;
    $('time').innerHTML = Math.floor(a / 1000);
    $('numballs').innerHTML = totalBalls;
    $('numbullets').innerHTML = totalBullets;
    totalBullets = totalBullets ? totalBullets : 1;
    var b = Math.ceil(a * (totalBalls / totalBullets));
    $('final').innerHTML = Math.ceil(a * (totalBalls / totalBullets));
    saveHighScore(b)
}
function main() {
    fms++;
    nextBallInterval -= 0.01;
    if (nextBallInterval < 30) {
        nextBallInterval = 30
    }
    bg();
    addBall();
    addBullet();
    drawBalls();
    drawScene();
    drawBullets();
    drawAmmo();
    for (var i = 0; i < balls.length; i++) {
        for (var j = 0; j < bullets.length; j++) {
            collide(balls[i], bullets[j])
        }
    }
    if (testEndGame()) {
        endGame();
        return
    }
    outOfBounds();
    drawScore();
    setTimeout(main, 30)
}
updateScoreChart();
bg();
drawScene();
drawAmmo();
$('inner').style.opacity = 1;
$('start').onclick = function() {
    $('inner').style.display = 'none';
    main()
};
$('restart').onclick = function() {
    balls = [];
    bullets = [];
    fms = 0;
    nextBallInterval = 90;
    nextBallAt = 30;
    nextBulletInterval = 3;
    nextBulletIntervalEmpty = 9;
    nextBulletAt = false;
    ammo = gameWidth;
    timeStart = (new Date()).getTime();
    totalBalls = 0;
    totalBullets = 0;
    $('score').style.display = 'none';
    main()
};
