var inputQueue = [];
var inputQueueFlags = {};
var clockInputQueue = [];
var clockInputQueueFlags = {};
var inputGates = [];
var clockInputGates = [];
var clocks = [];

function simulate(fromClock = false, gateFromButton, clocksForQueue){
    var queue = [];
    var queueFlags = {};

    var simInputGates = [];
    var simInputQueue = [];
    if(fromClock){
        simInputGates = clocksForQueue;
        clocksForQueue.forEach(function(clock){
            clock.out.forEach(function(outButton){
                outButton.wires.forEach(function(wire) {
                    simInputQueue.push({gate:gates[wire.inGateIndex]});
                }, this);
            });
        });
    }
    else if(typeof gateFromButton !== 'undefined'){
        simInputGates.push(gateFromButton);
        gateFromButton.out.forEach(function(outButton){
            outButton.wires.forEach(function(wire) {
                simInputQueue.push({gate:gates[wire.inGateIndex]});
            }, this);
        });
    }
    else{
        simInputGates = inputGates;
        simInputQueue = inputQueue;
    }
    
    simInputGates.forEach(function(gate) {
        gate.out.forEach(function(outButton){
            outButton.wires.forEach(function(wire) {
                wire.switch(gate.status);
            }, this);
        });
    }, this);

    simInputQueue.forEach(function(queueGate){
        pushGate(queueGate.gate, queue, queueFlags);
    });

    var i = 0;
    console.log(gates);
    while(queue.length > 0){
        if(i++ > gates.length * 10){ 
            break;
            console.log("Infinite loop detected");
        }
        var currentQueueGate = shiftGate(queue, queueFlags);
        var currentGate = currentQueueGate.gate;
        currentGate.inputs = currentQueueGate.inputs;
        //setPreviousValues(currentGate, currentQueueGate.previousValues);

        console.log("New gate popped from queue:");
        console.log(currentGate);

        inputWires = [];
        outputWires = [];

        if(typeof currentGate.in !== 'undefined'){
            currentGate.in.forEach(function(inButton){
                if(inButton.wires.length == 0){
                    inputWires.push("");
                }
                else{
                    inputWires = inputWires.concat(inButton.wires);
                }
            });
        }
        
        if(typeof currentGate.out !== 'undefined'){
            currentGate.out.forEach(function(outButton){
                outputWires = outputWires.concat(outButton.wires);
            });
        }

        inputs = [];
        inputWires.forEach(function(wire){
            if(typeof wire.status === 'undefined'){
                inputs.push(0);
            }
            else{
                inputs.push(wire.status);
            }
        });

        var newStatus = 2;
       // try{
            if(currentGate.outputNum > 0 ){
                if((typeof currentGate.demux !== 'undefined' && currentGate.demux) || 
                        (typeof currentGate.mux !== 'undefined' && currentGate.mux)){
                    newStatus = currentGate.output();
                }
                else if(currentGate.inputNum === 1){
                    newStatus = currentGate.truthTable[currentGate.inputs[0]];
                }
                else if(currentGate.inputNum === 2 && typeof currentGate.state === 'undefined'){
                    newStatus = currentGate.truthTable[currentGate.inputs[0]][currentGate.inputs[1]];
                }
                else if(currentGate.inputNum === 2 && typeof currentGate.state !== 'undefined'){
                    currentGate.switch();
                    newStatus = currentGate.truthTable;
                }
                else if(currentGate.inputNum === 3 && typeof currentGate.jk === 'undefined'){
                    newStatus = currentGate.truthTable[currentGate.inputs[0]][currentGate.inputs[1]][currentGate.inputs[2]];
                }
                else if(typeof currentGate.jk !== 'undefined'){
                    currentGate.switch();
                    newStatus = currentGate.truthTable;
                }
                else if(currentGate.inputNum === 4){
                    newStatus = currentGate.truthTable[currentGate.inputs[0]][currentGate.inputs[1]][currentGate.inputs[2]][currentGate.inputs[3]];
                }
            }
        /*}
        catch(error){
            console.log("Error at gate: " + error);
            console.log(currentGate);
        }*/
        if(typeof newStatus === 'undefiend' || typeof newStatus == undefined || newStatus == null){
            if(currentGate.outputNum == 1){
                newStatus = 0;
            }
            else{
                for(var i = 0; i < currentGate.outputNum; i++){
                    newStatus = [];
                    newStatus[i] = 0;
                }
            }
        }
        if(typeof outputWires !== 'undefined'){
            var gatesToPush = [];
            outputWires.forEach(function(wire){
                if((currentGate.outputNum === 1 && newStatus !== wire.status) || (currentGate.outputNum > 1 && newStatus[wire.outIndex] !== wire.status)){
                    if(currentGate.outputNum > 1){
                        wire.status = newStatus[wire.outIndex];
                    }
                    else{
                        wire.status = newStatus;
                    }
                    wire.switch(wire.status);
                    gatesToPush.push(gates[wire.inGateIndex]);
                }
            });
            gatesToPush.forEach(function(gate){
                pushGate(gate, queue, queueFlags);
            });
        }
        if(currentGate.outputNum === 0 && currentGate.inputNum === 1){
            currentGate.status = currentGate.inputs[0];
            currentGate.switch(currentGate.status);
        }
        if(typeof currentGate.sevenSeg !== 'undefined'){
            currentGate.switch(inputs);
        }
    }
}

