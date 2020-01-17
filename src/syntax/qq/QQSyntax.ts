import { BaseSyntax } from "../BaseSyntax";
import { BaseProtocol } from "../../protocols/BaseProtocol";
import { ValueTransformer } from "typeorm";
import { QQProtocol } from "../../protocols/QQProtocol";
import { TextSyntax } from "../TextSyntax";
import { QQTextSyntax } from "./QQTextSyntax";
import { QQMentionSyntax } from "./QQMentionSyntax";

export class QQSyntax extends BaseSyntax {
    private escapeList = [
        ['&', '&amp;'],
        ['[', '&#91;'],
        [']', '&#93;'],
        [',', '&#44;'],
    ];

    public type: string;
    public params: {
        [name: string]: string
    };

    constructor(protocol: QQProtocol, type: string = '', params: { [name: string]: string } = {}){
        super(protocol);

        this.type = type;
        this.params = params;
    }

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

    public static parseMessage(protocol: QQProtocol, message: string): BaseSyntax[] {
        let result: BaseSyntax[] = [];
        //开始解析文本
        let list = message.split(/((?=\[)|\])/g);
        for(let i = 0; i < list.length; i ++){
            let code = list[i];
            if(code === '' || code === ']') continue;
            if(code.startsWith('[CQ:')){ // 是CQ码
                code = code.replace(/(^\[CQ:|\]$)/g, '');
                let data = code.split(',');
                if(data.length > 0){
                    let type = data[0];
                    let syntax: QQSyntax;
                    switch(type){
                        case 'at':
                            syntax = new QQMentionSyntax(protocol);
                        default:
                            syntax = new QQSyntax(protocol);
                            break;
                    }
                    syntax.fromString(code);
                    result.push(syntax);
                } else {
                    let syntax = new QQSyntax(protocol);
                    syntax.fromString(code);
                    result.push(syntax);
                }
            } else { // 是文本
                result.push(new QQTextSyntax(protocol, code));
            }
        }

        return result;
    }

    public from(syntax: BaseSyntax): boolean {
        return this.fromString(syntax.toString());
    }

    public fromString(code: string): boolean {
        code = code.replace(/(^\[CQ:|\]$)/g, '');
        let data = code.split(',');
        if(data.length > 0){
            this.type = data[0];
            if(data.length > 1){ //存在参数
                for(let i = 1; i < data.length; i ++){
                    let temp = data[i].split('=');
                    let [key, value] = temp;
                    value = this.unescape(value);
                    this.params[key] = value;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    public toString(): string {
        let data = [this.type];
        for(let key in this.params){
            let value = this.params[key];
            data.push(key + '=' + this.escape(value));
        }
        return '[CQ:' + data.join(',') + ']';
    }

    public toShortString(): string {
        return '[QQ Syntax]';
    }

    public toBase(): BaseSyntax {
        return new TextSyntax(this.protocol, this.toShortString());
    }

    public toProtocol(protocol: BaseProtocol): BaseSyntax {
        if(!(protocol instanceof QQProtocol)){
            return this.toBase();
        } else {
            return this;
        }
    }
}