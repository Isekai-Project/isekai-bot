import { IsekaiRobot } from "../IsekaiRobot";
import { BaseProtocol } from "../protocols/BaseProtocol";

export class BaseUser {
    protected bot: IsekaiRobot;

    /** 用户id */
    public uid: number;
    /** 昵称 */
    public nickname: string;

    constructor(bot: IsekaiRobot, protocol: BaseProtocol, uid: number, nickname: string){
        this.bot = bot;
        this.uid = uid;
        this.nickname = nickname;
    }
}