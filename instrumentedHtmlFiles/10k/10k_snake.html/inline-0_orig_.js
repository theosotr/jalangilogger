
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    Array.prototype.getRandom = function() {
        return (this.length) ? this[random(0, this.length - 1)] : null
    }
    Array.prototype.getLast = function() {
        return (this.length) ? this[this.length - 1] : null
    }
    Array.prototype.erase = function(item) {
        for (var i = this.length; i--; i) {
            if (this[i] === item) this.splice(i, 1)
        }
        return this
    }
    Number.prototype.isInt = function() {
        return parseInt(this).toString() == this
    }
    Number.prototype.isWhollyDivisibleBy = function(test) {
        return (this / test).isInt()
    }
    String.prototype.contains = function(string, separator) {
        return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1
    }
    String.prototype.clean = function() {
        return this.replace(/\s+/g, ' ').trim()
    }
    Element.prototype.hasClass = function(className) {
        return this.className.contains(className, ' ')
    }
    Element.prototype.addClass = function(className) {
        if (!this.hasClass(className))
            this.className = (this.className + ' ' + className).clean()
        return this
    }
    Element.prototype.removeClass = function(className) {
        this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1')
        return this
    }
    var grid = [],snake = [],scores = []
            ,food,timer
            ,count = 0,digestCount = 0
            ,digesting = false,turning = false,paused = true
            ,direction = 'right'
            ,display = document.getElementById('display')
            ,directions = ['up', 'down', 'left', 'right']
            ,keys = {37:'left',38:'up',39:'right',40:'down'}
            ,opposites = {up:   'down'
        ,down: 'up'
        ,left: 'right'
        ,right:'left'}
            ,corners = {'right:down':'tr'
        ,'up:left'   :'tr'
        ,'right:up'  :'br'
        ,'down:left' :'br'
        ,'up:right'  :'tl'
        ,'left:down' :'tl'
        ,'down:right':'bl'
        ,'left:up'   :'bl'}
    function init() {
        var board = document.getElementById('board')
        for (r = 0; r < 20; r++) {
            var rowArr = []
            var row = document.createElement('div')
            for (c = 0; c < 30; c++) {
                var cell = document.createElement('span')
                rowArr.push({ el: cell, col: c, row: r})
                row.appendChild(cell)
            }
            board.appendChild(row)
            grid.push(rowArr)
        }
        document.addEventListener('keydown', keydown, false)
        resetGame()
    }
    function keydown(event) {
        if (direction != keys[event.keyCode] &&
                direction != opposites[keys[event.keyCode]] &&
                (directions.indexOf(keys[event.keyCode]) != -1) &&
                !paused &&
                !turning) {
            turning = true;
            lastDirection = direction;
            direction = keys[event.keyCode];
            paused && startTimer()
        }
        else if (direction && event.keyCode == 32) {
            (paused) ? startTimer() : stopTimer()
        }
    }
    function startTimer() {
        paused = false
        timer = setInterval(move, 75)
    }
    function stopTimer() {
        paused = true
        clearInterval(timer)
    }
    function resetGame() {
        var head = grid.getRandom().getRandom()
        head.el.className = 'snake head tail right'
        snake.push(head)
        digesting = true;
        move();
        digesting = false;
        timer && stopTimer()
        place()
    }
    function endGame() {
        scores.push(snake.length)
        display.innerHTML = '<li>' + scores.join('</li><li>') + '</li>'
        stopTimer()
        snake.forEach(function(item) {
            item.el.className = ''
        })
        snake = []
        food.el.className = ''
        food = undefined
        direction = 'right'
        resetGame()
    }
    function place() {
        food = grid.getRandom().getRandom()
        if (food.el.hasClass('snake') || food.el.hasClass('food'))
            setTimeout(place, 1)
        else
            food.el.addClass('food')
    }
    function checkDigesting() {
        if (digestCount == 5) digesting = false;
        if (digesting) {
            digestCount++;
            snake[1].el.removeClass('tail')
        }
        else {
            digestCount = 0;
            removeTail();
        }
    }
    function removeTail() {
        snake[0].el.className = ''
        snake.erase(snake[0])
    }
    function getup() {
        var coords = snake.getLast()
        return {col: coords.col, row: (coords.row == 0) ? 20 - 1 : coords.row - 1}
    }
    function getdown() {
        var coords = snake.getLast()
        return {col: coords.col, row: (coords.row == 20 - 1) ? 0 : coords.row + 1}
    }
    function getright() {
        var coords = snake.getLast()
        return {col: (coords.col == 30 - 1) ? 0 : coords.col + 1, row: coords.row}
    }
    function getleft() {
        var coords = snake.getLast()
        return { col: (coords.col == 0) ? 30 - 1 : coords.col - 1, row: coords.row}
    }
    function move() {
        var coords = this['get' + direction](),
                newCell = grid[coords.row][coords.col];
        if (newCell.el.hasClass('snake')) {
            endGame();
            return;
        }
        if (newCell.el.hasClass('food')) {
            digesting = true
            place()
        }
        snake.push(newCell)
        newCell.el.className = 'snake head ' + direction
        snake[1].el.addClass('tail')
        var lastCell = snake[snake.indexOf(newCell) - 1];
        lastCell.el.removeClass('head')
        if (turning) {
            turning = false
            lastCell.el.addClass(corners[lastDirection + ':' + direction])
        }
        checkDigesting()
    }
    init()
