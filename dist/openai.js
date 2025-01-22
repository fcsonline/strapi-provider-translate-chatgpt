"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTranslateClient = void 0;
const openai_1 = require("openai");
class ChatGptTranslator {
    _options;
    _openAiClient = null;
    constructor(_options) {
        this._options = _options;
    }
    _getOpenAiClient() {
        if (!this._openAiClient) {
            const configuration = new openai_1.Configuration(this._options);
            this._openAiClient = new openai_1.OpenAIApi(configuration);
        }
        return this._openAiClient;
    }
    async translate(text, srcLocale, targetLocale, options) {
        try {
            const prompt = `Translate this from ${srcLocale} in to ${targetLocale}:\n\n${text}`;
            const { data: { choices }, } = await this._getOpenAiClient().createChatCompletion({
                model: this._options.model,
                messages: [
                    { role: "system", content: this._options.systemMessage },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: options.maxTokens,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            });
            if (choices[0]) {
                return String(choices[0]?.message?.content).trim();
            }
            throw new Error('No result received');
        }
        catch (error) {
            // @ts-ignore
            const status = error?.response?.status;
            switch (status) {
                case 429:
                    throw new Error('Too many requests');
                case 400:
                    throw new Error('Bad request');
                default:
                    throw new Error(`translate(): ${JSON.stringify(error)}`);
            }
        }
    }
    async usage() {
        return {
            count: 1,
            limit: 10,
        };
    }
}
const createTranslateClient = ({ apiKey, model, basePath, systemMessage }) => {
    // TODO basePath.replace(/\/+$/, ""); remove last slash
    return new ChatGptTranslator({ apiKey, model, basePath, systemMessage });
};
exports.createTranslateClient = createTranslateClient;
