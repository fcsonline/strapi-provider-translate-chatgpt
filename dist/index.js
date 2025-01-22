"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.name = exports.index = void 0;
const openai_1 = require("./openai");
const getService_1 = require("./getService");
const parseLocale_1 = require("./parseLocale");
const bottleneck_1 = __importDefault(require("bottleneck"));
exports.index = 'chatgpt';
exports.name = 'ChatGPT';
class ProviderOptions {
    apiKey;
    model;
    systemMessage;
    basePath;
    localeMap;
    maxTokens;
    constructor({ apiKey, model, basePath, localeMap, maxTokens, systemMessage }) {
        if (!apiKey)
            throw new Error(`apiKey is not defined`);
        if (!model)
            throw new Error(`model is not defined`);
        if (!basePath)
            throw new Error(`basePath is not defined`);
        this.localeMap = localeMap || {};
        this.maxTokens = maxTokens || 1000;
        this.apiKey = apiKey;
        this.model = model;
        this.basePath = basePath;
        this.systemMessage = systemMessage || 'You are a professional translator.';
    }
}
const init = ({ apiKey, model, basePath, localeMap, maxTokens, systemMessage } = {}) => {
    const options = new ProviderOptions({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
        model: model || process.env.OPENAI_MODEL || 'text-davinci-003',
        basePath: basePath || process.env.OPENAI_BASE_PATH || 'https://api.openai.com/v1',
        maxTokens: Number(maxTokens) || Number(process.env.OPENAI_MAX_TOKENS) || 1000,
        localeMap,
        systemMessage: systemMessage || process.env.OPENAI_SYSTEM_MESSAGE || 'You are a professional translator.',
    });
    const client = (0, openai_1.createTranslateClient)(options);
    const limiter = new bottleneck_1.default({
        maxConcurrent: 1,
    });
    return {
        /**
         * @param {{
         *  text:string|string[],
         *  sourceLocale: string,
         *  targetLocale: string,
         *  priority: number,
         *  format?: 'plain'|'markdown'|'html'
         * }} options all translate options
         * @returns {string[]} the input text(s) translated
         */
        async translate({ text, priority, sourceLocale, targetLocale, format }) {
            if (!text) {
                return [];
            }
            if (!sourceLocale) {
                throw new Error('source locale must be defined');
            }
            if (!targetLocale) {
                throw new Error('target locale must be defined');
            }
            const formatService = (0, getService_1.getService)('format');
            let textArray = Array.isArray(text) ? text : [text];
            if (format === 'markdown') {
                textArray = formatService.markdownToHtml(textArray);
            }
            const sLocale = (0, parseLocale_1.parseLocale)(sourceLocale, options.localeMap, 'source');
            const tLocale = (0, parseLocale_1.parseLocale)(targetLocale, options.localeMap, 'target');
            const result = await Promise.all(textArray.map((t) => limiter.schedule(() => {
                return client.translate(t, sLocale, tLocale, { maxTokens: options.maxTokens });
            })));
            if (format === 'markdown') {
                return formatService.htmlToMarkdown(result);
            }
            return result;
        },
        async usage() {
            return client.usage();
        },
    };
};
exports.init = init;
