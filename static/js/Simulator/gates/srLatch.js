function SrLatch(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "SR_LATCH_";

    this.length = 40;
    this.height = 60;

    this.left = this.x - 20;
    this.right = this.x + this.length + 20;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 2;
    this.outputNum = 2;
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
        line(this.x, this.y, this.x, this.y + this.height);
        line(this.x + this.length, this.y, this.x + this.length, this.y + this.height);

        if (this.inputNum == 2) {
            line(this.left, this.y + this.height / 4, this.x, this.y + this.height / 4);
            line(this.left, this.y + 3 * this.height / 4, this.x, this.y + 3 * this.height / 4);
        }

        line(this.x + this.length, this.y + this.height / 4, this.x + this.length + 20, this.y + this.height / 4);
        line(this.x + this.length, this.y + 3 * this.height / 4, this.x + this.length + 20, this.y + 3 * this.height / 4);

        strokeWeight(1.2);
        textSize(14);
        text("S R", this.x + 9, this.y + 35);
        strokeWeight(0.7);
        textSize(10);
        text("S", this.x - 10, this.y + 12);
        text("R", this.x - 10, this.y + 42);
        text("Q", this.x + 44, this.y + 12);
        line(this.x + this.length + 5, this.y + this.height - 28, this.x + this.length + 12, this.y + this.height - 28);
        text("Q", this.x + 44, this.y + 42);
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
        return new SrLatch();
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
        this.truthTable = [
            [
                [0, 0],
                [1, 1],
                [2, 2]
            ],
            [
                [1, 0],
                [0, 0],
                [2, 2]
            ],
            [
                [2, 2],
                [2, 2],
                [2, 2]
            ]
        ];
    }

    this.refreshButtons = function() {
        this.in[0].setPosition(this.left, this.y + this.height / 4);
        this.in[1].setPosition(this.left, this.y + 3 * this.height / 4);
        this.out[0].setPosition(this.right, this.y + this.height / 4);
        this.out[1].setPosition(this.right, this.y + 3 * this.height / 4);

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

        this.left = this.x - 22;
        this.right = this.x + this.length + 22;
        this.up = this.y;
        this.bottom = this.y + this.height;
    }

    this.refresh = function(index) {
        if (this.index == index)
            return;

        var prevIndex = this.index;
        this.index = index;
        this.name = "SR_LATCH_" + this.index;

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