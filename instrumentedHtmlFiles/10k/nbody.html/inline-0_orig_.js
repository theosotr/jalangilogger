
var part_p = new Object();
var last_count = 8;
var pos = new Object();
pos.x = 0;
pos.y = 0;
part_p.x = 200.0;
part_p.y = 200.0;
part_p.x_speed = 1.0 - Math.random() * 2.0;
part_p.y_speed = 1.0 - Math.random() * 2.0;
part_p.x_acc = 1.0 - Math.random() * 2.0;
part_p.y_acc = 1.0 - Math.random() * 2.0;
part_p.last_pos = new Array();
for (var i = 0; i < last_count; i++)
    part_p.last_pos[i] = clone(pos);

part_p.pos_counter = 0;

part_p.m = 1;

var x_size = 800;
var y_size = 600;

var g_c = null;
var g_canvas = null;

var particle_count = 250;

var particles = new Array();

var counter = 0.0;
var counter2 = 0;

var pos_2d_prototype = new Object();
pos_2d_prototype.x = 0;
pos_2d_prototype.y = 0;

var line_p = new Object();
line_p.point1 = clone(pos_2d_prototype);
line_p.point2 = clone(pos_2d_prototype);

var rect_2d_prototype = new Object();
rect_2d_prototype.left_top = clone(pos_2d_prototype);
rect_2d_prototype.right_bottom = clone(pos_2d_prototype);

var ray_x = 0;
var ray_inc = 10.5;

var ray_counter = 0;
var ray_item_counter = 0;

var ray_history_size = 80;

var ray_history = Array();

var ray_mod = Array();

function clear_history() {
    for (var i = 0; i < 100; i++) {
        ray_history[i] = Array();
        ray_mod[i] = Math.random();

        for (var j = 0; j < ray_history_size; j++) {
            ray_history[i][j] = clone(pos_2d_prototype);
        }
    }
}

clear_history();

var alpha_inc = 0.0;
var alpha_counter = 0.0;

function normal(mean, dev) {
    var sum = 0.0;

    for (var i = 0; i < 12; i++)
        sum += Math.random();

    return (sum - 6.0) * dev + mean;
}

function draw_line(line_2d) {
    g_c.lineWidth = 12.0;
    g_c.globalAlpha = 0.15 + alpha_inc;
    g_c.strokeStyle = "green";

    g_c.beginPath();

    g_c.moveTo(line_2d.point1.x,
            line_2d.point1.y);

    g_c.lineTo(line_2d.point2.x,
            line_2d.point2.y);
    g_c.closePath();
    g_c.stroke();

    g_c.beginPath();
    g_c.lineWidth = 8.0;
    g_c.globalAlpha = 0.3 + alpha_inc;

    g_c.moveTo(line_2d.point2.x,
            line_2d.point2.y);

    g_c.lineTo(line_2d.point1.x,
            line_2d.point1.y);

    g_c.closePath();
    g_c.stroke();

    g_c.beginPath();
    g_c.lineWidth = 3.0;
    g_c.strokeStyle = "lightgreen"
    g_c.globalAlpha = 0.6 + alpha_inc;

    g_c.moveTo(line_2d.point1.x,
            line_2d.point1.y);

    g_c.lineTo(line_2d.point2.x,
            line_2d.point2.y);

    g_c.closePath();
    g_c.stroke();

    g_c.globalAlpha = 1.0;
}

