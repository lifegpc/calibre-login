import { Component, ComponentChildren, ContextType } from "preact";
import { BCtx } from "./BContext.tsx";
import { useState } from "preact/hooks";
import type { _MdOutlinedTextField as _TextField } from "../server/md3.ts";
import { MdOutlinedTextField } from "../server/dmodule.ts";

interface TextType {
    text: string;
    password: string;
    number: number;
}

interface DataType {
    text: never;
    password: never;
    number: number;
}

type Props<T extends keyof TextType> = {
    /**@default {true} */
    clear_cache?: boolean;
    label?: string;
    description?: string;
    value?: TextType[T];
    name?: string;
    type: T;
    disabled?: boolean;
    children?: ComponentChildren;
    set_value?: (v?: TextType[T]) => void;
    min?: DataType[T];
    max?: DataType[T];
    id?: string;
    list?: string;
};

export default class BTextField<T extends keyof TextType>
    extends Component<Props<T>, unknown> {
    static contextType = BCtx;
    declare context: ContextType<typeof BCtx>;
    get clear_cache() {
        return this.props.clear_cache !== undefined
            ? this.props.clear_cache
            : true;
    }
    get_value(e: _TextField): TextType[T] | undefined {
        const type = this.props.type;
        if (!e.value.length) return undefined;
        // @ts-ignore Checked
        if (type === "text" || type === "password") return e.value;
        // @ts-ignore Checked
        return e.valueAsNumber;
    }
    render() {
        if (!MdOutlinedTextField.value) return null;
        let cn = "b-text-field text";
        if (this.props.label) cn += " label";
        const TextField = MdOutlinedTextField.value;
        let desc = null;
        if (this.props.description) {
            desc = <label>{this.props.description}</label>;
        }
        let value: string | undefined;
        if (this.props.value !== undefined) {
            if (typeof this.props.value === "string") {
                value = this.props.value;
            } else {
                value = this.props.value.toString();
            }
        } else if (this.clear_cache) {
            value = "";
        }
        return (
            <div class={cn} id={this.props.id}>
                {desc}
                <TextField
                    value={value}
                    type={this.props.type}
                    label={this.props.label}
                    disabled={this.props.disabled}
                    min={this.props.min ? this.props.min.toString() : undefined}
                    max={this.props.max ? this.props.max.toString() : undefined}
                    list={this.props.list}
                    /**@ts-ignore */
                    onInput={(ev: InputEvent) => {
                        if (ev.target) {
                            const e = ev.target as _TextField;
                            this.set_value(this.get_value(e));
                        }
                    }}
                />
                {this.props.children}
            </div>
        );
    }
    set_value(value?: TextType[T]) {
        if (this.props.set_value) {
            this.props.set_value(value);
        } else if (this.context) {
            this.context.set_value((v) => {
                v[this.props.name || ""] = value;
                return v;
            });
        }
    }
}
