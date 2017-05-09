var gates = [];
var wires = [];
var andButton;
var orButton;
var customButton;
var mousePointer;
var clearButton;
var clearWireButton;
var inSignalButton;
var outSignalButton;
var currentGate = null;
var currentWire = null;
var canvas;
var simToggleValue = 0;
var simToggleButton;
var notButton;
var nandButton;
var norButton;
var xorButton;
var delWireButton;
var deleteWireMode = 0;
var fadderButton;
var hadderButton;
var fsubtractorButton;
var hsubtractorButton;
var sevenSegButton;
var bcdToSevenSegButton;
var slider;
var sliderValue = 0;
var canWidth;
var canHeigth;
var scroll = $(document).scrollTop();

function setup() {
    slider = createSlider(0, 100, 0, 1);
    slider.position(10, 650);
    canWidth = 700;
    canHeigth = 400;
    canvas = createCanvas(canWidth, canHeigth);
    canvas.parent('canvas-holder');
    canvas.mousePressed(addGateOrWire);

    andButton = createButton('AND gate');
    andButton.position(0, 410);
    andButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new AndGate(0, 0);
    });

    orButton = createButton('OR gate');
    orButton.position(100, 410);
    orButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new OrGate(0, 0);
    });

    customButton = createButton('Custom gate');
    customButton.position(200, 410);
    customButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new CustomGate(0, 0);
    });

    inSignalButton = createButton('Input Signal');
    inSignalButton.position(0, 450);
    inSignalButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new InSignal(0, 0);
    });

    outSignalButton = createButton('Output Signal');
    outSignalButton.position(100, 450);
    outSignalButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new OutSignal(0, 0);
    });

    mousePointer = createButton('Mouse pointer');
    mousePointer.position(330, 410);
    mousePointer.mousePressed(function() {
        currentGate = null;
    });

    clearButton = createButton('Clear');
    clearButton.position(460, 410);
    clearButton.mousePressed(function() {
        if (simToggleValue === 1)
            return;

        for (var i = 0; i < gates.length; i++) {
            gates[i].delete();
        }
        gates = [];
        wires = [];
        currentWire = null;
        currentGate = null;
    });

    clearWireButton = createButton('Clear Wire');
    clearWireButton.position(530, 410);
    clearWireButton.mousePressed(function() {
        clearCurrentWire();
    });

    notButton = createButton('NOT gate');
    notButton.position(230, 450);
    notButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new NotGate(0, 0);
    });

    nandButton = createButton('NAND gate');
    nandButton.position(330, 450);
    nandButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new NandGate(0, 0);
    });

    norButton = createButton('NOR gate');
    norButton.position(460, 450);
    norButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new NorGate(0, 0);
    });

    xorButton = createButton('XOR gate');
    xorButton.position(560, 450);
    xorButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new XorGate(0, 0);
    });

    delWireButton = createButton('Delete Wire Mode');
    delWireButton.position(800, 450);
    delWireButton.style('background', 'red');
    delWireButton.mousePressed(function() {
        deleteWireMode = 1 - deleteWireMode;
        if (deleteWireMode === 1) {
            delWireButton.style('background', 'green');
            clearCurrentWire();
        } else {
            delWireButton.style('background', 'red');
        }
    });

    hadderButton = createButton('Half adder');
    hadderButton.position(0, 490);
    hadderButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new HalfAdderGate(0, 0);
    });

    fadderButton = createButton('Full adder');
    fadderButton.position(130, 490);
    fadderButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new FullAdderGate(0, 0);
    });

    hsubtractorButton = createButton('Half subtractor');
    hsubtractorButton.position(260, 490);
    hsubtractorButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new HalfSubtractor(0, 0);
    });

    fsubtractorButton = createButton('Full subtractor');
    fsubtractorButton.position(390, 490);
    fsubtractorButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new FullSubtractor(0, 0);
    });

    sevenSegButton = createButton('7 seg display');
    sevenSegButton.position(520, 490);
    sevenSegButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new SevenSegDisplay(0, 0);
    });

    bcdToSevenSegButton = createButton('BCD to 7 seg');
    bcdToSevenSegButton.position(0, 530);
    bcdToSevenSegButton.mousePressed(function() {
        if (simToggleValue === 0)
            currentGate = new BcdToSevenSeg(0, 0);
    });

    simToggleButton = createButton('Simulation');
    simToggleButton.style('background', 'red')
    simToggleButton.position(0, 570);
    simToggleButton.mousePressed(function() {
        currentGate = null;
        currentWire = null;
        simToggleValue = 1 - simToggleValue;
        print(simToggleValue);
        if (simToggleValue === 1) {
            simToggleButton.style('background', 'green');
            simulate();
        } else {
            simToggleButton.style('background', 'red');
            endSimulation();
        }
    });
}

