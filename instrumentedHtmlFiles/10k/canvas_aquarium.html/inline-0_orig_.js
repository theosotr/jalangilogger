
    var f,h,k;
    function l(b, a, c) {
        b.shadowOffsetX = 0;
        b.shadowOffsetY = 0;
        b.shadowBlur = a;
        b.shadowColor = c
    }
    function m(b, a, c, d, e, g) {
        b.addColorStop(a, "rgba(" + c + "," + d + "," + e + "," + g + ")")
    }
    function n(b, a) {
        var c = b ? b[a] : null;
        if (typeof c == "undefined")return function() {
        };
        return function() {
            return c.apply(b, arguments)
        }
    }
    function p(b, a) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = b;
        this.canvas.height = a
    }
    p.prototype.f = function() {
        var b = this.canvas,a = b.getContext("2d"),c = b.width;
        b = b.height;
        for (var d = 0; d < c * 10; d++) {
            var e = q(10, c - 10),g = q(b - q(65, 72), b - 10),i = q(2, 4),j = a.createRadialGradient(e, g, 0, e, g, i),o = "rgba(" + ~~q(90, 110) + "," + ~~q(50, 70) + ",00,1)",r = "rgba(" + ~~q(34, 54) + "," + ~~q(27, 47) + "," + ~~q(19, 39) + ",1)";
            j.addColorStop(0.4, o);
            j.addColorStop(1, r);
            a.fillStyle = j;
            s(a, e, g, i);
            a.fill();
            a.lineWidth = 1;
            a.strokeStyle = "#2f251c";
            a.stroke()
        }
        a.strokeStyle = "#666";
        a.lineWidth = 15;
        a.beginPath();
        a.moveTo(0, 7.5);
        a.lineTo(c - 7.5,
                7.5);
        a.lineTo(c - 7.5, b - 7.5);
        a.lineTo(7.5, b - 7.5);
        a.lineTo(7.5, -7.5);
        a.stroke()
    };
    p.prototype.g = function(b) {
        var a = this.canvas;
        b.drawImage(a, 0, 0, a.width, a.height)
    };
    function t(b, a, c, d, e) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = u;
        this.canvas.height = v;
        this.k = b;
        this.x = a;
        this.y = c;
        this.b = d;
        this.c = e;
        this.i = 0;
        this.w = a;
        this.f();
        w.push(this)
    }
    var w = [];
    t.prototype.f = function() {
        var b = this.canvas,a = b.getContext("2d");
        a.strokeStyle = "#61afef";
        a.lineWidth = 3;
        for (var c = this.x; c < b.width; c += this.c) {
            a.moveTo(c, this.y);
            a.bezierCurveTo(c + this.c * 0.2, this.y + this.b, c + this.c * 0.8, this.y + this.b, c + this.c, this.y)
        }
        a.lineTo(b.width, b.height);
        a.lineTo(0, b.height);
        a.lineTo(0, this.y);
        a.stroke();
        b = a.createLinearGradient(0.5 * b.width, 0, 0.5 * b.width, b.height);
        b.addColorStop(0, "#67c1e9");
        b.addColorStop(0.04, "#65c1e9");
        b.addColorStop(0.5, "#7dcbec");
        b.addColorStop(1, "#2d95ea");
        a.fillStyle = b;
        a.fill()
    };
    t.prototype.g = function(b) {
        var a = this.canvas;
        if (this.i > this.k)this.i = 0;
        this.w = this.i > this.k / 2 ? this.i - (this.i - this.k / 2) * 2 + this.x : this.i + this.x;
        this.i++;
        b.drawImage(a, this.w, 0, a.width, a.height)
    };
    function x(b, a, c) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = u;
        this.canvas.height = v;
        this.x = b;
        this.y = a;
        this.a = q(c * 0.9, c * 1.1);
        this.f();
        y.push(this)
    }
    var y = [];
    x.prototype.f = function() {
        var b = this.canvas.getContext("2d");
        b.globalAlpha = 0.15;
        var a = this.a + 5;
        s(b, a, a, this.a);
        b.fillStyle = "#FFF";
        b.fill();
        b.strokeStyle = "#77c1ff";
        b.globalAlpha = 0.3;
        b.lineWidth = 1;
        b.stroke();
        b.fillStyle = "#FFF";
        b.globalAlpha = 0.15;
        b.fillRect(a * 0.7, a * 0.7, this.a * 0.4, this.a * 0.4)
    };
    x.prototype.g = function(b) {
        var a = this.canvas;
        if (this.y < 25) {
            this.y = ~~q(v - 20, v);
            this.x = ~~q(u - 80, u - 90)
        } else {
            this.y = ~~q(this.y - 2, this.y - 5);
            this.x = ~~q(this.x - 1, this.x + 2)
        }
        b.drawImage(a, this.x, this.y)
    };
    function z(b) {
        this.canvas = document.getElementById(b);
        this.l = this.canvas.getContext("2d");
        document.getElementById("view")
    }
    z.prototype.clear = function() {
        this.canvas.width = this.canvas.width
    };
    function A(b, a, c, d) {
        this.x = b;
        this.y = a;
        this.c = c;
        this.b = d;
        this.a = q(0, 3);
        this.m = 1;
        this.h = this.D = 0;
        this.canvas = [];
        this.n = [];
        this.e = {t:this.c - 10,u:this.b * 0.5,s:this.c * q(0.3, 0.75),q:this.c * q(0.15, 0.25),k:this.b * q(0, 0.35),A:10,z:this.b * q(0.25, 0.75),B:this.b * q(0, 0.4),C:this.c * q(0, 0.2),o:~~q(0, 5),n:[]};
        b = this.c - this.e.q;
        for (a = ~~q(0, 5); a > 0; a--)this.e.n.push({a:this.c - b * q(0.1, 0.3),y:this.b * q(0, 1),p:b * q(0.2, 0.5)});
        this.e.d = {b:this.b * q(0.04, 0.15),x:this.c * 0.8,a:this.b * q(0.05, 0.1)};
        this.e.j = {a:this.e.d.a * q(0.5,
                0.8),r:q(0, Math.PI * 2)};
        this.e.j.v = (this.e.d.a - this.e.j.a) * q(0.2, 0.5);
        for (b = 0; b < B; b++)this.f(b);
        this.f(B);
        C.push(this)
    }
    var B = 20,C = [];
    function D(b, a, c, d, e) {
        var g = Math.PI * 2 / B * e,i = b.c * 0.1;
        e = [d.A + i * Math.cos(g),d.z];
        g = [d.A + i * Math.cos(g + Math.PI * 0.5),a.height - d.z];
        c.beginPath();
        c.moveTo(d.t, d.u);
        c.bezierCurveTo(d.s, a.height + d.k, d.q, a.height * 0.15, e[0], e[1]);
        c.bezierCurveTo(d.C, a.height * 0.5 - d.B, d.C, a.height * 0.5 + d.B, g[0], g[1]);
        c.bezierCurveTo(d.q, a.height - a.height * 0.15, d.s, -d.k, d.t, d.u);
        b = E(b, a, c, d);
        c.fillStyle = f ? "#FFF" : b[d.o];
        c.fill()
    }
    function E(b, a) {
        var c = a.width,d = a.height,e = [];
        e[0] = k(0.64 * c, 0.45 * d, c * 0.1, 0.5 * c, 0.5 * d, c * 0.8);
        m(e[0], 0, 255, 204, 0, 0.7);
        m(e[0], 0.25, 230, 152, 0, 0.9);
        m(e[0], 0.8, 146, 62, 0, 1);
        e[1] = k(0.64 * c, 0.7 * d, c * 0.1, 0.5 * c, 0.5 * d, c * 0.8);
        m(e[1], 0.6, 129, 153, 33, 0.9);
        m(e[1], 0.45, 252, 229, 127, 1);
        m(e[1], 0.3, 232, 135, 20, 0.8);
        m(e[1], 0, 67, 106, 103, 1);
        e[2] = h(0, d * 0.45, c, d);
        m(e[2], 0.3, 254, 186, 18, 0.9);
        m(e[2], 0.32, 0, 0, 0, 0.7);
        m(e[2], 0.35, 255, 255, 255, 0.9);
        m(e[2], 0.43, 255, 255, 255, 0.9);
        m(e[2], 0.45, 0, 0, 0, 0.7);
        m(e[2], 0.47, 254, 186, 18, 0.9);
        m(e[2],
                0.55, 254, 186, 18, 0.9);
        m(e[2], 0.57, 0, 0, 0, 0.7);
        m(e[2], 0.6, 255, 255, 255, 0.9);
        m(e[2], 0.62, 255, 255, 255, 0.9);
        m(e[2], 0.64, 0, 0, 0, 0.7);
        m(e[2], 0.66, 254, 186, 18, 0.9);
        e[3] = k(0.8 * c, d, c * 0.1, 0.8 * c, d, c * 0.8);
        m(e[3], 0, 255, 255, 255, 0.9);
        m(e[3], 0.65, 128, 128, 128, 0.9);
        m(e[3], 0.7, 0, 0, 0, 0.7);
        m(e[3], 0.75, 255, 255, 255, 0.5);
        m(e[3], 0.8, 255, 255, 255, 0.5);
        m(e[3], 0.95, 128, 128, 128, 0.8);
        e[4] = k(0.8 * c, 0.5 * d, c * 0.1, 0.8 * c, 0.5 * d, c * 0.6);
        m(e[4], 0.3, 200, 0, 0, 0.9);
        m(e[4], 0.4, 255, 100, 0, 0.8);
        m(e[4], 0.75, 255, 0, 0, 0.9);
        m(e[4], 1, 200, 0, 0, 0.7);
        return e
    }
    function F(b, a, c, d, e) {
        b = k(d.d.x, a.height * 0.5 - d.d.b, 0, d.d.x, a.height * 0.5 - d.d.b, d.d.a);
        m(b, 0.7, 255, 255, 255, 1);
        m(b, 1, 255, 255, 255, 0.5);
        c.fillStyle = b;
        s(c, d.d.x - e, a.height * 0.5 - d.d.b, d.d.a);
        l(c, 5, "rgba(0,0,0,.7)");
        c.fill();
        l(c, 0, "");
        c.fillStyle = "#000";
        s(c, d.d.x + Math.cos(d.j.r) * d.j.v - e, a.height * 0.5 - d.d.b + Math.sin(d.j.r) * d.j.v, d.j.a);
        c.fill()
    }
    A.prototype.f = function(b) {
        this.canvas[b] = document.createElement("canvas");
        this.canvas[b].width = this.c;
        this.canvas[b].height = this.b;
        var a = this.canvas[b],c = a.getContext("2d"),d = this.e;
        if (b == B) {
            c.save();
            c.translate(a.width * 0.15, 0);
            c.scale(0.2, 1);
            s(c, a.width * 0.5, a.height * 0.5, this.b * 0.3);
            var e = E(this, a, c, d);
            c.restore();
            c.fillStyle = e[d.o];
            c.fill();
            F(this, a, c, d, a.width / 2);
            F(this, a, c, d, d.d.a * 2 + a.width / 2)
        } else {
            D(this, a, c, d, b);
            if (f) {
                var g = document.createElement("canvas"),i = g.getContext("2d");
                g.width = a.width;
                g.height = a.height;
                var j = this.b / 10;
                i.strokeStyle = "#000";
                for (var o = 0; o < g.width * 2 / j; o += 1)for (var r = 0; r < g.height / j; r += 1) {
                    s(i, o * j * 0.5, r * j + j * 0.5 * (o % 2), j * 0.5 - 1);
                    l(i, 3, "#000");
                    var N = 1 - Math.abs(r * j - g.height * 0.5) / (g.height * 0.5) * 1.25;
                    N *= (1 - Math.abs(o * j * 0.5 - g.width * 0.6) / (g.width * 0.7)) * 1.25;
                    i.fillStyle = "rgba(255,255,255," + N + ")";
                    i.fill()
                }
                c.globalCompositeOperation = "source-atop";
                c.drawImage(g, 0, 0, g.width, g.height);
                c.globalCompositeOperation = "source-over"
            }
            if (f) {
                g = E(this, a, c, d);
                c.globalAlpha = 0.9;
                c.globalCompositeOperation =
                        "source-atop";
                c.fillStyle = g[d.o];
                c.fillRect(0, 0, a.width, a.height);
                c.globalAlpha = 1
            }
            if (f) {
                c.globalCompositeOperation = "destination-over";
                l(c, 30, "rgba(255,255,255,0.35)");
                D(this, a, c, d, b);
                c.globalCompositeOperation = "source-over"
            }
            if (f) {
                b = this.c * 0.025 * Math.cos(Math.PI * 2 / B * b);
                c.globalCompositeOperation = "destination-over";
                for (e in d.n) {
                    g = d.n[e];
                    i = c.createLinearGradient(0.5 * a.width, 0, 0.5 * a.width, a.height);
                    i.addColorStop(0, "rgba(255,255,255,.35)");
                    i.addColorStop(0.5, "rgba(255,255,255,.2)");
                    i.addColorStop(1,
                            "rgba(255,255,255,.6)");
                    c.fillStyle = i;
                    c.beginPath();
                    c.moveTo(g.a, a.height * 0.5);
                    c.quadraticCurveTo(g.a - g.p * 0.5, g.y, g.a - g.p * 1.35 - b, g.y);
                    c.lineTo(g.a - g.p, a.height * 0.5);
                    c.fill()
                }
                c.globalCompositeOperation = "source-over"
            }
            F(this, a, c, d, 0)
        }
    };
    A.prototype.g = function(b, a) {
        var c = this.canvas[a];
        if (this.x >= u - c.width - 5 && this.h == 0) {
            this.m = this.m == 1 ? 0 : 1;
            this.x = 0;
            this.h = 1
        }
        if (this.h > 3 && q(-2, 1) > 0) {
            this.h = 0;
            c = this.canvas[a]
        } else if (this.h > 0) {
            this.h++;
            c = this.canvas[B]
        }
        if (a == 2) {
            this.D = this.y > 50 && this.y < v - 175 ? q(-1, 1) : this.y < 50 ? 2 : -2;
            if (q(-1, 1) > 0)this.a = q(this.a - 1, this.a + 1);
            if (q(-1, 15) < 0) {
                this.m = this.m == 1 ? 0 : 1;
                this.x = u - this.x - c.width;
                this.h = 1
            }
        }
        if (this.a < 1)this.a = 1;
        if (this.a > 5)this.a = 3;
        if (a < B && this.h == 0)this.x += this.a;
        if (a < B)this.y += this.D;
        b.save();
        if (!this.m) {
            b.translate(u,
                    1);
            b.scale(-1, 1)
        }
        b.drawImage(c, this.x, this.y);
        b.restore()
    };
    function q(b, a) {
        return Math.random() * (a - b) + b
    }
    function s(b, a, c, d) {
        b.beginPath();
        b.arc(a, c, d, 0, Math.PI * 2, false)
    }
    var G = 0,H = 0,I = 0,J = 1;
    K = new z("view");
    var K,L,v,u;
    new (function() {
        ctx = document.createElement("canvas").getContext("2d");
        f = ctx.globalCompositeOperation ? true : false;
        h = n(ctx, "createLinearGradient");
        k = n(ctx, "createRadialGradient")
    });
    v = K.canvas.height;
    u = K.canvas.width;
    L = new p(u, v);
    L.f();
    new t(50, -13, 30, 15, 55);
    new t(45, -13, 32, 10, 50);
    for (var M = v; M > 0; M -= Math.floor(q(10, 35)))new x(q(u - 80, u - 90), M, 8);
    document.getElementById("view").addEventListener("click", O, false);
    setInterval(function() {
        K.clear();
        for (var b in w)w[b].g(K.l);
        for (b in y)y[b].g(K.l);
        G = (G + 1) % B;
        for (b in C)I > 0 ? C[b].g(K.l, B) : C[b].g(K.l, G);
        L.g(K.l);
        I > 0 && I++;
        if (I > 100)I = 0;
        if (H == 100)H = 0; else H++;
        if (J > 0) {
            for (b = 0; b < J; b++) {
                var a = q(60, 200);
                new A(q(50, u * 0.7), q(75, v - 150), a, q(a * 0.6, a * 0.9))
            }
            J = 0
        }
    }, 25);
    function O() {
        I = 1;
        J++
    }
    ;