function draw_ray(x1, y1, sin_mod) {
    if (x1 >= x_size - 2) {
        clear_history();
        return;
    }

    if (sin_mod)
        y1 += Math.sin(counter * 20) * (80 * ray_mod[ray_counter]);

    g_c.beginPath();
    g_c.fillStyle = "green";

    g_c.globalAlpha = 0.1;
    g_c.arc(x1, y1, 10, 0, 2 * Math.PI, false);

    g_c.closePath();
    g_c.fill();

    g_c.beginPath();
    g_c.fillStyle = "green";

    g_c.globalAlpha = 0.3;
    g_c.arc(x1, y1, 8, 0, 2 * Math.PI, false);

    g_c.closePath();
    g_c.fill();

    g_c.beginPath();
    g_c.fillStyle = "green";

    g_c.globalAlpha = 0.5;
    g_c.arc(x1, y1, 6, 0, 2 * Math.PI, false);

    g_c.closePath();
    g_c.fill();

    g_c.beginPath();
    g_c.fillStyle = "lightgreen";

    g_c.globalAlpha = 0.9;
    g_c.arc(x1, y1, 4, 0, 2 * Math.PI, false);

    g_c.closePath();
    g_c.fill();

    g_c.globalAlpha = 1.0;

    ray_history[ray_counter][ray_item_counter].x = x1;
    ray_history[ray_counter][ray_item_counter].y = y1;


    for (var i = 1; i < ray_item_counter; i++) {
        if (ray_history[ray_counter][i].x != 0 && ray_history[ray_counter][i].y != 0) {
            g_c.beginPath();
            g_c.globalAlpha = i * (1 / ray_item_counter);
            g_c.moveTo(ray_history[ray_counter][i - 1].x,
                    ray_history[ray_counter][i - 1].y);
            g_c.lineTo(ray_history[ray_counter][i].x,
                    ray_history[ray_counter][i].y);

            g_c.closePath();
            g_c.stroke();

        }
    }


    ray_counter++;
}

function draw_ray_3(context, x1, y1, scale) {
    context.beginPath();
    context.fillStyle = "green";

    context.globalAlpha = 0.1 + alpha_inc;
    context.arc(x1, y1, 10 * scale, 0, 2 * Math.PI, false);

    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = "green";

    context.globalAlpha = 0.3 + alpha_inc;
    context.arc(x1, y1, 8 * scale, 0, 2 * Math.PI, false);

    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = "green";

    context.globalAlpha = 0.5 + alpha_inc;
    context.arc(x1, y1, 6 * scale, 0, 2 * Math.PI, false);

    context.closePath();
    context.fill();

    context.beginPath();
    context.fillStyle = "lightgreen";

    context.globalAlpha = 0.9 + alpha_inc;
    context.arc(x1, y1, 4 * scale, 0, 2 * Math.PI, false);

    context.closePath();
    context.fill();

    context.globalAlpha = 1.0;


}

function draw_rectangle_4(x1, y1, x2, y2) {
    var rect = clone(rect_2d_prototype);

    rect.left_top.x = x1;
    rect.left_top.y = y1;

    rect.right_bottom.x = x2;
    rect.right_bottom.y = y2;

    draw_rectangle_1(rect);
}

function draw_rectangle_1(rect) {
    var line = clone(line_p);

    line.point1.x = rect.left_top.x;
    line.point1.y = rect.left_top.y;

    line.point2.x = rect.right_bottom.x;
    line.point2.y = rect.left_top.y;

    if (ray_x >= line.point1.x && ray_x <= line.point2.x) {
        draw_ray(ray_x, line.point1.y);
        draw_ray(ray_x, line.point1.y, true);
    }

    draw_line(line);

    line.point1.x = rect.right_bottom.x;
    line.point1.y = rect.left_top.y;

    line.point2.x = rect.right_bottom.x;
    line.point2.y = rect.right_bottom.y;

    draw_line(line);

    line.point1.x = rect.right_bottom.x;
    line.point1.y = rect.right_bottom.y;

    line.point2.x = rect.left_top.x;
    line.point2.y = rect.right_bottom.y;

    if (ray_x >= line.point2.x && ray_x <= line.point1.x) {
        draw_ray(ray_x, line.point2.y);
        draw_ray(ray_x, line.point1.y, false);
    }

    draw_line(line);

    line.point1.x = rect.left_top.x;
    line.point1.y = rect.right_bottom.y;

    line.point2.x = rect.left_top.x;
    line.point2.y = rect.left_top.y;

    draw_line(line);
}


