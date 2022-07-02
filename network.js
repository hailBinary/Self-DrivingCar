//defining a neural net of many levels
class NeuralNetwork{
    //neuroncounts is an array where we put the number of neurons for each level. eg.: nc = [5, 6, 3] i.e. 5 is number of neurons in first level and 6 in second and so on.
    constructor(neuronCounts){
        this.levels = [];
        for(let i = 0; i < neuronCounts.length - 1; i++){
            //sending Level1(input neuron count, output neuron count) as defined below.
            this.levels.push(new Level1(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    //using the feedforward algorithm for each level
    static feedForward(givenInputs, network){
        let outputs = Level1.feedForward(
            givenInputs, network.levels[0]);
        //using i = 1 since the first level is already done with the above code.
        //putting the output of one level to the other.
        for(let i = 1; i < network.levels.length; i++){
            outputs = Level1.feedForward(
                outputs, network.levels[i]);
        }
        return outputs;
    }
}

//defining the first level
class Level1{
    //inputCount and outputCount are to keep track of the number of input and output neurons in a level within the net.
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        //biases are the values above which a neuron fires in a network.
        this.biases = new Array(outputCount);

        //weight is the strength of connection between the neurons in different levels.
        this.weights = [];
        for(let i = 0; i < inputCount; i++){
            this.weights[i] = new Array(outputCount);
        }
        //assigning a random brain initially.
        Level1.#randomize(this);
    }

    //static to serialize this object and methods do not serialize and thus a static function. 
    //What does serialize object do? --To serialize an object means to convert its state to a byte stream so way that the byte stream can be reverted back into a copy of the object.
    static #randomize(level){
        for (let i = 0; i < level.inputs.length; i++){
            for (let j = 0; j < level.outputs.length; j++){
                //Math.random() gives a value between 0 and 1 and *2-1 is done to make the value between -1 and 1.
                //Why negative values? so that weights and biases can warn you against doing things instead of only promoting what to do or remaining neutral.
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        //same logic as weights for the biases for each neuron.
        for(let i = 0; i < level.biases.length; i++){
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    //computing the output with a feedForward algorithm.
    //Data enters at the inputs and passes through the network, layer by layer, until it arrives at the outputs. During normal operation, that is when it acts as a classifier, there is no feedback between layers. This is why they are called feedforward neural networks. 
    
    static feedForward(givenInputs, level){
        //providing inputs to the neural net
        for(let i = 0; i < level.inputs.length; i++){
            level.inputs[i] = givenInputs[i];
        }
        //for the outputs is given by a sum between the inputs and the weight of each connection.
        for(let i = 0; i < level.outputs.length; i++){
            let sum = 0
            for(let j = 0; j < level.inputs.length; j++){
                sum += level.inputs[j] * level.weights[j][i];
            }
            //bias: the value above which the input value must be for the neuron to fire.
            if(sum > level.biases[i]){
                level.outputs[i] = 1;
            }else{
                //since sum < bias thus the neuron doesn't fire.
                level.outputs[i] = 0;
            }
        }
        //the function returns the output value for the first level.
        return level.outputs;
    }
}