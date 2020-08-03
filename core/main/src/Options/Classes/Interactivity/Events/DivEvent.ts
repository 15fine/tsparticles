import type { IDivEvent } from "../../../Interfaces/Interactivity/Events/IDivEvent";
import { DivMode, DivType } from "../../../../Enums";
import type { RecursivePartial, SingleOrMultiple } from "../../../../Types";
import type { IOptionLoader } from "../../../Interfaces/IOptionLoader";

export class DivEvent implements IDivEvent, IOptionLoader<IDivEvent> {
    /**
     * The element id to detect the event
     * @deprecated this property is obsolete, please use the new selectors
     */
    get elementId(): SingleOrMultiple<string> {
        return this.ids;
    }

    /**
     * The element id to detect the event
     * @deprecated this property is obsolete, please use the new selectors
     * @param value
     */
    set elementId(value: SingleOrMultiple<string>) {
        this.ids = value;
    }

    /**
     * The element id to detect the event
     * @deprecated this property is obsolete, please use the new selectors
     */
    public get el(): SingleOrMultiple<string> {
        return this.elementId;
    }

    /**
     * The element id to detect the event
     * @deprecated this property is obsolete, please use the new selectors
     * @param value
     */
    public set el(value: SingleOrMultiple<string>) {
        this.elementId = value;
    }

    /**
     * The element id to detect the event
     * @deprecated this property is obsolete, please use the new ids
     */
    get ids(): SingleOrMultiple<string> {
        if (this.selectors instanceof Array) {
            return this.selectors.map((t) => t.replace("#", ""));
        } else {
            return this.selectors.replace("#", "");
        }

        // this is the best we can do, if a non-id selector is used the old property won't work
        // but ids is deprecated so who cares.
    }

    /**
     * The element id to detect the event
     * @deprecated this property is obsolete, please use the new ids
     * @param value
     */
    set ids(value: SingleOrMultiple<string>) {
        if (value instanceof Array) {
            this.selectors = value.map((t) => `#${value}`);
        } else {
            this.selectors = `#${value}`;
        }
    }

    public selectors: SingleOrMultiple<string>;

    /**
     * The div event handler enabling mode
     */
    public enable: boolean;

    /**
     * Div mode values described in [[DivMode]], an array of these values is also valid.
     */
    public mode: SingleOrMultiple<DivMode | keyof typeof DivMode | string>;

    public type: DivType;

    constructor() {
        this.selectors = [];
        this.enable = false;
        this.mode = [];
        this.type = DivType.circle;
    }

    public load(data?: RecursivePartial<IDivEvent>): void {
        if (data === undefined) {
            return;
        }

        const ids = data.ids ?? data.elementId ?? data.el;

        if (ids !== undefined) {
            this.ids = ids;
        }

        if (data.selectors !== undefined) {
            this.selectors = data.selectors;
        }

        if (data.enable !== undefined) {
            this.enable = data.enable;
        }

        if (data.mode !== undefined) {
            this.mode = data.mode;
        }

        if (data.type !== undefined) {
            this.type = data.type;
        }
    }
}
