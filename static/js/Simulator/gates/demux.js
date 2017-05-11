function Demux(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "DEMUX_";

    this.length = 40;
    this.height = 80;

    this.left = this.x - 22;
    this.right = this.x + this.length + 22;
    this.up = this.y;
    this.bottom = this.y + this.height + 10;

    this.closeButton = new CloseButton(this);

    this.inputNum = 3;
    this.outputNum = 4;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.isOutSignal = false;
    this.mux = true;
    this.demux = true;

    this.truthTable = [];

    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y + 20, this.x + this.length, this.y);
        line(this.x, this.y + this.height - 20, this.x + this.length, this.y + this.height);
        line(this.x, this.y + 20, this.x, this.y + this.height - 20);
        line(this.x + this.length, this.y, this.x + this.length, this.y + this.height);

        line(this.left, this.y + 40, this.x, this.y + 40);

        line(this.x + 30, this.y + this.height - 5, this.x + 30, this.y + this.height + 15);
        line(this.x + 10, this.y + this.height - 14, this.x + 10, this.y + this.height + 15);

        for (var i = 0; i < this.outputNum; i++) {
            line(this.x + this.length, this.y + 10 + i * 20, this.right, this.y + 10 + i * 20);
        }

        strokeWeight(0.7);
        textSize(9);

        text("I0", this.right - 18, this.y + 8);
        text("I1", this.right - 18, this.y + 28);
        text("I2", this.right - 18, this.y + 48);
        text("I3", this.right - 18, this.y + 68);

        text("S1", this.x - 3, this.y + this.height + 10);
        text("S0", this.x + 17, this.y + this.height + 10);

        strokeWeight(1.0);
        textSize(10);
        text("DEMUX", this.x + 2, this.y + 36);
        textSize(12);
        text("1/4", this.x + 10, this.y + 52);
        strokeWeight(1);

        if (this.index >= 0 && this.mouseInside() && currentGate === null && simToggleValue === 0 && currentWire === null) {
            this.closeButton.show();
        } else {
            this.closeButton.hide();
        }

        for (i = 0; i < this.out.length; i++) {
            var but = this.out[i];
            if (mouseX > but.x - 10 && mouseX < but.x + 10 && mouseY > but.y - 10 && mouseY < but.y + 10 && simToggleValue === 0 && currentGate === null && but.wires.length === 0) {
                but.show();
            } else {
                but.hide();
            }
        }

        for (i = 0; i < this.in.length; i++) {
            var but = this.in[i];
            if (mouseX > but.x - 6 && mouseX < but.x + 6 && mouseY > but.y - 6 && mouseY < but.y + 6 && simToggleValue === 0 && currentGate === null && but.wires.length === 0) {
                but.show();
            } else {
                but.hide();
            }
        }
    }

    this.placeTaken = function(other) {
        if (other.left < this.right && other.right > this.left && other.up < this.bottom && other.bottom > this.up)
            return true;
        return false;
    }

    this.clone = function() {
        return new Demux();
    }

    this.mouseInside = function() {
        if (mouseX > this.left - 6 && mouseX < this.right + 6 && mouseY > this.up && mouseY < this.bottom)
            return true;
        return false;
    }

    this.set = function() {
        this.x = mouseX;
        this.y = mouseY - mouseY % 5;
        this.index = gates.length;
        this.name += this.index;

        for (var i = 0; i < this.inputNum; i++) {
            this.in[i] = new InButton(this, i);
        }

        for (i = 0; i < this.outputNum; i++) {
            this.out[i] = new OutButton(this, i);
        }

        this.refreshButtons();
    }

    this.refreshButtons = function() {
        this.in[0].setPosition(this.left, this.y + 40);
        this.in[1].setPosition(this.x + 10, this.y + this.height + 15);
        this.in[2].setPosition(this.x + 30, this.y + this.height + 15);

        for(var i = 0; i < this.outputNum; i++){
            this.out[i].setPosition(this.right, this.y + 10 + 20 * i);
        }

        this.closeButton.setPosition(this.right - 33, this.up + 2);
    }

    this.delete = function() {

        for (var i = 0; i < this.inputNum; i++) {
            this.in[i].hide();
        }

        this.closeButton.hide();

        for (var i = wires.length - 1; i >= 0; i--) {
            if (wires[i].inGateIndex == this.index || wires[i].outGateIndex == this.index) {
                deleteWire(wires[i]);
            }
        }
        refreshWires();
    }

    this.refreshPosition = function() {
        this.x = mouseX;
        this.y = mouseY - mouseY % 5;

        this.left = this.x - 22;
        this.right = this.x + this.length + 22;
        this.up = this.y;
        this.bottom = this.y + this.height + 15;
    }

    this.refresh = function(index) {
        if (this.index == index)
            return;

        var prevIndex = this.index;
        this.index = index;
        this.name = "DEMUX_" + this.index;

        for (var i = 0; i < wires.length; i++) {
            if (wires[i].inGateIndex == prevIndex)
                wires[i].inGateIndex = index;
            if (wires[i].outGateIndex == prevIndex)
                wires[i].outGateIndex = index;
        }

        for (var i = 0; i < this.in.length; i++) {
            this.in[i].refresh();
        }

        for (var i = 0; i < this.out.length; i++) {
            this.out[i].refresh();
        }
    }

    this.output = function(inputs){
        var input = inputs[0];
        var outputs = [
            [ [input, 0, 0, 0], [0, input, 0, 0] ],
            [ [0, 0, input, 0], [0, 0, 0, input] ]
        ];
        if(inputs[1] === 2 || inputs[2] === 2){
            return 2;
        }
        var output = outputs[inputs[1]][inputs[2]];
        if(typeof output === 'undefined'){
            return 2;
        }
        return output;
    }
}