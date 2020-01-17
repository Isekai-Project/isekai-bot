import { BaseSyntax } from "../BaseSyntax";
import { BaseProtocol } from "../../protocols/BaseProtocol";
import { TextSyntax } from "../TextSyntax";
import { QQProtocol } from "../../protocols/QQProtocol";

export class QQTextSyntax extends TextSyntax {
    private escapeList = [
        ['&', '&amp;'],
        ['[', '&#91;'],
        [']', '&#93;'],
    ];

    private escape(str: string){
        this.escapeList.forEach((one) => {
            str = str.replace(new RegExp('/' + one[0] + '/', 'g'), one[1]);
        });
        return str;
    }

    private unescape(str: string){
        this.escapeList.forEach((one) => {
            str = str.replace(new RegExp('/' + one[1] + '/', 'g'), one[0]);
        });
        return str;
    }

    public fromString(text: string): void {
        // 解码特殊字符
        this.text = this.unescape(text);
    }

    public toString(): string {
        // CQ要求编码特殊字符
        return this.escape(this.text);
    }

    public toShortString(): string {
        return this.text;
    }

    public toBase(): TextSyntax {
        return new TextSyntax(this.protocol, this.text);
    }

    public toProtocol(protocol: BaseProtocol): BaseSyntax {
        if(!(protocol instanceof QQProtocol)){
            return this.toBase().toProtocol(protocol);
        } else {
            return this;
        }
    }
}