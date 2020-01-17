import WebSocket from 'ws';

import { IsekaiRobot } from '../IsekaiRobot';
import { Logger } from '../Logger';
import { Utils } from '../util/Utils';
import { BaseProtocol } from './BaseProtocol';

import { ParamError } from '../error/ParamError';
import { PermissionError } from '../error/PermissionError';

import { QQMessage } from '../message/QQMessage';
import { BaseGroup } from '../source/BaseGroup';
import { BaseUser } from '../source/BaseUser';
import { BaseMessage } from '../message/BaseMessage';
import { QQGroup } from '../source/QQGroup';
import { QQUser } from '../source/QQUser';

export class QQProtocol extends BaseProtocol {
    /** 协议的id */
    public protocolId = 1;

    /**
     * 回调列表
     */
    private callback: {
        onMessage: CallableFunction[];
    } = {
        onMessage: []
    };

    private bot: IsekaiRobot;
    private logger: Logger;

    private serverUrl: string;
    private apiRequestTimeout: number = 10000;
    private reconnectTimeout: number = 10000;

    public uid: number = 0;
    public nickname: string = '';

    private onClosing: boolean = false;
    private wsApiClient!: WebSocket;
    private wsEventClient!: WebSocket;
    private jobId: NodeJS.Timeout | null = null;
    private initPromise: Promise<void>;
    private initCallback: { success: CallableFunction, error: CallableFunction } = { success: () => {}, error: () => {} };

    private apiRequestCallback: { [index: string]: {
        success: CallableFunction,
        error: CallableFunction,
        time: number,
    }} = {};

