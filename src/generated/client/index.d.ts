
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Service
 * 
 */
export type Service = $Result.DefaultSelection<Prisma.$ServicePayload>
/**
 * Model CampaignHistory
 * 
 */
export type CampaignHistory = $Result.DefaultSelection<Prisma.$CampaignHistoryPayload>
/**
 * Model GlobalSettings
 * 
 */
export type GlobalSettings = $Result.DefaultSelection<Prisma.$GlobalSettingsPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model GmailAccount
 * 
 */
export type GmailAccount = $Result.DefaultSelection<Prisma.$GmailAccountPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ClientSource: {
  MANUAL: 'MANUAL',
  INVOICE_SYSTEM: 'INVOICE_SYSTEM',
  ZOHO_BIGIN: 'ZOHO_BIGIN',
  GMAIL: 'GMAIL'
};

export type ClientSource = (typeof ClientSource)[keyof typeof ClientSource]


export const UserRole: {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const UserStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  BANNED: 'BANNED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

}

export type ClientSource = $Enums.ClientSource

export const ClientSource: typeof $Enums.ClientSource

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Clients
 * const clients = await prisma.client.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Clients
   * const clients = await prisma.client.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.service`: Exposes CRUD operations for the **Service** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Services
    * const services = await prisma.service.findMany()
    * ```
    */
  get service(): Prisma.ServiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.campaignHistory`: Exposes CRUD operations for the **CampaignHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CampaignHistories
    * const campaignHistories = await prisma.campaignHistory.findMany()
    * ```
    */
  get campaignHistory(): Prisma.CampaignHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.globalSettings`: Exposes CRUD operations for the **GlobalSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GlobalSettings
    * const globalSettings = await prisma.globalSettings.findMany()
    * ```
    */
  get globalSettings(): Prisma.GlobalSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gmailAccount`: Exposes CRUD operations for the **GmailAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GmailAccounts
    * const gmailAccounts = await prisma.gmailAccount.findMany()
    * ```
    */
  get gmailAccount(): Prisma.GmailAccountDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Client: 'Client',
    Service: 'Service',
    CampaignHistory: 'CampaignHistory',
    GlobalSettings: 'GlobalSettings',
    User: 'User',
    GmailAccount: 'GmailAccount'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "client" | "service" | "campaignHistory" | "globalSettings" | "user" | "gmailAccount"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Service: {
        payload: Prisma.$ServicePayload<ExtArgs>
        fields: Prisma.ServiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          findFirst: {
            args: Prisma.ServiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          findMany: {
            args: Prisma.ServiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>[]
          }
          create: {
            args: Prisma.ServiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          createMany: {
            args: Prisma.ServiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>[]
          }
          delete: {
            args: Prisma.ServiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          update: {
            args: Prisma.ServiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          deleteMany: {
            args: Prisma.ServiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>[]
          }
          upsert: {
            args: Prisma.ServiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          aggregate: {
            args: Prisma.ServiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateService>
          }
          groupBy: {
            args: Prisma.ServiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceCountAggregateOutputType> | number
          }
        }
      }
      CampaignHistory: {
        payload: Prisma.$CampaignHistoryPayload<ExtArgs>
        fields: Prisma.CampaignHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CampaignHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CampaignHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>
          }
          findFirst: {
            args: Prisma.CampaignHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CampaignHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>
          }
          findMany: {
            args: Prisma.CampaignHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>[]
          }
          create: {
            args: Prisma.CampaignHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>
          }
          createMany: {
            args: Prisma.CampaignHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CampaignHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>[]
          }
          delete: {
            args: Prisma.CampaignHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>
          }
          update: {
            args: Prisma.CampaignHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>
          }
          deleteMany: {
            args: Prisma.CampaignHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CampaignHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CampaignHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>[]
          }
          upsert: {
            args: Prisma.CampaignHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignHistoryPayload>
          }
          aggregate: {
            args: Prisma.CampaignHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCampaignHistory>
          }
          groupBy: {
            args: Prisma.CampaignHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CampaignHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CampaignHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<CampaignHistoryCountAggregateOutputType> | number
          }
        }
      }
      GlobalSettings: {
        payload: Prisma.$GlobalSettingsPayload<ExtArgs>
        fields: Prisma.GlobalSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GlobalSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GlobalSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>
          }
          findFirst: {
            args: Prisma.GlobalSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GlobalSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>
          }
          findMany: {
            args: Prisma.GlobalSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>[]
          }
          create: {
            args: Prisma.GlobalSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>
          }
          createMany: {
            args: Prisma.GlobalSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GlobalSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>[]
          }
          delete: {
            args: Prisma.GlobalSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>
          }
          update: {
            args: Prisma.GlobalSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>
          }
          deleteMany: {
            args: Prisma.GlobalSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GlobalSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GlobalSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>[]
          }
          upsert: {
            args: Prisma.GlobalSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalSettingsPayload>
          }
          aggregate: {
            args: Prisma.GlobalSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGlobalSettings>
          }
          groupBy: {
            args: Prisma.GlobalSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<GlobalSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.GlobalSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<GlobalSettingsCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      GmailAccount: {
        payload: Prisma.$GmailAccountPayload<ExtArgs>
        fields: Prisma.GmailAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GmailAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GmailAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>
          }
          findFirst: {
            args: Prisma.GmailAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GmailAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>
          }
          findMany: {
            args: Prisma.GmailAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>[]
          }
          create: {
            args: Prisma.GmailAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>
          }
          createMany: {
            args: Prisma.GmailAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GmailAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>[]
          }
          delete: {
            args: Prisma.GmailAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>
          }
          update: {
            args: Prisma.GmailAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>
          }
          deleteMany: {
            args: Prisma.GmailAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GmailAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GmailAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>[]
          }
          upsert: {
            args: Prisma.GmailAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GmailAccountPayload>
          }
          aggregate: {
            args: Prisma.GmailAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGmailAccount>
          }
          groupBy: {
            args: Prisma.GmailAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<GmailAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.GmailAccountCountArgs<ExtArgs>
            result: $Utils.Optional<GmailAccountCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    client?: ClientOmit
    service?: ServiceOmit
    campaignHistory?: CampaignHistoryOmit
    globalSettings?: GlobalSettingsOmit
    user?: UserOmit
    gmailAccount?: GmailAccountOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    campaigns: number
    services: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaigns?: boolean | ClientCountOutputTypeCountCampaignsArgs
    services?: boolean | ClientCountOutputTypeCountServicesArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountCampaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignHistoryWhereInput
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceWhereInput
  }


  /**
   * Count Type ServiceCountOutputType
   */

  export type ServiceCountOutputType = {
    clients: number
  }

  export type ServiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clients?: boolean | ServiceCountOutputTypeCountClientsArgs
  }

  // Custom InputTypes
  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCountOutputType
     */
    select?: ServiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeCountClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    clientName: string | null
    contactPerson: string | null
    email: string | null
    industry: string | null
    relationshipLevel: string | null
    createdAt: Date | null
    updatedAt: Date | null
    externalId: string | null
    source: $Enums.ClientSource | null
    gmailSourceAccount: string | null
    lastContacted: Date | null
    isRoleBased: boolean | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    clientName: string | null
    contactPerson: string | null
    email: string | null
    industry: string | null
    relationshipLevel: string | null
    createdAt: Date | null
    updatedAt: Date | null
    externalId: string | null
    source: $Enums.ClientSource | null
    gmailSourceAccount: string | null
    lastContacted: Date | null
    isRoleBased: boolean | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    clientName: number
    contactPerson: number
    email: number
    industry: number
    relationshipLevel: number
    createdAt: number
    updatedAt: number
    externalId: number
    source: number
    zohoTags: number
    gmailSourceAccount: number
    lastContacted: number
    isRoleBased: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    clientName?: true
    contactPerson?: true
    email?: true
    industry?: true
    relationshipLevel?: true
    createdAt?: true
    updatedAt?: true
    externalId?: true
    source?: true
    gmailSourceAccount?: true
    lastContacted?: true
    isRoleBased?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    clientName?: true
    contactPerson?: true
    email?: true
    industry?: true
    relationshipLevel?: true
    createdAt?: true
    updatedAt?: true
    externalId?: true
    source?: true
    gmailSourceAccount?: true
    lastContacted?: true
    isRoleBased?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    clientName?: true
    contactPerson?: true
    email?: true
    industry?: true
    relationshipLevel?: true
    createdAt?: true
    updatedAt?: true
    externalId?: true
    source?: true
    zohoTags?: true
    gmailSourceAccount?: true
    lastContacted?: true
    isRoleBased?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    clientName: string
    contactPerson: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt: Date
    updatedAt: Date
    externalId: string | null
    source: $Enums.ClientSource
    zohoTags: string[]
    gmailSourceAccount: string | null
    lastContacted: Date | null
    isRoleBased: boolean
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    contactPerson?: boolean
    email?: boolean
    industry?: boolean
    relationshipLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    externalId?: boolean
    source?: boolean
    zohoTags?: boolean
    gmailSourceAccount?: boolean
    lastContacted?: boolean
    isRoleBased?: boolean
    campaigns?: boolean | Client$campaignsArgs<ExtArgs>
    services?: boolean | Client$servicesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    contactPerson?: boolean
    email?: boolean
    industry?: boolean
    relationshipLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    externalId?: boolean
    source?: boolean
    zohoTags?: boolean
    gmailSourceAccount?: boolean
    lastContacted?: boolean
    isRoleBased?: boolean
  }, ExtArgs["result"]["client"]>

  export type ClientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    contactPerson?: boolean
    email?: boolean
    industry?: boolean
    relationshipLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    externalId?: boolean
    source?: boolean
    zohoTags?: boolean
    gmailSourceAccount?: boolean
    lastContacted?: boolean
    isRoleBased?: boolean
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    clientName?: boolean
    contactPerson?: boolean
    email?: boolean
    industry?: boolean
    relationshipLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    externalId?: boolean
    source?: boolean
    zohoTags?: boolean
    gmailSourceAccount?: boolean
    lastContacted?: boolean
    isRoleBased?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientName" | "contactPerson" | "email" | "industry" | "relationshipLevel" | "createdAt" | "updatedAt" | "externalId" | "source" | "zohoTags" | "gmailSourceAccount" | "lastContacted" | "isRoleBased", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaigns?: boolean | Client$campaignsArgs<ExtArgs>
    services?: boolean | Client$servicesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ClientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      campaigns: Prisma.$CampaignHistoryPayload<ExtArgs>[]
      services: Prisma.$ServicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientName: string
      contactPerson: string | null
      email: string
      industry: string
      relationshipLevel: string
      createdAt: Date
      updatedAt: Date
      externalId: string | null
      source: $Enums.ClientSource
      zohoTags: string[]
      gmailSourceAccount: string | null
      lastContacted: Date | null
      isRoleBased: boolean
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients and returns the data updated in the database.
     * @param {ClientUpdateManyAndReturnArgs} args - Arguments to update many Clients.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClientUpdateManyAndReturnArgs>(args: SelectSubset<T, ClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaigns<T extends Client$campaignsArgs<ExtArgs> = {}>(args?: Subset<T, Client$campaignsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    services<T extends Client$servicesArgs<ExtArgs> = {}>(args?: Subset<T, Client$servicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly clientName: FieldRef<"Client", 'String'>
    readonly contactPerson: FieldRef<"Client", 'String'>
    readonly email: FieldRef<"Client", 'String'>
    readonly industry: FieldRef<"Client", 'String'>
    readonly relationshipLevel: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
    readonly externalId: FieldRef<"Client", 'String'>
    readonly source: FieldRef<"Client", 'ClientSource'>
    readonly zohoTags: FieldRef<"Client", 'String[]'>
    readonly gmailSourceAccount: FieldRef<"Client", 'String'>
    readonly lastContacted: FieldRef<"Client", 'DateTime'>
    readonly isRoleBased: FieldRef<"Client", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client updateManyAndReturn
   */
  export type ClientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.campaigns
   */
  export type Client$campaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    where?: CampaignHistoryWhereInput
    orderBy?: CampaignHistoryOrderByWithRelationInput | CampaignHistoryOrderByWithRelationInput[]
    cursor?: CampaignHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CampaignHistoryScalarFieldEnum | CampaignHistoryScalarFieldEnum[]
  }

  /**
   * Client.services
   */
  export type Client$servicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    where?: ServiceWhereInput
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    cursor?: ServiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Service
   */

  export type AggregateService = {
    _count: ServiceCountAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  export type ServiceMinAggregateOutputType = {
    id: string | null
    serviceName: string | null
    category: string | null
    description: string | null
  }

  export type ServiceMaxAggregateOutputType = {
    id: string | null
    serviceName: string | null
    category: string | null
    description: string | null
  }

  export type ServiceCountAggregateOutputType = {
    id: number
    serviceName: number
    category: number
    description: number
    _all: number
  }


  export type ServiceMinAggregateInputType = {
    id?: true
    serviceName?: true
    category?: true
    description?: true
  }

  export type ServiceMaxAggregateInputType = {
    id?: true
    serviceName?: true
    category?: true
    description?: true
  }

  export type ServiceCountAggregateInputType = {
    id?: true
    serviceName?: true
    category?: true
    description?: true
    _all?: true
  }

  export type ServiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Service to aggregate.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Services
    **/
    _count?: true | ServiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceMaxAggregateInputType
  }

  export type GetServiceAggregateType<T extends ServiceAggregateArgs> = {
        [P in keyof T & keyof AggregateService]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateService[P]>
      : GetScalarType<T[P], AggregateService[P]>
  }




  export type ServiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceWhereInput
    orderBy?: ServiceOrderByWithAggregationInput | ServiceOrderByWithAggregationInput[]
    by: ServiceScalarFieldEnum[] | ServiceScalarFieldEnum
    having?: ServiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceCountAggregateInputType | true
    _min?: ServiceMinAggregateInputType
    _max?: ServiceMaxAggregateInputType
  }

  export type ServiceGroupByOutputType = {
    id: string
    serviceName: string
    category: string | null
    description: string | null
    _count: ServiceCountAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  type GetServiceGroupByPayload<T extends ServiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceGroupByOutputType[P]>
        }
      >
    >


  export type ServiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceName?: boolean
    category?: boolean
    description?: boolean
    clients?: boolean | Service$clientsArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceName?: boolean
    category?: boolean
    description?: boolean
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serviceName?: boolean
    category?: boolean
    description?: boolean
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectScalar = {
    id?: boolean
    serviceName?: boolean
    category?: boolean
    description?: boolean
  }

  export type ServiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "serviceName" | "category" | "description", ExtArgs["result"]["service"]>
  export type ServiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clients?: boolean | Service$clientsArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ServiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ServicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Service"
    objects: {
      clients: Prisma.$ClientPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serviceName: string
      category: string | null
      description: string | null
    }, ExtArgs["result"]["service"]>
    composites: {}
  }

  type ServiceGetPayload<S extends boolean | null | undefined | ServiceDefaultArgs> = $Result.GetResult<Prisma.$ServicePayload, S>

  type ServiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServiceCountAggregateInputType | true
    }

  export interface ServiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Service'], meta: { name: 'Service' } }
    /**
     * Find zero or one Service that matches the filter.
     * @param {ServiceFindUniqueArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceFindUniqueArgs>(args: SelectSubset<T, ServiceFindUniqueArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Service that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServiceFindUniqueOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Service that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceFindFirstArgs>(args?: SelectSubset<T, ServiceFindFirstArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Service that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Services that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Services
     * const services = await prisma.service.findMany()
     * 
     * // Get first 10 Services
     * const services = await prisma.service.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceWithIdOnly = await prisma.service.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceFindManyArgs>(args?: SelectSubset<T, ServiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Service.
     * @param {ServiceCreateArgs} args - Arguments to create a Service.
     * @example
     * // Create one Service
     * const Service = await prisma.service.create({
     *   data: {
     *     // ... data to create a Service
     *   }
     * })
     * 
     */
    create<T extends ServiceCreateArgs>(args: SelectSubset<T, ServiceCreateArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Services.
     * @param {ServiceCreateManyArgs} args - Arguments to create many Services.
     * @example
     * // Create many Services
     * const service = await prisma.service.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceCreateManyArgs>(args?: SelectSubset<T, ServiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Services and returns the data saved in the database.
     * @param {ServiceCreateManyAndReturnArgs} args - Arguments to create many Services.
     * @example
     * // Create many Services
     * const service = await prisma.service.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Services and only return the `id`
     * const serviceWithIdOnly = await prisma.service.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Service.
     * @param {ServiceDeleteArgs} args - Arguments to delete one Service.
     * @example
     * // Delete one Service
     * const Service = await prisma.service.delete({
     *   where: {
     *     // ... filter to delete one Service
     *   }
     * })
     * 
     */
    delete<T extends ServiceDeleteArgs>(args: SelectSubset<T, ServiceDeleteArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Service.
     * @param {ServiceUpdateArgs} args - Arguments to update one Service.
     * @example
     * // Update one Service
     * const service = await prisma.service.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceUpdateArgs>(args: SelectSubset<T, ServiceUpdateArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Services.
     * @param {ServiceDeleteManyArgs} args - Arguments to filter Services to delete.
     * @example
     * // Delete a few Services
     * const { count } = await prisma.service.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceDeleteManyArgs>(args?: SelectSubset<T, ServiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Services
     * const service = await prisma.service.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceUpdateManyArgs>(args: SelectSubset<T, ServiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Services and returns the data updated in the database.
     * @param {ServiceUpdateManyAndReturnArgs} args - Arguments to update many Services.
     * @example
     * // Update many Services
     * const service = await prisma.service.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Services and only return the `id`
     * const serviceWithIdOnly = await prisma.service.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ServiceUpdateManyAndReturnArgs>(args: SelectSubset<T, ServiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Service.
     * @param {ServiceUpsertArgs} args - Arguments to update or create a Service.
     * @example
     * // Update or create a Service
     * const service = await prisma.service.upsert({
     *   create: {
     *     // ... data to create a Service
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Service we want to update
     *   }
     * })
     */
    upsert<T extends ServiceUpsertArgs>(args: SelectSubset<T, ServiceUpsertArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCountArgs} args - Arguments to filter Services to count.
     * @example
     * // Count the number of Services
     * const count = await prisma.service.count({
     *   where: {
     *     // ... the filter for the Services we want to count
     *   }
     * })
    **/
    count<T extends ServiceCountArgs>(
      args?: Subset<T, ServiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServiceAggregateArgs>(args: Subset<T, ServiceAggregateArgs>): Prisma.PrismaPromise<GetServiceAggregateType<T>>

    /**
     * Group by Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceGroupByArgs['orderBy'] }
        : { orderBy?: ServiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Service model
   */
  readonly fields: ServiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Service.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clients<T extends Service$clientsArgs<ExtArgs> = {}>(args?: Subset<T, Service$clientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Service model
   */
  interface ServiceFieldRefs {
    readonly id: FieldRef<"Service", 'String'>
    readonly serviceName: FieldRef<"Service", 'String'>
    readonly category: FieldRef<"Service", 'String'>
    readonly description: FieldRef<"Service", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Service findUnique
   */
  export type ServiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service findUniqueOrThrow
   */
  export type ServiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service findFirst
   */
  export type ServiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Services.
     */
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service findFirstOrThrow
   */
  export type ServiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Services.
     */
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service findMany
   */
  export type ServiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Services to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service create
   */
  export type ServiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Service.
     */
    data: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
  }

  /**
   * Service createMany
   */
  export type ServiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Services.
     */
    data: ServiceCreateManyInput | ServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Service createManyAndReturn
   */
  export type ServiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * The data used to create many Services.
     */
    data: ServiceCreateManyInput | ServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Service update
   */
  export type ServiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Service.
     */
    data: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
    /**
     * Choose, which Service to update.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service updateMany
   */
  export type ServiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Services.
     */
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyInput>
    /**
     * Filter which Services to update
     */
    where?: ServiceWhereInput
    /**
     * Limit how many Services to update.
     */
    limit?: number
  }

  /**
   * Service updateManyAndReturn
   */
  export type ServiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * The data used to update Services.
     */
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyInput>
    /**
     * Filter which Services to update
     */
    where?: ServiceWhereInput
    /**
     * Limit how many Services to update.
     */
    limit?: number
  }

  /**
   * Service upsert
   */
  export type ServiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Service to update in case it exists.
     */
    where: ServiceWhereUniqueInput
    /**
     * In case the Service found by the `where` argument doesn't exist, create a new Service with this data.
     */
    create: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
    /**
     * In case the Service was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
  }

  /**
   * Service delete
   */
  export type ServiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter which Service to delete.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service deleteMany
   */
  export type ServiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Services to delete
     */
    where?: ServiceWhereInput
    /**
     * Limit how many Services to delete.
     */
    limit?: number
  }

  /**
   * Service.clients
   */
  export type Service$clientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    cursor?: ClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Service without action
   */
  export type ServiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Service
     */
    omit?: ServiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
  }


  /**
   * Model CampaignHistory
   */

  export type AggregateCampaignHistory = {
    _count: CampaignHistoryCountAggregateOutputType | null
    _min: CampaignHistoryMinAggregateOutputType | null
    _max: CampaignHistoryMaxAggregateOutputType | null
  }

  export type CampaignHistoryMinAggregateOutputType = {
    id: string | null
    campaignType: string | null
    campaignTopic: string | null
    generatedOutput: string | null
    clientId: string | null
    dateCreated: Date | null
  }

  export type CampaignHistoryMaxAggregateOutputType = {
    id: string | null
    campaignType: string | null
    campaignTopic: string | null
    generatedOutput: string | null
    clientId: string | null
    dateCreated: Date | null
  }

  export type CampaignHistoryCountAggregateOutputType = {
    id: number
    campaignType: number
    campaignTopic: number
    generatedOutput: number
    clientId: number
    dateCreated: number
    _all: number
  }


  export type CampaignHistoryMinAggregateInputType = {
    id?: true
    campaignType?: true
    campaignTopic?: true
    generatedOutput?: true
    clientId?: true
    dateCreated?: true
  }

  export type CampaignHistoryMaxAggregateInputType = {
    id?: true
    campaignType?: true
    campaignTopic?: true
    generatedOutput?: true
    clientId?: true
    dateCreated?: true
  }

  export type CampaignHistoryCountAggregateInputType = {
    id?: true
    campaignType?: true
    campaignTopic?: true
    generatedOutput?: true
    clientId?: true
    dateCreated?: true
    _all?: true
  }

  export type CampaignHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CampaignHistory to aggregate.
     */
    where?: CampaignHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignHistories to fetch.
     */
    orderBy?: CampaignHistoryOrderByWithRelationInput | CampaignHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CampaignHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CampaignHistories
    **/
    _count?: true | CampaignHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CampaignHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CampaignHistoryMaxAggregateInputType
  }

  export type GetCampaignHistoryAggregateType<T extends CampaignHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCampaignHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCampaignHistory[P]>
      : GetScalarType<T[P], AggregateCampaignHistory[P]>
  }




  export type CampaignHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignHistoryWhereInput
    orderBy?: CampaignHistoryOrderByWithAggregationInput | CampaignHistoryOrderByWithAggregationInput[]
    by: CampaignHistoryScalarFieldEnum[] | CampaignHistoryScalarFieldEnum
    having?: CampaignHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CampaignHistoryCountAggregateInputType | true
    _min?: CampaignHistoryMinAggregateInputType
    _max?: CampaignHistoryMaxAggregateInputType
  }

  export type CampaignHistoryGroupByOutputType = {
    id: string
    campaignType: string
    campaignTopic: string
    generatedOutput: string
    clientId: string | null
    dateCreated: Date
    _count: CampaignHistoryCountAggregateOutputType | null
    _min: CampaignHistoryMinAggregateOutputType | null
    _max: CampaignHistoryMaxAggregateOutputType | null
  }

  type GetCampaignHistoryGroupByPayload<T extends CampaignHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CampaignHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CampaignHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CampaignHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], CampaignHistoryGroupByOutputType[P]>
        }
      >
    >


  export type CampaignHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignType?: boolean
    campaignTopic?: boolean
    generatedOutput?: boolean
    clientId?: boolean
    dateCreated?: boolean
    client?: boolean | CampaignHistory$clientArgs<ExtArgs>
  }, ExtArgs["result"]["campaignHistory"]>

  export type CampaignHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignType?: boolean
    campaignTopic?: boolean
    generatedOutput?: boolean
    clientId?: boolean
    dateCreated?: boolean
    client?: boolean | CampaignHistory$clientArgs<ExtArgs>
  }, ExtArgs["result"]["campaignHistory"]>

  export type CampaignHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignType?: boolean
    campaignTopic?: boolean
    generatedOutput?: boolean
    clientId?: boolean
    dateCreated?: boolean
    client?: boolean | CampaignHistory$clientArgs<ExtArgs>
  }, ExtArgs["result"]["campaignHistory"]>

  export type CampaignHistorySelectScalar = {
    id?: boolean
    campaignType?: boolean
    campaignTopic?: boolean
    generatedOutput?: boolean
    clientId?: boolean
    dateCreated?: boolean
  }

  export type CampaignHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignType" | "campaignTopic" | "generatedOutput" | "clientId" | "dateCreated", ExtArgs["result"]["campaignHistory"]>
  export type CampaignHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | CampaignHistory$clientArgs<ExtArgs>
  }
  export type CampaignHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | CampaignHistory$clientArgs<ExtArgs>
  }
  export type CampaignHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | CampaignHistory$clientArgs<ExtArgs>
  }

  export type $CampaignHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CampaignHistory"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignType: string
      campaignTopic: string
      generatedOutput: string
      clientId: string | null
      dateCreated: Date
    }, ExtArgs["result"]["campaignHistory"]>
    composites: {}
  }

  type CampaignHistoryGetPayload<S extends boolean | null | undefined | CampaignHistoryDefaultArgs> = $Result.GetResult<Prisma.$CampaignHistoryPayload, S>

  type CampaignHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CampaignHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CampaignHistoryCountAggregateInputType | true
    }

  export interface CampaignHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CampaignHistory'], meta: { name: 'CampaignHistory' } }
    /**
     * Find zero or one CampaignHistory that matches the filter.
     * @param {CampaignHistoryFindUniqueArgs} args - Arguments to find a CampaignHistory
     * @example
     * // Get one CampaignHistory
     * const campaignHistory = await prisma.campaignHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CampaignHistoryFindUniqueArgs>(args: SelectSubset<T, CampaignHistoryFindUniqueArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CampaignHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CampaignHistoryFindUniqueOrThrowArgs} args - Arguments to find a CampaignHistory
     * @example
     * // Get one CampaignHistory
     * const campaignHistory = await prisma.campaignHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CampaignHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CampaignHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CampaignHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignHistoryFindFirstArgs} args - Arguments to find a CampaignHistory
     * @example
     * // Get one CampaignHistory
     * const campaignHistory = await prisma.campaignHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CampaignHistoryFindFirstArgs>(args?: SelectSubset<T, CampaignHistoryFindFirstArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CampaignHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignHistoryFindFirstOrThrowArgs} args - Arguments to find a CampaignHistory
     * @example
     * // Get one CampaignHistory
     * const campaignHistory = await prisma.campaignHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CampaignHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CampaignHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CampaignHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CampaignHistories
     * const campaignHistories = await prisma.campaignHistory.findMany()
     * 
     * // Get first 10 CampaignHistories
     * const campaignHistories = await prisma.campaignHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const campaignHistoryWithIdOnly = await prisma.campaignHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CampaignHistoryFindManyArgs>(args?: SelectSubset<T, CampaignHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CampaignHistory.
     * @param {CampaignHistoryCreateArgs} args - Arguments to create a CampaignHistory.
     * @example
     * // Create one CampaignHistory
     * const CampaignHistory = await prisma.campaignHistory.create({
     *   data: {
     *     // ... data to create a CampaignHistory
     *   }
     * })
     * 
     */
    create<T extends CampaignHistoryCreateArgs>(args: SelectSubset<T, CampaignHistoryCreateArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CampaignHistories.
     * @param {CampaignHistoryCreateManyArgs} args - Arguments to create many CampaignHistories.
     * @example
     * // Create many CampaignHistories
     * const campaignHistory = await prisma.campaignHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CampaignHistoryCreateManyArgs>(args?: SelectSubset<T, CampaignHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CampaignHistories and returns the data saved in the database.
     * @param {CampaignHistoryCreateManyAndReturnArgs} args - Arguments to create many CampaignHistories.
     * @example
     * // Create many CampaignHistories
     * const campaignHistory = await prisma.campaignHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CampaignHistories and only return the `id`
     * const campaignHistoryWithIdOnly = await prisma.campaignHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CampaignHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CampaignHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CampaignHistory.
     * @param {CampaignHistoryDeleteArgs} args - Arguments to delete one CampaignHistory.
     * @example
     * // Delete one CampaignHistory
     * const CampaignHistory = await prisma.campaignHistory.delete({
     *   where: {
     *     // ... filter to delete one CampaignHistory
     *   }
     * })
     * 
     */
    delete<T extends CampaignHistoryDeleteArgs>(args: SelectSubset<T, CampaignHistoryDeleteArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CampaignHistory.
     * @param {CampaignHistoryUpdateArgs} args - Arguments to update one CampaignHistory.
     * @example
     * // Update one CampaignHistory
     * const campaignHistory = await prisma.campaignHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CampaignHistoryUpdateArgs>(args: SelectSubset<T, CampaignHistoryUpdateArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CampaignHistories.
     * @param {CampaignHistoryDeleteManyArgs} args - Arguments to filter CampaignHistories to delete.
     * @example
     * // Delete a few CampaignHistories
     * const { count } = await prisma.campaignHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CampaignHistoryDeleteManyArgs>(args?: SelectSubset<T, CampaignHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CampaignHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CampaignHistories
     * const campaignHistory = await prisma.campaignHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CampaignHistoryUpdateManyArgs>(args: SelectSubset<T, CampaignHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CampaignHistories and returns the data updated in the database.
     * @param {CampaignHistoryUpdateManyAndReturnArgs} args - Arguments to update many CampaignHistories.
     * @example
     * // Update many CampaignHistories
     * const campaignHistory = await prisma.campaignHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CampaignHistories and only return the `id`
     * const campaignHistoryWithIdOnly = await prisma.campaignHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CampaignHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CampaignHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CampaignHistory.
     * @param {CampaignHistoryUpsertArgs} args - Arguments to update or create a CampaignHistory.
     * @example
     * // Update or create a CampaignHistory
     * const campaignHistory = await prisma.campaignHistory.upsert({
     *   create: {
     *     // ... data to create a CampaignHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CampaignHistory we want to update
     *   }
     * })
     */
    upsert<T extends CampaignHistoryUpsertArgs>(args: SelectSubset<T, CampaignHistoryUpsertArgs<ExtArgs>>): Prisma__CampaignHistoryClient<$Result.GetResult<Prisma.$CampaignHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CampaignHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignHistoryCountArgs} args - Arguments to filter CampaignHistories to count.
     * @example
     * // Count the number of CampaignHistories
     * const count = await prisma.campaignHistory.count({
     *   where: {
     *     // ... the filter for the CampaignHistories we want to count
     *   }
     * })
    **/
    count<T extends CampaignHistoryCountArgs>(
      args?: Subset<T, CampaignHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CampaignHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CampaignHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CampaignHistoryAggregateArgs>(args: Subset<T, CampaignHistoryAggregateArgs>): Prisma.PrismaPromise<GetCampaignHistoryAggregateType<T>>

    /**
     * Group by CampaignHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CampaignHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CampaignHistoryGroupByArgs['orderBy'] }
        : { orderBy?: CampaignHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CampaignHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCampaignHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CampaignHistory model
   */
  readonly fields: CampaignHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CampaignHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CampaignHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends CampaignHistory$clientArgs<ExtArgs> = {}>(args?: Subset<T, CampaignHistory$clientArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CampaignHistory model
   */
  interface CampaignHistoryFieldRefs {
    readonly id: FieldRef<"CampaignHistory", 'String'>
    readonly campaignType: FieldRef<"CampaignHistory", 'String'>
    readonly campaignTopic: FieldRef<"CampaignHistory", 'String'>
    readonly generatedOutput: FieldRef<"CampaignHistory", 'String'>
    readonly clientId: FieldRef<"CampaignHistory", 'String'>
    readonly dateCreated: FieldRef<"CampaignHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CampaignHistory findUnique
   */
  export type CampaignHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CampaignHistory to fetch.
     */
    where: CampaignHistoryWhereUniqueInput
  }

  /**
   * CampaignHistory findUniqueOrThrow
   */
  export type CampaignHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CampaignHistory to fetch.
     */
    where: CampaignHistoryWhereUniqueInput
  }

  /**
   * CampaignHistory findFirst
   */
  export type CampaignHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CampaignHistory to fetch.
     */
    where?: CampaignHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignHistories to fetch.
     */
    orderBy?: CampaignHistoryOrderByWithRelationInput | CampaignHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CampaignHistories.
     */
    cursor?: CampaignHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CampaignHistories.
     */
    distinct?: CampaignHistoryScalarFieldEnum | CampaignHistoryScalarFieldEnum[]
  }

  /**
   * CampaignHistory findFirstOrThrow
   */
  export type CampaignHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CampaignHistory to fetch.
     */
    where?: CampaignHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignHistories to fetch.
     */
    orderBy?: CampaignHistoryOrderByWithRelationInput | CampaignHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CampaignHistories.
     */
    cursor?: CampaignHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CampaignHistories.
     */
    distinct?: CampaignHistoryScalarFieldEnum | CampaignHistoryScalarFieldEnum[]
  }

  /**
   * CampaignHistory findMany
   */
  export type CampaignHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * Filter, which CampaignHistories to fetch.
     */
    where?: CampaignHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignHistories to fetch.
     */
    orderBy?: CampaignHistoryOrderByWithRelationInput | CampaignHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CampaignHistories.
     */
    cursor?: CampaignHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignHistories.
     */
    skip?: number
    distinct?: CampaignHistoryScalarFieldEnum | CampaignHistoryScalarFieldEnum[]
  }

  /**
   * CampaignHistory create
   */
  export type CampaignHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a CampaignHistory.
     */
    data: XOR<CampaignHistoryCreateInput, CampaignHistoryUncheckedCreateInput>
  }

  /**
   * CampaignHistory createMany
   */
  export type CampaignHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CampaignHistories.
     */
    data: CampaignHistoryCreateManyInput | CampaignHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CampaignHistory createManyAndReturn
   */
  export type CampaignHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many CampaignHistories.
     */
    data: CampaignHistoryCreateManyInput | CampaignHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CampaignHistory update
   */
  export type CampaignHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a CampaignHistory.
     */
    data: XOR<CampaignHistoryUpdateInput, CampaignHistoryUncheckedUpdateInput>
    /**
     * Choose, which CampaignHistory to update.
     */
    where: CampaignHistoryWhereUniqueInput
  }

  /**
   * CampaignHistory updateMany
   */
  export type CampaignHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CampaignHistories.
     */
    data: XOR<CampaignHistoryUpdateManyMutationInput, CampaignHistoryUncheckedUpdateManyInput>
    /**
     * Filter which CampaignHistories to update
     */
    where?: CampaignHistoryWhereInput
    /**
     * Limit how many CampaignHistories to update.
     */
    limit?: number
  }

  /**
   * CampaignHistory updateManyAndReturn
   */
  export type CampaignHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * The data used to update CampaignHistories.
     */
    data: XOR<CampaignHistoryUpdateManyMutationInput, CampaignHistoryUncheckedUpdateManyInput>
    /**
     * Filter which CampaignHistories to update
     */
    where?: CampaignHistoryWhereInput
    /**
     * Limit how many CampaignHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CampaignHistory upsert
   */
  export type CampaignHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the CampaignHistory to update in case it exists.
     */
    where: CampaignHistoryWhereUniqueInput
    /**
     * In case the CampaignHistory found by the `where` argument doesn't exist, create a new CampaignHistory with this data.
     */
    create: XOR<CampaignHistoryCreateInput, CampaignHistoryUncheckedCreateInput>
    /**
     * In case the CampaignHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CampaignHistoryUpdateInput, CampaignHistoryUncheckedUpdateInput>
  }

  /**
   * CampaignHistory delete
   */
  export type CampaignHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
    /**
     * Filter which CampaignHistory to delete.
     */
    where: CampaignHistoryWhereUniqueInput
  }

  /**
   * CampaignHistory deleteMany
   */
  export type CampaignHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CampaignHistories to delete
     */
    where?: CampaignHistoryWhereInput
    /**
     * Limit how many CampaignHistories to delete.
     */
    limit?: number
  }

  /**
   * CampaignHistory.client
   */
  export type CampaignHistory$clientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
  }

  /**
   * CampaignHistory without action
   */
  export type CampaignHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignHistory
     */
    select?: CampaignHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignHistory
     */
    omit?: CampaignHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignHistoryInclude<ExtArgs> | null
  }


  /**
   * Model GlobalSettings
   */

  export type AggregateGlobalSettings = {
    _count: GlobalSettingsCountAggregateOutputType | null
    _min: GlobalSettingsMinAggregateOutputType | null
    _max: GlobalSettingsMaxAggregateOutputType | null
  }

  export type GlobalSettingsMinAggregateOutputType = {
    id: string | null
    aiProvider: string | null
    aiModel: string | null
    brandResonance: string | null
    signature: string | null
    groqApiKeyEncrypted: string | null
    openaiApiKeyEncrypted: string | null
    googleClientIdEncrypted: string | null
    googleClientSecretEncrypted: string | null
    googleRefreshTokenEncrypted: string | null
    googleEmailEncrypted: string | null
    updatedAt: Date | null
    invoiceApiKeyEncrypted: string | null
    invoiceApiUrlEncrypted: string | null
    zohoClientIdEncrypted: string | null
    zohoClientSecretEncrypted: string | null
    zohoPipelineName: string | null
    zohoRefreshTokenEncrypted: string | null
    zohoStageName: string | null
  }

  export type GlobalSettingsMaxAggregateOutputType = {
    id: string | null
    aiProvider: string | null
    aiModel: string | null
    brandResonance: string | null
    signature: string | null
    groqApiKeyEncrypted: string | null
    openaiApiKeyEncrypted: string | null
    googleClientIdEncrypted: string | null
    googleClientSecretEncrypted: string | null
    googleRefreshTokenEncrypted: string | null
    googleEmailEncrypted: string | null
    updatedAt: Date | null
    invoiceApiKeyEncrypted: string | null
    invoiceApiUrlEncrypted: string | null
    zohoClientIdEncrypted: string | null
    zohoClientSecretEncrypted: string | null
    zohoPipelineName: string | null
    zohoRefreshTokenEncrypted: string | null
    zohoStageName: string | null
  }

  export type GlobalSettingsCountAggregateOutputType = {
    id: number
    aiProvider: number
    aiModel: number
    brandResonance: number
    signature: number
    groqApiKeyEncrypted: number
    openaiApiKeyEncrypted: number
    googleClientIdEncrypted: number
    googleClientSecretEncrypted: number
    googleRefreshTokenEncrypted: number
    googleEmailEncrypted: number
    updatedAt: number
    invoiceApiKeyEncrypted: number
    invoiceApiUrlEncrypted: number
    zohoClientIdEncrypted: number
    zohoClientSecretEncrypted: number
    zohoPipelineName: number
    zohoRefreshTokenEncrypted: number
    zohoStageName: number
    _all: number
  }


  export type GlobalSettingsMinAggregateInputType = {
    id?: true
    aiProvider?: true
    aiModel?: true
    brandResonance?: true
    signature?: true
    groqApiKeyEncrypted?: true
    openaiApiKeyEncrypted?: true
    googleClientIdEncrypted?: true
    googleClientSecretEncrypted?: true
    googleRefreshTokenEncrypted?: true
    googleEmailEncrypted?: true
    updatedAt?: true
    invoiceApiKeyEncrypted?: true
    invoiceApiUrlEncrypted?: true
    zohoClientIdEncrypted?: true
    zohoClientSecretEncrypted?: true
    zohoPipelineName?: true
    zohoRefreshTokenEncrypted?: true
    zohoStageName?: true
  }

  export type GlobalSettingsMaxAggregateInputType = {
    id?: true
    aiProvider?: true
    aiModel?: true
    brandResonance?: true
    signature?: true
    groqApiKeyEncrypted?: true
    openaiApiKeyEncrypted?: true
    googleClientIdEncrypted?: true
    googleClientSecretEncrypted?: true
    googleRefreshTokenEncrypted?: true
    googleEmailEncrypted?: true
    updatedAt?: true
    invoiceApiKeyEncrypted?: true
    invoiceApiUrlEncrypted?: true
    zohoClientIdEncrypted?: true
    zohoClientSecretEncrypted?: true
    zohoPipelineName?: true
    zohoRefreshTokenEncrypted?: true
    zohoStageName?: true
  }

  export type GlobalSettingsCountAggregateInputType = {
    id?: true
    aiProvider?: true
    aiModel?: true
    brandResonance?: true
    signature?: true
    groqApiKeyEncrypted?: true
    openaiApiKeyEncrypted?: true
    googleClientIdEncrypted?: true
    googleClientSecretEncrypted?: true
    googleRefreshTokenEncrypted?: true
    googleEmailEncrypted?: true
    updatedAt?: true
    invoiceApiKeyEncrypted?: true
    invoiceApiUrlEncrypted?: true
    zohoClientIdEncrypted?: true
    zohoClientSecretEncrypted?: true
    zohoPipelineName?: true
    zohoRefreshTokenEncrypted?: true
    zohoStageName?: true
    _all?: true
  }

  export type GlobalSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalSettings to aggregate.
     */
    where?: GlobalSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalSettings to fetch.
     */
    orderBy?: GlobalSettingsOrderByWithRelationInput | GlobalSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GlobalSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GlobalSettings
    **/
    _count?: true | GlobalSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GlobalSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GlobalSettingsMaxAggregateInputType
  }

  export type GetGlobalSettingsAggregateType<T extends GlobalSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateGlobalSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGlobalSettings[P]>
      : GetScalarType<T[P], AggregateGlobalSettings[P]>
  }




  export type GlobalSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GlobalSettingsWhereInput
    orderBy?: GlobalSettingsOrderByWithAggregationInput | GlobalSettingsOrderByWithAggregationInput[]
    by: GlobalSettingsScalarFieldEnum[] | GlobalSettingsScalarFieldEnum
    having?: GlobalSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GlobalSettingsCountAggregateInputType | true
    _min?: GlobalSettingsMinAggregateInputType
    _max?: GlobalSettingsMaxAggregateInputType
  }

  export type GlobalSettingsGroupByOutputType = {
    id: string
    aiProvider: string
    aiModel: string
    brandResonance: string
    signature: string
    groqApiKeyEncrypted: string | null
    openaiApiKeyEncrypted: string | null
    googleClientIdEncrypted: string | null
    googleClientSecretEncrypted: string | null
    googleRefreshTokenEncrypted: string | null
    googleEmailEncrypted: string | null
    updatedAt: Date
    invoiceApiKeyEncrypted: string | null
    invoiceApiUrlEncrypted: string | null
    zohoClientIdEncrypted: string | null
    zohoClientSecretEncrypted: string | null
    zohoPipelineName: string | null
    zohoRefreshTokenEncrypted: string | null
    zohoStageName: string | null
    _count: GlobalSettingsCountAggregateOutputType | null
    _min: GlobalSettingsMinAggregateOutputType | null
    _max: GlobalSettingsMaxAggregateOutputType | null
  }

  type GetGlobalSettingsGroupByPayload<T extends GlobalSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GlobalSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GlobalSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GlobalSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], GlobalSettingsGroupByOutputType[P]>
        }
      >
    >


  export type GlobalSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    aiProvider?: boolean
    aiModel?: boolean
    brandResonance?: boolean
    signature?: boolean
    groqApiKeyEncrypted?: boolean
    openaiApiKeyEncrypted?: boolean
    googleClientIdEncrypted?: boolean
    googleClientSecretEncrypted?: boolean
    googleRefreshTokenEncrypted?: boolean
    googleEmailEncrypted?: boolean
    updatedAt?: boolean
    invoiceApiKeyEncrypted?: boolean
    invoiceApiUrlEncrypted?: boolean
    zohoClientIdEncrypted?: boolean
    zohoClientSecretEncrypted?: boolean
    zohoPipelineName?: boolean
    zohoRefreshTokenEncrypted?: boolean
    zohoStageName?: boolean
  }, ExtArgs["result"]["globalSettings"]>

  export type GlobalSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    aiProvider?: boolean
    aiModel?: boolean
    brandResonance?: boolean
    signature?: boolean
    groqApiKeyEncrypted?: boolean
    openaiApiKeyEncrypted?: boolean
    googleClientIdEncrypted?: boolean
    googleClientSecretEncrypted?: boolean
    googleRefreshTokenEncrypted?: boolean
    googleEmailEncrypted?: boolean
    updatedAt?: boolean
    invoiceApiKeyEncrypted?: boolean
    invoiceApiUrlEncrypted?: boolean
    zohoClientIdEncrypted?: boolean
    zohoClientSecretEncrypted?: boolean
    zohoPipelineName?: boolean
    zohoRefreshTokenEncrypted?: boolean
    zohoStageName?: boolean
  }, ExtArgs["result"]["globalSettings"]>

  export type GlobalSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    aiProvider?: boolean
    aiModel?: boolean
    brandResonance?: boolean
    signature?: boolean
    groqApiKeyEncrypted?: boolean
    openaiApiKeyEncrypted?: boolean
    googleClientIdEncrypted?: boolean
    googleClientSecretEncrypted?: boolean
    googleRefreshTokenEncrypted?: boolean
    googleEmailEncrypted?: boolean
    updatedAt?: boolean
    invoiceApiKeyEncrypted?: boolean
    invoiceApiUrlEncrypted?: boolean
    zohoClientIdEncrypted?: boolean
    zohoClientSecretEncrypted?: boolean
    zohoPipelineName?: boolean
    zohoRefreshTokenEncrypted?: boolean
    zohoStageName?: boolean
  }, ExtArgs["result"]["globalSettings"]>

  export type GlobalSettingsSelectScalar = {
    id?: boolean
    aiProvider?: boolean
    aiModel?: boolean
    brandResonance?: boolean
    signature?: boolean
    groqApiKeyEncrypted?: boolean
    openaiApiKeyEncrypted?: boolean
    googleClientIdEncrypted?: boolean
    googleClientSecretEncrypted?: boolean
    googleRefreshTokenEncrypted?: boolean
    googleEmailEncrypted?: boolean
    updatedAt?: boolean
    invoiceApiKeyEncrypted?: boolean
    invoiceApiUrlEncrypted?: boolean
    zohoClientIdEncrypted?: boolean
    zohoClientSecretEncrypted?: boolean
    zohoPipelineName?: boolean
    zohoRefreshTokenEncrypted?: boolean
    zohoStageName?: boolean
  }

  export type GlobalSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "aiProvider" | "aiModel" | "brandResonance" | "signature" | "groqApiKeyEncrypted" | "openaiApiKeyEncrypted" | "googleClientIdEncrypted" | "googleClientSecretEncrypted" | "googleRefreshTokenEncrypted" | "googleEmailEncrypted" | "updatedAt" | "invoiceApiKeyEncrypted" | "invoiceApiUrlEncrypted" | "zohoClientIdEncrypted" | "zohoClientSecretEncrypted" | "zohoPipelineName" | "zohoRefreshTokenEncrypted" | "zohoStageName", ExtArgs["result"]["globalSettings"]>

  export type $GlobalSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GlobalSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      aiProvider: string
      aiModel: string
      brandResonance: string
      signature: string
      groqApiKeyEncrypted: string | null
      openaiApiKeyEncrypted: string | null
      googleClientIdEncrypted: string | null
      googleClientSecretEncrypted: string | null
      googleRefreshTokenEncrypted: string | null
      googleEmailEncrypted: string | null
      updatedAt: Date
      invoiceApiKeyEncrypted: string | null
      invoiceApiUrlEncrypted: string | null
      zohoClientIdEncrypted: string | null
      zohoClientSecretEncrypted: string | null
      zohoPipelineName: string | null
      zohoRefreshTokenEncrypted: string | null
      zohoStageName: string | null
    }, ExtArgs["result"]["globalSettings"]>
    composites: {}
  }

  type GlobalSettingsGetPayload<S extends boolean | null | undefined | GlobalSettingsDefaultArgs> = $Result.GetResult<Prisma.$GlobalSettingsPayload, S>

  type GlobalSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GlobalSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GlobalSettingsCountAggregateInputType | true
    }

  export interface GlobalSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GlobalSettings'], meta: { name: 'GlobalSettings' } }
    /**
     * Find zero or one GlobalSettings that matches the filter.
     * @param {GlobalSettingsFindUniqueArgs} args - Arguments to find a GlobalSettings
     * @example
     * // Get one GlobalSettings
     * const globalSettings = await prisma.globalSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GlobalSettingsFindUniqueArgs>(args: SelectSubset<T, GlobalSettingsFindUniqueArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GlobalSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GlobalSettingsFindUniqueOrThrowArgs} args - Arguments to find a GlobalSettings
     * @example
     * // Get one GlobalSettings
     * const globalSettings = await prisma.globalSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GlobalSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, GlobalSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GlobalSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalSettingsFindFirstArgs} args - Arguments to find a GlobalSettings
     * @example
     * // Get one GlobalSettings
     * const globalSettings = await prisma.globalSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GlobalSettingsFindFirstArgs>(args?: SelectSubset<T, GlobalSettingsFindFirstArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GlobalSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalSettingsFindFirstOrThrowArgs} args - Arguments to find a GlobalSettings
     * @example
     * // Get one GlobalSettings
     * const globalSettings = await prisma.globalSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GlobalSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, GlobalSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GlobalSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GlobalSettings
     * const globalSettings = await prisma.globalSettings.findMany()
     * 
     * // Get first 10 GlobalSettings
     * const globalSettings = await prisma.globalSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const globalSettingsWithIdOnly = await prisma.globalSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GlobalSettingsFindManyArgs>(args?: SelectSubset<T, GlobalSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GlobalSettings.
     * @param {GlobalSettingsCreateArgs} args - Arguments to create a GlobalSettings.
     * @example
     * // Create one GlobalSettings
     * const GlobalSettings = await prisma.globalSettings.create({
     *   data: {
     *     // ... data to create a GlobalSettings
     *   }
     * })
     * 
     */
    create<T extends GlobalSettingsCreateArgs>(args: SelectSubset<T, GlobalSettingsCreateArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GlobalSettings.
     * @param {GlobalSettingsCreateManyArgs} args - Arguments to create many GlobalSettings.
     * @example
     * // Create many GlobalSettings
     * const globalSettings = await prisma.globalSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GlobalSettingsCreateManyArgs>(args?: SelectSubset<T, GlobalSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GlobalSettings and returns the data saved in the database.
     * @param {GlobalSettingsCreateManyAndReturnArgs} args - Arguments to create many GlobalSettings.
     * @example
     * // Create many GlobalSettings
     * const globalSettings = await prisma.globalSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GlobalSettings and only return the `id`
     * const globalSettingsWithIdOnly = await prisma.globalSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GlobalSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, GlobalSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GlobalSettings.
     * @param {GlobalSettingsDeleteArgs} args - Arguments to delete one GlobalSettings.
     * @example
     * // Delete one GlobalSettings
     * const GlobalSettings = await prisma.globalSettings.delete({
     *   where: {
     *     // ... filter to delete one GlobalSettings
     *   }
     * })
     * 
     */
    delete<T extends GlobalSettingsDeleteArgs>(args: SelectSubset<T, GlobalSettingsDeleteArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GlobalSettings.
     * @param {GlobalSettingsUpdateArgs} args - Arguments to update one GlobalSettings.
     * @example
     * // Update one GlobalSettings
     * const globalSettings = await prisma.globalSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GlobalSettingsUpdateArgs>(args: SelectSubset<T, GlobalSettingsUpdateArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GlobalSettings.
     * @param {GlobalSettingsDeleteManyArgs} args - Arguments to filter GlobalSettings to delete.
     * @example
     * // Delete a few GlobalSettings
     * const { count } = await prisma.globalSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GlobalSettingsDeleteManyArgs>(args?: SelectSubset<T, GlobalSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GlobalSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GlobalSettings
     * const globalSettings = await prisma.globalSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GlobalSettingsUpdateManyArgs>(args: SelectSubset<T, GlobalSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GlobalSettings and returns the data updated in the database.
     * @param {GlobalSettingsUpdateManyAndReturnArgs} args - Arguments to update many GlobalSettings.
     * @example
     * // Update many GlobalSettings
     * const globalSettings = await prisma.globalSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GlobalSettings and only return the `id`
     * const globalSettingsWithIdOnly = await prisma.globalSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GlobalSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, GlobalSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GlobalSettings.
     * @param {GlobalSettingsUpsertArgs} args - Arguments to update or create a GlobalSettings.
     * @example
     * // Update or create a GlobalSettings
     * const globalSettings = await prisma.globalSettings.upsert({
     *   create: {
     *     // ... data to create a GlobalSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GlobalSettings we want to update
     *   }
     * })
     */
    upsert<T extends GlobalSettingsUpsertArgs>(args: SelectSubset<T, GlobalSettingsUpsertArgs<ExtArgs>>): Prisma__GlobalSettingsClient<$Result.GetResult<Prisma.$GlobalSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GlobalSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalSettingsCountArgs} args - Arguments to filter GlobalSettings to count.
     * @example
     * // Count the number of GlobalSettings
     * const count = await prisma.globalSettings.count({
     *   where: {
     *     // ... the filter for the GlobalSettings we want to count
     *   }
     * })
    **/
    count<T extends GlobalSettingsCountArgs>(
      args?: Subset<T, GlobalSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GlobalSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GlobalSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GlobalSettingsAggregateArgs>(args: Subset<T, GlobalSettingsAggregateArgs>): Prisma.PrismaPromise<GetGlobalSettingsAggregateType<T>>

    /**
     * Group by GlobalSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GlobalSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GlobalSettingsGroupByArgs['orderBy'] }
        : { orderBy?: GlobalSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GlobalSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGlobalSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GlobalSettings model
   */
  readonly fields: GlobalSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GlobalSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GlobalSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GlobalSettings model
   */
  interface GlobalSettingsFieldRefs {
    readonly id: FieldRef<"GlobalSettings", 'String'>
    readonly aiProvider: FieldRef<"GlobalSettings", 'String'>
    readonly aiModel: FieldRef<"GlobalSettings", 'String'>
    readonly brandResonance: FieldRef<"GlobalSettings", 'String'>
    readonly signature: FieldRef<"GlobalSettings", 'String'>
    readonly groqApiKeyEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly openaiApiKeyEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly googleClientIdEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly googleClientSecretEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly googleRefreshTokenEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly googleEmailEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly updatedAt: FieldRef<"GlobalSettings", 'DateTime'>
    readonly invoiceApiKeyEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly invoiceApiUrlEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly zohoClientIdEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly zohoClientSecretEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly zohoPipelineName: FieldRef<"GlobalSettings", 'String'>
    readonly zohoRefreshTokenEncrypted: FieldRef<"GlobalSettings", 'String'>
    readonly zohoStageName: FieldRef<"GlobalSettings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GlobalSettings findUnique
   */
  export type GlobalSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * Filter, which GlobalSettings to fetch.
     */
    where: GlobalSettingsWhereUniqueInput
  }

  /**
   * GlobalSettings findUniqueOrThrow
   */
  export type GlobalSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * Filter, which GlobalSettings to fetch.
     */
    where: GlobalSettingsWhereUniqueInput
  }

  /**
   * GlobalSettings findFirst
   */
  export type GlobalSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * Filter, which GlobalSettings to fetch.
     */
    where?: GlobalSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalSettings to fetch.
     */
    orderBy?: GlobalSettingsOrderByWithRelationInput | GlobalSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalSettings.
     */
    cursor?: GlobalSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalSettings.
     */
    distinct?: GlobalSettingsScalarFieldEnum | GlobalSettingsScalarFieldEnum[]
  }

  /**
   * GlobalSettings findFirstOrThrow
   */
  export type GlobalSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * Filter, which GlobalSettings to fetch.
     */
    where?: GlobalSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalSettings to fetch.
     */
    orderBy?: GlobalSettingsOrderByWithRelationInput | GlobalSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalSettings.
     */
    cursor?: GlobalSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalSettings.
     */
    distinct?: GlobalSettingsScalarFieldEnum | GlobalSettingsScalarFieldEnum[]
  }

  /**
   * GlobalSettings findMany
   */
  export type GlobalSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * Filter, which GlobalSettings to fetch.
     */
    where?: GlobalSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalSettings to fetch.
     */
    orderBy?: GlobalSettingsOrderByWithRelationInput | GlobalSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GlobalSettings.
     */
    cursor?: GlobalSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalSettings.
     */
    skip?: number
    distinct?: GlobalSettingsScalarFieldEnum | GlobalSettingsScalarFieldEnum[]
  }

  /**
   * GlobalSettings create
   */
  export type GlobalSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a GlobalSettings.
     */
    data: XOR<GlobalSettingsCreateInput, GlobalSettingsUncheckedCreateInput>
  }

  /**
   * GlobalSettings createMany
   */
  export type GlobalSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GlobalSettings.
     */
    data: GlobalSettingsCreateManyInput | GlobalSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalSettings createManyAndReturn
   */
  export type GlobalSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many GlobalSettings.
     */
    data: GlobalSettingsCreateManyInput | GlobalSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalSettings update
   */
  export type GlobalSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a GlobalSettings.
     */
    data: XOR<GlobalSettingsUpdateInput, GlobalSettingsUncheckedUpdateInput>
    /**
     * Choose, which GlobalSettings to update.
     */
    where: GlobalSettingsWhereUniqueInput
  }

  /**
   * GlobalSettings updateMany
   */
  export type GlobalSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GlobalSettings.
     */
    data: XOR<GlobalSettingsUpdateManyMutationInput, GlobalSettingsUncheckedUpdateManyInput>
    /**
     * Filter which GlobalSettings to update
     */
    where?: GlobalSettingsWhereInput
    /**
     * Limit how many GlobalSettings to update.
     */
    limit?: number
  }

  /**
   * GlobalSettings updateManyAndReturn
   */
  export type GlobalSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * The data used to update GlobalSettings.
     */
    data: XOR<GlobalSettingsUpdateManyMutationInput, GlobalSettingsUncheckedUpdateManyInput>
    /**
     * Filter which GlobalSettings to update
     */
    where?: GlobalSettingsWhereInput
    /**
     * Limit how many GlobalSettings to update.
     */
    limit?: number
  }

  /**
   * GlobalSettings upsert
   */
  export type GlobalSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the GlobalSettings to update in case it exists.
     */
    where: GlobalSettingsWhereUniqueInput
    /**
     * In case the GlobalSettings found by the `where` argument doesn't exist, create a new GlobalSettings with this data.
     */
    create: XOR<GlobalSettingsCreateInput, GlobalSettingsUncheckedCreateInput>
    /**
     * In case the GlobalSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GlobalSettingsUpdateInput, GlobalSettingsUncheckedUpdateInput>
  }

  /**
   * GlobalSettings delete
   */
  export type GlobalSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
    /**
     * Filter which GlobalSettings to delete.
     */
    where: GlobalSettingsWhereUniqueInput
  }

  /**
   * GlobalSettings deleteMany
   */
  export type GlobalSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalSettings to delete
     */
    where?: GlobalSettingsWhereInput
    /**
     * Limit how many GlobalSettings to delete.
     */
    limit?: number
  }

  /**
   * GlobalSettings without action
   */
  export type GlobalSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalSettings
     */
    select?: GlobalSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalSettings
     */
    omit?: GlobalSettingsOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    status: $Enums.UserStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    role: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    passwordHash: string
    role: $Enums.UserRole
    status: $Enums.UserStatus
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "role" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      passwordHash: string
      role: $Enums.UserRole
      status: $Enums.UserStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model GmailAccount
   */

  export type AggregateGmailAccount = {
    _count: GmailAccountCountAggregateOutputType | null
    _min: GmailAccountMinAggregateOutputType | null
    _max: GmailAccountMaxAggregateOutputType | null
  }

  export type GmailAccountMinAggregateOutputType = {
    id: string | null
    accountName: string | null
    email: string | null
    refreshTokenEncrypted: string | null
    accessTokenEncrypted: string | null
    expiresAt: Date | null
    updatedAt: Date | null
  }

  export type GmailAccountMaxAggregateOutputType = {
    id: string | null
    accountName: string | null
    email: string | null
    refreshTokenEncrypted: string | null
    accessTokenEncrypted: string | null
    expiresAt: Date | null
    updatedAt: Date | null
  }

  export type GmailAccountCountAggregateOutputType = {
    id: number
    accountName: number
    email: number
    refreshTokenEncrypted: number
    accessTokenEncrypted: number
    expiresAt: number
    updatedAt: number
    _all: number
  }


  export type GmailAccountMinAggregateInputType = {
    id?: true
    accountName?: true
    email?: true
    refreshTokenEncrypted?: true
    accessTokenEncrypted?: true
    expiresAt?: true
    updatedAt?: true
  }

  export type GmailAccountMaxAggregateInputType = {
    id?: true
    accountName?: true
    email?: true
    refreshTokenEncrypted?: true
    accessTokenEncrypted?: true
    expiresAt?: true
    updatedAt?: true
  }

  export type GmailAccountCountAggregateInputType = {
    id?: true
    accountName?: true
    email?: true
    refreshTokenEncrypted?: true
    accessTokenEncrypted?: true
    expiresAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GmailAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GmailAccount to aggregate.
     */
    where?: GmailAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GmailAccounts to fetch.
     */
    orderBy?: GmailAccountOrderByWithRelationInput | GmailAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GmailAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GmailAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GmailAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GmailAccounts
    **/
    _count?: true | GmailAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GmailAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GmailAccountMaxAggregateInputType
  }

  export type GetGmailAccountAggregateType<T extends GmailAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateGmailAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGmailAccount[P]>
      : GetScalarType<T[P], AggregateGmailAccount[P]>
  }




  export type GmailAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GmailAccountWhereInput
    orderBy?: GmailAccountOrderByWithAggregationInput | GmailAccountOrderByWithAggregationInput[]
    by: GmailAccountScalarFieldEnum[] | GmailAccountScalarFieldEnum
    having?: GmailAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GmailAccountCountAggregateInputType | true
    _min?: GmailAccountMinAggregateInputType
    _max?: GmailAccountMaxAggregateInputType
  }

  export type GmailAccountGroupByOutputType = {
    id: string
    accountName: string
    email: string
    refreshTokenEncrypted: string
    accessTokenEncrypted: string | null
    expiresAt: Date | null
    updatedAt: Date
    _count: GmailAccountCountAggregateOutputType | null
    _min: GmailAccountMinAggregateOutputType | null
    _max: GmailAccountMaxAggregateOutputType | null
  }

  type GetGmailAccountGroupByPayload<T extends GmailAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GmailAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GmailAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GmailAccountGroupByOutputType[P]>
            : GetScalarType<T[P], GmailAccountGroupByOutputType[P]>
        }
      >
    >


  export type GmailAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountName?: boolean
    email?: boolean
    refreshTokenEncrypted?: boolean
    accessTokenEncrypted?: boolean
    expiresAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gmailAccount"]>

  export type GmailAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountName?: boolean
    email?: boolean
    refreshTokenEncrypted?: boolean
    accessTokenEncrypted?: boolean
    expiresAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gmailAccount"]>

  export type GmailAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountName?: boolean
    email?: boolean
    refreshTokenEncrypted?: boolean
    accessTokenEncrypted?: boolean
    expiresAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gmailAccount"]>

  export type GmailAccountSelectScalar = {
    id?: boolean
    accountName?: boolean
    email?: boolean
    refreshTokenEncrypted?: boolean
    accessTokenEncrypted?: boolean
    expiresAt?: boolean
    updatedAt?: boolean
  }

  export type GmailAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountName" | "email" | "refreshTokenEncrypted" | "accessTokenEncrypted" | "expiresAt" | "updatedAt", ExtArgs["result"]["gmailAccount"]>

  export type $GmailAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GmailAccount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountName: string
      email: string
      refreshTokenEncrypted: string
      accessTokenEncrypted: string | null
      expiresAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["gmailAccount"]>
    composites: {}
  }

  type GmailAccountGetPayload<S extends boolean | null | undefined | GmailAccountDefaultArgs> = $Result.GetResult<Prisma.$GmailAccountPayload, S>

  type GmailAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GmailAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GmailAccountCountAggregateInputType | true
    }

  export interface GmailAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GmailAccount'], meta: { name: 'GmailAccount' } }
    /**
     * Find zero or one GmailAccount that matches the filter.
     * @param {GmailAccountFindUniqueArgs} args - Arguments to find a GmailAccount
     * @example
     * // Get one GmailAccount
     * const gmailAccount = await prisma.gmailAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GmailAccountFindUniqueArgs>(args: SelectSubset<T, GmailAccountFindUniqueArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GmailAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GmailAccountFindUniqueOrThrowArgs} args - Arguments to find a GmailAccount
     * @example
     * // Get one GmailAccount
     * const gmailAccount = await prisma.gmailAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GmailAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, GmailAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GmailAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GmailAccountFindFirstArgs} args - Arguments to find a GmailAccount
     * @example
     * // Get one GmailAccount
     * const gmailAccount = await prisma.gmailAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GmailAccountFindFirstArgs>(args?: SelectSubset<T, GmailAccountFindFirstArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GmailAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GmailAccountFindFirstOrThrowArgs} args - Arguments to find a GmailAccount
     * @example
     * // Get one GmailAccount
     * const gmailAccount = await prisma.gmailAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GmailAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, GmailAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GmailAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GmailAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GmailAccounts
     * const gmailAccounts = await prisma.gmailAccount.findMany()
     * 
     * // Get first 10 GmailAccounts
     * const gmailAccounts = await prisma.gmailAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gmailAccountWithIdOnly = await prisma.gmailAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GmailAccountFindManyArgs>(args?: SelectSubset<T, GmailAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GmailAccount.
     * @param {GmailAccountCreateArgs} args - Arguments to create a GmailAccount.
     * @example
     * // Create one GmailAccount
     * const GmailAccount = await prisma.gmailAccount.create({
     *   data: {
     *     // ... data to create a GmailAccount
     *   }
     * })
     * 
     */
    create<T extends GmailAccountCreateArgs>(args: SelectSubset<T, GmailAccountCreateArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GmailAccounts.
     * @param {GmailAccountCreateManyArgs} args - Arguments to create many GmailAccounts.
     * @example
     * // Create many GmailAccounts
     * const gmailAccount = await prisma.gmailAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GmailAccountCreateManyArgs>(args?: SelectSubset<T, GmailAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GmailAccounts and returns the data saved in the database.
     * @param {GmailAccountCreateManyAndReturnArgs} args - Arguments to create many GmailAccounts.
     * @example
     * // Create many GmailAccounts
     * const gmailAccount = await prisma.gmailAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GmailAccounts and only return the `id`
     * const gmailAccountWithIdOnly = await prisma.gmailAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GmailAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, GmailAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GmailAccount.
     * @param {GmailAccountDeleteArgs} args - Arguments to delete one GmailAccount.
     * @example
     * // Delete one GmailAccount
     * const GmailAccount = await prisma.gmailAccount.delete({
     *   where: {
     *     // ... filter to delete one GmailAccount
     *   }
     * })
     * 
     */
    delete<T extends GmailAccountDeleteArgs>(args: SelectSubset<T, GmailAccountDeleteArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GmailAccount.
     * @param {GmailAccountUpdateArgs} args - Arguments to update one GmailAccount.
     * @example
     * // Update one GmailAccount
     * const gmailAccount = await prisma.gmailAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GmailAccountUpdateArgs>(args: SelectSubset<T, GmailAccountUpdateArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GmailAccounts.
     * @param {GmailAccountDeleteManyArgs} args - Arguments to filter GmailAccounts to delete.
     * @example
     * // Delete a few GmailAccounts
     * const { count } = await prisma.gmailAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GmailAccountDeleteManyArgs>(args?: SelectSubset<T, GmailAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GmailAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GmailAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GmailAccounts
     * const gmailAccount = await prisma.gmailAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GmailAccountUpdateManyArgs>(args: SelectSubset<T, GmailAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GmailAccounts and returns the data updated in the database.
     * @param {GmailAccountUpdateManyAndReturnArgs} args - Arguments to update many GmailAccounts.
     * @example
     * // Update many GmailAccounts
     * const gmailAccount = await prisma.gmailAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GmailAccounts and only return the `id`
     * const gmailAccountWithIdOnly = await prisma.gmailAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GmailAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, GmailAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GmailAccount.
     * @param {GmailAccountUpsertArgs} args - Arguments to update or create a GmailAccount.
     * @example
     * // Update or create a GmailAccount
     * const gmailAccount = await prisma.gmailAccount.upsert({
     *   create: {
     *     // ... data to create a GmailAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GmailAccount we want to update
     *   }
     * })
     */
    upsert<T extends GmailAccountUpsertArgs>(args: SelectSubset<T, GmailAccountUpsertArgs<ExtArgs>>): Prisma__GmailAccountClient<$Result.GetResult<Prisma.$GmailAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GmailAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GmailAccountCountArgs} args - Arguments to filter GmailAccounts to count.
     * @example
     * // Count the number of GmailAccounts
     * const count = await prisma.gmailAccount.count({
     *   where: {
     *     // ... the filter for the GmailAccounts we want to count
     *   }
     * })
    **/
    count<T extends GmailAccountCountArgs>(
      args?: Subset<T, GmailAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GmailAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GmailAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GmailAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GmailAccountAggregateArgs>(args: Subset<T, GmailAccountAggregateArgs>): Prisma.PrismaPromise<GetGmailAccountAggregateType<T>>

    /**
     * Group by GmailAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GmailAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GmailAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GmailAccountGroupByArgs['orderBy'] }
        : { orderBy?: GmailAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GmailAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGmailAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GmailAccount model
   */
  readonly fields: GmailAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GmailAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GmailAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GmailAccount model
   */
  interface GmailAccountFieldRefs {
    readonly id: FieldRef<"GmailAccount", 'String'>
    readonly accountName: FieldRef<"GmailAccount", 'String'>
    readonly email: FieldRef<"GmailAccount", 'String'>
    readonly refreshTokenEncrypted: FieldRef<"GmailAccount", 'String'>
    readonly accessTokenEncrypted: FieldRef<"GmailAccount", 'String'>
    readonly expiresAt: FieldRef<"GmailAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"GmailAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GmailAccount findUnique
   */
  export type GmailAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * Filter, which GmailAccount to fetch.
     */
    where: GmailAccountWhereUniqueInput
  }

  /**
   * GmailAccount findUniqueOrThrow
   */
  export type GmailAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * Filter, which GmailAccount to fetch.
     */
    where: GmailAccountWhereUniqueInput
  }

  /**
   * GmailAccount findFirst
   */
  export type GmailAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * Filter, which GmailAccount to fetch.
     */
    where?: GmailAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GmailAccounts to fetch.
     */
    orderBy?: GmailAccountOrderByWithRelationInput | GmailAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GmailAccounts.
     */
    cursor?: GmailAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GmailAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GmailAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GmailAccounts.
     */
    distinct?: GmailAccountScalarFieldEnum | GmailAccountScalarFieldEnum[]
  }

  /**
   * GmailAccount findFirstOrThrow
   */
  export type GmailAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * Filter, which GmailAccount to fetch.
     */
    where?: GmailAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GmailAccounts to fetch.
     */
    orderBy?: GmailAccountOrderByWithRelationInput | GmailAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GmailAccounts.
     */
    cursor?: GmailAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GmailAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GmailAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GmailAccounts.
     */
    distinct?: GmailAccountScalarFieldEnum | GmailAccountScalarFieldEnum[]
  }

  /**
   * GmailAccount findMany
   */
  export type GmailAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * Filter, which GmailAccounts to fetch.
     */
    where?: GmailAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GmailAccounts to fetch.
     */
    orderBy?: GmailAccountOrderByWithRelationInput | GmailAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GmailAccounts.
     */
    cursor?: GmailAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GmailAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GmailAccounts.
     */
    skip?: number
    distinct?: GmailAccountScalarFieldEnum | GmailAccountScalarFieldEnum[]
  }

  /**
   * GmailAccount create
   */
  export type GmailAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * The data needed to create a GmailAccount.
     */
    data: XOR<GmailAccountCreateInput, GmailAccountUncheckedCreateInput>
  }

  /**
   * GmailAccount createMany
   */
  export type GmailAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GmailAccounts.
     */
    data: GmailAccountCreateManyInput | GmailAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GmailAccount createManyAndReturn
   */
  export type GmailAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * The data used to create many GmailAccounts.
     */
    data: GmailAccountCreateManyInput | GmailAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GmailAccount update
   */
  export type GmailAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * The data needed to update a GmailAccount.
     */
    data: XOR<GmailAccountUpdateInput, GmailAccountUncheckedUpdateInput>
    /**
     * Choose, which GmailAccount to update.
     */
    where: GmailAccountWhereUniqueInput
  }

  /**
   * GmailAccount updateMany
   */
  export type GmailAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GmailAccounts.
     */
    data: XOR<GmailAccountUpdateManyMutationInput, GmailAccountUncheckedUpdateManyInput>
    /**
     * Filter which GmailAccounts to update
     */
    where?: GmailAccountWhereInput
    /**
     * Limit how many GmailAccounts to update.
     */
    limit?: number
  }

  /**
   * GmailAccount updateManyAndReturn
   */
  export type GmailAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * The data used to update GmailAccounts.
     */
    data: XOR<GmailAccountUpdateManyMutationInput, GmailAccountUncheckedUpdateManyInput>
    /**
     * Filter which GmailAccounts to update
     */
    where?: GmailAccountWhereInput
    /**
     * Limit how many GmailAccounts to update.
     */
    limit?: number
  }

  /**
   * GmailAccount upsert
   */
  export type GmailAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * The filter to search for the GmailAccount to update in case it exists.
     */
    where: GmailAccountWhereUniqueInput
    /**
     * In case the GmailAccount found by the `where` argument doesn't exist, create a new GmailAccount with this data.
     */
    create: XOR<GmailAccountCreateInput, GmailAccountUncheckedCreateInput>
    /**
     * In case the GmailAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GmailAccountUpdateInput, GmailAccountUncheckedUpdateInput>
  }

  /**
   * GmailAccount delete
   */
  export type GmailAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
    /**
     * Filter which GmailAccount to delete.
     */
    where: GmailAccountWhereUniqueInput
  }

  /**
   * GmailAccount deleteMany
   */
  export type GmailAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GmailAccounts to delete
     */
    where?: GmailAccountWhereInput
    /**
     * Limit how many GmailAccounts to delete.
     */
    limit?: number
  }

  /**
   * GmailAccount without action
   */
  export type GmailAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GmailAccount
     */
    select?: GmailAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GmailAccount
     */
    omit?: GmailAccountOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ClientScalarFieldEnum: {
    id: 'id',
    clientName: 'clientName',
    contactPerson: 'contactPerson',
    email: 'email',
    industry: 'industry',
    relationshipLevel: 'relationshipLevel',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    externalId: 'externalId',
    source: 'source',
    zohoTags: 'zohoTags',
    gmailSourceAccount: 'gmailSourceAccount',
    lastContacted: 'lastContacted',
    isRoleBased: 'isRoleBased'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const ServiceScalarFieldEnum: {
    id: 'id',
    serviceName: 'serviceName',
    category: 'category',
    description: 'description'
  };

  export type ServiceScalarFieldEnum = (typeof ServiceScalarFieldEnum)[keyof typeof ServiceScalarFieldEnum]


  export const CampaignHistoryScalarFieldEnum: {
    id: 'id',
    campaignType: 'campaignType',
    campaignTopic: 'campaignTopic',
    generatedOutput: 'generatedOutput',
    clientId: 'clientId',
    dateCreated: 'dateCreated'
  };

  export type CampaignHistoryScalarFieldEnum = (typeof CampaignHistoryScalarFieldEnum)[keyof typeof CampaignHistoryScalarFieldEnum]


  export const GlobalSettingsScalarFieldEnum: {
    id: 'id',
    aiProvider: 'aiProvider',
    aiModel: 'aiModel',
    brandResonance: 'brandResonance',
    signature: 'signature',
    groqApiKeyEncrypted: 'groqApiKeyEncrypted',
    openaiApiKeyEncrypted: 'openaiApiKeyEncrypted',
    googleClientIdEncrypted: 'googleClientIdEncrypted',
    googleClientSecretEncrypted: 'googleClientSecretEncrypted',
    googleRefreshTokenEncrypted: 'googleRefreshTokenEncrypted',
    googleEmailEncrypted: 'googleEmailEncrypted',
    updatedAt: 'updatedAt',
    invoiceApiKeyEncrypted: 'invoiceApiKeyEncrypted',
    invoiceApiUrlEncrypted: 'invoiceApiUrlEncrypted',
    zohoClientIdEncrypted: 'zohoClientIdEncrypted',
    zohoClientSecretEncrypted: 'zohoClientSecretEncrypted',
    zohoPipelineName: 'zohoPipelineName',
    zohoRefreshTokenEncrypted: 'zohoRefreshTokenEncrypted',
    zohoStageName: 'zohoStageName'
  };

  export type GlobalSettingsScalarFieldEnum = (typeof GlobalSettingsScalarFieldEnum)[keyof typeof GlobalSettingsScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const GmailAccountScalarFieldEnum: {
    id: 'id',
    accountName: 'accountName',
    email: 'email',
    refreshTokenEncrypted: 'refreshTokenEncrypted',
    accessTokenEncrypted: 'accessTokenEncrypted',
    expiresAt: 'expiresAt',
    updatedAt: 'updatedAt'
  };

  export type GmailAccountScalarFieldEnum = (typeof GmailAccountScalarFieldEnum)[keyof typeof GmailAccountScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ClientSource'
   */
  export type EnumClientSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientSource'>
    


  /**
   * Reference to a field of type 'ClientSource[]'
   */
  export type ListEnumClientSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientSource[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    clientName?: StringFilter<"Client"> | string
    contactPerson?: StringNullableFilter<"Client"> | string | null
    email?: StringFilter<"Client"> | string
    industry?: StringFilter<"Client"> | string
    relationshipLevel?: StringFilter<"Client"> | string
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    externalId?: StringNullableFilter<"Client"> | string | null
    source?: EnumClientSourceFilter<"Client"> | $Enums.ClientSource
    zohoTags?: StringNullableListFilter<"Client">
    gmailSourceAccount?: StringNullableFilter<"Client"> | string | null
    lastContacted?: DateTimeNullableFilter<"Client"> | Date | string | null
    isRoleBased?: BoolFilter<"Client"> | boolean
    campaigns?: CampaignHistoryListRelationFilter
    services?: ServiceListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    clientName?: SortOrder
    contactPerson?: SortOrderInput | SortOrder
    email?: SortOrder
    industry?: SortOrder
    relationshipLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    externalId?: SortOrderInput | SortOrder
    source?: SortOrder
    zohoTags?: SortOrder
    gmailSourceAccount?: SortOrderInput | SortOrder
    lastContacted?: SortOrderInput | SortOrder
    isRoleBased?: SortOrder
    campaigns?: CampaignHistoryOrderByRelationAggregateInput
    services?: ServiceOrderByRelationAggregateInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    source_externalId?: ClientSourceExternalIdCompoundUniqueInput
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    clientName?: StringFilter<"Client"> | string
    contactPerson?: StringNullableFilter<"Client"> | string | null
    email?: StringFilter<"Client"> | string
    industry?: StringFilter<"Client"> | string
    relationshipLevel?: StringFilter<"Client"> | string
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    externalId?: StringNullableFilter<"Client"> | string | null
    source?: EnumClientSourceFilter<"Client"> | $Enums.ClientSource
    zohoTags?: StringNullableListFilter<"Client">
    gmailSourceAccount?: StringNullableFilter<"Client"> | string | null
    lastContacted?: DateTimeNullableFilter<"Client"> | Date | string | null
    isRoleBased?: BoolFilter<"Client"> | boolean
    campaigns?: CampaignHistoryListRelationFilter
    services?: ServiceListRelationFilter
  }, "id" | "source_externalId">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    clientName?: SortOrder
    contactPerson?: SortOrderInput | SortOrder
    email?: SortOrder
    industry?: SortOrder
    relationshipLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    externalId?: SortOrderInput | SortOrder
    source?: SortOrder
    zohoTags?: SortOrder
    gmailSourceAccount?: SortOrderInput | SortOrder
    lastContacted?: SortOrderInput | SortOrder
    isRoleBased?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    clientName?: StringWithAggregatesFilter<"Client"> | string
    contactPerson?: StringNullableWithAggregatesFilter<"Client"> | string | null
    email?: StringWithAggregatesFilter<"Client"> | string
    industry?: StringWithAggregatesFilter<"Client"> | string
    relationshipLevel?: StringWithAggregatesFilter<"Client"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    externalId?: StringNullableWithAggregatesFilter<"Client"> | string | null
    source?: EnumClientSourceWithAggregatesFilter<"Client"> | $Enums.ClientSource
    zohoTags?: StringNullableListFilter<"Client">
    gmailSourceAccount?: StringNullableWithAggregatesFilter<"Client"> | string | null
    lastContacted?: DateTimeNullableWithAggregatesFilter<"Client"> | Date | string | null
    isRoleBased?: BoolWithAggregatesFilter<"Client"> | boolean
  }

  export type ServiceWhereInput = {
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    id?: StringFilter<"Service"> | string
    serviceName?: StringFilter<"Service"> | string
    category?: StringNullableFilter<"Service"> | string | null
    description?: StringNullableFilter<"Service"> | string | null
    clients?: ClientListRelationFilter
  }

  export type ServiceOrderByWithRelationInput = {
    id?: SortOrder
    serviceName?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    clients?: ClientOrderByRelationAggregateInput
  }

  export type ServiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    serviceName?: string
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    category?: StringNullableFilter<"Service"> | string | null
    description?: StringNullableFilter<"Service"> | string | null
    clients?: ClientListRelationFilter
  }, "id" | "serviceName">

  export type ServiceOrderByWithAggregationInput = {
    id?: SortOrder
    serviceName?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    _count?: ServiceCountOrderByAggregateInput
    _max?: ServiceMaxOrderByAggregateInput
    _min?: ServiceMinOrderByAggregateInput
  }

  export type ServiceScalarWhereWithAggregatesInput = {
    AND?: ServiceScalarWhereWithAggregatesInput | ServiceScalarWhereWithAggregatesInput[]
    OR?: ServiceScalarWhereWithAggregatesInput[]
    NOT?: ServiceScalarWhereWithAggregatesInput | ServiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Service"> | string
    serviceName?: StringWithAggregatesFilter<"Service"> | string
    category?: StringNullableWithAggregatesFilter<"Service"> | string | null
    description?: StringNullableWithAggregatesFilter<"Service"> | string | null
  }

  export type CampaignHistoryWhereInput = {
    AND?: CampaignHistoryWhereInput | CampaignHistoryWhereInput[]
    OR?: CampaignHistoryWhereInput[]
    NOT?: CampaignHistoryWhereInput | CampaignHistoryWhereInput[]
    id?: StringFilter<"CampaignHistory"> | string
    campaignType?: StringFilter<"CampaignHistory"> | string
    campaignTopic?: StringFilter<"CampaignHistory"> | string
    generatedOutput?: StringFilter<"CampaignHistory"> | string
    clientId?: StringNullableFilter<"CampaignHistory"> | string | null
    dateCreated?: DateTimeFilter<"CampaignHistory"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
  }

  export type CampaignHistoryOrderByWithRelationInput = {
    id?: SortOrder
    campaignType?: SortOrder
    campaignTopic?: SortOrder
    generatedOutput?: SortOrder
    clientId?: SortOrderInput | SortOrder
    dateCreated?: SortOrder
    client?: ClientOrderByWithRelationInput
  }

  export type CampaignHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CampaignHistoryWhereInput | CampaignHistoryWhereInput[]
    OR?: CampaignHistoryWhereInput[]
    NOT?: CampaignHistoryWhereInput | CampaignHistoryWhereInput[]
    campaignType?: StringFilter<"CampaignHistory"> | string
    campaignTopic?: StringFilter<"CampaignHistory"> | string
    generatedOutput?: StringFilter<"CampaignHistory"> | string
    clientId?: StringNullableFilter<"CampaignHistory"> | string | null
    dateCreated?: DateTimeFilter<"CampaignHistory"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
  }, "id">

  export type CampaignHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    campaignType?: SortOrder
    campaignTopic?: SortOrder
    generatedOutput?: SortOrder
    clientId?: SortOrderInput | SortOrder
    dateCreated?: SortOrder
    _count?: CampaignHistoryCountOrderByAggregateInput
    _max?: CampaignHistoryMaxOrderByAggregateInput
    _min?: CampaignHistoryMinOrderByAggregateInput
  }

  export type CampaignHistoryScalarWhereWithAggregatesInput = {
    AND?: CampaignHistoryScalarWhereWithAggregatesInput | CampaignHistoryScalarWhereWithAggregatesInput[]
    OR?: CampaignHistoryScalarWhereWithAggregatesInput[]
    NOT?: CampaignHistoryScalarWhereWithAggregatesInput | CampaignHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CampaignHistory"> | string
    campaignType?: StringWithAggregatesFilter<"CampaignHistory"> | string
    campaignTopic?: StringWithAggregatesFilter<"CampaignHistory"> | string
    generatedOutput?: StringWithAggregatesFilter<"CampaignHistory"> | string
    clientId?: StringNullableWithAggregatesFilter<"CampaignHistory"> | string | null
    dateCreated?: DateTimeWithAggregatesFilter<"CampaignHistory"> | Date | string
  }

  export type GlobalSettingsWhereInput = {
    AND?: GlobalSettingsWhereInput | GlobalSettingsWhereInput[]
    OR?: GlobalSettingsWhereInput[]
    NOT?: GlobalSettingsWhereInput | GlobalSettingsWhereInput[]
    id?: StringFilter<"GlobalSettings"> | string
    aiProvider?: StringFilter<"GlobalSettings"> | string
    aiModel?: StringFilter<"GlobalSettings"> | string
    brandResonance?: StringFilter<"GlobalSettings"> | string
    signature?: StringFilter<"GlobalSettings"> | string
    groqApiKeyEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    openaiApiKeyEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleClientIdEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleClientSecretEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleRefreshTokenEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleEmailEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    updatedAt?: DateTimeFilter<"GlobalSettings"> | Date | string
    invoiceApiKeyEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    invoiceApiUrlEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoClientIdEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoClientSecretEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoPipelineName?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoRefreshTokenEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoStageName?: StringNullableFilter<"GlobalSettings"> | string | null
  }

  export type GlobalSettingsOrderByWithRelationInput = {
    id?: SortOrder
    aiProvider?: SortOrder
    aiModel?: SortOrder
    brandResonance?: SortOrder
    signature?: SortOrder
    groqApiKeyEncrypted?: SortOrderInput | SortOrder
    openaiApiKeyEncrypted?: SortOrderInput | SortOrder
    googleClientIdEncrypted?: SortOrderInput | SortOrder
    googleClientSecretEncrypted?: SortOrderInput | SortOrder
    googleRefreshTokenEncrypted?: SortOrderInput | SortOrder
    googleEmailEncrypted?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    invoiceApiKeyEncrypted?: SortOrderInput | SortOrder
    invoiceApiUrlEncrypted?: SortOrderInput | SortOrder
    zohoClientIdEncrypted?: SortOrderInput | SortOrder
    zohoClientSecretEncrypted?: SortOrderInput | SortOrder
    zohoPipelineName?: SortOrderInput | SortOrder
    zohoRefreshTokenEncrypted?: SortOrderInput | SortOrder
    zohoStageName?: SortOrderInput | SortOrder
  }

  export type GlobalSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GlobalSettingsWhereInput | GlobalSettingsWhereInput[]
    OR?: GlobalSettingsWhereInput[]
    NOT?: GlobalSettingsWhereInput | GlobalSettingsWhereInput[]
    aiProvider?: StringFilter<"GlobalSettings"> | string
    aiModel?: StringFilter<"GlobalSettings"> | string
    brandResonance?: StringFilter<"GlobalSettings"> | string
    signature?: StringFilter<"GlobalSettings"> | string
    groqApiKeyEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    openaiApiKeyEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleClientIdEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleClientSecretEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleRefreshTokenEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    googleEmailEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    updatedAt?: DateTimeFilter<"GlobalSettings"> | Date | string
    invoiceApiKeyEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    invoiceApiUrlEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoClientIdEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoClientSecretEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoPipelineName?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoRefreshTokenEncrypted?: StringNullableFilter<"GlobalSettings"> | string | null
    zohoStageName?: StringNullableFilter<"GlobalSettings"> | string | null
  }, "id">

  export type GlobalSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    aiProvider?: SortOrder
    aiModel?: SortOrder
    brandResonance?: SortOrder
    signature?: SortOrder
    groqApiKeyEncrypted?: SortOrderInput | SortOrder
    openaiApiKeyEncrypted?: SortOrderInput | SortOrder
    googleClientIdEncrypted?: SortOrderInput | SortOrder
    googleClientSecretEncrypted?: SortOrderInput | SortOrder
    googleRefreshTokenEncrypted?: SortOrderInput | SortOrder
    googleEmailEncrypted?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    invoiceApiKeyEncrypted?: SortOrderInput | SortOrder
    invoiceApiUrlEncrypted?: SortOrderInput | SortOrder
    zohoClientIdEncrypted?: SortOrderInput | SortOrder
    zohoClientSecretEncrypted?: SortOrderInput | SortOrder
    zohoPipelineName?: SortOrderInput | SortOrder
    zohoRefreshTokenEncrypted?: SortOrderInput | SortOrder
    zohoStageName?: SortOrderInput | SortOrder
    _count?: GlobalSettingsCountOrderByAggregateInput
    _max?: GlobalSettingsMaxOrderByAggregateInput
    _min?: GlobalSettingsMinOrderByAggregateInput
  }

  export type GlobalSettingsScalarWhereWithAggregatesInput = {
    AND?: GlobalSettingsScalarWhereWithAggregatesInput | GlobalSettingsScalarWhereWithAggregatesInput[]
    OR?: GlobalSettingsScalarWhereWithAggregatesInput[]
    NOT?: GlobalSettingsScalarWhereWithAggregatesInput | GlobalSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GlobalSettings"> | string
    aiProvider?: StringWithAggregatesFilter<"GlobalSettings"> | string
    aiModel?: StringWithAggregatesFilter<"GlobalSettings"> | string
    brandResonance?: StringWithAggregatesFilter<"GlobalSettings"> | string
    signature?: StringWithAggregatesFilter<"GlobalSettings"> | string
    groqApiKeyEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    openaiApiKeyEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    googleClientIdEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    googleClientSecretEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    googleRefreshTokenEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    googleEmailEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"GlobalSettings"> | Date | string
    invoiceApiKeyEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    invoiceApiUrlEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    zohoClientIdEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    zohoClientSecretEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    zohoPipelineName?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    zohoRefreshTokenEncrypted?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
    zohoStageName?: StringNullableWithAggregatesFilter<"GlobalSettings"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type GmailAccountWhereInput = {
    AND?: GmailAccountWhereInput | GmailAccountWhereInput[]
    OR?: GmailAccountWhereInput[]
    NOT?: GmailAccountWhereInput | GmailAccountWhereInput[]
    id?: StringFilter<"GmailAccount"> | string
    accountName?: StringFilter<"GmailAccount"> | string
    email?: StringFilter<"GmailAccount"> | string
    refreshTokenEncrypted?: StringFilter<"GmailAccount"> | string
    accessTokenEncrypted?: StringNullableFilter<"GmailAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"GmailAccount"> | Date | string | null
    updatedAt?: DateTimeFilter<"GmailAccount"> | Date | string
  }

  export type GmailAccountOrderByWithRelationInput = {
    id?: SortOrder
    accountName?: SortOrder
    email?: SortOrder
    refreshTokenEncrypted?: SortOrder
    accessTokenEncrypted?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type GmailAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: GmailAccountWhereInput | GmailAccountWhereInput[]
    OR?: GmailAccountWhereInput[]
    NOT?: GmailAccountWhereInput | GmailAccountWhereInput[]
    accountName?: StringFilter<"GmailAccount"> | string
    refreshTokenEncrypted?: StringFilter<"GmailAccount"> | string
    accessTokenEncrypted?: StringNullableFilter<"GmailAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"GmailAccount"> | Date | string | null
    updatedAt?: DateTimeFilter<"GmailAccount"> | Date | string
  }, "id" | "email">

  export type GmailAccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountName?: SortOrder
    email?: SortOrder
    refreshTokenEncrypted?: SortOrder
    accessTokenEncrypted?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: GmailAccountCountOrderByAggregateInput
    _max?: GmailAccountMaxOrderByAggregateInput
    _min?: GmailAccountMinOrderByAggregateInput
  }

  export type GmailAccountScalarWhereWithAggregatesInput = {
    AND?: GmailAccountScalarWhereWithAggregatesInput | GmailAccountScalarWhereWithAggregatesInput[]
    OR?: GmailAccountScalarWhereWithAggregatesInput[]
    NOT?: GmailAccountScalarWhereWithAggregatesInput | GmailAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GmailAccount"> | string
    accountName?: StringWithAggregatesFilter<"GmailAccount"> | string
    email?: StringWithAggregatesFilter<"GmailAccount"> | string
    refreshTokenEncrypted?: StringWithAggregatesFilter<"GmailAccount"> | string
    accessTokenEncrypted?: StringNullableWithAggregatesFilter<"GmailAccount"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"GmailAccount"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"GmailAccount"> | Date | string
  }

  export type ClientCreateInput = {
    id?: string
    clientName: string
    contactPerson?: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt?: Date | string
    updatedAt?: Date | string
    externalId?: string | null
    source?: $Enums.ClientSource
    zohoTags?: ClientCreatezohoTagsInput | string[]
    gmailSourceAccount?: string | null
    lastContacted?: Date | string | null
    isRoleBased?: boolean
    campaigns?: CampaignHistoryCreateNestedManyWithoutClientInput
    services?: ServiceCreateNestedManyWithoutClientsInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    clientName: string
    contactPerson?: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt?: Date | string
    updatedAt?: Date | string
    externalId?: string | null
    source?: $Enums.ClientSource
    zohoTags?: ClientCreatezohoTagsInput | string[]
    gmailSourceAccount?: string | null
    lastContacted?: Date | string | null
    isRoleBased?: boolean
    campaigns?: CampaignHistoryUncheckedCreateNestedManyWithoutClientInput
    services?: ServiceUncheckedCreateNestedManyWithoutClientsInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
    campaigns?: CampaignHistoryUpdateManyWithoutClientNestedInput
    services?: ServiceUpdateManyWithoutClientsNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
    campaigns?: CampaignHistoryUncheckedUpdateManyWithoutClientNestedInput
    services?: ServiceUncheckedUpdateManyWithoutClientsNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    clientName: string
    contactPerson?: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt?: Date | string
    updatedAt?: Date | string
    externalId?: string | null
    source?: $Enums.ClientSource
    zohoTags?: ClientCreatezohoTagsInput | string[]
    gmailSourceAccount?: string | null
    lastContacted?: Date | string | null
    isRoleBased?: boolean
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ServiceCreateInput = {
    id?: string
    serviceName: string
    category?: string | null
    description?: string | null
    clients?: ClientCreateNestedManyWithoutServicesInput
  }

  export type ServiceUncheckedCreateInput = {
    id?: string
    serviceName: string
    category?: string | null
    description?: string | null
    clients?: ClientUncheckedCreateNestedManyWithoutServicesInput
  }

  export type ServiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clients?: ClientUpdateManyWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clients?: ClientUncheckedUpdateManyWithoutServicesNestedInput
  }

  export type ServiceCreateManyInput = {
    id?: string
    serviceName: string
    category?: string | null
    description?: string | null
  }

  export type ServiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ServiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CampaignHistoryCreateInput = {
    id?: string
    campaignType: string
    campaignTopic: string
    generatedOutput: string
    dateCreated?: Date | string
    client?: ClientCreateNestedOneWithoutCampaignsInput
  }

  export type CampaignHistoryUncheckedCreateInput = {
    id?: string
    campaignType: string
    campaignTopic: string
    generatedOutput: string
    clientId?: string | null
    dateCreated?: Date | string
  }

  export type CampaignHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignType?: StringFieldUpdateOperationsInput | string
    campaignTopic?: StringFieldUpdateOperationsInput | string
    generatedOutput?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneWithoutCampaignsNestedInput
  }

  export type CampaignHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignType?: StringFieldUpdateOperationsInput | string
    campaignTopic?: StringFieldUpdateOperationsInput | string
    generatedOutput?: StringFieldUpdateOperationsInput | string
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignHistoryCreateManyInput = {
    id?: string
    campaignType: string
    campaignTopic: string
    generatedOutput: string
    clientId?: string | null
    dateCreated?: Date | string
  }

  export type CampaignHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignType?: StringFieldUpdateOperationsInput | string
    campaignTopic?: StringFieldUpdateOperationsInput | string
    generatedOutput?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignType?: StringFieldUpdateOperationsInput | string
    campaignTopic?: StringFieldUpdateOperationsInput | string
    generatedOutput?: StringFieldUpdateOperationsInput | string
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalSettingsCreateInput = {
    id?: string
    aiProvider?: string
    aiModel?: string
    brandResonance?: string
    signature?: string
    groqApiKeyEncrypted?: string | null
    openaiApiKeyEncrypted?: string | null
    googleClientIdEncrypted?: string | null
    googleClientSecretEncrypted?: string | null
    googleRefreshTokenEncrypted?: string | null
    googleEmailEncrypted?: string | null
    updatedAt?: Date | string
    invoiceApiKeyEncrypted?: string | null
    invoiceApiUrlEncrypted?: string | null
    zohoClientIdEncrypted?: string | null
    zohoClientSecretEncrypted?: string | null
    zohoPipelineName?: string | null
    zohoRefreshTokenEncrypted?: string | null
    zohoStageName?: string | null
  }

  export type GlobalSettingsUncheckedCreateInput = {
    id?: string
    aiProvider?: string
    aiModel?: string
    brandResonance?: string
    signature?: string
    groqApiKeyEncrypted?: string | null
    openaiApiKeyEncrypted?: string | null
    googleClientIdEncrypted?: string | null
    googleClientSecretEncrypted?: string | null
    googleRefreshTokenEncrypted?: string | null
    googleEmailEncrypted?: string | null
    updatedAt?: Date | string
    invoiceApiKeyEncrypted?: string | null
    invoiceApiUrlEncrypted?: string | null
    zohoClientIdEncrypted?: string | null
    zohoClientSecretEncrypted?: string | null
    zohoPipelineName?: string | null
    zohoRefreshTokenEncrypted?: string | null
    zohoStageName?: string | null
  }

  export type GlobalSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiProvider?: StringFieldUpdateOperationsInput | string
    aiModel?: StringFieldUpdateOperationsInput | string
    brandResonance?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    groqApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    openaiApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmailEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceApiUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoPipelineName?: NullableStringFieldUpdateOperationsInput | string | null
    zohoRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoStageName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GlobalSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiProvider?: StringFieldUpdateOperationsInput | string
    aiModel?: StringFieldUpdateOperationsInput | string
    brandResonance?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    groqApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    openaiApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmailEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceApiUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoPipelineName?: NullableStringFieldUpdateOperationsInput | string | null
    zohoRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoStageName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GlobalSettingsCreateManyInput = {
    id?: string
    aiProvider?: string
    aiModel?: string
    brandResonance?: string
    signature?: string
    groqApiKeyEncrypted?: string | null
    openaiApiKeyEncrypted?: string | null
    googleClientIdEncrypted?: string | null
    googleClientSecretEncrypted?: string | null
    googleRefreshTokenEncrypted?: string | null
    googleEmailEncrypted?: string | null
    updatedAt?: Date | string
    invoiceApiKeyEncrypted?: string | null
    invoiceApiUrlEncrypted?: string | null
    zohoClientIdEncrypted?: string | null
    zohoClientSecretEncrypted?: string | null
    zohoPipelineName?: string | null
    zohoRefreshTokenEncrypted?: string | null
    zohoStageName?: string | null
  }

  export type GlobalSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiProvider?: StringFieldUpdateOperationsInput | string
    aiModel?: StringFieldUpdateOperationsInput | string
    brandResonance?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    groqApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    openaiApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmailEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceApiUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoPipelineName?: NullableStringFieldUpdateOperationsInput | string | null
    zohoRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoStageName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GlobalSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    aiProvider?: StringFieldUpdateOperationsInput | string
    aiModel?: StringFieldUpdateOperationsInput | string
    brandResonance?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    groqApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    openaiApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmailEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceApiKeyEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceApiUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientIdEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoClientSecretEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoPipelineName?: NullableStringFieldUpdateOperationsInput | string | null
    zohoRefreshTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    zohoStageName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    passwordHash: string
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GmailAccountCreateInput = {
    id?: string
    accountName: string
    email: string
    refreshTokenEncrypted: string
    accessTokenEncrypted?: string | null
    expiresAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type GmailAccountUncheckedCreateInput = {
    id?: string
    accountName: string
    email: string
    refreshTokenEncrypted: string
    accessTokenEncrypted?: string | null
    expiresAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type GmailAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    refreshTokenEncrypted?: StringFieldUpdateOperationsInput | string
    accessTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GmailAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    refreshTokenEncrypted?: StringFieldUpdateOperationsInput | string
    accessTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GmailAccountCreateManyInput = {
    id?: string
    accountName: string
    email: string
    refreshTokenEncrypted: string
    accessTokenEncrypted?: string | null
    expiresAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type GmailAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    refreshTokenEncrypted?: StringFieldUpdateOperationsInput | string
    accessTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GmailAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    refreshTokenEncrypted?: StringFieldUpdateOperationsInput | string
    accessTokenEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumClientSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientSource | EnumClientSourceFieldRefInput<$PrismaModel>
    in?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumClientSourceFilter<$PrismaModel> | $Enums.ClientSource
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CampaignHistoryListRelationFilter = {
    every?: CampaignHistoryWhereInput
    some?: CampaignHistoryWhereInput
    none?: CampaignHistoryWhereInput
  }

  export type ServiceListRelationFilter = {
    every?: ServiceWhereInput
    some?: ServiceWhereInput
    none?: ServiceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CampaignHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientSourceExternalIdCompoundUniqueInput = {
    source: $Enums.ClientSource
    externalId: string
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    industry?: SortOrder
    relationshipLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    externalId?: SortOrder
    source?: SortOrder
    zohoTags?: SortOrder
    gmailSourceAccount?: SortOrder
    lastContacted?: SortOrder
    isRoleBased?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    industry?: SortOrder
    relationshipLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    externalId?: SortOrder
    source?: SortOrder
    gmailSourceAccount?: SortOrder
    lastContacted?: SortOrder
    isRoleBased?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    contactPerson?: SortOrder
    email?: SortOrder
    industry?: SortOrder
    relationshipLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    externalId?: SortOrder
    source?: SortOrder
    gmailSourceAccount?: SortOrder
    lastContacted?: SortOrder
    isRoleBased?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumClientSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientSource | EnumClientSourceFieldRefInput<$PrismaModel>
    in?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumClientSourceWithAggregatesFilter<$PrismaModel> | $Enums.ClientSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClientSourceFilter<$PrismaModel>
    _max?: NestedEnumClientSourceFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ClientListRelationFilter = {
    every?: ClientWhereInput
    some?: ClientWhereInput
    none?: ClientWhereInput
  }

  export type ClientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServiceCountOrderByAggregateInput = {
    id?: SortOrder
    serviceName?: SortOrder
    category?: SortOrder
    description?: SortOrder
  }

  export type ServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    serviceName?: SortOrder
    category?: SortOrder
    description?: SortOrder
  }

  export type ServiceMinOrderByAggregateInput = {
    id?: SortOrder
    serviceName?: SortOrder
    category?: SortOrder
    description?: SortOrder
  }

  export type ClientNullableScalarRelationFilter = {
    is?: ClientWhereInput | null
    isNot?: ClientWhereInput | null
  }

  export type CampaignHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    campaignType?: SortOrder
    campaignTopic?: SortOrder
    generatedOutput?: SortOrder
    clientId?: SortOrder
    dateCreated?: SortOrder
  }

  export type CampaignHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignType?: SortOrder
    campaignTopic?: SortOrder
    generatedOutput?: SortOrder
    clientId?: SortOrder
    dateCreated?: SortOrder
  }

  export type CampaignHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    campaignType?: SortOrder
    campaignTopic?: SortOrder
    generatedOutput?: SortOrder
    clientId?: SortOrder
    dateCreated?: SortOrder
  }

  export type GlobalSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    aiProvider?: SortOrder
    aiModel?: SortOrder
    brandResonance?: SortOrder
    signature?: SortOrder
    groqApiKeyEncrypted?: SortOrder
    openaiApiKeyEncrypted?: SortOrder
    googleClientIdEncrypted?: SortOrder
    googleClientSecretEncrypted?: SortOrder
    googleRefreshTokenEncrypted?: SortOrder
    googleEmailEncrypted?: SortOrder
    updatedAt?: SortOrder
    invoiceApiKeyEncrypted?: SortOrder
    invoiceApiUrlEncrypted?: SortOrder
    zohoClientIdEncrypted?: SortOrder
    zohoClientSecretEncrypted?: SortOrder
    zohoPipelineName?: SortOrder
    zohoRefreshTokenEncrypted?: SortOrder
    zohoStageName?: SortOrder
  }

  export type GlobalSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    aiProvider?: SortOrder
    aiModel?: SortOrder
    brandResonance?: SortOrder
    signature?: SortOrder
    groqApiKeyEncrypted?: SortOrder
    openaiApiKeyEncrypted?: SortOrder
    googleClientIdEncrypted?: SortOrder
    googleClientSecretEncrypted?: SortOrder
    googleRefreshTokenEncrypted?: SortOrder
    googleEmailEncrypted?: SortOrder
    updatedAt?: SortOrder
    invoiceApiKeyEncrypted?: SortOrder
    invoiceApiUrlEncrypted?: SortOrder
    zohoClientIdEncrypted?: SortOrder
    zohoClientSecretEncrypted?: SortOrder
    zohoPipelineName?: SortOrder
    zohoRefreshTokenEncrypted?: SortOrder
    zohoStageName?: SortOrder
  }

  export type GlobalSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    aiProvider?: SortOrder
    aiModel?: SortOrder
    brandResonance?: SortOrder
    signature?: SortOrder
    groqApiKeyEncrypted?: SortOrder
    openaiApiKeyEncrypted?: SortOrder
    googleClientIdEncrypted?: SortOrder
    googleClientSecretEncrypted?: SortOrder
    googleRefreshTokenEncrypted?: SortOrder
    googleEmailEncrypted?: SortOrder
    updatedAt?: SortOrder
    invoiceApiKeyEncrypted?: SortOrder
    invoiceApiUrlEncrypted?: SortOrder
    zohoClientIdEncrypted?: SortOrder
    zohoClientSecretEncrypted?: SortOrder
    zohoPipelineName?: SortOrder
    zohoRefreshTokenEncrypted?: SortOrder
    zohoStageName?: SortOrder
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type GmailAccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountName?: SortOrder
    email?: SortOrder
    refreshTokenEncrypted?: SortOrder
    accessTokenEncrypted?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GmailAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountName?: SortOrder
    email?: SortOrder
    refreshTokenEncrypted?: SortOrder
    accessTokenEncrypted?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GmailAccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountName?: SortOrder
    email?: SortOrder
    refreshTokenEncrypted?: SortOrder
    accessTokenEncrypted?: SortOrder
    expiresAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientCreatezohoTagsInput = {
    set: string[]
  }

  export type CampaignHistoryCreateNestedManyWithoutClientInput = {
    create?: XOR<CampaignHistoryCreateWithoutClientInput, CampaignHistoryUncheckedCreateWithoutClientInput> | CampaignHistoryCreateWithoutClientInput[] | CampaignHistoryUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CampaignHistoryCreateOrConnectWithoutClientInput | CampaignHistoryCreateOrConnectWithoutClientInput[]
    createMany?: CampaignHistoryCreateManyClientInputEnvelope
    connect?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
  }

  export type ServiceCreateNestedManyWithoutClientsInput = {
    create?: XOR<ServiceCreateWithoutClientsInput, ServiceUncheckedCreateWithoutClientsInput> | ServiceCreateWithoutClientsInput[] | ServiceUncheckedCreateWithoutClientsInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutClientsInput | ServiceCreateOrConnectWithoutClientsInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type CampaignHistoryUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<CampaignHistoryCreateWithoutClientInput, CampaignHistoryUncheckedCreateWithoutClientInput> | CampaignHistoryCreateWithoutClientInput[] | CampaignHistoryUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CampaignHistoryCreateOrConnectWithoutClientInput | CampaignHistoryCreateOrConnectWithoutClientInput[]
    createMany?: CampaignHistoryCreateManyClientInputEnvelope
    connect?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
  }

  export type ServiceUncheckedCreateNestedManyWithoutClientsInput = {
    create?: XOR<ServiceCreateWithoutClientsInput, ServiceUncheckedCreateWithoutClientsInput> | ServiceCreateWithoutClientsInput[] | ServiceUncheckedCreateWithoutClientsInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutClientsInput | ServiceCreateOrConnectWithoutClientsInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumClientSourceFieldUpdateOperationsInput = {
    set?: $Enums.ClientSource
  }

  export type ClientUpdatezohoTagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CampaignHistoryUpdateManyWithoutClientNestedInput = {
    create?: XOR<CampaignHistoryCreateWithoutClientInput, CampaignHistoryUncheckedCreateWithoutClientInput> | CampaignHistoryCreateWithoutClientInput[] | CampaignHistoryUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CampaignHistoryCreateOrConnectWithoutClientInput | CampaignHistoryCreateOrConnectWithoutClientInput[]
    upsert?: CampaignHistoryUpsertWithWhereUniqueWithoutClientInput | CampaignHistoryUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: CampaignHistoryCreateManyClientInputEnvelope
    set?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    disconnect?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    delete?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    connect?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    update?: CampaignHistoryUpdateWithWhereUniqueWithoutClientInput | CampaignHistoryUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: CampaignHistoryUpdateManyWithWhereWithoutClientInput | CampaignHistoryUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: CampaignHistoryScalarWhereInput | CampaignHistoryScalarWhereInput[]
  }

  export type ServiceUpdateManyWithoutClientsNestedInput = {
    create?: XOR<ServiceCreateWithoutClientsInput, ServiceUncheckedCreateWithoutClientsInput> | ServiceCreateWithoutClientsInput[] | ServiceUncheckedCreateWithoutClientsInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutClientsInput | ServiceCreateOrConnectWithoutClientsInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutClientsInput | ServiceUpsertWithWhereUniqueWithoutClientsInput[]
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutClientsInput | ServiceUpdateWithWhereUniqueWithoutClientsInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutClientsInput | ServiceUpdateManyWithWhereWithoutClientsInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type CampaignHistoryUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<CampaignHistoryCreateWithoutClientInput, CampaignHistoryUncheckedCreateWithoutClientInput> | CampaignHistoryCreateWithoutClientInput[] | CampaignHistoryUncheckedCreateWithoutClientInput[]
    connectOrCreate?: CampaignHistoryCreateOrConnectWithoutClientInput | CampaignHistoryCreateOrConnectWithoutClientInput[]
    upsert?: CampaignHistoryUpsertWithWhereUniqueWithoutClientInput | CampaignHistoryUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: CampaignHistoryCreateManyClientInputEnvelope
    set?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    disconnect?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    delete?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    connect?: CampaignHistoryWhereUniqueInput | CampaignHistoryWhereUniqueInput[]
    update?: CampaignHistoryUpdateWithWhereUniqueWithoutClientInput | CampaignHistoryUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: CampaignHistoryUpdateManyWithWhereWithoutClientInput | CampaignHistoryUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: CampaignHistoryScalarWhereInput | CampaignHistoryScalarWhereInput[]
  }

  export type ServiceUncheckedUpdateManyWithoutClientsNestedInput = {
    create?: XOR<ServiceCreateWithoutClientsInput, ServiceUncheckedCreateWithoutClientsInput> | ServiceCreateWithoutClientsInput[] | ServiceUncheckedCreateWithoutClientsInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutClientsInput | ServiceCreateOrConnectWithoutClientsInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutClientsInput | ServiceUpsertWithWhereUniqueWithoutClientsInput[]
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutClientsInput | ServiceUpdateWithWhereUniqueWithoutClientsInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutClientsInput | ServiceUpdateManyWithWhereWithoutClientsInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type ClientCreateNestedManyWithoutServicesInput = {
    create?: XOR<ClientCreateWithoutServicesInput, ClientUncheckedCreateWithoutServicesInput> | ClientCreateWithoutServicesInput[] | ClientUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutServicesInput | ClientCreateOrConnectWithoutServicesInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ClientUncheckedCreateNestedManyWithoutServicesInput = {
    create?: XOR<ClientCreateWithoutServicesInput, ClientUncheckedCreateWithoutServicesInput> | ClientCreateWithoutServicesInput[] | ClientUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutServicesInput | ClientCreateOrConnectWithoutServicesInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ClientUpdateManyWithoutServicesNestedInput = {
    create?: XOR<ClientCreateWithoutServicesInput, ClientUncheckedCreateWithoutServicesInput> | ClientCreateWithoutServicesInput[] | ClientUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutServicesInput | ClientCreateOrConnectWithoutServicesInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutServicesInput | ClientUpsertWithWhereUniqueWithoutServicesInput[]
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutServicesInput | ClientUpdateWithWhereUniqueWithoutServicesInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutServicesInput | ClientUpdateManyWithWhereWithoutServicesInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ClientUncheckedUpdateManyWithoutServicesNestedInput = {
    create?: XOR<ClientCreateWithoutServicesInput, ClientUncheckedCreateWithoutServicesInput> | ClientCreateWithoutServicesInput[] | ClientUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutServicesInput | ClientCreateOrConnectWithoutServicesInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutServicesInput | ClientUpsertWithWhereUniqueWithoutServicesInput[]
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutServicesInput | ClientUpdateWithWhereUniqueWithoutServicesInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutServicesInput | ClientUpdateManyWithWhereWithoutServicesInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ClientCreateNestedOneWithoutCampaignsInput = {
    create?: XOR<ClientCreateWithoutCampaignsInput, ClientUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutCampaignsInput
    connect?: ClientWhereUniqueInput
  }

  export type ClientUpdateOneWithoutCampaignsNestedInput = {
    create?: XOR<ClientCreateWithoutCampaignsInput, ClientUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutCampaignsInput
    upsert?: ClientUpsertWithoutCampaignsInput
    disconnect?: ClientWhereInput | boolean
    delete?: ClientWhereInput | boolean
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutCampaignsInput, ClientUpdateWithoutCampaignsInput>, ClientUncheckedUpdateWithoutCampaignsInput>
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumClientSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientSource | EnumClientSourceFieldRefInput<$PrismaModel>
    in?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumClientSourceFilter<$PrismaModel> | $Enums.ClientSource
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumClientSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientSource | EnumClientSourceFieldRefInput<$PrismaModel>
    in?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientSource[] | ListEnumClientSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumClientSourceWithAggregatesFilter<$PrismaModel> | $Enums.ClientSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClientSourceFilter<$PrismaModel>
    _max?: NestedEnumClientSourceFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type CampaignHistoryCreateWithoutClientInput = {
    id?: string
    campaignType: string
    campaignTopic: string
    generatedOutput: string
    dateCreated?: Date | string
  }

  export type CampaignHistoryUncheckedCreateWithoutClientInput = {
    id?: string
    campaignType: string
    campaignTopic: string
    generatedOutput: string
    dateCreated?: Date | string
  }

  export type CampaignHistoryCreateOrConnectWithoutClientInput = {
    where: CampaignHistoryWhereUniqueInput
    create: XOR<CampaignHistoryCreateWithoutClientInput, CampaignHistoryUncheckedCreateWithoutClientInput>
  }

  export type CampaignHistoryCreateManyClientInputEnvelope = {
    data: CampaignHistoryCreateManyClientInput | CampaignHistoryCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type ServiceCreateWithoutClientsInput = {
    id?: string
    serviceName: string
    category?: string | null
    description?: string | null
  }

  export type ServiceUncheckedCreateWithoutClientsInput = {
    id?: string
    serviceName: string
    category?: string | null
    description?: string | null
  }

  export type ServiceCreateOrConnectWithoutClientsInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutClientsInput, ServiceUncheckedCreateWithoutClientsInput>
  }

  export type CampaignHistoryUpsertWithWhereUniqueWithoutClientInput = {
    where: CampaignHistoryWhereUniqueInput
    update: XOR<CampaignHistoryUpdateWithoutClientInput, CampaignHistoryUncheckedUpdateWithoutClientInput>
    create: XOR<CampaignHistoryCreateWithoutClientInput, CampaignHistoryUncheckedCreateWithoutClientInput>
  }

  export type CampaignHistoryUpdateWithWhereUniqueWithoutClientInput = {
    where: CampaignHistoryWhereUniqueInput
    data: XOR<CampaignHistoryUpdateWithoutClientInput, CampaignHistoryUncheckedUpdateWithoutClientInput>
  }

  export type CampaignHistoryUpdateManyWithWhereWithoutClientInput = {
    where: CampaignHistoryScalarWhereInput
    data: XOR<CampaignHistoryUpdateManyMutationInput, CampaignHistoryUncheckedUpdateManyWithoutClientInput>
  }

  export type CampaignHistoryScalarWhereInput = {
    AND?: CampaignHistoryScalarWhereInput | CampaignHistoryScalarWhereInput[]
    OR?: CampaignHistoryScalarWhereInput[]
    NOT?: CampaignHistoryScalarWhereInput | CampaignHistoryScalarWhereInput[]
    id?: StringFilter<"CampaignHistory"> | string
    campaignType?: StringFilter<"CampaignHistory"> | string
    campaignTopic?: StringFilter<"CampaignHistory"> | string
    generatedOutput?: StringFilter<"CampaignHistory"> | string
    clientId?: StringNullableFilter<"CampaignHistory"> | string | null
    dateCreated?: DateTimeFilter<"CampaignHistory"> | Date | string
  }

  export type ServiceUpsertWithWhereUniqueWithoutClientsInput = {
    where: ServiceWhereUniqueInput
    update: XOR<ServiceUpdateWithoutClientsInput, ServiceUncheckedUpdateWithoutClientsInput>
    create: XOR<ServiceCreateWithoutClientsInput, ServiceUncheckedCreateWithoutClientsInput>
  }

  export type ServiceUpdateWithWhereUniqueWithoutClientsInput = {
    where: ServiceWhereUniqueInput
    data: XOR<ServiceUpdateWithoutClientsInput, ServiceUncheckedUpdateWithoutClientsInput>
  }

  export type ServiceUpdateManyWithWhereWithoutClientsInput = {
    where: ServiceScalarWhereInput
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyWithoutClientsInput>
  }

  export type ServiceScalarWhereInput = {
    AND?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
    OR?: ServiceScalarWhereInput[]
    NOT?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
    id?: StringFilter<"Service"> | string
    serviceName?: StringFilter<"Service"> | string
    category?: StringNullableFilter<"Service"> | string | null
    description?: StringNullableFilter<"Service"> | string | null
  }

  export type ClientCreateWithoutServicesInput = {
    id?: string
    clientName: string
    contactPerson?: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt?: Date | string
    updatedAt?: Date | string
    externalId?: string | null
    source?: $Enums.ClientSource
    zohoTags?: ClientCreatezohoTagsInput | string[]
    gmailSourceAccount?: string | null
    lastContacted?: Date | string | null
    isRoleBased?: boolean
    campaigns?: CampaignHistoryCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutServicesInput = {
    id?: string
    clientName: string
    contactPerson?: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt?: Date | string
    updatedAt?: Date | string
    externalId?: string | null
    source?: $Enums.ClientSource
    zohoTags?: ClientCreatezohoTagsInput | string[]
    gmailSourceAccount?: string | null
    lastContacted?: Date | string | null
    isRoleBased?: boolean
    campaigns?: CampaignHistoryUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutServicesInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutServicesInput, ClientUncheckedCreateWithoutServicesInput>
  }

  export type ClientUpsertWithWhereUniqueWithoutServicesInput = {
    where: ClientWhereUniqueInput
    update: XOR<ClientUpdateWithoutServicesInput, ClientUncheckedUpdateWithoutServicesInput>
    create: XOR<ClientCreateWithoutServicesInput, ClientUncheckedCreateWithoutServicesInput>
  }

  export type ClientUpdateWithWhereUniqueWithoutServicesInput = {
    where: ClientWhereUniqueInput
    data: XOR<ClientUpdateWithoutServicesInput, ClientUncheckedUpdateWithoutServicesInput>
  }

  export type ClientUpdateManyWithWhereWithoutServicesInput = {
    where: ClientScalarWhereInput
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyWithoutServicesInput>
  }

  export type ClientScalarWhereInput = {
    AND?: ClientScalarWhereInput | ClientScalarWhereInput[]
    OR?: ClientScalarWhereInput[]
    NOT?: ClientScalarWhereInput | ClientScalarWhereInput[]
    id?: StringFilter<"Client"> | string
    clientName?: StringFilter<"Client"> | string
    contactPerson?: StringNullableFilter<"Client"> | string | null
    email?: StringFilter<"Client"> | string
    industry?: StringFilter<"Client"> | string
    relationshipLevel?: StringFilter<"Client"> | string
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    externalId?: StringNullableFilter<"Client"> | string | null
    source?: EnumClientSourceFilter<"Client"> | $Enums.ClientSource
    zohoTags?: StringNullableListFilter<"Client">
    gmailSourceAccount?: StringNullableFilter<"Client"> | string | null
    lastContacted?: DateTimeNullableFilter<"Client"> | Date | string | null
    isRoleBased?: BoolFilter<"Client"> | boolean
  }

  export type ClientCreateWithoutCampaignsInput = {
    id?: string
    clientName: string
    contactPerson?: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt?: Date | string
    updatedAt?: Date | string
    externalId?: string | null
    source?: $Enums.ClientSource
    zohoTags?: ClientCreatezohoTagsInput | string[]
    gmailSourceAccount?: string | null
    lastContacted?: Date | string | null
    isRoleBased?: boolean
    services?: ServiceCreateNestedManyWithoutClientsInput
  }

  export type ClientUncheckedCreateWithoutCampaignsInput = {
    id?: string
    clientName: string
    contactPerson?: string | null
    email: string
    industry: string
    relationshipLevel: string
    createdAt?: Date | string
    updatedAt?: Date | string
    externalId?: string | null
    source?: $Enums.ClientSource
    zohoTags?: ClientCreatezohoTagsInput | string[]
    gmailSourceAccount?: string | null
    lastContacted?: Date | string | null
    isRoleBased?: boolean
    services?: ServiceUncheckedCreateNestedManyWithoutClientsInput
  }

  export type ClientCreateOrConnectWithoutCampaignsInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutCampaignsInput, ClientUncheckedCreateWithoutCampaignsInput>
  }

  export type ClientUpsertWithoutCampaignsInput = {
    update: XOR<ClientUpdateWithoutCampaignsInput, ClientUncheckedUpdateWithoutCampaignsInput>
    create: XOR<ClientCreateWithoutCampaignsInput, ClientUncheckedCreateWithoutCampaignsInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutCampaignsInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutCampaignsInput, ClientUncheckedUpdateWithoutCampaignsInput>
  }

  export type ClientUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
    services?: ServiceUpdateManyWithoutClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
    services?: ServiceUncheckedUpdateManyWithoutClientsNestedInput
  }

  export type CampaignHistoryCreateManyClientInput = {
    id?: string
    campaignType: string
    campaignTopic: string
    generatedOutput: string
    dateCreated?: Date | string
  }

  export type CampaignHistoryUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignType?: StringFieldUpdateOperationsInput | string
    campaignTopic?: StringFieldUpdateOperationsInput | string
    generatedOutput?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignHistoryUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignType?: StringFieldUpdateOperationsInput | string
    campaignTopic?: StringFieldUpdateOperationsInput | string
    generatedOutput?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CampaignHistoryUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignType?: StringFieldUpdateOperationsInput | string
    campaignTopic?: StringFieldUpdateOperationsInput | string
    generatedOutput?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ServiceUncheckedUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ServiceUncheckedUpdateManyWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceName?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClientUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
    campaigns?: CampaignHistoryUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
    campaigns?: CampaignHistoryUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateManyWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    contactPerson?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    industry?: StringFieldUpdateOperationsInput | string
    relationshipLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: EnumClientSourceFieldUpdateOperationsInput | $Enums.ClientSource
    zohoTags?: ClientUpdatezohoTagsInput | string[]
    gmailSourceAccount?: NullableStringFieldUpdateOperationsInput | string | null
    lastContacted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isRoleBased?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}