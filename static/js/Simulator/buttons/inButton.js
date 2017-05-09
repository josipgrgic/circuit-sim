function InButton(gate, inIndex) {
    this.gate = gate;
    this.gateIndex = this.gate.index;
    this.inIndex = inIndex;
    this.wires = [];

    this.x;
    this.y;

    this.button = createButton('');
    this.button.addClass('sigButton');
    this.button.value(this.gateIndex);
    this.button.id(this.inIndex);

    this.button.mousePressed(function() {
        var but = gates[this.value()].in[parseInt(this.id())];
        print(but);
        if (simToggleValue === 1 || deleteWireMode === 1)
            return;

        if (currentWire === null && but.wires.length === 0) {
            currentWire = new Wire();
            currentWire.addIn(this.value(), this.id());
            but.wires.push(currentWire);

        } else {
            if (currentWire.inGateIndex !== null || but.wires.length === 1)
                return;

            currentWire.addIn(this.value(), this.id());
            var but = gates[this.value()].in[parseInt(this.id())];
            but.wires.push(currentWire);
            currentWire.push();
        }
    });

    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
        //this.button.position(this.x - 7, this.y - 7);
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