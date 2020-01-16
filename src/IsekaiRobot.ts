import { QQProtocol } from './protocols/QQProtocol';
import { BaseProtocol } from './protocols/BaseProtocol';
import * as winston from 'winston';
import { Format } from 'logform';
import { Logger } from './Logger';

export class IsekaiRobot {
    config: any;
    protocolList: BaseProtocol[] = [];
    logger: winston.Logger = winston.createLogger();

    constructor(config: any){
        this.config = config;

        // 初始化log
        if('log' in config){
            let logConf = config.log;
            if('base' in logConf){
                if('error' in logConf){
                    this.initLogger(logConf.base, logConf.error);
                } else {
                    this.initLogger(logConf.base);
                }
            } else {
                this.initLogger();
            }
        } else {
            this.initLogger();
        }

        this.logger.info('正在加载机器人……');

        // 异步初始化
        this.initialize();
    }

    private async initialize(): Promise<void> {
        // 初始化协议接口
        if('protocol' in this.config){
            await this.initProtocol(this.config.protocol);
        }
        this.logger.info('机器人加载完成……');
    }

    private initLogger(robotLog: string = 'robot.log', errorLog: string = 'error.log'): void {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: robotLog }),
                new winston.transports.File({ filename: errorLog, level: 'error' }),
            ]
        });

        let formats: Format[]  = [
            winston.format.colorize(),
        ];

        let customFormat = winston.format.printf(({ level, message, label }) => {
            let timestamp = (new Date).toLocaleString();
            return `\x1b[36m${timestamp}\x1b[0m \x1b[93m${label}\x1b[0m - ${level}: ${message}`;
        });

        formats.push(winston.format.label({label: 'main'}));
        formats.push(winston.format.timestamp());
        formats.push(winston.format.splat());
        formats.push(winston.format.simple());
        formats.push(customFormat);

        this.logger.add(new winston.transports.Console({
            format: winston.format.combine.apply(null, formats)
        }));
    }

    private async initProtocol(config: any[]): Promise<void> {
        for(let i = 0; i < config.length; i ++){
            let one = config[i];
            if('type' in one){
                let type = <string>(one.type);
                type = type.toLowerCase();
                switch(type){
                    case 'qq':
                        if('url' in one){
                            let protocol = new QQProtocol(this, one.url, one);
                            await protocol.initialize();
                            this.protocolList.push(protocol);
                        }
                        break;
                    case 'telegram':
                        break;
                    case 'discord':
                        break;
                }
            }
        }
    }

    public getLogger(prefix: string = ''): Logger {
        return new Logger(this, this.logger, prefix);
    }
}