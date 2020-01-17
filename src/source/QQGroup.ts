import { IsekaiRobot } from '../IsekaiRobot';
import { QQProtocol } from '../protocols/QQProtocol';
import { BaseGroup } from './BaseGroup';

export class QQGroup extends BaseGroup {
    constructor(bot: IsekaiRobot, protocol: QQProtocol, gid: number, info: any[]){
        super(bot, protocol, gid, info);
    }
}