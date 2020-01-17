import { IsekaiRobot } from "../IsekaiRobot";
import { BaseProtocol } from "../protocols/BaseProtocol";
import { BaseMessage } from "../message/BaseMessage";
import { BaseUser } from "./BaseUser";

export class BaseGroup {
    private bot: IsekaiRobot;
    private protocol: BaseProtocol;

    /** 群号 */
    public gid: number;
    /** 群名 */
    public name: string = '未知';
    /** 管理员列表 */
    public adminList: BaseUser[] = [];

    constructor(bot: IsekaiRobot, protocol: BaseProtocol, gid: number, info: any[]){
        this.bot = bot;
        this.protocol = protocol;
        this.gid = gid;
        this.initInfo(info);
    }

    initInfo(info: any){
        if('name' in info){
            this.name = info.name;
        }
        if('adminList' in info){
            this.adminList = info.adminList;
        }
    }

    public send(message: BaseMessage){
        return this.protocol.sendGroupMessage(this, message);
    }
}