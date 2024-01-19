"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasMoreData = exports.toString = void 0;
/** @hidden */
function toString(id) {
    return id ? id.toString() : '';
}
exports.toString = toString;
/** @hidden */
function hasMoreData(response) {
    const responseOffset = response.offset || 0;
    const size = response.data?.length || 0;
    const total = response.total || 0;
    return !!total && !!size && responseOffset + size < total;
}
exports.hasMoreData = hasMoreData;
