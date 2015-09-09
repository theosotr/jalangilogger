
// <![CDATA[
var canvas;
var ctx;
var hWidth;
var hHeight;
var N_ARC = 48;
var arcAngle;
var lighten;
var p = new Array(3);
var color = new Array(3);
var scheme;
var tType;
var sepAngle = 15;
var hexStr = "0123456789abcdef";
var colorIncr = new Array(255, -1, 0, 0, 1, 255);
var prompt = {
    "1": ["Base Color", "Complement"],
    "2": ["Base Color", "Triad 1", "Triad 2"],
    "3": ["Base Color", "Split 1", "Split 2"],
    "4": ["Base Color", "Analog 1", "Analog 2"]
}

function ge(n) {
    return document.getElementById(n);
}
function cs(e) {
    return document.defaultView.getComputedStyle(e, null);
}
function rad(d) {
    return d * Math.PI / 180;
}
function sel(i) {
    return ge(i).selectedIndex;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.r = Math.sqrt(Math.pow(this.x - hWidth, 2) +
            Math.pow(this.y - hHeight, 2));
    this.theta = Math.atan2(this.y - hHeight, this.x - hWidth);
    if (this.theta < 0) {
        this.theta += 2 * Math.PI
    }
}

Point.prototype.setTheta = function(t) {
    this.theta = (t < 0) ? t + 2 * Math.PI : t;
}

Point.prototype.toXy = function() {
    this.x = hWidth + this.r * Math.cos(this.theta);
    this.y = hWidth + this.r * Math.sin(this.theta);
}

function hex(n) {
    return hexStr[(n >> 4) & 0x0f] + hexStr[n & 0x0f];
}

function colorStr(c) {
    return "rgb(" +
            Math.floor(c[0]) + "," + Math.floor(c[1]) + "," + Math.floor(c[2]) +
            ")";
}

function crossHair(x, y) {
    ctx.beginPath();
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x - 6, y);
    ctx.moveTo(x + 3, y);
    ctx.lineTo(x + 6, y);
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x, y - 6);
    ctx.moveTo(x, y + 3);
    ctx.lineTo(x, y + 6);
    ctx.stroke();
}

function drawCursor() {
    ctx.strokeStyle = (lighten) ? "#000" : "#fff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p[0].x, p[0].y, 3, 0, 2 * Math.PI, true);
    ctx.stroke();
    if (scheme >= 1) {
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        ctx.lineTo(p[1].x, p[1].y);
        ctx.stroke();
        crossHair(p[1].x, p[1].y);
    }
    if (scheme >= 2) {
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        ctx.lineTo(p[2].x, p[2].y);
        ctx.stroke();
        crossHair(p[2].x, p[2].y);
    }
}

function compute(sixth, segment, rad) {
    var rgb = new Array(3);
    var limit = (lighten) ? 255 : 0;

    for (var i = 0; i < 3; i++) {
        rgb[i] = colorIncr[(sixth + i * 4) % 6];
        if (rgb[i] == -1) {
            rgb[i] = 255 - segment * 32;
        }
        else if (rgb[i] == 1) {
            rgb[i] = segment * 32;
        }
        rgb[i] = limit + (rgb[i] - limit) * (rad / hWidth);
    }
    return rgb;
}

function drawWheel() {
    var s;
    var grad;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, hWidth * 2, hHeight * 2);
    s = 0;
    for (var sixth = 0; sixth < 6; sixth++) {
        for (var segment = 0; segment < 8; segment++) {
            rgb = compute(sixth, segment, hWidth);
            grad = ctx.createRadialGradient(hWidth, hHeight, 0,
                    hWidth, hHeight, hWidth);
            grad.addColorStop(0.0, (lighten) ? "#fff" : "#000");
            grad.addColorStop(1, colorStr(rgb));
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(hWidth, hHeight);
            ctx.arc(hWidth, hHeight, hWidth,
                    s * arcAngle, (s + 1) * arcAngle, false);
            ctx.closePath();
            ctx.fill();
            s++;
        }
    }
}

function getColor(pt) {
    var sixth = Math.floor(pt.theta / (Math.PI / 3));
    var segment = Math.floor((pt.theta - (sixth * Math.PI / 3)) /
            (Math.PI / 24));
    return compute(sixth, segment, pt.r);
}

function showColor(rgb, area) {
    str = colorStr(rgb);
    ge("s" + area).style.backgroundColor = str;
    str += "<br/>#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
    ge("t" + area).innerHTML = str;
}

function findOtherPoints() {
    var r, theta;
    var x, y;
    var delta = 0;
    var delta2 = 0;
    switch (scheme) {
        case 1: delta = Math.PI;  delta2 = 0; break;
        case 2: delta = rad(120); delta2 = -delta; break;
        case 3: delta = Math.PI + rad(sepAngle);
            delta2 = Math.PI - rad(sepAngle);
            break;
        case 4: delta = rad(sepAngle); delta2 = -delta; break;
    }
    if (scheme > 0) {
        p[1] = new Point(p[0].x, p[0].y);
        p[1].setTheta(p[1].theta + delta);
        p[1].toXy();
        color[1] = getColor(p[1]);
        showColor(color[1], 1);
        if (scheme > 1) {
            p[2] = new Point(p[0].x, p[0].y);
            p[2].setTheta(p[2].theta + delta2);
            p[2].toXy();
            color[2] = getColor(p[2]);
            showColor(color[2], 2);
        }
    }
}

