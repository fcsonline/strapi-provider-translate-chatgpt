export declare const index = "chatgpt";
export declare const name = "ChatGPT";
interface IProviderOptions {
    apiKey?: string;
    model?: string;
    systemMessage?: string;
    basePath?: string;
    localeMap?: object;
    maxTokens?: number;
}
interface ITranslate {
    text: string;
    priority?: number;
    sourceLocale: string;
    targetLocale: string;
    format: 'markdown' | 'plain' | 'html';
}
export interface IProvider {
    translate(options: ITranslate): Promise<string[]>;
    usage(): Promise<{
        count: number;
        limit: number;
    }>;
}
export declare const init: ({ apiKey, model, basePath, localeMap, maxTokens, systemMessage }?: IProviderOptions) => IProvider;
export {};
