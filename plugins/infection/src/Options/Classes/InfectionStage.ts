import type { IInfectionStage } from "../Interfaces/IInfectionStage";
import { OptionsColor } from "tsparticles-core/Options/Classes/OptionsColor";
import type { RecursivePartial } from "tsparticles-core";
import type { IOptionLoader } from "tsparticles-core/Options/Interfaces/IOptionLoader";

/**
 * @category Options
 */
export class InfectionStage implements IInfectionStage, IOptionLoader<IInfectionStage> {
    public color;
    public duration?: number;
    public infectedStage?: number;
    public radius;
    public rate;

    constructor() {
        this.color = new OptionsColor();
        this.color.value = "#ff0000";
        this.radius = 0;
        this.rate = 1;
    }

    public load(data?: RecursivePartial<IInfectionStage>): void {
        if (data === undefined) {
            return;
        }

        if (data.color !== undefined) {
            this.color = OptionsColor.create(this.color, data.color);
        }

        this.duration = data.duration;
        this.infectedStage = data.infectedStage;

        if (data.radius !== undefined) {
            this.radius = data.radius;
        }

        if (data.rate !== undefined) {
            this.rate = data.rate;
        }
    }
}