function clone(obj) {
    if (obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor();
    for (var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

function particles_init(count) {
    for (var i = 0; i < count; i++) {
        particles[i] = clone(part_p);

        particles[i].x = normal(x_size / 2.0, 100);
        particles[i].y = normal(y_size / 2.0, 100);
    }
}

function particle_draw(context, particle) {
    var center_x = x_size / 2.0;
    var center_y = y_size / 2.0;

    var dist = Math.sqrt(Math.pow(particle.x - center_x, 2) + Math.pow(particle.y - center_y, 2));

    context.beginPath();
    context.fillStyle = "rgb(0, " + (5 * (dist / 100)) + ", 0)";

    context.strokeStyle = "black";
    draw_ray_3(context, particle.x, particle.y, 1 * (dist / 100));

    for (var i = 0; i < last_count; i++) {
        var x = particle.last_pos[i].x;
        var y = particle.last_pos[i].y;
        var alpha = (last_count + 1 - i) * 50;

        if (x == 0 || y == 0)
            continue;

        context.globalAlpha = alpha / 255.0;
        context.fillStyle = "rgb(0, " + (5 * (dist / 100)) + ", 0)";

        var dist = Math.sqrt(Math.pow(x - center_x, 2) + Math.pow(y - center_y, 2));

        context.arc(x, y, 5 * (dist / 100), 0, 2 * Math.PI, true);
    }

    context.closePath();
    context.fill();
}

function updatePhysx(dt) {
    var ax;
    var ay;

    var dx;
    var dy;

    var array_clone = clone(particles);

    for (var i = 0; i < particle_count; i++) {
        ax = 0;
        ay = 0;

        for (var j = 0; j < particle_count; j++) {
            dx = particles[j].x - particles[i].x;
            dy = particles[j].y - particles[i].y;

            var invr = 1.0 / Math.sqrt(dx * dx + dy * dy + 1); //!! 1
            var invr2 = invr * invr;
            var f = particles[j].m * invr2;

            ax += f * dx;
            ay += f * dy;
        }

        array_clone[i].x = particles[i].x + dt * particles[i].x_speed + 0.5 * dt * dt * ax;
        array_clone[i].y = particles[i].y + dt * particles[i].y_speed + 0.5 * dt * dt * ay;

        particles[i].x_speed += dt * ax;
        particles[i].y_speed += dt * ay;
    }

    for (var i = 0; i < particle_count; i++) {
        particles[i].x = array_clone[i].x;
        particles[i].y = array_clone[i].y;

        particles[i].last_pos[particles[i].pos_counter].x = particles[i].x;
        particles[i].last_pos[particles[i].pos_counter].y = particles[i].y;

        particles[i].pos_counter++;

        if (particles[i].pos_counter >= last_count)
            particles[i].pos_counter = 0;
    }
}

function update() {
    updatePhysx(Math.sin(counter));

    g_c.fillStyle = "black";
    g_c.strokeStyke = "#0FF";
    g_c.lineWidth = 1;
    g_c.fillRect(0, 0, g_canvas.width, g_canvas.height);
    g_c.strokeRect(0, 0, g_canvas.width, g_canvas.height);

    g_c.fillStyle = "lightgreen";
    g_c.strokeStyle = "white";

    for (var i = 0; i < particle_count; i++)
        particle_draw(g_c, particles[i]);

    counter += 0.01;

    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            draw_rectangle_4(i * (x_size / 6.0), j * (y_size / 6.0),
                    (i + 1) * (x_size / 6.0), (j + 1) * (y_size / 6.0));
        }
    }

    ray_x += ray_inc;

    if (ray_x >= x_size)
        ray_x = 0;

    alpha_inc = Math.sin(alpha_counter) / 6.0;

    if (alpha_inc >= 0.39)
        alpha_inc = 0.39;
    else if (alpha_inc < 0)
        alpha_inc = 0;

    alpha_counter += 0.05;

    ray_counter = 0;

    ray_item_counter++;

    if (ray_item_counter >= ray_history_size) {
        ray_item_counter = 0;
    }
}

function setup() {
    var canvas = document.getElementById("mujCanvas");
    var context = canvas.getContext("2d");

    particle_count = 100;

    context.fillStyle = "black";
    context.strokeStyke = "#0FF";
    context.lineWidth = 1;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);

    particles_init(particle_count);

    context.fillStyle = "lightgreen";
    context.strokeStyle = "white";

    for (var i = 0; i < particle_count; i++)
        particle_draw(context, particles[i]);

    g_c = context;
    g_canvas = canvas;

    setInterval("update()", 1000 / 60.0);
}

