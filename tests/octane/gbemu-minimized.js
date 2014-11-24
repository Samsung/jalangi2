function runGameboy() {
    start();
    gameboy.instructions = 0;
    gameboy.totalInstructions = 25e4;
    while (gameboy.instructions <= gameboy.totalInstructions) {
        gameboy.run();
        GameBoyAudioNode.run();
    }
}

function cout() {}

var GameBoyAudioNode = {
    run: function() {
        this.onaudioprocess();
    }
};

function GameBoyAudioContext() {
    this.createBufferSource = function() {
        return {};
    };
    this.createJavaScriptNode = function() {
        return GameBoyAudioNode;
    };
}

function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize) {
    this.channels = channels;
    this.outputBufferSize = outputBufferSize;
    this.initialize();
}

Resampler.prototype.initialize = function() {
    this.compileInterpolationFunction();
    this.resampler = this.interpolate;
};

Resampler.prototype.compileInterpolationFunction = function() {
    var toCompile = "var bufferLength = Math.min(buffer.length, this.outputBufferSize);  if ((bufferLength % " + this.channels + ") == 0) {    if (bufferLength > 0) {      var ratioWeight = this.ratioWeight;      var weight = 0;";
    toCompile += "var actualPosition = 0;      var amountToNext = 0;      var alreadyProcessedTail = !this.tailExists;      this.tailExists = false;      var outputBuffer = this.outputBuffer;      var outputOffset = 0;      var currentPosition = 0;      do {        if (alreadyProcessedTail) {          weight = ratioWeight;";
    toCompile += "alreadyProcessedTail = true;        }        while (weight > 0 && actualPosition < bufferLength) {          amountToNext = 1 + actualPosition - currentPosition;          if (weight >= amountToNext) {";
    toCompile += "currentPosition += weight;            weight = 0;            break;          }        }        if (weight == 0) {";
    toCompile += 'this.tailExists = true;          break;        }      } while (actualPosition < bufferLength);      return this.bufferSlice(outputOffset);    }    else {      return (this.noReturn) ? 0 : [];    }  }  else {    throw(new Error("Buffer was of incorrect sample length."));  }';
    this.interpolate = Function("buffer", toCompile);
};

function XAudioServer(minBufferSize, maxBufferSize) {
    webAudioMaxBufferSize = maxBufferSize;
    this.initializeAudio();
}

XAudioServer.prototype.initializeAudio = function() {
    try {
        throw new Error;
        this.preInitializeMozAudio();
        {}
        this.initializeMozAudio();
    } catch (error) {
        try {
            this.initializeWebAudio();
        } catch (error) {
            try {
                this.initializeFlashAudio();
            } catch (error) {
                throw new Error;
            }
        }
    }
};

XAudioServer.prototype.initializeWebAudio = function() {
    resetCallbackAPIAudioBuffer();
};

function getFloat32() {
    try {
        return new Float32Array;
    } catch (error) {
        return;
    }
}

function getFloat32Flat(size) {
    try {
        var newBuffer = new Float32Array(size);
    } catch (error) {
        var newBuffer = new Array(size);
        var audioSampleIndice = 0;
        do {} while (audioSampleIndice);
    }
}

var resampleControl = null;

function audioOutputEvent() {
    resampleRefill();
}

function resampleRefill() {
    var resampleLength = resampleControl.resampler(getBufferSamples());
}

function getBufferSamples() {
    try {
        return audioContextSampleBuffer.subarray();
    } catch (error) {
        try {
            audioContextSampleBuffer.length;
            return;
        } catch (error) {
            return;
        }
    }
}

function resetCallbackAPIAudioBuffer(APISampleRate) {
    audioContextSampleBuffer = getFloat32();
    resampleBufferSize = Math.max(webAudioMaxBufferSize);
    {
        getFloat32Flat(resampleBufferSize);
        resampleControl = new Resampler(XAudioJSSampleRate, APISampleRate, 2, resampleBufferSize);
    }
}

(function() {
    try {
        audioContextHandle = new GameBoyAudioContext;
    } catch (error) {
        try {
            audioContextHandle;
        } catch (error) {
            return;
        }
    }
    try {
        audioSource = audioContextHandle.createBufferSource();
        audioSource.loop;
        XAudioJSSampleRate = audioContextHandle.sampleRate;
        audioSource.buffer;
        audioNode = audioContextHandle.createJavaScriptNode();
        audioNode.onaudioprocess = audioOutputEvent;
        audioSource.connect();
        audioNode.connect();
        audioSource.noteOn();
    } catch (error) {
        return;
    }
})();

function GameBoyCore() {}

GameBoyCore.prototype.start = function() {
    this.initSound();
};

GameBoyCore.prototype.initSound = function() {
    try {
        var parentObj = this;
        new XAudioServer(2, 4194304);
        this.initAudioBuffer();
    } catch (error) {
        cout();
        settings[0];
    }
};

GameBoyCore.prototype.run = function() {
    this.stopEmulator = 0;
    this.executeIteration();
};

GameBoyCore.prototype.executeIteration = function() {
    while (this.stopEmulator == 0) {
        this.instructions += 1;
        this.iterationEndRoutine();
    }
};

GameBoyCore.prototype.iterationEndRoutine = function() {
    this.stopEmulator |= 1;
};

var settings = [];

function start() {
    gameboy = new GameBoyCore;
    gameboy.start();
}

runGameboy();