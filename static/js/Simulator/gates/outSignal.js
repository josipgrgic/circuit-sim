function OutSignal(x, y) {
    this.x = x;
    this.y = y;

    this.status;
    this.index = -1;
    this.name = "OUT_SIGNAL_";

    this.length = this.height = 20;

    this.left = this.x - 20;
    this.right = this.x + this.length;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 1;
    this.outputNum = 0;
    this.in = [];
    this.isInSignal = false;
    this.isOutSignal = true;

    this.status = 2;
    this.color = color(255);

    this.draw = function() {
        fill(this.color);
        strokeWeight(2);

        ellipse(this.x + this.length / 2, this.y + this.length / 2, this.length, this.height);

        line(this.left + 1, this.up + this.height / 2, this.left + 20, this.up + this.height / 2);


        strokeWeight(1);

        if (this.index >= 0 && this.mouseInside() && currentGate === null && simToggleValue === 0) {
            this.closeButton.show();
        } else {
            this.closeButton.hide();
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
        return new OutSignal();
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
        this.in[0].setPosition(this.left, this.up + this.height / 2);

        this.closeButton.setPosition(this.left + 6, this.up - 3);
    }

    this.delete = function() {
        this.in[0].hide();
        this.closeButton.hide();

        for (i = wires.length - 1; i >= 0; i--) {
            if (wires[i].inGateIndex == this.index) {
                deleteWire(wires[i])
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
        this.name = "IN_SIGNAL_" + this.index;


        for (var i = 0; i < wires.length; i++) {
            if (wires[i].inGateIndex == prevIndex)
                wires[i].inGateIndex = index;
        }

        this.in[0].refresh();

    }

    this.evaluate = function() {
        this.status = this.in.wire.status;
    }

    this.switch = function(status) {
        this.status = status;
        if (this.status === 2)
            this.color = color(255);
        else if (this.status === 1)
            this.color = color(0, 255, 0);
        else if (this.status === 0)
            this.color = color(255, 0, 0);
    }

}