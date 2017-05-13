function Wire() {
    this.points = [];
    this.segment = [];

    this.inGateIndex = null;
    this.inIndex = null;

    this.outGateIndex = null;
    this.outIndex = null;

    this.branchButton = new BranchButton(this);

    this.done = false;
    this.index;

    this.status = 2;
    this.color = color(0);
    this.branchingPoint = null;
    this.branchedFrom=null;
    this.branchIndexBefore=null;
    this.bSet = false;

    this.drawSegment = function() {
        this.segment = [];
        this.add(null);

        strokeWeight(2);
        stroke(150);
        for (var i = 1; i < this.segment.length; i++) {
            line(this.segment[i - 1].x, this.segment[i - 1].y, this.segment[i].x, this.segment[i].y);
        }
        stroke(0);

        if(this.branchingPoint !== null && this.bSet===false){
            var pnt = this.segment[1];
            var y1 = wires[this.branchedFrom].points[this.branchIndexBefore].y;
            var y2 = wires[this.branchedFrom].points[this.branchIndexBefore+1].y;
            var x = wires[this.branchedFrom].points[this.branchIndexBefore+1].x;
            if(pnt.y<min(y1,y2)) {
                this.branchingPoint.y=min(y1,y2)
            }
            else if(pnt.y > max(y1,y2)){
                this.branchingPoint.y=max(y1,y2)
            }
            else {
                this.branchingPoint.y=pnt.y;
            }
        }

        strokeWeight(1);
    }

    this.addPath = function() {
        this.branchedX = false;
        this.bSet=true;
        for (var i = 1; i < this.segment.length; i++) {
            this.points.push(this.segment[i]);
        }
        this.segment = [];
    }

    this.addIn = function(inGateIndex, inIndex) {
        this.inGateIndex = Number(inGateIndex);
        this.inIndex = parseInt(inIndex);

        var button = gates[this.inGateIndex].in[inIndex];
        //button.wire = this;

        if (this.points.length === 0) {
            this.points.push(new Point(button.x, button.y));
        } else {
            this.add(button);
        }
    }

    this.addOut = function(outGateIndex, outIndex) {
        this.outGateIndex = Number(outGateIndex);
        this.outIndex = parseInt(outIndex);

        var button = gates[this.outGateIndex].out[outIndex];
        //button.wire = this;

        if (this.points.length === 0) {
            this.points.push(new Point(button.x, button.y));
        } else {
            this.add(button);
        }
    }

    this.add = function(button) {
        var last = this.points[this.points.length - 1];
        if (button !== null) {
            this.points.push(new Point(last.x, button.y));
            //this.points.push(new Point(button.x, last.y));
            this.points.push(new Point(button.x, button.y));
        } else {
            this.segment.push(last);
            this.segment.push(new Point(last.x, mouseY /*- mouseY % 10*/ ));
            this.segment.push(new Point(mouseX, mouseY /*- mouseY % 10*/ ));
            //this.segment.push(new Point(mouseX, last.y /*- mouseY % 10*/ ));
            //this.segment.push(new Point(mouseX, mouseY /*- mouseY % 10*/ ));
        }
    }

    this.draw = function() {
        if (this.done === false) {
            if (this.inGateIndex !== null && this.outGateIndex !== null)
                this.done = true;
        }
        this.mouseOver();
        stroke(this.color);

        strokeWeight(2);
        for (var i = 1; i < this.points.length; i++) {
            line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
        }
        strokeWeight(1);
        stroke(0);
        if(this.branchingPoint !== null) {
            fill(0);
            ellipse(this.branchingPoint.x,this.branchingPoint.y,5,5);
            noFill();
        }
        this.mouseOver();
    }

    this.mouseOver = function() {
        var first = this.points[0];
        var last = this.points[this.points.length - 1];

        /*if (mouseX < first.x + 10 && mouseX > first.x - 10 && mouseY < first.y + 10 && mouseY > first.y - 10) {
            this.branchButton.hide();
            return;
        }

        if (mouseX < last.x + 10 && mouseX > last.x - 10 && mouseY < last.y + 10 && mouseY > last.y - 10) {
            this.branchButton.hide();
            return;
        }*/

        if (!this.done || currentGate !== null || simToggleValue === 1) {
            this.branchButton.hide();
            return;
        }

        for (var i = 1; i < this.points.length; i++) {
            if (this.points[i - 1].x == this.points[i].x) {
                var x = this.points[i - 1].x;
                var y1 = this.points[i - 1].y;
                var y2 = this.points[i].y;

                if (mouseX > (x - 5) && mouseX < (x + 5) && mouseY >= min(y1, y2) && mouseY <= max(y1, y2)) {
                    this.branchButton.setPosition(x, mouseY /*- mouseY % 10*/ );
                    this.branchButton.setPointBeforeIndex(i - 1);
                    this.branchButton.show();
                    return;
                }
            } else if (this.points[i - 1].y == this.points[i].y) {
                var y = this.points[i - 1].y;
                var x1 = this.points[i - 1].x;
                var x2 = this.points[i].x;

                if (mouseY > (y - 5) && mouseY < (y + 5) && mouseX >= min(x1, x2) && mouseX <= max(x1, x2)) {
                    this.branchButton.setPosition(mouseX, y);
                    this.branchButton.setPointBeforeIndex(i - 1);
                    this.branchButton.show();
                    return;
                }
            }
        }
        this.branchButton.hide();
    }

    this.push = function() {
        this.index = wires.length;
        this.branchButton.setIndex();
        wires.push(this);
        currentWire = null;
    }

    this.refresh = function(i) {
        this.index = i;
        this.branchButton.setIndex();
    }

    this.placeTaken = function(other) {
        for (var i = 1; i < this.points.length; i++) {
            var left = min(this.points[i - 1].x, this.points[i].x) - 9;
            var right = max(this.points[i - 1].x, this.points[i].x) + 9;
            var up = min(this.points[i - 1].y, this.points[i].y) - 9;
            var bottom = max(this.points[i - 1].y, this.points[i].y) + 9;

            if (other.left < right && other.right > left && other.up < bottom && other.bottom > up)
                return true;
        }

        return false;
    }

    this.switch = function(status) {
        this.status = status;
        if (this.status === 2)
            this.color = color(0);
        else if (this.status === 1)
            this.color = color(0, 255, 0);
        else if (this.status === 0)
            this.color = color(255, 0, 0);
    }
}