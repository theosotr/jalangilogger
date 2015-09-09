
        var mf = Math.floor,mr = Math.random,ms = Math.round;
        var W = 216,H = 108,s = Math.min(window.innerWidth / W, window.innerHeight / H),w = mf(W * s),h = mf(H * s),pdf = new Array(w * h),pdfm,tout,rate = 50;
        function l() {
            var img = new Image();
            var cvs = document.getElementById('load'),ctx = cvs.getContext('2d');
            var outline = new Image();
            outline.src = 'img/outline_small.gif';
            var de = false;
            img.onload = function() {
                cvs.width = w;
                cvs.height = h;
                cvs.style.left = (window.innerWidth - w) / 2;
                cvs.style.top = (window.innerHeight - h) / 2;
                ctx.scale(s, s);
                ctx.drawImage(img, 0, 0);
                ctx.scale(1 / s, 1 / s);
                var pixels = ctx.getImageData(0, 0, w, h),sum = 0;
                for (var y = 0; y < h; y++)
                    for (var x = 0; x < w; x++) {
                        var val = pixels.data[y * w * 4 + x * 4 + 1];
                        sum += val > 0 ? val : 0;
                        pdf[y * w + x] = sum;
                    }
                pdfm = pdf[pdf.length - 1];
                ctx.clearRect(0, 0, w, h);
                go();
            };
            img.src = 'img/earth_lights_small.gif';
            function blurdisk(x, y, r, c) {
                ctx.globalCompositeOperation = 'lighter';
                var rg = ctx.createRadialGradient(x, y, 0, x, y, r)
                rg.addColorStop(0, c);
                rg.addColorStop(uf(0.4, 0.8), c);
                rg.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = rg;
                ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
            }

            ;
            function go() {
                tout = setInterval(function() {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.globalAlpha = rate / 1600;
                    ctx.fillStyle = 'rgb(0,0,0)';
                    ctx.fillRect(0, 0, w, h);
                    if (de) {
                        ctx.scale(s, s);
                        ctx.drawImage(outline, 0, 0);
                        ctx.scale(1 / s, 1 / s);
                    } else {
                        ctx.fillStyle = 'rgb(0,0,0)';
                        ctx.fillRect(0, 0, w, h);
                    }
                    ctx.globalAlpha = 1;
                    for (var i = 0; i < rate / 5; i++) {
                        var rp = randomPos(),x = rp[1],y = rp[2],r = Math.min(h / 2, pto(10, 1.3)),alpha = 0.3 * 20 / r + 0.05,jitter = 0.1,hue = ((x - 200) / (w - 400) + Math.random() * jitter - jitter / 2) % 1,hue = hue < 0 ? hue + 1 : hue,rgb = h2r(hue, 1, 0.5 + 1 / r * 3),color = rgb.join(',') + ',' + alpha;
                        blurdisk(x, y, r, 'rgba(' + color + ')');
                    }
                }, rate);
            }

            document.getElementById('load').onclick = function() {
                de = !de;
            };
        }
        function randomPos() {
            var i = mf(Math.random() * pdfm);
            var j = sch(pdf, i);
            return[j,j % w,mf(j / w)];
        }
        function sch(o, v) {
            var h = o.length,l = -1,m;
            while (h - l > 1)
                if (o[m = h + l >> 1] < v)l = m; else h = m;
            return h;
        }
        ;
        function h2r(h, s, l) {
            var r,g,b;
            if (s == 0) {
                r = g = b = l;
            } else {
                function h2r(p, q, t) {
                    if (t < 0)t += 1;
                    if (t > 1)t -= 1;
                    if (t < 1 / 6)return p + (q - p) * 6 * t;
                    if (t < 1 / 2)return q;
                    if (t < 2 / 3)return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = h2r(p, q, h + 1 / 3);
                g = h2r(p, q, h);
                b = h2r(p, q, h - 1 / 3);
            }
            return[ms(r * 255),ms(g * 255),ms(b * 255)];
        }
        function pto(xm, alpha) {
            return mf(xm / Math.pow(Math.random(), 1 / alpha));
        }
        function uf(min, max) {
            return Math.random() * (max - min) + min;
        }
    