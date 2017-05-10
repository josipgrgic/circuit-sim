var gates = [];
var wires = [];
var currentGate = null;
var currentWire = null;
var canvas;
var simToggleValue = 0;
var deleteWireMode = 0;
//var slider;
//var sliderValue = 700;
var canWidth;
var canHeigth;
var scroll = $(document).scrollTop();
var intervalClock;
var gateCreated = false;


function setup() {
    var el = document.getElementById("canvas-holder");
    var rect = el.getBoundingClientRect();
    //slider = createSlider(700, rect.right - rect.left, rect.right - rect.left, 1);
    //slider.parent("SLIDER");
    canWidth = rect.right - rect.left;
    canHeigth = 400 * (canWidth/700);
    canvas = createCanvas(canWidth, canHeigth);
    canvas.parent('canvas-holder');
    canvas.mousePressed(addGateOrWire);

    $( "#AND-GATE" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new AndGate(0, 0);
        }

    });

    $( "#OR-GATE" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new OrGate(0, 0);
        }
    });

    $( "#CUSTOM-GATE" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new CustomGate(0, 0);
        }
    });

    $( "#INPUT-SIGNAL" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new InSignal(0, 0);
        }

    });

    $( "#OUTPUT-SIGNAL" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new OutSignal(0, 0);
        }
    });

    $( "#MOUSE-POINTER" ).click(function() {
        currentGate = null;
    });

    $( "#CLEAR" ).click(function() {
        if (simToggleValue === 1)
            return;

        for (var i = 0; i < gates.length; i++) {
            gates[i].delete();
        }
        gates = [];
        wires = [];
        currentWire = null;
        currentGate = null;
        deleteWireMode = 0;
        adjustColor()
    });

    $( "#CLEAR-WIRE" ).click(function() {
        clearCurrentWire();
    });

    $( "#NOT-GATE" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0)
            currentGate = new NotGate(0, 0);
    });

    $( "#NAND-GATE" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0)
            currentGate = new NandGate(0, 0);
    });

    $( "#NOR-GATE" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new NorGate(0, 0);
        }
    });

    $( "#XOR-GATE" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new XorGate(0, 0);
        }
    });

    $( "#DELETE-WIRE-MODE" ).click(function() {
        if(simToggleValue === 0){
            deleteWireMode = 1 - deleteWireMode;
            adjustColor();
        }
    });

    $( "#HALF-ADDER" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new HalfAdderGate(0, 0);
        }
    });

    $( "#FULL-ADDER" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new FullAdderGate(0, 0);
        }

    });

    $( "#HALF-SUBTRACTOR" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new HalfSubtractor(0, 0);
        }
    });

    $( "#FULL-SUBTRACTOR" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0)
            currentGate = new FullSubtractor(0, 0);
    });

    $( "#7-SEG-DISPLAY" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new SevenSegDisplay(0, 0);
        }
    });

    $( "#BCD-TO-7-SEG" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            currentGate = new BcdToSevenSeg(0, 0);
        }
    });

    $( "#COUNTER" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            deleteWireMode = 0;
            adjustColor();
            currentGate = new Counter(0, 0);
        }
    });

    $( "#SR-LATCH" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            deleteWireMode = 0;
            adjustColor();
            currentGate = new SrLatch(0, 0);
        }
    });

    $( "#MUX" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            deleteWireMode = 0;
            adjustColor();
            currentGate = new Mux(0, 0);
        }
    });

    $( "#DEMUX" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0){
            deleteWireMode = 0;
            adjustColor();
            currentGate = new Demux(0, 0);
        }
    });

    $( "#CLOCK" ).click(function() {
        if (simToggleValue === 0 && deleteWireMode === 0)
            currentGate = new Clock(0, 0);
    });

    $( "#SIMULATION" ).click(function() {
        deleteWireMode = 0;
        adjustColor();
        currentGate = null;
        currentWire = null;
        simToggleValue = 1 - simToggleValue;
        if (simToggleValue === 1) {
            $( "#SIMULATION" ).removeClass("btn-danger");
            $( "#SIMULATION" ).addClass("btn-success");
            $( "#SIMULATION" ).html("<span class='glyphicon glyphicon-stop'></span>&nbsp;Zaustavi");
            //simulate();
            prepareSimulation();
            intervalClock = setInterval(clock, 25);
        } else {
            $( "#SIMULATION" ).removeClass("btn-success");
            $( "#SIMULATION" ).addClass("btn-danger");
            $( "#SIMULATION" ).html("<span class='glyphicon glyphicon-play'></span>&nbsp;Pokreni");
            endSimulation();
        }

    });
}

