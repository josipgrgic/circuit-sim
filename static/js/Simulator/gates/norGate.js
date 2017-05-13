function NorGate(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "NOR_GATE_";

    this.length = 16;
    this.height = 40;

    this.left = this.x - 20;
    this.right = this.x + (3 / 2) * this.length + 45;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton();

    this.inputNum = 2;
    this.outputNum = 1;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.isOutSignal = false;
    this.truthTable = [];
    this.inputs = [0, 0];

    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y, this.x + this.length, this.y);
        line(this.x, this.y + this.height, this.x + this.length, this.y + this.height);
        arc(this.x - this.length - 18, this.y + this.height / 2, 2 * this.height + 1, 2 * this.height - 1, -(1 / 3) * HALF_PI, (1 / 3) * HALF_PI);
        arc(this.x + this.length, this.y + this.height / 2, this.length + 29, this.height, 3 * HALF_PI, HALF_PI);
        ellipse(this.x + this.length + 28, this.y + this.height / 2, 10, 10);

        if (this.inputNum == 2) {
            line(this.left, this.y + this.height / 4, this.x + 5, this.y + this.height / 4);
            line(this.left, this.y + 3 * this.height / 4, this.x + 5, this.y + 3 * this.height / 4);
        } else {
            for (var i = 0; i < this.inputNum; i++) {
                line(this.left, this.y + (i + 1) * this.height / (this.inputNum + 1), this.x + 5, this.y + (i + 1) * this.height / (this.inputNum + 1));
            }
        }

        for (i = 0; i < this.outputNum; i++) {
            line(this.right - 20, this.y + (i + 1) * this.height / (this.outputNum + 1), this.right - 3, this.y + (i + 1) * this.height / (this.outputNum + 1));
        }
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
        return new NorGate();
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

        for (i = 0; i < this.inputNum; i++) {
            this.in[i] = new InButton(this, i);
        }

        for (i = 0; i < this.outputNum; i++) {
            this.out[i] = new OutButton(this, i);
        }

        this.refreshButtons();
        this.truthTable = [
            [1, 0, 2],
            [0, 0, 0],
            [2, 0, 2]
        ];
    }

    this.refreshButtons = function() {
        if (this.inputNum == 2) {
            this.in[0].setPosition(this.left, this.y + this.height / 4);
            this.in[1].setPosition(this.left, this.y + 3 * this.height / 4);
        } else {
            for (i = 0; i < this.inputNum; i++) {
                this.in[i].setPosition(this.left, this.y + (i + 1) * this.height / (this.inputNum + 1));
            }
        }

        for (i = 0; i < this.outputNum; i++) {
            this.out[i].setPosition(this.right - 2, this.y + (i + 1) * this.height / (this.outputNum + 1));
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
        this.right = this.x + (3 / 2) * this.length + 45;
        this.up = this.y;
        this.bottom = this.y + this.height;
    }

    this.refresh = function(index) {
        if (this.index == index)
            return;

        var prevIndex = this.index;
        this.index = index;
        this.name = "NOR_GATE_" + this.index;

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