import { BaseController } from "./BaseController";
import { IsekaiRobot } from "../IsekaiRobot";
import { BaseUser } from "../source/BaseUser";
import { BaseGroup } from "../source/BaseGroup";
import { BaseMessage } from "../message/BaseMessage";
import { BaseProtocol } from "../protocols/BaseProtocol";
import { QQProtocol } from "../protocols/QQProtocol";
import { QQMessage } from "../message/QQMessage";
import { BaseSyntax } from "../syntax/BaseSyntax";

export class TestController extends BaseController {
    constructor(bot: IsekaiRobot){
        super(bot);

        this.command = [{
            name: '测试',
            description: '测试机器人是否运行正常',
            callback: this.test.bind(this),
            protocols: [QQProtocol],
        }]
    }

    public test(protocol: BaseProtocol, sender: BaseUser, group: BaseGroup | undefined, params: BaseSyntax[], rawMessage: BaseMessage){
        
    }
}