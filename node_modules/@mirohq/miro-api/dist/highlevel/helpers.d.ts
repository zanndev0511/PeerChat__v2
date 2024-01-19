/** @hidden */
export declare function toString(id: number | string | undefined): string;
/** @hidden */
export declare function hasMoreData(response: {
    offset?: number;
    data?: Array<any>;
    total?: number;
}): boolean;
declare type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: T[P] extends string ? string : DeepPartial<T[P]>;
} : T;
export declare type KeepBase<T> = DeepPartial<T>;
export {};
