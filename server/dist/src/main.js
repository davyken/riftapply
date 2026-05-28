"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const helmet_1 = __importDefault(require("helmet"));
const compression = require('compression');
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
    });
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.use((req, res, next) => {
        if (req.headers['content-type']?.includes('application/json')) {
        }
        next();
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin))
                return callback(null, true);
            callback(new Error(`CORS: origin ${origin} not allowed`));
        },
        credentials: true,
    });
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Server running on port ${port} [${process.env.NODE_ENV || 'development'}]`);
    const serverUrl = process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL || process.env.RAILWAY_STATIC_URL;
    if (serverUrl) {
        setInterval(() => {
            fetch(`${serverUrl}/api/health`)
                .then(() => console.log('Keep-alive ping successful'))
                .catch((err) => console.error('Keep-alive ping failed:', err.message));
        }, 5 * 60 * 1000);
    }
    else {
        setInterval(() => {
            fetch(`http://localhost:${port}/api/health`)
                .then(() => console.log('Local keep-alive ping successful'))
                .catch((err) => console.error('Local keep-alive ping failed:', err.message));
        }, 5 * 60 * 1000);
    }
}
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
bootstrap();
//# sourceMappingURL=main.js.map