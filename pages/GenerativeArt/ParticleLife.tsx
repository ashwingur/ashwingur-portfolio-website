import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { P5CanvasInstance, P5WrapperProps, Sketch } from "@p5-wrapper/react";
import BasicNavbar from "../../components/BasicNavbar";
import p5 from "p5";
import { useEffect, useState } from "react";

const makeRandomMatrix = (numColours: number) => {
  const rows = [];
  for (let i = 0; i < numColours; i++) {
    const row = [];
    for (let j = 0; j < numColours; j++) {
      row.push(Math.random() * 2 - 1);
    }
    rows.push(row);
  }
  return rows;
  // return [
  //   [1, 0, 0, 0, 0, 0],
  //   [0, 1, 0.5, 0, 0, 0],
  //   [0, 0, 1, 0.5, 0, 0],
  //   [0, 0, 0, 1, 0.5, 0],
  //   [0, 0, 0, 0, 1, 0.5],
  //   [0.5, 0, 0, 0, 0, 1],
  // ];
};

const force = (r: number, a: number) => {
  const beta = 0.3;
  if (r < beta) {
    return r / beta - 1;
  } else if (beta < r && r < 1) {
    return a * (1 - Math.abs(2 * r - 1 - beta) / (1 - beta));
  } else {
    return 0;
  }
};

