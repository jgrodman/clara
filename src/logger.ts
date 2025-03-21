import winston from 'winston';
import path from 'path';

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Write all logs to a file
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join('logs', 'combined.log')
        })
    ]
});

export const stream = {
    write: (message: string) => {
        logger.info(message.trim());
    }
};

export default logger; 