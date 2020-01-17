import { IsekaiRobot } from "./IsekaiRobot";

/**
 * 读取controller
 */
export class ControllerLoader {
    private bot: IsekaiRobot;
    private controllerPath: string;

    constructor(bot: IsekaiRobot, controllerPath: string){
        this.bot = bot;
        this.controllerPath = controllerPath;
    }

    
}