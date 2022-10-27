// 全部变成可选
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

// type t = Partial<{ a: string, b: number }> // { a?: string, b?: number }

// 全部变成必填
export type Required<T> = {
    [P in keyof T]-?: T[P];
};
// type p = Required<{ a: string, b?: number }> // { a: string, b: number }

// 全部变成只读
export type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 从T里面挑几个key
export type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
// type p = Pick<{ a: string, b?: number }, 'a'> // { a: string }

// K extends keyof，说明第一个泛型参数是key。也就是对于给定key，都是T类型
export type Record<K extends keyof any, T> = {
    [P in K]: T;
};
// type p = Record<'a' | 'b', string> // { a: string, b: string }
// Record版本的Readonly和Required，应该怎么实现，也很明显了

// 返回T里面除了U的
export type Exclude<T, U> = T extends U ? never : T;
// type p = Exclude<'a' | 'b', 'a'> // 'b'

// Exclude反向作用
export type Extract<T, U> = T extends U ? T : never; //  'a'

// Pick的反向作用，从T里面选取非K里面的key出来
export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
// type p = Omit<{ a: string, b?: number }, 'b'> // { a: string }

// 过滤null和undefined
export type NonNullable<T> = T extends null | undefined ? never : T;

// type p1 = NonNullable<{ a: number, b: string }> // { a: number, b: string }
// type p2 = NonNullable<undefined>  // never

// 把函数的参数抠出来
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
// type op = Parameters<(a: string, b: number) => void> // [string, number]