function draw() {
    scroll = $(document).scrollTop();
    changeCanvasSize();
    background('#F8F8F8');
    for (var i = gates.length - 1; i >= 0; i--) {
        if (gates[i].closeButton.value() == 1)
            gates[i].draw();
        else {
            gates[i].delete();
            gates.splice(i, 1);
            refreshGates();
        }
    }

    for (i = 0; i < wires.length; i++) {
        wires[i].draw();
    }

    if (currentGate !== null && simToggleValue === 0) {
        displayGate();
    } else if (currentWire !== null) {
        currentWire.draw();
        currentWire.drawSegment();
    }
}

function changeCanvasSize() {
    if (simToggleValue === 0) {
        var newWidth = 700 * (1 + slider.value() / 100);
        var newHeigth = 400 * (1 + slider.value() / 100);

        var maxW = 0;
        var maxH = 0;

        for (var i = 0; i < gates.length; i++) {
            if (maxW < gates[i].right)
                maxW = gates[i].right;
            if (maxH < gates[i].bottom)
                maxH = gates[i].bottom;
        }

        for (var i = 0; i < wires.length; i++) {
            for (var j = 0; j < wires[i].points.length; j++) {
                if (maxW < wires[i].points[j].x)
                    maxW = wires[i].points[j].x;
                if (maxH < wires[i].points[j].y)
                    maxH = wires[i].points[j].y;
            }
        }

        if (newWidth > maxW && newHeigth > maxH) {
            canWidth = newWidth;
            canHeigth = newHeigth;
            sliderValue = slider.value();
        } else
            slider.value(sliderValue);

        canvas.size(canWidth, canHeigth);
    } else
        slider.value(sliderValue);

    canvas.size(canWidth, canHeigth);
}

function addGateOrWire() {
    if (simToggleValue === 1)
        return;
    if (currentGate !== null) {

        if (outOfBounds(currentGate)) {
            return;
        }

        var good = true;
        for (var i = 0; i < gates.length; i++) {
            if (gates[i].placeTaken(currentGate)) {
                good = false;
                break;
            }
        }

        if (good) {
            for (i = 0; i < wires.length; i++) {
                if (wires[i].placeTaken(currentGate)) {
                    good = false;
                    break;
                }
            }
            if (good) {
                currentGate.set();
                gates.push(currentGate);
                currentGate = currentGate.clone();
            }
        }
    } else {
        if (currentWire !== null) {
            currentWire.addPath();
        }
    }
}

function displayGate() {
    currentGate.refreshPosition();

    if (outOfBounds(currentGate)) {
        stroke(255, 10, 20);
        currentGate.draw();
        stroke(0);
        return;
    }

    var taken = false;
    for (i = 0; i < gates.length; i++) {
        if (gates[i].placeTaken(currentGate)) {
            taken = true;
            break;
        }
    }

    if (!taken) {
        for (i = 0; i < wires.length; i++) {
            if (wires[i].placeTaken(currentGate)) {
                taken = true;
                break;
            }
        }
    }

    if (taken) {
        stroke(255, 10, 20);
        currentGate.draw();
        stroke(0);
    } else
        currentGate.draw();
}

function outOfBounds(other) {
    if (other.left < 0 || other.right > width || other.up < 0 || other.bottom > height)
        return true;
    return false;
}

function refreshGates() {
    for (var i = 0; i < gates.length; i++) {
        gates[i].refresh(i);
    }
}

function refreshWires() {
    for (i = 0; i < wires.length; i++) {
        wires[i].refresh(i);
    }
}

function deleteWire(wire) {
    var button = gates[wire.inGateIndex].in[wire.inIndex];
    for (var j = 0; j < button.wires.length; j++) {
        if (button.wires[j] === wire) {
            button.wires.splice(j, 1);
            break;
        }
    }

    var button = gates[wire.outGateIndex].out[wire.outIndex];
    for (var j = 0; j < button.wires.length; j++) {
        if (button.wires[j] === wire) {
            button.wires.splice(j, 1);
            break;
        }
    }
    for (var i = 0; i < wires.length; i++) {
        if (wires[i] === wire) {
            wires.splice(i, 1);
            break;
        }
    }

}

function clearCurrentWire() {
    if (simToggleValue === 0 && currentWire !== null) {
        if (currentWire.inGateIndex !== null) {
            let inBWires = gates[currentWire.inGateIndex].in[currentWire.inIndex].wires;
            if (inBWires.length > 0) {
                let wire = inBWires[inBWires.length - 1];
                if (wire !== null && wire.outGateIndex === null || wire.inGateIndex === null)
                    inBWires.splice(inBWires.length - 1, 1);
            }

        } else {
            let outBWires = gates[currentWire.outGateIndex].out[currentWire.outIndex].wires;
            if (outBWires.length > 0) {
                let wire = outBWires[outBWires.length - 1];
                if (wire !== null && wire.outGateIndex === null || wire.inGateIndex === null)
                    outBWires.splice(outBWires.length - 1, 1);
            }

        }
        currentWire = null;
    }
}