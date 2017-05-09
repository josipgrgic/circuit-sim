function simulate(){

    var queue = [];

    gates.forEach(function(gate) {
        if(gate.isInSignal && gates.out !== 'undefined'){
            gate.out.forEach(function(outButton){
                outButton.wires.forEach(function(wire) {
                    queue.push(gates[wire.inGateIndex]);
                    wire.status = gate.status;
                    wire.switch(wire.status);
                }, this);
            });
        }
    }, this);

    var i = 0;
    while(queue.length > 0){
        if(i++ > wires.length * 10){ 
            break;
            console.log("Infinite loop detected");
        }
        currentGate = queue.shift();

        inputWires = [];
        outputWires = [];

        if(typeof currentGate.in !== 'undefined'){
            currentGate.in.forEach(function(inButton){
                inputWires = inputWires.concat(inButton.wires);
            });
        }
        
        if(typeof currentGate.out !== 'undefined'){
            currentGate.out.forEach(function(outButton){
                outputWires = outputWires.concat(outButton.wires);
            });
        }

        inputs = [];
        console.log("inputs");
        console.log(inputs);

        inputWires.forEach(function(wire){
            inputs.push(wire.status);
        });

        if(typeof outputWires !== 'undefined'){
            outputWires.forEach(function(wire){
                newStatus = wire.status;
                if(currentGate.inputNum === 1){
                    newStatus = currentGate.truthTable[inputs[0]];
                }
                if(currentGate.inputNum === 2){
                    newStatus = currentGate.truthTable[inputs[0]][inputs[1]];
                }
                if(currentGate.inputNum === 3){
                    newStatus = currentGate.truthTable[inputs[0]][inputs[1]][inputs[2]];
                }
                if(currentGate.inputNum === 4){
                    newStatus = currentGate.truthTable[inputs[0]][inputs[1]][inputs[2]][inputs[3]];
                }
                if(typeof newStatus === 'undefined'){
                        newStatus = 2;
                }
                if(newStatus !== wire.status){
                    if(currentGate.outputNum > 1){
                        wire.status = newStatus[wire.outIndex];
                    }
                    else{
                        wire.status = newStatus;
                    }
                    wire.switch(wire.status);
                    queue.push(gates[wire.inGateIndex]);
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
        console.log("Current gate: ");
        console.log(currentGate);
        console.log(inputs);
        console.log(wires);
    }
}

function endSimulation(){
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
        }
    });
}

