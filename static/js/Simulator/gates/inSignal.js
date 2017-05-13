function InSignal(x, y) {
    this.x = x;
    this.y = y;

    this.status;
    this.index = -1;
    this.name = "IN_SIGNAL_";

    this.length = this.height = 20;

    this.left = this.x;
    this.right = this.x + this.length + 20;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.outputNum = 1;
    this.out = [];
    this.statusButton;

    this.status = 0;
    this.isInSignal = true;
    this.isOutSignal = false;
    this.inputs = [];
    
    this.draw = function() {
        noFill();
        strokeWeight(2);

        rect(this.x, this.y, this.length, this.height);

        line(this.right - 19, this.up + this.height / 2, this.right, this.up + this.height / 2);


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

    }

    this.placeTaken = function(other) {
        if (other.left < this.right + 10 && other.right > this.left - 10 && other.up < this.bottom && other.bottom > this.up)
            return true;
        return false;
    }

    this.clone = function() {
        return new InSignal();
    }

    this.mouseInside = function() {
        if (mouseX > this.left - 6 && mouseX < this.right + 6 && mouseY > this.up-6 && mouseY < this.bottom+6)
            return true;
        return false;
    }

    this.set = function() {
        this.x = mouseX;
        this.y = mouseY - mouseY % 5;
        this.index = gates.length;
        this.name += this.index;

        this.out[0] = new OutButton(this, 0);

        this.statusButton = new StatusButton(this, this.index);

        this.refreshButtons();
    }

    this.refreshButtons = function() {
        this.out[0].setPosition(this.right, this.up + this.height / 2);

        this.statusButton.setPosition(this.x, this.y);

        this.closeButton.setPosition(this.right - 15, this.up - 3);
    }

    this.delete = function() {
        this.out[0].hide();
        this.statusButton.hide();
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

        this.left = this.x;
        this.right = this.x + this.length + 20;
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
            if (wires[i].outGateIndex == prevIndex)
                wires[i].outGateIndex = index;
        }

        this.out[0].refresh();
        this.statusButton.refresh();
    }

    this.switch = function() {
        this.status = 1 - this.status;

        if (this.status === 1)
            this.statusButton.button.style('background', 'green');
        else
            this.statusButton.button.style('background', 'red');

    }

}