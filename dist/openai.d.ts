interface OpenAIOptions {
    apiKey: string;
    model: string;
    basePath: string;
    systemMessage: string;
}
interface ITranslateOptions {
    maxTokens: number;
}
declare class ChatGptTranslator {
    private readonly _options;
    private _openAiClient;
    constructor(_options: OpenAIOptions);
    private _getOpenAiClient;
    translate(text: string, srcLocale: string, targetLocale: string, options: ITranslateOptions): Promise<string>;
    usage(): Promise<{
        count: number;
        limit: number;
    }>;
}
declare const createTranslateClient: ({ apiKey, model, basePath, systemMessage }: OpenAIOptions) => ChatGptTranslator;
export { createTranslateClient };
