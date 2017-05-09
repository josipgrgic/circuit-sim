function Clock(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "CLOCK_";

    this.length = 40;
    this.height = 40;

    this.left = this.x;
    this.right = this.x + this.length + 20;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 0;
    this.outputNum = 1;
    this.in = [];
    this.out = [];
    this.isInSignal = true;
    this.isOutSignal = false;
    this.truthTable = [];
    this.status = 0;
    this.counter = 0;
    this.isClock = true;

    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y, this.x + this.length, this.y);
        line(this.x, this.y + this.height, this.x + this.length, this.y + this.height);
        line(this.x, this.y, this.x, this.y + this.height);
        line(this.x + this.length, this.y, this.x + this.length, this.y + this.height);

        var xOffset = 3;
        line(this.x + 4 + xOffset, this.y + 25, this.x + 12 + xOffset, this.y + 25);
        line(this.x + 12 + xOffset, this.y + 25, this.x + 12 + xOffset, this.y + 15);

        line(this.x + 13 + xOffset, this.y + 15, this.x + 21 + xOffset, this.y + 15);

        line(this.x + 21 + xOffset, this.y + 15, this.x + 21 + xOffset, this.y + 25);
        line(this.x + 22 + xOffset, this.y + 25, this.x + 29 + xOffset, this.y + 25);

        line(this.x + this.length, this.y + this.height / 2, this.x + this.length + 20, this.y + this.height / 2);

        strokeWeight(1);

        if (this.index >= 0 && this.mouseInside() && currentGate === null && simToggleValue === 0) {
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
    }

    this.placeTaken = function(other) {
        if (other.left < this.right + 10 && other.right > this.left - 10 && other.up < this.bottom && other.bottom > this.up)
            return true;
        return false;
    }

    this.clone = function() {
        return new Clock();
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

        for (i = 0; i < this.outputNum; i++) {
            this.out[i] = new OutButton(this, i);
        }
        this.out[0].setPosition(this.right, this.y + this.height / 2);
        this.closeButton.setPosition(this.right - 33, this.up + 2);
    }

    this.delete = function() {

        for (var i = 0; i < this.inputNum; i++) {
            this.in[i].hide();
        }

        for (i = 0; i < this.outputNum; i++) {
            this.out[i].hide();
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

        this.left = this.x;
        this.right = this.x + this.length + 22;
        this.up = this.y;
        this.bottom = this.y + this.height;
    }

    this.refresh = function(index) {
        if (this.index == index)
            return;

        var prevIndex = this.index;
        this.index = index;
        this.name = "CLOCK_" + this.index;

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

    this.switch = function(){
        this.counter++;
        if(this.counter % 5 === 0){
            this.counter = 0;
            this.status ^= 1;
        }
    }
}