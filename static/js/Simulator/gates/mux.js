function Mux(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "MUX_";

    this.length = 40;
    this.height = 80;

    this.left = this.x - 22;
    this.right = this.x + this.length + 22;
    this.up = this.y;
    this.bottom = this.y + this.height + 10;

    this.closeButton = new CloseButton(this);

    this.inputNum = 6;
    this.outputNum = 1;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.isOutSignal = false;
    this.mux = true;

    this.truthTable = [];

    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y, this.x + this.length, this.y + 20);
        line(this.x, this.y + this.height, this.x + this.length, this.y + this.height - 20);
        line(this.x, this.y, this.x, this.y + this.height);
        line(this.x + this.length, this.y + 20, this.x + this.length, this.y + this.height - 20);

        line(this.x + this.length, this.y + 40, this.right, this.y + 40);

        line(this.x + 10, this.y + this.height - 5, this.x + 10, this.y + this.height + 15);
        line(this.x + 30, this.y + this.height - 14, this.x + 30, this.y + this.height + 15);

        for (var i = 0; i < this.inputNum - 2; i++) {
            line(this.left, this.y + 10 + i * 20, this.x, this.y + 10 + i * 20);
        }

        strokeWeight(0.7);
        textSize(9);

        text("I0", this.x - 12, this.y + 8);
        text("I1", this.x - 12, this.y + 28);
        text("I2", this.x - 12, this.y + 48);
        text("I3", this.x - 12, this.y + 68);

        text("S1", this.x - 3, this.y + this.height + 10);
        text("S0", this.x + 17, this.y + this.height + 10);

        strokeWeight(1.0);
        textSize(12);
        text("MUX\n 4/1", this.x + 6, this.y + 36);

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
        return new Mux();
    }

    this.mouseInside = function() {
        if (mouseX > this.left - 6 && mouseX < this.right + 6 && mouseY > this.up && mouseY < this.bottom)
            return true;
        return false;
    }

    this.set = function() {
        this.refreshPosition();
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
        for(i = 0; i < this.inputNum - 2; i++){
            this.in[i].setPosition(this.left, this.y + 10 + i * 20);
        }
        
        this.in[4].setPosition(this.x + 10, this.y + this.height + 15);
        this.in[5].setPosition(this.x + 30, this.y + this.height + 15);

        this.out[0].setPosition(this.right, this.y + 40);

        this.closeButton.setPosition(this.right - 33, this.up + 2);
    }

    this.delete = function() {

        for (var i = 0; i < this.inputNum; i++) {
            this.in[i].hide();
        }

        this.closeButton.hide();

        for (i = wires.length - 1; i >= 0; i--) {
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
        this.name = "MUX_" + this.index;

        for (var i = 0; i < wires.length; i++) {
            if (wires[i].inGateIndex == prevIndex)
                wires[i].inGateIndex = index;
            if (wires[i].outGateIndex == prevIndex)
                wires[i].outGateIndex = index;
        }

        for (i = 0; i < this.in.length; i++) {
            this.in[i].refresh();
        }

        for (i = 0; i < this.out.length; i++) {
            this.out[i].refresh();
        }
    }

    this.output = function(inputs){
        var outputs = [
            [inputs[0], inputs[1]],
            [inputs[2], inputs[3]]
        ];
        if(inputs[4] === 2 || inputs[5] === 2){
            return 2;
        }
        var output = outputs[inputs[4]][inputs[5]];
        if(typeof output === 'undefined'){
            return 2;
        }
        return output;
    }
}