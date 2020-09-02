import type { IModes } from "../../../Interfaces/Interactivity/Modes/IModes";
import { Bubble } from "./Bubble";
import { Connect } from "./Connect";
import { Grab } from "./Grab";
import { Remove } from "./Remove";
import { Push } from "./Push";
import { Repulse } from "./Repulse";
import { Slow } from "./Slow";
import type { RecursivePartial } from "../../../../Types";
import { Trail } from "./Trail";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";
import { Attract } from "./Attract";
import { Light } from "./Light";

/**
 * [[include:Options/Interactivity/Modes.md]]
 * @category Options
 */
export class Modes implements IModes, IOptionLoader<IModes> {
    public attract;
    public bubble;
    public connect;
    public grab;
    public light;
    public push;
    public remove;
    public repulse;
    public slow;
    public trail;

    constructor() {
        this.attract = new Attract();
        this.bubble = new Bubble();
        this.connect = new Connect();
        this.grab = new Grab();
        this.light = new Light();
        this.push = new Push();
        this.remove = new Remove();
        this.repulse = new Repulse();
        this.slow = new Slow();
        this.trail = new Trail();
    }

    public load(data?: RecursivePartial<IModes>): void {
        if (data === undefined) {
            return;
        }

        this.attract.load(data.attract);
        this.bubble.load(data.bubble);
        this.connect.load(data.connect);
        this.grab.load(data.grab);
        this.light.load(data.light);
        this.push.load(data.push);
        this.remove.load(data.remove);
        this.repulse.load(data.repulse);
        this.slow.load(data.slow);
        this.trail.load(data.trail);
    }
}
