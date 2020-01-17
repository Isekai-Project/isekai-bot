import { IsekaiRobot } from './IsekaiRobot';

let config = {
    log: {
        base: 'log/robot.log',
        error: 'log/error.log',
    },
    protocol: [{
        type: 'qq',
        url: 'ws://192.168.0.14:6700',
    }],
    db: 'mysql://root:root@localhost:3306/isekai_bot'
};

let bot = new IsekaiRobot(config);