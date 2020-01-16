import { IsekaiRobot } from './IsekaiRobot';

let config = {
    log: {
        base: 'log/robot.log',
        error: 'log/error.log',
    },
    protocol: [{
        type: 'qq',
        url: 'ws://192.168.0.14:6700',
    }]
};

let bot = new IsekaiRobot(config);