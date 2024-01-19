declare type StringStyleKeys<T = keyof CSSStyleDeclaration> = T extends keyof CSSStyleDeclaration ? CSSStyleDeclaration[T] extends string ? T : never : never;
export declare type TeleStyles = Partial<Pick<CSSStyleDeclaration, StringStyleKeys>>;
export {};
