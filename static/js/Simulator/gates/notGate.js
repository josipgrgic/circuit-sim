function NotGate(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "NOT_GATE_";

    this.length = 14;
    this.height = 20;

    this.left = this.x - 10;
    this.right = this.x + this.length + 17;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 1;
    this.outputNum = 1;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.truthTable = [];

    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y, this.x + this.length, this.y + this.height / 2); // \
        line(this.x, this.y, this.x, this.y + this.height); // |
        line(this.x, this.y + this.height, this.x + this.length, this.y + this.height / 2); // /
        line(this.left, this.y + this.height / 2, this.x, this.y + this.height / 2); // - in
        ellipse(this.x + this.length + 5, this.y + this.height / 2, 8, 8); // O
        line(this.x + this.length + 10, this.y + this.height / 2, this.right, this.y + this.height / 2); // - out

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
        return new NotGate();
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

        this.in[0] = new InButton(this, 0);
        this.out[0] = new OutButton(this, 0);

        this.refreshButtons();
        this.truthTable = [1, 0, 2];
    }

    this.refreshButtons = function() {
        this.in[0].setPosition(this.left, this.y + this.height / 2);
        this.out[0].setPosition(this.right, this.y + this.height / 2);

        this.closeButton.setPosition(this.right - 40, this.up - 5);
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

        this.left = this.x - 10;
        this.right = this.x + this.length + 17;
        this.up = this.y;
        this.bottom = this.y + this.height;

    }

    this.refresh = function(index) {
        if (this.index == index)
            return;

        var prevIndex = this.index;
        this.index = index;
        this.name = "AND_GATE_" + this.index;

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