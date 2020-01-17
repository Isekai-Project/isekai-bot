import { BaseSyntax } from "./BaseSyntax";
import { BaseProtocol } from "../protocols/BaseProtocol";

export class TextSyntax extends BaseSyntax {
    public text: string;

    constructor(protocol: BaseProtocol, text: string = ''){
        super(protocol);
        this.text = text;
    }

    public from(syntax: BaseSyntax){
        this.text = syntax.toShortString();
    }

    public fromString(text: string): void {
        this.text = text;
    }

    public toString(): string {
        return this.text;
    }

    public toShortString(): string {
        return this.text;
    }

    public toBase(): BaseSyntax {
        return this;
    }

    public toProtocol(protocol: BaseProtocol): BaseSyntax {
        return this;
    }
}