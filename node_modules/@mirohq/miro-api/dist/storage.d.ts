import { ExternalUserId } from './index';
export declare type Awaitable<T> = Promise<T> | T;
export interface State {
    userId: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiresAt?: string;
}
export interface Storage {
    get(userId: ExternalUserId): Promise<State | undefined>;
    set(userId: ExternalUserId, state: State | undefined): Awaitable<void>;
}
export declare class InMemoryStorage implements Storage {
    storage: Record<string, State | undefined>;
    constructor();
    get(userId: ExternalUserId): Promise<State | undefined>;
    set(userId: ExternalUserId, state: State | undefined): Promise<void>;
}
