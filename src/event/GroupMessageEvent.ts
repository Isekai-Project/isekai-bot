import { IsekaiRobot } from '../IsekaiRobot';
import { BaseProtocol } from '../protocols/BaseProtocol';
import { BaseGroup } from '../source/BaseGroup';
import { BaseUser } from '../source/BaseUser';
import { BaseMessage } from '../message/BaseMessage';

export class GroupMessageEvent {
    /** 机器人 */
    private bot: IsekaiRobot;
    /** 协议对象 */
    private protocol: BaseProtocol;
    /** 群对象 */
    public group: BaseGroup;
    /** 发送者对象 */
    public sender: BaseUser;
    public message: BaseMessage;

    

    constructor(bot: IsekaiRobot, protocol: BaseProtocol, group: BaseGroup, sender: BaseUser, message: BaseMessage){
        this.bot = bot;
        this.protocol = protocol;
        this.group = group;
        this.sender = sender;
        this.message = message;
    }

    /**
     * 回复消息
     */
    public reply(message: string): void {

    }
}