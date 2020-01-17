import { IsekaiRobot } from "../IsekaiRobot";

export class BaseController {
    protected bot: IsekaiRobot;

    /** 注册指令 */
    public command: {
        name: string,
        alias?: string[],
        description?: string,
        help?: string,
        protocols?: any[],
        callback: CallableFunction,
    }[] = [];

    constructor(bot: IsekaiRobot){
        this.bot = bot;
    }
}