function BranchButton(wire) {
    this.wire = wire;

    this.button = createButton('');
    this.button.addClass('branchButton');
    this.button.style('visibility', 'hidden');

    this.x;
    this.y;

    this.pointBeforeIndex;

    this.button.mousePressed(function() {
        if (deleteWireMode === 0) {
            if (currentWire === null) {
                currentWire = new Wire();
                var i = this.value();
                currentWire.outGateIndex = wires[i].outGateIndex;
                currentWire.outIndex = wires[i].outIndex;
                var outButton = gates[wires[i].outGateIndex].out[wires[i].outIndex];
                outButton.wires.push(currentWire);

                var clickedButton = wires[i].branchButton;
                var endIndex = clickedButton.pointBeforeIndex;
                var points = clickedButton.wire.points;

                for (var i = 0; i <= endIndex; i++) {
                    currentWire.points.push(points[i]);
                }
                currentWire.points.push(new Point(clickedButton.x, clickedButton.y));


                return;
            } else if (currentWire.outGateIndex !== null) {
                return;
            } else {
                i = this.value();
                currentWire.outGateIndex = wires[i].outGateIndex;
                currentWire.outIndex = wires[i].outIndex;
                var outButton = gates[wires[i].outGateIndex].out[wires[i].outIndex];
                outButton.wires.push(currentWire);

                clickedButton = wires[i].branchButton;
                endIndex = clickedButton.pointBeforeIndex;
                points = clickedButton.wire.points;

                currentWire.addPath();
                currentWire.points.splice(currentWire.points.length - 1, 1);

                if (points[endIndex].y == points[endIndex + 1].y) {
                    currentWire.points.splice(currentWire.points.length - 1, 1);
                    currentWire.points.push(new Point(currentWire.points[currentWire.points.length - 1].x, clickedButton.y));
                } else {
                    currentWire.points.push(new Point(clickedButton.x, clickedButton.y));
                }

                for (j = endIndex; j >= 0; j--) {
                    currentWire.points.push(points[j]);
                }

                points = [];
                for (i = 0; i < currentWire.points.length; i++) {
                    points.push(currentWire.points[i]);
                }

                j = points.length - 1;
                for (i = 0; i < points.length; i++) {
                    currentWire.points[i] = points[j--];
                }

                currentWire.push();
            }
        } else {
            var i = this.value();
            var wire = wires[i];
            var wiresToDelete = [];

            var but = wire.branchButton;

            var pointBefore = wire.points[but.pointBeforeIndex];
            var pointAfter = wire.points[but.pointBeforeIndex + 1];

            var isHorizontal = true;
            if (pointBefore.x === pointAfter.x)
                isHorizontal = false;

            for (var i = 0; i < wires.length; i++) {
                var w = wires[i];
                if (w.outGateIndex !== wire.outGateIndex) {
                    continue;
                }

                for (var j = 1; j < w.points.length; j++) {
                    var p1 = w.points[j - 1];
                    var p2 = w.points[j];

                    if ((p1.y === p2.y) === isHorizontal) {
                        if (isHorizontal) {
                            if (but.y === p1.y && (but.x > min(p1.x, p2.x) && but.x < max(p1.x, p2.x))) {
                                wiresToDelete.push(w);
                            }
                        } else {
                            if (but.x === p1.x && (but.y > min(p1.y, p2.y) && but.y < max(p1.y, p2.y))) {
                                wiresToDelete.push(w);
                            }
                        }
                    }
                }
            }

            for (var i = wiresToDelete.length - 1; i >= 0; i--) {
                wiresToDelete[i].branchButton.hide();
                deleteWire(wiresToDelete[i]);
                refreshWires();
            }
            but.hide();
        }
    });

    this.setIndex = function() {
        this.button.value(this.wire.index);
    }

    this.setPointBeforeIndex = function(i) {
        this.pointBeforeIndex = i;
    }

    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
        var el = document.getElementById("canvas-holder");
        var rect = el.getBoundingClientRect();
        this.button.position(rect.left + this.x - 7, rect.top +  this.y - 7 + scroll);
    }

    this.hide = function() {
        this.button.style('visibility', 'hidden');
    }

    this.show = function() {
        this.button.style('visibility', 'visible');
    }
}