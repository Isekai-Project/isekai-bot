import { BaseProtocol } from "../protocols/BaseProtocol";

/** 基础syntax */
export class BaseSyntax {
    protected protocol: BaseProtocol;

    constructor(protocol: BaseProtocol){
        this.protocol = protocol;
    }

    public from(syntax: BaseSyntax){

    }

    public fromString(code: string): void {

    }

    public toString(): string {
        return '[object BaseSyntax]';
    }

    public toShortString(): string {
        return '[Syntax]';
    }

    public toBase(): BaseSyntax {
        return this;
    }

    public toProtocol(protocol: BaseProtocol): BaseSyntax {
        return this;
    }
}