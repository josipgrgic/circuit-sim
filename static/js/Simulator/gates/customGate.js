function CustomGate(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "CUSTOM_GATE_";

    this.length = 75;
    this.height = 150;

    this.left = this.x - 20;
    this.right = this.x + this.length + 20;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 4;
    this.outputNum = 3;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.isOutSignal = false;

    this.draw = function() {
        noFill();
        strokeWeight(2);
        rect(this.x, this.y, this.length, this.height);

        if (this.inputNum == 2) {
            line(this.left, this.y + this.height / 4, this.x, this.y + this.height / 4);
            line(this.left, this.y + 3 * this.height / 4, this.x, this.y + 3 * this.height / 4);
        } else {
            for (var i = 0; i < this.inputNum; i++) {
                line(this.left, this.y + (i + 1) * this.height / (this.inputNum + 1), this.x, this.y + (i + 1) * this.height / (this.inputNum + 1));
            }
        }

        for (i = 0; i < this.outputNum; i++) {
            line(this.x + this.length, this.y + (i + 1) * this.height / (this.outputNum + 1), this.right, this.y + (i + 1) * this.height / (this.outputNum + 1));
        }

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

        for (i = 0; i < this.in.length; i++) {
            var but = this.in[i];
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
        return new CustomGate();
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

        if (this.inputNum == 2) {
            for (var i = 0; i < this.inputNum; i++) {
                this.in[i] = new InButton(this, i);
            }

            this.in[0].setPosition(this.left, this.y + this.height / 4);
            this.in[1].setPosition(this.left, this.y + 3 * this.height / 4);
        } else {
            for (i = 0; i < this.inputNum; i++) {
                this.in[i] = new InButton(this, i);
                this.in[i].setPosition(this.left, this.y + (i + 1) * this.height / (this.inputNum + 1));
            }
        }

        for (i = 0; i < this.outputNum; i++) {
            this.out[i] = new OutButton(this, i);
            this.out[i].setPosition(this.right, this.y + (i + 1) * this.height / (this.outputNum + 1));
        }

        this.closeButton.setPosition(this.right - 20, this.up);
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
                deleteWire(wires[i])
            }
        }
        refreshWires();
    }

    this.refreshPosition = function() {
        this.x = mouseX;
        this.y = mouseY - mouseY % 5;

        this.left = this.x - 20;
        this.right = this.x + this.length + 20;
        this.up = this.y;
        this.bottom = this.y + this.height;
    }

    this.refresh = function(index) {
        if (this.index == index)
            return;

        var prevIndex = this.index;
        this.index = index;
        this.name = "CUSTOM_GATE_" + this.index;

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

}