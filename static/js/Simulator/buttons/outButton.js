function OutButton(gate, outIndex) {
    this.gate = gate;
    this.gateIndex = this.gate.index;
    this.outIndex = outIndex;
    this.wires = [];

    this.x;
    this.y;

    this.button = createButton('');
    this.button.addClass('sigButton');
    this.button.value(this.gateIndex);
    this.button.id(this.outIndex);

    this.button.mousePressed(function() {
        if (simToggleValue === 1 || deleteWireMode === 1)
            return;

        if (currentWire === null) {
            currentWire = new Wire();
            currentWire.addOut(this.value(), this.id());
            var but = gates[this.value()].out[parseInt(this.id())];
            but.wires.push(currentWire);

        } else {
            if (currentWire.outGateIndex !== null) {
                print('Ne ide')
                return;
            }

            currentWire.addOut(this.value(), this.id());

            var points = [];
            for (var i = 0; i < currentWire.points.length; i++) {
                points.push(currentWire.points[i]);
            }

            var j = points.length - 1;
            for (i = 0; i < points.length; i++) {
                currentWire.points[i] = points[j--];
            }

            var but = gates[this.value()].out[parseInt(this.id())];
            but.wires.push(currentWire);
            currentWire.push();
        }
    });

    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
        var el = document.getElementById("canvas-holder");
        var rect = el.getBoundingClientRect();
        this.button.position(rect.left + this.x - 7, rect.top +  this.y - 7 + scroll);
    }

    this.hide = function() {
        this.button.style('visibility', 'hidden');
    }

    this.show = function() {
        this.button.style('visibility', 'visible');
    }

    this.refresh = function() {
        this.gateIndex = this.gate.index;
        this.button.value(this.gateIndex);
    }
}