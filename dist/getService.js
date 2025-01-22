'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getService = void 0;
const getService = (name) => {
    // @ts-ignore
    return strapi.plugin('translate').service(name);
};
exports.getService = getService;