function getClickPoint(evt) {
    var offsetX = 0, offsetY = 0;
    var element = canvas;
    var rgb;
    var r, x, y;

    drawWheel();

    var stylePaddingLeft = parseInt(cs(element)['paddingLeft'], 10) || 0;
    var stylePaddingTop = parseInt(cs(element)['paddingTop'], 10) || 0;
    var styleBorderLeft = parseInt(cs(element)['borderLeftWidth'], 10) || 0;
    var styleBorderTop = parseInt(cs(element)['borderTopWidth'], 10) || 0;
    if (element.offsetParent) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    offsetX += stylePaddingLeft + styleBorderLeft;
    offsetY += stylePaddingTop + styleBorderTop;

    x = evt.pageX - offsetX;
    y = evt.pageY - offsetY;
    r = Math.sqrt(Math.pow((x - hWidth), 2) + Math.pow((y - hHeight), 2));
    if (r <= hWidth) {
        p[0] = new Point(x, y);
        color[0] = getColor(p[0]);
        showColor(color[0], 0);
        findOtherPoints();
        setTest();
    }
    drawCursor();
}

function setLight(n) {
    lighten = n;
    drawWheel();
    color[0] = getColor(p[0]);
    showColor(color[0], 0);
    findOtherPoints();
    drawCursor();
    setTest();
}

function showSquare(n, visible) {
    ge("s" + n).style.display = (visible) ? "block" : "none";
    ge("t" + n).style.display = (visible) ? "block" : "none";
}

function setTest() {
    var t = ge("txt");
    var ctx = ge("swatch").getContext("2d");
    var c = sel("sbg");
    if (scheme > 0) {
        if (arguments.length == 1) {
            var other = arguments[0];
            if (sel("fg") == sel("bg")) {
                ge(other).selectedIndex = (scheme == 1) ?
                        1 - sel(other) : (sel(other) + 1) % 3;
            }
        }
        t.style.color = colorStr(color[sel("fg")]);
        t.style.backgroundColor = colorStr(
                color[sel("bg")]);
        ctx.fillStyle = colorStr(color[c]);
        rect(ctx, 0, 0, 150, 50);
        ctx.fill();
        if (scheme == 1) {
            ctx.fillStyle = colorStr(color[1 - c]);
            rect(ctx, 50, 10, 50, 30);
        }
        else {
            ctx.fillStyle = colorStr(color[(c + 1) % 3]);
            rect(ctx, 20, 10, 50, 30);
            ctx.fillStyle = colorStr(color[(c + 2) % 3]);
            rect(ctx, 90, 10, 50, 30);
        }
    }
}

function rect(c, x, y, w, h) {
    c.beginPath();
    c.rect(x, y, w, h);
    c.fill();
}

function setTextMenu(id, n) {
    var m = ge(id);
    var opt = prompt[n];
    var el;
    while (m.lastChild != null) {
        m.removeChild(m.lastChild);
    }
    for (var i = 0; i < opt.length; i++) {
        el = document.createElement("option");
        el.appendChild(document.createTextNode(opt[i]));
        m.appendChild(el);
    }
}

function newScheme() {
    scheme = sel("scheme");
    showSquare(1, scheme > 0);
    showSquare(2, scheme > 1);
    drawWheel();
    findOtherPoints();
    drawCursor();
    ge("sep").style.display = (scheme > 2) ? "block" : "none";
    ge("testing").style.display = (scheme > 0) ? "block" : "none";
    if (scheme > 0) {
        setTextMenu("sbg", scheme);
        setTextMenu("bg", scheme);
        setTextMenu("fg", scheme);
        ge("sbg").selectedIndex = 0;
        ge("bg").selectedIndex = 0;
        ge("fg").selectedIndex = 1;
        setTest();
    }
}

function newAngle() {
    sepAngle = parseInt(ge("sepAngle").value, 10);
    if (sepAngle < 5) {
        sepAngle = 5;
    }
    if (sepAngle > 60) {
        sepAngle = 60;
    }
    ge("sepAngle").value = sepAngle;
    drawWheel();
    findOtherPoints();
    drawCursor();
    setTest();
}

function tchoose(n) {
    tType = n;
    // document.cform.tc[n].checked = true; // Commented, Magnus
    ge("test" + tType).style.display = "block";
    ge("test" + (1 - tType)).style.display = "none";
}

function init() {
    canvas = ge("canvas");
    ctx = canvas.getContext("2d");
    canvas.onclick = getClickPoint;
    hWidth = canvas.width / 2;
    hHeight = canvas.height / 2;
    arcAngle = (2 * Math.PI / N_ARC);
    lighten = 1;
    // document.cform.mode[1].checked = true; // Commented, Magnus
    p[0] = new Point(hWidth * 2 - 2, hHeight);
    color[0] = getColor(p[0]);
    ge("sepAngle").value = sepAngle;
    ge("scheme").selectedIndex = 0;
    tchoose(0);
    newScheme(0);
    showColor(color[0], 0);
}
//]]>
