import {IsekaiRobot} from './IsekaiRobot';
import * as winston from 'winston';
import { Format } from 'logform';

export class Logger {
    private bot: IsekaiRobot;
    private mainLogger: winston.Logger;
    private channel: string

    constructor(bot: IsekaiRobot, mainLogger: winston.Logger, channel: string){
        this.bot = bot;
        this.mainLogger = mainLogger;
        this.channel = channel;
    }

    public getMainLogger(){
        return this.mainLogger;
    }

    public info(message: string): void;
    public info(prefix: string, message: string): void;
    public info(arg1:string, arg2?:string) {
        let meta = this.channel;
        let message = '';
        if(arg2){
            meta += ' ' + arg1;
            message = arg2;
        } else {
            message = arg1
        }
        this.mainLogger.info(message, { label: meta });
    }

    public debug(message: string): void;
    public debug(prefix: string, message: string): void;
    public debug(arg1:string, arg2?:string) {
        let meta = this.channel;
        let message = '';
        if(arg2){
            meta += ' ' + arg1;
            message = arg2;
        } else {
            message = arg1
        }
        this.mainLogger.debug(message, { label: meta });
    }

    public error(message: string): void;
    public error(prefix: string, message: string): void;
    public error(message: Error): void;
    public error(prefix: string, message: Error): void;
    public error(arg1:any, arg2?:any) {
        let meta = this.channel;
        let message: any;
        if(arg2){
            meta += ' ' + arg1;
            
            message = arg2;
        } else {
            message = arg1
        }
        this.mainLogger.error(message, { label: meta });
    }

    public warning(message: string): void;
    public warning(prefix: string, message: string): void;
    public warning(arg1:string, arg2?:string) {
        let meta = this.channel;
        let message = '';
        if(arg2){
            meta += ' ' + arg1;
            message = arg2;
        } else {
            message = arg1
        }
        this.mainLogger.warn(message, { label: meta });
    }
}