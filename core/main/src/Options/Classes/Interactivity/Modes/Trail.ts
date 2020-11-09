import type { ITrail } from "../../../Interfaces/Interactivity/Modes/ITrail";
import type { IParticles } from "../../../Interfaces/Particles/IParticles";
import type { RecursivePartial } from "../../../../Types";
import { Utils } from "../../../../Utils";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";

/**
 * @category Options
 */
export class Trail implements ITrail, IOptionLoader<ITrail> {
    public delay;
    public particles?: RecursivePartial<IParticles>;
    public quantity;
    public pauseOnStop;

    constructor() {
        this.delay = 1;
        this.quantity = 1;
        this.pauseOnStop = false;
    }

    public load(data?: RecursivePartial<ITrail>): void {
        if (data === undefined) {
            return;
        }

        if (data.delay !== undefined) {
            this.delay = data.delay;
        }

        if (data.quantity !== undefined) {
            this.quantity = data.quantity;
        }

        if (data.particles !== undefined) {
            this.particles = Utils.deepExtend({}, data.particles) as RecursivePartial<IParticles>;
        }

        if (data.pauseOnStop !== undefined) {
            this.pauseOnStop = data.pauseOnStop;
        }
    }
}
