// Type definitions for solid-particles
// Project: https://github.com/matteobruni/tsparticles
// Definitions by: Matteo Bruni <https://github.com/matteobruni>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="solid-js" />
import type { Container, ISourceOptions, Main } from "tsparticles";
import type { JSX } from "solid-js";

export interface IParticlesProps {
	id?: string;
	width?: string;
	height?: string;
	options?: ISourceOptions;
	url?: string;
	params?: ISourceOptions;
	style?: JSX.CSSProperties;
	className?: string;
	canvasClassName?: string;
	container?: { current: Container; };
	init?: (tsParticles: Main) => void;
	loaded?: (container: Container) => void;
}

export interface IParticlesState {
	containerId?: string;
}

export type IParticlesParams = IParticlesProps;
export type ParticlesProps = IParticlesProps;

export * from "tsparticles";

type Particles = (props: IParticlesProps) => Element;

declare const Particles: Particles;

export default Particles;