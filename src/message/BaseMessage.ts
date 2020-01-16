import { BaseGroup } from '../source/BaseGroup';
import { BaseUser } from '../source/BaseUser';
import { BaseSyntax } from '../syntax/BaseSyntax';

export class BaseMessage {
    /** 消息id */
    public messageId: number = -1;
    /** 原消息内容 */
    public message: Array<string | BaseSyntax> = [];
    /** 消息发送时间 */
    public time: number = 0;
    /** 提到的用户 */
    public mentionList: string[] = [];
    /** 发送目标 */
    public target: BaseUser | BaseGroup | null = null;

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