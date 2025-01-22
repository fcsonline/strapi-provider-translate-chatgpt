"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param time
 * @param inMs
 * @ignore
 */
const sleep = (time, inMs = false) => new Promise((resolve) => setTimeout(resolve, time * (inMs ? 1 : 1000)));
exports.default = sleep;