function clock(){
    if (simToggleValue === 1) {
        setupClocks();
        simulate();
    }
}

function draw() {
    scroll = $(document).scrollTop();
    //changeCanvasSize();
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
    drawFrame();
    if(deleteWireMode === 1)
        drawEraser();
}

function drawEraser() {
    line(mouseX, mouseY, mouseX - 10, mouseY - 10);

    line(mouseX, mouseY, mouseX + 5, mouseY - 5);

    line(mouseX + 5, mouseY - 5, mouseX - 5, mouseY - 15);

    line(mouseX - 5, mouseY - 15, mouseX-10, mouseY-10);

    line(mouseX - 10, mouseY - 10, mouseX - 10 + 10, mouseY - 10 - 20);

    line(mouseX - 5, mouseY - 15, mouseX - 5 + 10, mouseY - 15 - 20);

    line(mouseX + 5, mouseY - 5, mouseX + 5 + 10, mouseY - 5 - 20);

    line(mouseX - 5 + 10, mouseY - 15 - 20, mouseX - 10 + 10, mouseY - 10 - 20);

    line(mouseX - 5 + 10, mouseY - 15 - 20, mouseX + 5 + 10, mouseY - 5 - 20);
}

function drawFrame() {
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(1,1,width-2, height-2);
    strokeWeight(1);
}

function adjustColor() {
    if (deleteWireMode === 1) {
        clearCurrentWire();
        $( "#DELETE-WIRE-MODE" ).removeClass("btn-warning");
        $( "#DELETE-WIRE-MODE" ).addClass("btn-success");
    } else {
        $( "#DELETE-WIRE-MODE" ).removeClass("btn-success");
        $( "#DELETE-WIRE-MODE" ).addClass("btn-warning");
    }
}

function windowResized() {
    //var currentVal = slider.value();
    var el = document.getElementById("canvas-holder");
    var rect = el.getBoundingClientRect();
    //slider.hide();
    //slider = createSlider(700, rect.right - rect.left, min(currentVal, rect.right - rect.left), 1);
    //slider.parent("SLIDER");

    var newWidth = rect.right - rect.left;
    var newHeigth = 400 * (newWidth/700);

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
    }
    canvas.size(canWidth, canHeigth);

    for(var i = 0; i<gates.length; i++) {
        gates[i].refreshButtons();
    }
}

function changeCanvasSize() {
    if (simToggleValue === 0) {
        var newWidth = slider.value();
        var newHeigth = 400 * (slider.value()/700);

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
    gateCreated = false;
    if (simToggleValue === 1)
        return;
    /*if (mouseButton == RIGHT)
        clearCurrentWire();*/
    if (currentGate !== null) {

        if (outOfBounds(currentGate)) {
            return;
        }

        var bad = placeTaken();
        if (!bad) {
            currentGate.set();
            gates.push(currentGate);
            currentGate = currentGate.clone();
            gateCreated = true;
        }
        else {
            return;
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

    var taken = placeTaken();

    if (taken) {
        stroke(255, 10, 20);
        currentGate.draw();
        stroke(0);
    } else
        currentGate.draw();
}

function clearCurrentGate() {
    if(currentGate !== null) {
         if(gateCreated) {
            var i = gates.length - 1;
            gates[i].delete();
            gates.splice(i, 1);
            refreshGates();
            gateCreated = false;
         }
         currentGate = null;
    }
}

function placeTaken() {
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
    return taken;
}

function outOfBounds(other) {
    if (other.left < 3 || other.right > width-3 || other.up < 0 || other.bottom > height)
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