    constructor(bot: IsekaiRobot, url: string = 'ws://localhost:6700', options: any = {}){
        super();
        this.bot = bot;
        this.serverUrl = url;
        this.initOptions(options);

        this.logger = bot.getLogger('QQ: ' + url.replace(/^ws:\/\//, ''));

        this.initPromise = new Promise((resolve, reject) => {
            this.initCallback = {
                success: resolve,
                error: reject,
            };
        });

        this.jobId = setInterval(this.job.bind(this), 1000);

        Promise.all([
            this.startApiClient(),
            this.startEventClient(),
        ]).then(() => {
            this.initCallback.success()
        }).catch((error) => {
            this.initCallback.error(error);
        });
    }

    private initOptions(options: any){
        if('apiRequestTimeout' in options){
            this.apiRequestTimeout = options.apiRequestTimeout;
        }
        if('reconnectTimeout' in options){
            this.reconnectTimeout = options.reconnectTimeout;
        }
    }

    public initialize(): Promise<void> {
        return this.initPromise;
    }

    private startApiClient(): Promise<void> {
        this.wsApiClient = new WebSocket(this.serverUrl + '/api');
        this.wsApiClient.on('message', (data: string) => {
            data = data.toString();
            let parsedData = JSON.parse(data);
            if(parsedData){
                this.onApiReturn(parsedData);
            }
        });

        this.wsApiClient.on('error', (err) => {
            this.logger.error('Api接口出错：' + err.message);
            this.logger.error(err.stack || '');
        });

        this.wsApiClient.on('close', () => {
            if(!this.onClosing){
                this.logger.info('正在重连Api接口……');
                setTimeout(this.startApiClient.bind(this), this.reconnectTimeout);
            }
        });

        return new Promise((resolve, reject) => {
            this.wsApiClient.on('open', () => {
                this.logger.info('已连接到Api接口');
                this.initUserInfo().then(reject);
                resolve();
            });
        });
    }

    private startEventClient(): Promise<void> {
        this.wsEventClient = new WebSocket(this.serverUrl + '/event');
        this.wsEventClient.on('message', (data: string) => {
            data = data.toString();
            let parsedData = JSON.parse(data);
            if(parsedData){
                this.onEventReceived(parsedData);
            }
        });

        this.wsEventClient.on('error', (err) => {
            this.logger.error('Event接口出错：' + err.message);
            this.logger.error(err.stack || '');
        });

        this.wsEventClient.on('close', () => {
            if(!this.onClosing){
                this.logger.info('正在重连Event接口……');
                setTimeout(this.startEventClient.bind(this), this.reconnectTimeout);
            }
        });

        return new Promise((resolve, reject) => {
            this.wsApiClient.on('open', () => {
                this.logger.info('已连接到Event接口');
                resolve();
            });
        });
    }

    private async initUserInfo(): Promise<void> {
        try {
            let userInfo = await this.getLoginInfo();
            if(userInfo){
                this.uid = userInfo.uid;
                this.nickname = userInfo.nickname;
                this.logger = this.bot.getLogger('QQ: ' + this.nickname);
                this.logger.info('当前登录用户：' + this.uid);
            }
        } catch(err){
            this.logger.error(err);
        }
    }

    private onApiReturn(data: any): void {
        if(!('echo' in data)) return;
        let rid = data.echo.toString();
        if(rid in this.apiRequestCallback){
            let callback = this.apiRequestCallback[rid];
            switch(data.retcode){
                case 0:
                    callback.success(data.data);
                    break;
                case 1:
                    callback.success();
                    break;
                case 100:
                    callback.error(new ParamError('参数缺失或参数无效'));
                    break;
                case 102:
                    callback.error(new PermissionError('酷Q函数返回的数据无效，一般是因为传入参数有效但没有权限，比如试图获取没有加入的群组的成员列表'));
                    break;
                case 103:
                    callback.error(new PermissionError('操作失败，一般是因为用户权限不足，或文件系统异常、不符合预期'));
                    break;
                case 104:
                    callback.error(new PermissionError('由于酷Q提供的凭证（Cookie 和 CSRF Token）失效导致请求QQ相关接口失败，可尝试清除酷Q缓存来解决'));
                    break;
                case 201:
                    callback.error(new Error('工作线程池未正确初始化（无法执行异步任务）'));
                    break;
                default:
                    callback.error(new Error('返回的数据错误'));
                    break;
            }
            
            delete this.apiRequestCallback[rid];
        }
    }

    /**
     * 接收到事件的处理
     * @param message 收到的信息
     */
    private onEventReceived(message: any): void {
        console.log(message);
        if(!('post_type' in message)) return;
        switch(message.post_type){
            case 'message':
                if(!('message_type' in message)) return;
                switch(message.message_type){
                    case 'private':
                        this.onPrivateMessage(message);
                        break;
                    case 'group':
                        this.onGroupMessage(message);
                        break;
                }
                break;
        }
    }

    /**
     * 进行api操作
     * @param action 操作类型
     * @param params 参数
     */
    public doApiRequest(action: string, params: any = {}): Promise<any> {
        let rid = Utils.randomString(16);
        return new Promise((resolve, reject) => {
            this.apiRequestCallback[rid] = { success: resolve, error: reject, time: Utils.getTimeStamp() };
            params.echo = rid;
            let data = JSON.stringify({
                action: action,
                params: params,
                echo: rid,
            });
            this.wsApiClient.send(data);
        });
    }

    /**
     * 获取当前机器人账号信息
     */
    public async getLoginInfo(): Promise<{uid: number, nickname: string} | null> {
        try {
            let data = await this.doApiRequest('get_login_info');
            return {
                uid: data.user_id,
                nickname: data.nickname,
            }
        } catch(err){
            this.logger.error(err);
        } 
        return null;
    }

    /**
     * 发送私聊消息
     * @param user 用户
     * @param msg 消息
     */
    public async sendMessage(user: QQUser, msg: BaseMessage): Promise<void> {
        let uid = user.uid;
        let textMsg = msg.toString();

        try {
            await this.doApiRequest('send_private_msg', {
                user_id: uid,
                message: textMsg,
            });
        } catch(err){
            this.logger.error(err);
        }
    }

    /**
     * 发送群消息
     * @param group 群
     * @param msg 消息
     */
    public async sendGroupMessage(group: QQGroup, msg: QQMessage): Promise<void> {
        let gid = group.gid;
        let textMsg = msg.toString();

        try {
            await this.doApiRequest('send_group_msg', {
                group_id: gid,
                message: textMsg,
            });
        } catch(err){
            this.logger.error(err);
        }
    }

    private onPrivateMessage(message: any): void {
        this.logger.info('收到私聊消息：' + message.sender.user_id + ' => ' + message.message);
    }

    private onGroupMessage(message: any): void {
        this.logger.info('收到群消息：' + message.sender.user_id + ' => ' + message.message);
        //判断是否是指令
        let puredMessage = message.replace(/\[CQ:.*?\]/g, '').trim();
        
    }

    private job(){
        let time = Utils.getTimeStamp();
        // 清理过期请求回调
        for(let key in this.apiRequestCallback){
            let one = this.apiRequestCallback[key];
            if(time - one.time > this.apiRequestTimeout){
                this.apiRequestCallback[key].error(new Error('Request timeout.'));
                delete this.apiRequestCallback[key];
            }
        }
    }
}