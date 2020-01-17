import { BaseSyntax } from "./BaseSyntax";
import { BaseProtocol } from "../protocols/BaseProtocol";
import { QQProtocol } from "../protocols/QQProtocol";
import { TextSyntax } from "./TextSyntax";
import { QQMentionSyntax } from "./qq/QQMentionSyntax";

export class MentionSyntax extends BaseSyntax {
    public target?: number;

    constructor(protocol: BaseProtocol, target?: number){
        super(protocol);
        this.target = target;
    }

    public fromString(code: string): boolean {
        return false;
    }

    public toString(): string {
        if(this.target){
            return ' @ ' + this.target.toString();
        } else {
            return '';
        }
    }

    public toShortString(): string {
        return this.toString();
    }

    public toProtocol(protocol: BaseProtocol): BaseSyntax {
        if(protocol instanceof QQProtocol){
            return new QQMentionSyntax(protocol, this.target);
        } else {
            return new TextSyntax(protocol, this.toShortString());
        }
    }
}