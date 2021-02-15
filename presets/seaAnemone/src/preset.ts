import type { ISourceOptions, Main } from "tsparticles-core";
import { loadParticlesMoveInteraction } from "tsparticles-interaction-particles-move";
import { loadEmittersPlugin } from "tsparticles-plugin-emitters";
import { loadCircleShape } from "tsparticles-shape-circle";
import { loadSizeUpdater } from "tsparticles-updater-size";
import { seaNoiseGenerator } from "./noiseGen";

export function loadSeaAnemonePreset(tsParticles: Main): void {
    loadParticlesMoveInteraction(tsParticles);
    loadEmittersPlugin(tsParticles);
    loadCircleShape(tsParticles);
    loadSizeUpdater(tsParticles);

    const presetName = "seaAnemone";
    const noiseGeneratorName = `${presetName}Noise`;
    const options = ({
        fullScreen: {
            enable: true,
        },
        fpsLimit: 60,
        interactivity: {
            detectsOn: "canvas",
            events: {
                resize: true,
            },
        },
        particles: {
            color: {
                value: "#FF0000",
            },
            move: {
                attract: {
                    enable: false,
                    distance: 100,
                    rotate: {
                        x: 2000,
                        y: 2000,
                    },
                },
                direction: "none",
                enable: true,
                outModes: {
                    default: "destroy",
                },
                noise: {
                    clamp: false,
                    enable: true,
                    delay: {
                        value: 0,
                    },
                    generator: "seaAnemoneNoise",
                },
                random: false,
                speed: 2,
                straight: false,
                trail: {
                    fillColor: "#000",
                    length: 30,
                    enable: true,
                },
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 0,
                limit: 300,
            },
            opacity: {
                value: 1,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: 10,
                animation: {
                    count: 1,
                    startValue: "min",
                    enable: true,
                    minimumValue: 1,
                    speed: 10,
                    sync: true,
                },
            },
        },
        background: {
            color: "#000",
        },
        detectRetina: true,
        emitters: {
            direction: "none",
            rate: {
                quantity: 10,
                delay: 0.3,
            },
            size: {
                width: 0,
                height: 0,
                mode: "precise",
            },
            spawnColor: {
                value: "#ff0000",
                animation: {
                    h: {
                        enable: true,
                        offset: {
                            min: -1.4,
                            max: 1.4,
                        },
                        speed: 5,
                        sync: false,
                    },
                    l: {
                        enable: true,
                        offset: {
                            min: 20,
                            max: 80,
                        },
                        speed: 0,
                        sync: false,
                    },
                },
            },
            position: {
                x: 50,
                y: 50,
            },
        },
    } as unknown) as ISourceOptions;

    tsParticles.addPreset(presetName, options);
    tsParticles.addNoiseGenerator(noiseGeneratorName, seaNoiseGenerator);
}