const ParticleLife = () => {
  let width = 1000;
  let height = 1000;
  const [n, setN] = useState(800);
  const fps = 60;
  const dt = 1 / fps;
  const [numColours, setNumColours] = useState(6);
  // Attraction matrix
  const [matrix, setMatrix] = useState(makeRandomMatrix(numColours));
  // Maximum attraction distance (0-1)
  const [rMax, setRMax] = useState(0.2);
  const [forceFactor, setForceFactor] = useState(4);
  const [frictionHalfLife, setFrictionHalfLife] = useState(0.04);
  const frictionFactor = Math.pow(0.5, dt / frictionHalfLife);
  const [particleSize, setParticleSize] = useState(5);
  const [trails, setTrails] = useState(0);
  const [blur, setBlur] = useState(0);
  const [light, setLight] = useState(50);

  const [colours, setColours] = useState(new Int32Array(n));
  const [positionsX, setPositionsX] = useState(new Float32Array(n));
  const [positionsY, setPositionsY] = useState(new Float32Array(n));
  const [velocitiesX, setVelocitiesX] = useState(new Float32Array(n));
  const [velocitiesY, setVelocitiesY] = useState(new Float32Array(n));

  const nChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setN(parseFloat(event.target.value));
  };
  const rMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRMax(parseFloat(event.target.value));
  };
  const forceFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForceFactor(parseFloat(event.target.value));
  };
  const frictionHalfLifeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFrictionHalfLife(parseFloat(event.target.value));
  };
  const particleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParticleSize(parseInt(event.target.value));
  };
  const numColoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumColours(parseInt(event.target.value));
    setMatrix(makeRandomMatrix(parseInt(event.target.value)));
  };
  const trailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrails(parseFloat(event.target.value));
  };
  const blurChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlur(parseInt(event.target.value));
  };
  const lightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLight(parseInt(event.target.value));
  };

  useEffect(() => {
    // I NEED TO PROPERLY UPDATE THE STATE, THIS SHOULD BE FIXED EVEN THOUGHT IT WORKS
    for (let i = 0; i < n; i++) {
      colours[i] = Math.floor(Math.random() * numColours);
      positionsX[i] = Math.random();
      positionsY[i] = Math.random();
      velocitiesX[i] = 0;
      velocitiesY[i] = 0;
    }
  }, [
    n,
    colours,
    positionsX,
    positionsY,
    velocitiesX,
    velocitiesY,
    numColours,
  ]);

  const updateParticles = () => {
    // update velocities
    for (let i = 0; i < n; i++) {
      let totalForceX = 0;
      let totalForceY = 0;

      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        let rx = positionsX[j] - positionsX[i];
        let ry = positionsY[j] - positionsY[i];

        // Adjust for wrapping around the canvas
        if (Math.abs(rx) > 0.5) {
          rx -= Math.sign(rx);
        }
        if (Math.abs(ry) > 0.5) {
          ry -= Math.sign(ry);
        }

        const r = Math.hypot(rx, ry);
        if (r > 0 && r < rMax) {
          const f = force(r / rMax, matrix[colours[i]][colours[j]]);
          totalForceX += (rx / r) * f;
          totalForceY += (ry / r) * f;
        }
      }

      totalForceX *= rMax * forceFactor;
      totalForceY *= rMax * forceFactor;

      velocitiesX[i] *= frictionFactor;
      velocitiesY[i] *= frictionFactor;

      velocitiesX[i] += totalForceX * dt;
      velocitiesY[i] += totalForceY * dt;
    }

    // update positions
    for (let i = 0; i < n; i++) {
      positionsX[i] += velocitiesX[i] * dt;
      positionsY[i] += velocitiesY[i] * dt;

      // Wrap around the canvas if they go out of it
      if (positionsX[i] <= 0) {
        positionsX[i] = 1;
      } else if (positionsX[i] >= 1) {
        positionsX[i] = 0;
      }
      if (positionsY[i] <= 0) {
        positionsY[i] = 1;
      } else if (positionsY[i] >= 1) {
        positionsY[i] = 0;
      }
    }
  };

  const sketch: Sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      width = Math.min(width, p5.windowWidth - 10);
      height = width; // We want a square so there's no distortion

      p5.createCanvas(width, height);

      p5.noStroke();
      p5.colorMode(p5.HSL);
      p5.frameRate(fps);
    };

    p5.draw = () => {
      p5.background(0, 1 - trails);

      updateParticles();
      if (blur > 0) {
        p5.filter(p5.BLUR, blur);
      }

      for (let i = 0; i < n; i++) {
        const screenX = positionsX[i] * width;
        const screenY = positionsY[i] * height;
        p5.fill((360 * colours[i]) / numColours, 100, light);
        p5.circle(screenX, screenY, particleSize);
      }
    };
  };

  return (
    <div>
      <BasicNavbar absolute={true} />
      <h1 className="text-center pt-20">Particle Life</h1>
      <div className="flex flex-col items-center justify-center">
        <button
          className="text-center p-2 bg-blue-600 text-white rounded-md my-4"
          onClick={() => {
            setMatrix(makeRandomMatrix(numColours));
          }}
        >
          Random Matrix
        </button>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-center gap-4">
          <div>
            <div>Max F distance: {rMax}</div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={rMax}
              onChange={rMaxChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Particles: {n}</div>
            <input
              type="range"
              min={10}
              max={2000}
              step={10}
              value={n}
              onChange={nChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Colours: {numColours}</div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={numColours}
              onChange={numColoursChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Force Factor: {forceFactor}</div>
            <input
              type="range"
              min={0.1}
              max={20}
              step={0.1}
              value={forceFactor}
              onChange={forceFactorChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Friction Half-life: {frictionHalfLife}</div>
            <input
              type="range"
              min={0.01}
              max={1}
              step={0.01}
              value={frictionHalfLife}
              onChange={frictionHalfLifeChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Particle Size: {particleSize}</div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={particleSize}
              onChange={particleSizeChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Trails: {trails}</div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={trails}
              onChange={trailsChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Blur [Requires Trails]: {blur}</div>
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={blur}
              onChange={blurChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
          <div>
            <div>Light : {light}</div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={light}
              onChange={lightChange}
              className="appearance-none w-40 h-2 bg-black rounded-md outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center my-8">
        <NextReactP5Wrapper sketch={sketch} />
      </div>
    </div>
  );
};

export default ParticleLife;
