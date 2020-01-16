import { BaseMessage } from './BaseMessage';

import { BaseGroup } from '../source/BaseGroup';
import { BaseUser } from '../source/BaseUser';
import { BaseSyntax } from '../syntax/BaseSyntax';

export class QQMessage extends BaseMessage {
    /** 解析收到的消息 */
    public fromString(msgData: string): void {

    }

    public toString(): string {
        let msgTextList = [];
        for(let i = 0; i < this.message.length; i ++){
            let one: string | BaseSyntax = this.message[i];
            if(typeof one === 'string'){
                msgTextList.push(one);
            } else {
                msgTextList.push(one.toString());
            }
        }
        return msgTextList.join('').trim();
    }

    /**
     * 获取纯文本的消息内容
     */
    public getTextMessage(): string {
        let msgTextList = [];
        for(let i = 0; i < this.message.length; i ++){
            if(typeof this.message[i] === 'string'){
                msgTextList.push(this.message[i]);
            }
        }
        return msgTextList.join('').trim();
    }
}