function StatusButton(inSignal, index) {
    this.inSignal = inSignal;
    this.inSignalIndex = index;

    this.x;
    this.y;

    this.button = createButton('');
    this.button.addClass('statButton');
    this.button.value(this.inSignalIndex);

    this.button.mousePressed(function() {
        if(typeof gates[this.value()].isClock !== 'undefined' && gates[this.value()].isClock){
            gates[this.value()].switchSpeed();
        }
        else{
            gates[this.value()].switch();
            if(simToggleValue === 1){
                simulate(false, gates[this.value()]);
            }
        }
    });

    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
        var el = document.getElementById("canvas-holder");
        var rect = el.getBoundingClientRect();
        this.button.position(rect.left + this.x + 2, rect.top +  this.y + scroll + 2);
    }

    this.hide = function() {
        this.button.style('visibility', 'hidden');
    }

    this.show = function() {
        this.button.style('visibility', 'visible');
    }

    this.refresh = function() {
        this.inSignalIndex = this.inSignal.index;
        this.button.value(this.inSignalIndex);
    }
}