function pushGate(gate, queue, queueFlags){
    //if(typeof queueFlags[gate.name] === 'undefined' || !queueFlags[gate.name]){
    var gateInputs = [];
    if(typeof gate.in !== 'undefined'){
        for(var i = 0; i < gate.inputNum; i++){
            if(gate.in[i].wires.length > 0){
                gate.inputs[i] = gate.in[i].wires[0].status;
                gateInputs[i] = gate.in[i].wires[0].status;
            }
            else{
                gate.inputs[i] = 0;
                gateInputs[i] = 0;
            }
        }
    }
    var previousValues = getPreviousValues(gate);

    var queueGate = {
        gate:gate,
        inputs:gateInputs,
        previousValues:previousValues
    };
    queue.push(queueGate);
    queueFlags[gate.name] = true;
    //}
}

function getPreviousValues(gate){
    var previousClk = "";
    var previousD = "";
    var previousReset = "";

    if(typeof gate.previousClk !== 'undefined'){
        previousClk = gate.previousClk;
    }
    if(typeof gate.previousD !== 'undefined'){
        previousD = gate.previousD;
    }
    if(typeof gate.previousClk !== 'undefined'){
        previousReset = gate.previousReset;
    }

    return {previousClk:previousClk,
            previousD:previousD,
            previoudReset:previousReset};
}

function setPreviousValues(gate, values){
    if(typeof gate.previousClk !== 'undefined'){
        gate.previousClk = values.previousClk;
    }
    if(typeof gate.previousD !== 'undefined'){
        gate.previousD = values.previousD;
    }
    if(typeof gate.previousReset !== 'undefined'){
        gate.previousReset = values.previousReset;
    }
}

function shiftGate(queue, queueFlags){
    if(queue.length > 0){
        var gate = queue.shift();
        queueFlags[gate.name] = false;
        return gate;
    }
}

function setupClocks(){
    var refresh = false;
    var clocksForQueue = [];
    clocks.forEach(function(gate) {
        if(gate.switch()){
            clocksForQueue.push(gate);
            refresh = true;
        }
    }, this);
    if(refresh){
        simulate(true, undefined, clocksForQueue);
    }
}

function prepareSimulation(){
    inputQueue = [];
    inputQueueFlags = {};
    clockInputQueue = [];
    clockInputQueueFlags = {};
    inputGates = [];
    clocks = [];

    gates.forEach(function(gate) {
        if(gate.isInSignal && gates.out !== 'undefined'){
            if(gate.out[0].wires.length > 0){
                if(typeof gate.isClock !== 'undefined'){
                    clockInputGates.push(gate);
                }
                else{
                    inputGates.push(gate);
                }
            }
            gate.out.forEach(function(outButton){
                outButton.wires.forEach(function(wire) {
                    if(typeof gate.isClock !== 'undefined'){
                        pushGate(gates[wire.inGateIndex], clockInputQueue, clockInputQueueFlags);
                    }
                    else{
                        pushGate(gates[wire.inGateIndex], inputQueue, inputQueueFlags);
                    }
                }, this);
            });
        }
        if(typeof gate.isClock !== 'undefined'){
            if(gate.out[0].wires.length > 0){
                clocks.push(gate);
            }
        }
    }, this);
}

function endSimulation(){
    clearInterval(intervalClock);

    wires.forEach(function(wire){
        wire.switch(2);
    });

    gates.forEach(function(gate){
        if(typeof gate.switch !== 'undefined'){
            if(!gate.isInSignal){
                gate.switch(2);
            }
            if(typeof gate.sevenSeg !== 'undefined'){
                gate.switch([0, 0, 0, 0, 0, 0, 0]);
            }
            if(typeof gate.counter !== 'undefined'){
                gate.state = 0;
            }
            if(typeof gate.jk !== 'undefined'){
                gate.truthTable = [0, 0];
                gate.previousJ = 0;
                gate.previousClk = 0;
                gate.previousK = 0;
            }
        }
    });
}

