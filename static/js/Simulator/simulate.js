var inputQueue = [];
var inputQueueFlags = {};
var inputGates = [];
var clocks = [];

function simulate(){
    var queue = inputQueue.slice();
    var queueFlags = {};

    inputGates.forEach(function(gate) {
        gate.out.forEach(function(outButton){
            outButton.wires.forEach(function(wire) {
                wire.switch(gate.status);
            }, this);
        });
    }, this);

    var i = 0;
    while(queue.length > 0){
        console.log("queue");
        console.log(queue);
        if(i++ > gates.length * 10){ 
            break;
            console.log("Infinite loop detected");
        }
        currentGate = shiftGate(queue, queueFlags);

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
                inputs.push(2);
            }
            else{
                inputs.push(wire.status);
            }
        });

        var newStatus = 2;
        if(currentGate.outputNum > 0 ){
            if((typeof currentGate.demux !== 'undefined' && currentGate.demux) || 
                    (typeof currentGate.mux !== 'undefined' && currentGate.mux)){
                newStatus = currentGate.output(inputs);
            }
            else if(currentGate.inputNum === 1){
                newStatus = currentGate.truthTable[inputs[0]];
            }
            else if(currentGate.inputNum === 2 && typeof currentGate.state === 'undefined'){
                newStatus = currentGate.truthTable[inputs[0]][inputs[1]];
            }
            else if(currentGate.inputNum === 2 && typeof currentGate.state !== 'undefined'){
                currentGate.switch(inputs[0], inputs[1]);
                newStatus = currentGate.truthTable;
            }
            else if(currentGate.inputNum === 3){
                newStatus = currentGate.truthTable[inputs[0]][inputs[1]][inputs[2]];
            }
            else if(currentGate.inputNum === 4){
                newStatus = currentGate.truthTable[inputs[0]][inputs[1]][inputs[2]][inputs[3]];
            }
            if(typeof newStatus === 'undefiend'){
                newStatus = 2;
            }
        }
        if(typeof outputWires !== 'undefined'){
            outputWires.forEach(function(wire){
                if((currentGate.outputNum === 1 && newStatus !== wire.status) || (currentGate.outputNum > 1 && newStatus[wire.outIndex] !== wire.status)){
                    if(currentGate.outputNum > 1){
                        wire.status = newStatus[wire.outIndex];
                    }
                    else{
                        wire.status = newStatus;
                    }
                    wire.switch(wire.status);
                    
                    pushGate(gates[wire.inGateIndex], queue, queueFlags);
                }
            });
        }
        if(currentGate.outputNum === 0 && currentGate.inputNum === 1){
            currentGate.status = inputs[0];
            currentGate.switch(currentGate.status);
        }
        if(typeof currentGate.sevenSeg !== 'undefined'){
            currentGate.switch(inputs);
        }
        console.log(currentGate);
        console.log(inputs);
        console.log(gates);
    }
}

function pushGate(gate, queue, queueFlags){
    if(typeof queueFlags[gate.name] === 'undefined' || !queueFlags[gate.name]){
        queue.push(gate);
        queueFlags[gate.name] = true;
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
    clocks.forEach(function(gate) {
        if(gate.switch()){
            refresh = true;
        }
    }, this);
    if(refresh){
        simulate();
    }
}

function prepareSimulation(){
    inputQueue = [];
    inputQueueFlags = {};
    inputGates = [];
    clocks = [];

    gates.forEach(function(gate) {
        if(gate.isInSignal && gates.out !== 'undefined'){
            if(gate.out[0].wires.length > 0){
                inputGates.push(gate);
            }
            gate.out.forEach(function(outButton){
                outButton.wires.forEach(function(wire) {
                    pushGate(gates[wire.inGateIndex], inputQueue, inputQueueFlags);
                }, this);
            });
        }
        if(typeof gate.isClock !== 'undefined' && gate.isClock){
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
                gate.switch(0, 1);
                gate.switch(0, 0);
            }
        }
    });
}

