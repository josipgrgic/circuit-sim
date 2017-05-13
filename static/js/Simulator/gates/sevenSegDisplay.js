function SevenSegDisplay(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "SEVEN_SEG_DISPLAY_";

    this.length = 55;
    this.height = 110;

    this.left = this.x - 10;
    this.right = this.x + this.length + 10;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 7;
    this.outputNum = 0;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.isOutSignal = false;
    this.truthTable = [];
    this.inputs = [0, 0, 0, 0, 0, 0, 0];
    this.sevenSeg = true;

    this.status = [0, 0, 0, 0, 0, 0, 0];

    this.colorGrey = color(225, 225, 225);
    this.colorRed = color(200, 0, 0);
    this.colorGreen = color(0, 255, 0);

    this.color = [this.colorGrey,
        this.colorGrey,
        this.colorGrey,
        this.colorGrey,
        this.colorGrey,
        this.colorGrey,
        this.colorGrey
    ];


    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y, this.x + this.length, this.y);
        line(this.x, this.y + this.height, this.x + this.length, this.y + this.height);
        line(this.x, this.y, this.x, this.y + this.height);
        line(this.x + this.length, this.y, this.x + this.length, this.y + this.height);

        strokeWeight(8);
        stroke(this.color[0]);
        line(this.x + 15, this.y + 10, this.x + this.length - 14, this.y + 10); // a

        stroke(this.color[5]);
        line(this.x + 9, this.y + 17, this.x + 8, this.y + this.height / 2 - 5); // f

        stroke(this.color[1]);
        line(this.x + this.length - 8, this.y + 17, this.x + this.length - 9, this.y + this.height / 2 - 5); // b

        stroke(this.color[6]);
        line(this.x + 14, this.y + this.height / 2, this.x + this.length - 14, this.y + this.height / 2); // g

        stroke(this.color[4]);
        line(this.x + 9, this.y + this.height / 2 + 5, this.x + 8, this.y + this.height - 17); // e

        stroke(this.color[2]);
        line(this.x + this.length - 8, this.y + this.height / 2 + 5, this.x + this.length - 9, this.y + this.height - 17); // c

        stroke(this.color[3]);
        line(this.x + 14, this.y + this.height - 10, this.x + this.length - 15, this.y + this.height - 10); // d

        stroke(0);

        strokeWeight(2);

        for (var i = 0; i < this.inputNum; i++) {
            line(this.left, this.y + 10 + i * 15, this.x, this.y + 10 + i * 15);
        }
        strokeWeight(0.7);
        textSize(9);
        text("A", this.x - 10, this.y + 8);
        text("B", this.x - 10, this.y + 23);
        text("C", this.x - 10, this.y + 38);
        text("D", this.x - 10, this.y + 53);
        text("E", this.x - 10, this.y + 68);
        text("F", this.x - 10, this.y + 83);
        text("G", this.x - 10, this.y + 98);

        strokeWeight(1);

        if (this.index >= 0 && this.mouseInside() && currentGate === null && simToggleValue === 0 && currentWire === null) {
            this.closeButton.show();
        } else {
            this.closeButton.hide();
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
        if (other.left < this.right + 10 && other.right > this.left - 10 && other.up < this.bottom && other.bottom > this.up)
            return true;
        return false;
    }

    this.clone = function() {
        return new SevenSegDisplay();
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
            this.in[i].setPosition(this.left, this.y + 10 + i * 15);
        }
        this.refreshButtons();
    }

    this.refreshButtons = function() {
        for (var i = 0; i < this.inputNum; i++) {
            this.in[i].setPosition(this.left, this.y + 10 + i * 15);
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
        this.right = this.x + this.length;
        this.up = this.y;
        this.bottom = this.y + this.height;
    }

    this.refresh = function(index) {
        if (this.index == index)
            return;

        var prevIndex = this.index;
        this.index = index;
        this.name = "SEVEN_SEG_DISPLAY_" + this.index;

        for (var i = 0; i < wires.length; i++) {
            if (wires[i].inGateIndex == prevIndex)
                wires[i].inGateIndex = index;
            if (wires[i].outGateIndex == prevIndex)
                wires[i].outGateIndex = index;
        }

        for (i = 0; i < this.in.length; i++) {
            this.in[i].refresh();
        }
    }

    this.switch = function(status) {
        this.status = status;

        for (var i = 0; i < status.length; i++) {
            if (status[i] === 0) {
                this.color[i] = this.colorGrey;
            } else if (status[i] === 1) {
                this.color[i] = this.colorRed;
            } else {
                this.color[i] = this.colorGrey;
            }
        }
    }
}