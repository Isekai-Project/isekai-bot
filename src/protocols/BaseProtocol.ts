import { BaseMessage } from '../message/BaseMessage';
import { BaseGroup } from '../source/BaseGroup';
import { BaseUser } from '../source/BaseUser';

export class BaseProtocol {
    /**
     * 发送私聊消息
     * @param user 用户
     * @param msg 消息
     */
    public sendMessage(user: BaseUser, msg: BaseMessage): void {
        
    }

    /**
     * 发送群消息
     * @param group 群
     * @param msg 消息
     */
    public sendGroupMessage(group: BaseGroup, msg: BaseMessage): void {
        
    }
}