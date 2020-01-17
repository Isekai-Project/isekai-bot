import { QQProtocol } from "../../protocols/QQProtocol";
import { QQSyntax } from "./QQSyntax";
import { BaseSyntax } from "../BaseSyntax";
import { MentionSyntax } from "../MentionSyntax";
import { BaseProtocol } from "../../protocols/BaseProtocol";

export class QQMentionSyntax extends QQSyntax {
    public target?: number;

    constructor(protocol: QQProtocol, target?: number){
        if(target){
            super(protocol, 'at', { qq: target.toString() });
        } else {
            super(protocol, 'at', { qq: '' });
        }
        this.target = target;
    }

    public fromString(code: string): boolean {
        let success = super.fromString(code);
        if(success){
            if(this.type === 'at' && 'qq' in this.params){
                this.target = parseInt(this.params.qq);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public toString(): string {
        if(this.target){
            this.params.qq = this.target.toString();
            return super.toString();
        } else {
            return '';
        }
    }

    public toShortString(): string {
        return '[QQ Mention]';
    }

    public toBase(): BaseSyntax {
        return new MentionSyntax(this.protocol, this.target);
    }

    public toProtocol(protocol: BaseProtocol): BaseSyntax {
        if(!(protocol instanceof QQProtocol)){
            return this.toBase().toProtocol(protocol);
        } else {
            return this;
        }
    }
}