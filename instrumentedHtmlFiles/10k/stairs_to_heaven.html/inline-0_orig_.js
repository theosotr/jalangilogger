

    // TODO: Added support for Array.forEach
    Array.prototype.forEach = function (callback) {
        TAJS_dumpValue(this)
        for (var i = 0; i < this.length; i++) {
            callback(this[i], i, this);
        }
    };

    var q = function() {
        function r() {
            if (b.ju == 0 && b.fa == 0) {
                b.fa = 0;
                b.faS = 0;
                b.ju = 1;
                b.juS = 17
            }
        }

        function x() {
            if (b.Y > 250)b.sp(b.X, b.Y - b.juS); else {
                y(b.juS * 0.6);
                if (b.juS > 10) {
                    i += 1;
                    s.innerHTML = i
                }
                k.forEach(function(a, c) {
                    a.y += b.juS;
                    if (a.y > f) {
                        var e = ~~(Math.random() * 5);
                        e = e == 0 ? 1 : 0;
                        k[c] = new t(Math.random() * (g - 70), a.y - f - Math.random() * 10, e)
                    }
                })
            }
            b.juS--;
            if (b.juS == 0) {
                b.ju = 0;
                b.fa = 1;
                b.faS = 1
            }
        }

        var u,m = 1,g = 350,f = 500,i = 0,s = document.getElementById("points"),j = document.getElementById("c"),d = j.getContext("2d"),z = function() {
            m = 0;
            clearTimeout(u);
            setTimeout(function() {
                v();
                d.fillStyle = "Black";
                d.fillText("GAME OVER", g / 2 - 60, f / 2 - 50);
                d.fillText("YOUR RESULT:" + i, g / 2 - 60, f / 2 - 30);
                d.fillText("CLICK ANYWHERE TO PLAY AGAIN", g / 2 - 60, f / 2 - 10)
            }, 100)
        };
        j.width = g;
        j.height = f;
        for (var v = function() {
            d.fillStyle = "#d0e7f9";
            d.clearRect(0, 0, g, f);
            d.beginPath();
            d.rect(0, 0, g, f);
            d.closePath();
            d.fill()
        },h = [],w = 0; w < 10; w++)h.push([Math.random() * g,Math.random() * f,Math.random() * 100,Math.random() / 2]);
        var A = function() {
            for (var a = 0; a < 10; a++) {
                d.fillStyle = "rgba(255, 255, 255, " + h[a][3] + ")";
                d.beginPath();
                d.arc(h[a][0], h[a][1], h[a][2], 0, Math.PI * 2, true);
                d.closePath();
                d.fill()
            }
        },y = function(a) {
            for (var c = 0; c < 10; c++)if (h[c][1] - h[c][2] > f) {
                h[c][0] = Math.random() * g;
                h[c][2] = Math.random() * 100;
                h[c][1] = 0 - h[c][2];
                h[c][3] = Math.random() / 2
            } else h[c][1] += a
        },p = function() {
            b.ju && x();
            if (b.fa)if (b.Y < f - b.he) {
                b.sp(b.X, b.Y + b.faS);
                b.faS++
            } else i == 0 ? o() : z();
            v();
            A();
            b.dr();
            k.forEach(function(a, c) {
                if (a.m) {
                    if (a.x < 0)a.k = 1; else if (a.x > g - 70)a.k = -1;
                    a.x += a.k * (c / 2) * ~~(i / 100)
                }
                var e = d.createRadialGradient(a.x + 35, a.y + 10, 5, a.x + 35, a.y + 10, 45);
                e.addColorStop(0, a.fc);
                e.addColorStop(1, a.sc);
                d.fillStyle = e;
                d.fillRect(a.x, a.y, 70, 20)
            });
            B();
            if (m == 1)u = setTimeout(p, 20)
        },b = new (function() {
            var a = this;
            a.im = new Image;
            a.sp = 1;
            a.wi = 0;
            a.he = 0;
            a.fr = 0;
            a.actFr = 0;
            a.anSp = 0;
            a.anIn = 0;
            a.X = 0;
            a.Y = 0;
            a.c = function(c, e, n) {
                a.im.src = "data:image/gif;base64,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%3D";
                a.wi = c;
                a.he = e;
                a.fr = n
            };
            a.sp = function(c, e) {
                a.X = c;
                a.Y = e
            };
            a.dr = function() {
                try {
                    d.drawImage(a.im, 0, a.he * a.actFr, a.wi, a.he, a.X, a.Y, a.wi, a.he)
                } catch(c) {
                }
                if (a.anIn == a.anSp && a.anSp !== 0) {
                    if (a.actFr == a.fr)a.actFr = 0; else a.actFr++;
                    a.anIn = 0
                }
                a.anSp !== 0 && a.anIn++
            }
        });
        b.c(65, 95, 1);
        b.sp(g / 2, f - b.he);
        b.anSp = 4;
        b.ju = 0;
        b.fa = 0;
        b.juS = 0;
        b.faS = 0;
        r();
        var o = function() {
            b.fa = 0;
            b.faS = 0;
            r();
            lot = 0
        },l = [];
        l[0] = function() {
            o()
        };
        l[1] = function() {
            o();
            b.juS = 50
        };
        l[2] = l[0];
        var k = [],t = function(a, c, e) {
            var n = "#FF8C00";
            secondColor = "#EEEE00";
            if (e == 1) {
                n = "#AADD00";
                secondColor = "#698B22"
            }
            return{x:~~a,y:c,fc:n,sc:secondColor,t:e,m:~~(Math.random() * 2),k:~~(Math.random() * 2) ? -1 : 1}
        };
        (function() {
            for (var a = 0,c,e = 0; e < 5; e++) {
                c = ~~(Math.random() * 5);
                c = c == 0 ? 1 : 0;
                k[e] = new t(Math.random() * (g - 70), a, c);
                if (a < f - 20)a += ~~(f / 5)
            }
        })();
        var B = function() {
            k.forEach(function(a) {
                b.fa && b.X < a.x + 70 && b.X + b.wi > a.x && b.Y + b.he > a.y && b.Y + b.he < a.y + 20 && l[a.t]()
            })
        };
        document.onmousemove = function(a) {
            if (b.X + j.offsetLeft > a.pageX)b.X > 0 && b.sp(b.X - 3, b.Y); else b.X + j.offsetLeft < a.pageX && b.X + b.wi < g && b.sp(b.X + 3, b.Y)
        };
        j.addEventListener("click", function() {
            if (m == 0) {
                i = 0;
                i += 0;
                s.innerHTML = i;
                m = 1;
                p()
            }
        }, false);
        p()
    }();
