
    (function() {
        var m = [],t = [],n = [],r = null,I = null,i = 0,o = 0,x = null,y = 0,k = [],z,p = document,A = "getElementById",B = "appendChild",C = "createElement",j = "length",D = "marginTop",E = "marginLeft",w = parseFloat,X = "rgba(0,0,0,0)",G = Y("lines-score"),s = null,u = Math.PI,F,M = "#",N = [0,["c66","800"],["db6","730"],["c6d","507"],["6cf","177"],["67e","027"],["7c6","270"]];

        function J(a, b, c, f, e, g, l) {
            a.beginPath();
            a.moveTo(b + g, c);
            a.lineTo(b + f - g, c);
            a.arc(b + f - g, c + g, g, u * 1.5, u * 2, 0);
            a.lineTo(b + f, c + e - g);
            a.arc(b + f - g, c + e - g, g, 0, u / 2, 0);
            a.lineTo(b + g, c + e);
            a.arc(b + g, c + e - g, g, u / 2, u, 0);
            a.lineTo(b, c + g);
            a.arc(b + g, c + g, g, u, u * 1.5, 0);
            a.fillStyle = l;
            a.fill()
        }

        function U(a, b, c, f, e, g) {
            g = g || 10;
            f = a.getImageData(b, c, f, e);
            e = 0;
            for (var l = f.data[j]; e < l; e++) {
                var q = Math.round(Math.random() * 2 * g - g);
                f.data[e] = Math.max(Math.min(f.data[e++] * (100 + q) / 100, 254), 0);
                f.data[e] = Math.max(Math.min(f.data[e++] * (100 + q) / 100, 254), 0);
                f.data[e] = Math.max(Math.min(f.data[e++] * (100 + q) / 100, 254), 0)
            }
            a.putImageData(f, b, c)
        }

        window.onload = function() {
            I = p[A]("bg");
            var a = p[C]("canvas");
            a.width = a.height = 450;
            I[B](a);
            a = a.getContext("2d");
            var b = a.createLinearGradient(0, 0, 0, 450);
            b.addColorStop(0, "#fff");
            b.addColorStop(1, "#999");
            var c = a.createLinearGradient(0, 0, 0, 450);
            c.addColorStop(0, "#ccc");
            c.addColorStop(1, "#666");
            for (var f = 0; f < 9; f++) {
                t[f] = [];
                m[f] = [];
                for (var e = 0; e < 9; e++) {
                    J(a, f * 50 + 1, e * 50 + 1, 48, 20, 5, "#fff");
                    J(a, f * 50 + 1, e * 50 + 3, 48, 46, 5, "#666");
                    J(a, f * 50 + 1, e * 50 + 2, 48, 46, 5, (f + e) % 2 ? b : c);
                    n.push({x:f,y:e});
                    var g = p[C]("canvas");
                    g.width = g.height = 50;
                    z = g.ctx = g.getContext("2d");
                    g.style.position = "absolute";
                    g.style.left = f * 50 + "px";
                    g.style.top = e * 50 + "px";
                    g.x = f;
                    g.y = e;
                    g.path = null;
                    g.move = null;
                    g.removing = 100;
                    g.onclick = Z;
                    I[B](g);
                    t[f][e] = g;
                    m[f][e] = 0
                }
            }
            U(a, 0, 0, 450, 450, 5);
            k[0] = p[C]("canvas");
            k[0].width = k[0].height = 50;
            k[1] = p[C]("canvas");
            k[1].width = k[1].height = 50;
            k[2] = p[C]("canvas");
            k[2].width = k[2].height = 50;
            a = p[A]("f");
            a[B](k[0]);
            a[B](k[1]);
            a[B](k[2]);
            k[0].ctx = k[0].getContext("2d");
            k[1].ctx = k[1].getContext("2d");
            k[2].ctx = k[2].getContext("2d");
            V();
            p[A]("record").innerHTML = G || 0;
            K();
            p[A]("f").onclick = K;
            setInterval($, 0);
            s = p[C]("canvas");
            s.style.cssText = "position:absolute;margin:-10px 0 0 -10px";
            s.width = s.height = 70;
            z = s.getContext("2d");
            z.arc(35, 35, 30, 90, 89.999, 0);
            z.strokeStyle = "#060";
            z.lineWidth = 3;
            z.globalAlpha = 0.75;
            z.stroke();
            I[B](s);
            s.jumpTo = function(l, q) {
                var d = this.style;
                d.top = 50 * q + "px";
                d.left = 50 * l + "px";
                d.display = "block"
            };
            s.hide = function() {
                this.style.display = "none"
            };
            s.hide()
        };
        function O(a, b, c, f) {
            f = f || 1;
            !c && H(a);
            a.save();
            a.beginPath();
            a.arc(25, 25, 30, 0, u * 2, 0);
            a.scale(1, 0.5);
            a.translate(0, 28);
            c = a.createRadialGradient(25, 58, 0, 25, 58, 30 * f);
            c.addColorStop(0, "rgba(0,0,0,.5)");
            c.addColorStop(1, X);
            a.fillStyle = c;
            a.fill();
            a.restore();
            a.beginPath();
            a.arc(25, 25, 20 * f, 0, u * 2, 0);
            c = a.createRadialGradient(25, 25 - 20 * f / 2, 0, 25, 25, 20 * f);
            c.addColorStop(0, M + N[b][0]);
            c.addColorStop(1, M + N[b][1]);
            a.fillStyle = c;
            a.fill()
        }

        function aa(a, b) {
            H(a);
            a.beginPath();
            a.arc(25, 25, 10, 90, 89.999, 0);
            a.fillStyle = M + N[b][1];
            a.globalAlpha = 0.5;
            a.fill();
            a.globalAlpha = 1
        }

        function H(a) {
            a.clearRect(0, 0, 50, 50)
        }

        function Z() {
            if (!(i || o))if (this.dirty) {
                r = this;
                s.jumpTo(this.x, this.y)
            } else if (r) {
                var a = ba(r.x, r.y, this.x, this.y);
                if (a) {
                    for (var b = a[j],c = r.x,f = r.y; b--;) {
                        switch (a[b]) {case "u":f--;break;case "d":f++;break;case "l":c--;break;case "r":c++;break
                        }
                        aa(t[c][f].ctx, r.dirty)
                    }
                    r.path = a;
                    i = r;
                    x = {x:r.x,y:r.y};
                    s.hide();
                    r = null
                }
            }
        }

        function $() {
            var a = 5;
            if (!(!i && !o && !F))if (F)for (a = 0; a < 3; a++) {
                var b = F[a],c = t[b.i.x][b.i.y];
                O(c.ctx, c.dirty, 0, 0.5 + 0.5 / 3 * b.s);
                b.s += 0.1;
                a == 2 && b.s >= 3.2 && (F = 0)
            } else if (i)if (i.move) {
                b = i.style;
                c = b[D];
                var f = b[E];
                switch (i.move) {case "u":b[D] = !c ? 0 : w(c) - a + "px";w(b[D]) <= -50 && L(i.x, i.y - 1);break;case "d":b[D] = !c ? 0 : w(c) + a + "px";w(b[D]) >= 50 && L(i.x, +i.y + 1);break;case "l":b[E] = !f ? 0 : w(f) - a + "px";w(b[E]) <= -50 && L(i.x - 1, i.y);break;case "r":b[E] = !f ? 0 : w(f) + a + "px";w(b[E]) >= 50 && L(+i.x + 1, i.y)
                }
            } else i.move = i.path.pop(); else {
                for (a = b = 0; a < o[j]; a++) {
                    c = t[o[a].x][o[a].y];
                    if (c.removing)c.style.opacity = (c.removing -= 5) / 100; else {
                        c.removing = 100;
                        m[o[a].x][o[a].y] = 0;
                        n.push({x:o[a].x,y:o[a].y});
                        b = 1;
                        c.style.opacity = "";
                        c.dirty = 0;
                        H(c.ctx)
                    }
                }
                if (b) {
                    y += 10 + 4 * (o[j] - 5);
                    p[A]("score").innerHTML = y;
                    if (y > G) {
                        G = y;
                        p[A]("record").innerHTML = G;
                        ca("lines-score", G, 365)
                    }
                    o = 0
                }
            }
        }

        function L(a, b) {
            i.style[D] = "";
            i.style[E] = "";
            var c = t[a][b];
            if (c) {
                c.dirty = i.dirty;
                i.dirty = 0;
                H(i.ctx);
                O(c.ctx, c.dirty);
                if (i.path[j]) {
                    c.path = i.path;
                    i.path = i.move = null;
                    c.move = c.path.pop();
                    i = c
                } else {
                    i.path = i.move = null;
                    i = false;
                    da(a, b, x.x, x.y);
                    m[a][b] = m[x.x][x.y];
                    m[x.x][x.y] = 0;
                    !W(a, b) && K()
                }
            } else i = false
        }

        function ba(a, b, c, f) {
            for (var e = [],g = [],l = 0; l < 9; l++) {
                g[l] = [];
                for (var q = 0; q < 9; q++)g[l][q] = m[l][q] ? -2 : -1
            }
            g[a][b] = 0;
            e.push({x:a,y:b,step:0});
            for (l = 0; 1;) {
                l++;
                if (!e[j]) {
                    l = 85;
                    break
                }
                var d = e.shift();
                if (d.y != 0 && g[d.x][d.y - 1] == -1) {
                    e.push({x:d.x,y:d.y - 1,step:d.step + 1});
                    g[d.x][d.y - 1] = d.step + 1
                }
                if (d.y != 8 && g[d.x][d.y + 1] == -1) {
                    e.push({x:d.x,y:d.y + 1,step:d.step + 1});
                    g[d.x][d.y + 1] = d.step + 1
                }
                if (d.x != 0 && g[d.x - 1][d.y] == -1) {
                    e.push({x:d.x - 1,y:d.y,step:d.step + 1});
                    g[d.x - 1][d.y] = d.step + 1
                }
                if (d.x != 8 && g[d.x + 1][d.y] == -1) {
                    e.push({x:d.x + 1,y:d.y,step:d.step + 1});
                    g[d.x + 1][d.y] = d.step + 1
                }
                if (d.x == c && d.y - 1 == f || d.x == c && d.y + 1 == f || d.x - 1 == c && d.y == f || d.x + 1 == c && d.y == f)break;
                if (l > 81)break
            }
            if (l > 81)return null;
            d = {x:c,y:f,step:d.step + 1};
            for (e = []; d.x != a || d.y != b;)if (d.y != 0 && g[d.x][d.y - 1] == d.step - 1) {
                d = {x:d.x,y:d.y - 1,step:d.step - 1};
                e.push("d")
            } else if (d.y != 8 && g[d.x][d.y + 1] == d.step - 1) {
                d = {x:d.x,y:d.y + 1,step:d.step - 1};
                e.push("u")
            } else if (d.x != 0 && g[d.x - 1][d.y] == d.step - 1) {
                d = {x:d.x - 1,y:d.y,step:d.step - 1};
                e.push("r")
            } else if (d.x != 8 && g[d.x + 1][d.y] == d.step - 1) {
                d = {x:d.x + 1,y:d.y,step:d.step - 1};
                e.push("l")
            }
            return e
        }

        function ea() {
            var a = [];
            if (n[j] > 0)for (var b = 0; b < 3 && n[j]; b++) {
                var c = Math.round(Math.random() * (n[j] - 1));
                a.push(n[c]);
                for (c = c; c < n[j] - 1; c++)n[c] = n[c + 1];
                n.pop()
            }
            return a
        }

        function V() {
            for (var a = 0; a < 3; a++) {
                var b = Math.round(Math.random() * 5) + 1;
                J(k[a].ctx, 1.5, 1.5, 48, 48, 5, "#333");
                U(k[a].ctx, 0, 0, 50, 50, 50);
                k[a].ctx.strokeStyle = "#666";
                k[a].ctx.stroke();
                O(k[a].ctx, b, 1);
                k[a].num = b
            }
        }

        function da(a, b, c, f) {
            for (var e = 0; e < n[j]; e++)if (n[e].x == a && n[e].y == b) {
                n[e].x = c;
                n[e].y = f;
                return
            }
        }

        function K() {
            var a = ea(),b = 1,c = 0;
            for (F = []; c < a[j]; c++) {
                m[a[c].x][a[c].y] = k[c].num;
                F[c] = {i:a[c],s:0};
                t[a[c].x][a[c].y].dirty = k[c].num;
                W(a[c].x, a[c].y) && (b = 0)
            }
            !n[j] && b && fa();
            V()
        }

        function fa() {
            alert("Game over\n Your score is: " + y);
            y = 0;
            p[A]("score").innerHTML = y;
            m = [];
            n = [];
            for (var a = 0; a < 9; a++) {
                m[a] = [];
                for (var b = 0; b < 9; b++) {
                    n.push({x:a,y:b});
                    m[a][b] = 0;
                    t[a][b].dirty = 0;
                    H(t[a][b].ctx)
                }
            }
            K()
        }

        function W(a, b) {
            var c = [],f = [],e = [],g = [],l = 1,q = 1,d = 1,P = 1,Q = 1,R = 1,S = 1,T = 1,v = m[a][b];
            if (v) {
                for (var h = 0; l || q || d || P || Q || R || S || T;) {
                    h++;
                    if (a - h >= 0 && b - h >= 0 && m[a - h][b - h] == v && l)g.push({x:a - h,y:b - h}); else l = 0;
                    if (b - h >= 0 && m[a][b - h] == v && q)c.push({x:a,y:b - h}); else q = 0;
                    if (a + h < 9 && b - h >= 0 && m[a + h][b - h] == v && d)e.push({x:a + h,y:b - h}); else d = 0;
                    if (a - h >= 0 && b + h < 9 && m[a - h][b + h] == v && P)e.push({x:a - h,y:b + h}); else P = 0;
                    if (b + h < 9 && m[a][b + h] == v && Q)c.push({x:a,y:b + h}); else Q = 0;
                    if (a + h < 9 && b + h >= 0 && m[a + h][b + h] == v && R)g.push({x:a + h,y:b + h}); else R = 0;
                    if (a - h >= 0 && m[a - h][b] == v && S)f.push({x:a - h,y:b}); else S = 0;
                    if (a + h < 9 && m[a + h][b] == v && T)f.push({x:a + h,y:b}); else T = 0
                }
                l = 0;
                if (c[j] > 3 || f[j] > 3 || e[j] > 3 || g[j] > 3) {
                    o = [
                        {x:a,y:b}
                    ];
                    l = 1
                }
                if (c[j] > 3)for (h = 0; h < c[j]; h++)o.push(c[h]);
                if (f[j] > 3)for (h = 0; h < f[j]; h++)o.push(f[h]);
                if (e[j] > 3)for (h = 0; h < e[j]; h++)o.push(e[h]);
                if (g[j] > 3)for (h = 0; h < g[j]; h++)o.push(g[h]);
                return l
            }
        }

        function ca(a, b) {
            var c = new Date;
            c.setTime(+c + 31536e6);
            c = "; expires=" + c.toGMTString();
            p.cookie = a + "=" + b + c + "; path=/"
        }

        function Y(a) {
            a = a + "=";
            for (var b = p.cookie.split(";"),c = 0,f = b[j]; c < f; c++) {
                for (var e = b[c]; e.charAt() == " ";)e = e.substring(1, e[j]);
                if (!e.indexOf(a))return e.substring(a[j], e[j])
            }
            return null
        }
    })();
