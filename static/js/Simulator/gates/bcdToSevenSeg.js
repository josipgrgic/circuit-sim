function BcdToSevenSeg(x, y) {
    this.x = x;
    this.y = y;

    this.index = -1;
    this.name = "BCD_TO_SEVEN_SEG_";

    this.length = 46;
    this.height = 80;

    this.left = this.x - 10;
    this.right = this.x + this.length + 10;
    this.up = this.y;
    this.bottom = this.y + this.height;

    this.closeButton = new CloseButton(this);

    this.inputNum = 4;
    this.outputNum = 7;
    this.in = [];
    this.out = [];
    this.isInSignal = false;
    this.isOutSignal = false;
    this.truthTable = [];

    this.draw = function() {
        noFill();
        strokeWeight(2);
        line(this.x, this.y, this.x + this.length, this.y);
        line(this.x, this.y + this.height, this.x + this.length, this.y + this.height);
        line(this.x, this.y, this.x, this.y + this.height);
        line(this.x + this.length, this.y, this.x + this.length, this.y + this.height);

        for(var i = 0; i < this.inputNum; i++){
            line(this.left, this.y + 10 + i * 20, this.x, this.y + 10 + i * 20);
        }

        for(var i = 0; i < this.outputNum; i++){
            line(this.x + this.length, this.y + (i + 1) * 10, this.right, this.y + (i + 1) * 10);
        }

        strokeWeight(0.7);
        textSize(9);
        text("A", this.x-10, this.y+9);
        text("B", this.x-10, this.y+29);
        text("C", this.x-10, this.y+49);
        text("D", this.x-10, this.y+69);

        text("A", this.right-15, this.y+9);
        text("B", this.right-15, this.y+19);
        text("C", this.right-15, this.y+29);
        text("D", this.right-15, this.y+39);
        text("E", this.right-15, this.y+49);
        text("F", this.right-15, this.y+59);
        text("G", this.right-15, this.y+69);

        strokeWeight(1.0);
        textSize(12);
        text("BCD\n   to\n7seg", this.x+10, this.y+30);

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
        return new BcdToSevenSeg();
    }

    this.mouseInside = function() {
        if (mouseX > this.left - 6 && mouseX < this.right + 6 && mouseY > this.up && mouseY < this.bottom)
            return true;
        return false;
    }

    this.set = function() {
        this.x = mouseX;
        this.y = mouseY - mouseY % 10;
        this.index = gates.length;
        this.name += this.index;

        for (var i = 0; i < this.inputNum; i++) {
            this.in[i] = new InButton(this, i);
            this.in[i].setPosition(this.left, this.y + 10 + i * 20);
        }

        for (i = 0; i < this.outputNum; i++) {
            this.out[i] = new OutButton(this, i);
            this.out[i].setPosition(this.right, this.y + (i + 1) * 10);
        }

        this.closeButton.setPosition(this.right - 33, this.up+2);

        this.truthTable = [
            [   [   [   [1, 1, 1, 1, 1, 1, 0], 
                        [0, 1, 1, 0, 0, 0, 0] 
                    ], 

                    [   [1, 1, 0, 1, 1, 0, 1], 
                        [1, 1, 1, 1, 0, 0, 1] 
                    ]
                ],
                [
                    [   [0, 1, 1, 0, 0, 1, 1], 
                        [1, 0, 1, 1, 0, 1, 1] 
                    ],

                    [   [1, 0, 1, 1, 1, 1, 1],
                        [1, 1, 1, 0, 0, 0, 0]
                    ]
                ]
            ],
            [   [   [   [1, 1, 1, 1, 1, 1, 1],
                        [1, 1, 1, 1, 0, 1, 1]
                    ],
                    [   [0, 0, 0, 0, 0, 0, 0], 
                        [0, 0, 0, 0, 0, 0, 0] 
                    ]
                ],
                [
                    [   [0, 0, 0, 0, 0, 0, 0], 
                        [0, 0, 0, 0, 0, 0, 0] 
                    ],

                    [   [0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0]
                    ]
                ]
            ]
        ];
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
        this.y = mouseY - mouseY % 10;

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
        this.name = "BCD_TO_SEVEN_SEG_" + this.index;

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