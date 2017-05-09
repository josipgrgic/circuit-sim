function CloseButton(gate) {

    this.button = createButton('X');
    this.button.addClass('closeButton');
    this.button.value(1);
    this.gate = gate;

    this.button.mousePressed(function() {
        this.value(-1);
    });

    this.setPosition = function(x, y) {
        var el = document.getElementById("canvas-holder");
        var rect = el.getBoundingClientRect();
        this.button.position(x + rect.left, y + rect.top + scroll);
    }

    this.hide = function() {
        this.button.style('visibility', 'hidden');
    }

    this.show = function() {
        this.button.style('visibility', 'visible');
    }

    this.value = function() {
        return this.button.value();
    }
}