function Counter(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "COUNTER_";

    this.length = 46;
    this.height = 80;

    this.left = this.x - 10;
    this.right = this.x + this.length + 10;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 2;
    this.outputNum = 4;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.isOutSignal = false;
    this.truthTable = [0, 0, 0, 0, 0, 0];
    this.state = 0;
    this.counter = true;
    this.previousClk = 0;
    this.previousReset = 0;

    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y, this.x + this.length, this.y);
        line(this.x, this.y + this.height, this.x + this.length, this.y + this.height);
        line(this.x, this.y, this.x, this.y + this.height);
        line(this.x + this.length, this.y, this.x + this.length, this.y + this.height);

        line(this.left, this.y + 20, this.x, this.y + 20);
        line(this.left, this.y + 60, this.x, this.y + 60);

        for (var i = 0; i < this.outputNum; i++) {
            line(this.x + this.length, this.y + 10 + i * 20, this.right, this.y + 10 + i * 20);
        }

        strokeWeight(0.7);
        textSize(9);
        text("C", this.x - 10, this.y + 18);
        text("R", this.x - 10, this.y + 58);

        text("A", this.right - 15, this.y + 8);
        text("B", this.right - 15, this.y + 28);
        text("C", this.right - 15, this.y + 48);
        text("D", this.right - 15, this.y + 68);

        strokeWeight(1.0);
        textSize(12);
        text("CNTR", this.x + 6, this.y + 42);

        strokeWeight(1);

        if (simToggleValue === 1)
            this.closeButton.hide();
        else if (this.index >= 0 && this.mouseInside() && currentGate === null) {
            this.closeButton.show();
        } else {
            this.closeButton.hide();
        }

        for (i = 0; i < this.out.length; i++) {
            var but = this.out[i];
            if (mouseX > but.x - 5 && mouseX < but.x + 5 && mouseY > but.y - 5 && mouseY < but.y + 5) {
                but.show();
            } else {
                but.hide();
            }
        }

        for (i = 0; i < this.in.length; i++) {
            var but = this.in[i];
            if (mouseX > but.x - 5 && mouseX < but.x + 5 && mouseY > but.y - 5 && mouseY < but.y + 5) {
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
        return new Counter();
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

        this.in[0].setPosition(this.left, this.y + 20);
        this.in[1].setPosition(this.left, this.y + 60);

        for (i = 0; i < this.outputNum; i++) {
            this.out[i].setPosition(this.right, this.y + i * 20 + 10);
        }

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
        this.name = "COUNTER_" + this.index;

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
    this.switch = function(clk, reset) {
        if (clk === 1 && this.previousClk != clk) {
            this.state++;
            this.state %= 16;
        }
        if (typeof reset === 'undefined' || reset === 2) {
            this.previousReset = 0;
        } else if (reset === 1) {
            this.state = 0;
        }
        this.previousClk = clk;
        this.previousReset = reset;
        switch (this.state) {
            case 0:
                this.truthTable = [0, 0, 0, 0];
                break;
            case 1:
                this.truthTable = [0, 0, 0, 1];
                break;
            case 2:
                this.truthTable = [0, 0, 1, 0];
                break;
            case 3:
                this.truthTable = [0, 0, 1, 1];
                break;
            case 4:
                this.truthTable = [0, 1, 0, 0];
                break;
            case 5:
                this.truthTable = [0, 1, 0, 1];
                break;
            case 6:
                this.truthTable = [0, 1, 1, 0];
                break;
            case 7:
                this.truthTable = [0, 1, 1, 1];
                break;
            case 8:
                this.truthTable = [1, 0, 0, 0];
                break;
            case 9:
                this.truthTable = [1, 0, 0, 1];
                break;
            case 10:
                this.truthTable = [1, 0, 1, 0];
                break;
            case 11:
                this.truthTable = [1, 0, 1, 1];
                break;
            case 12:
                this.truthTable = [1, 1, 0, 0];
                break;
            case 13:
                this.truthTable = [1, 1, 0, 1];
                break;
            case 14:
                this.truthTable = [1, 1, 1, 0];
                break;
            case 15:
                this.truthTable = [1, 1, 1, 1];
                break;
        }

    }
}