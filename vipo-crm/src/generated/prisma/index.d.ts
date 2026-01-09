
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
 * Model Business
 * 
 */
export type Business = $Result.DefaultSelection<Prisma.$BusinessPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Agent
 * 
 */
export type Agent = $Result.DefaultSelection<Prisma.$AgentPayload>
/**
 * Model Lead
 * 
 */
export type Lead = $Result.DefaultSelection<Prisma.$LeadPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Conversation
 * 
 */
export type Conversation = $Result.DefaultSelection<Prisma.$ConversationPayload>
/**
 * Model Interaction
 * 
 */
export type Interaction = $Result.DefaultSelection<Prisma.$InteractionPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model Attribution
 * 
 */
export type Attribution = $Result.DefaultSelection<Prisma.$AttributionPayload>
/**
 * Model AuditEvent
 * 
 */
export type AuditEvent = $Result.DefaultSelection<Prisma.$AuditEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  SUPER_ADMIN: 'SUPER_ADMIN',
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const LeadStatus: {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST'
};

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus]


export const ConversationChannel: {
  SITE: 'SITE',
  WHATSAPP: 'WHATSAPP',
  PHONE: 'PHONE',
  INTERNAL: 'INTERNAL'
};

export type ConversationChannel = (typeof ConversationChannel)[keyof typeof ConversationChannel]


export const ConversationStatus: {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_CUSTOMER: 'WAITING_CUSTOMER',
  FOLLOW_UP: 'FOLLOW_UP',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOST: 'CLOSED_LOST'
};

export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus]


export const InteractionType: {
  SITE_MESSAGE: 'SITE_MESSAGE',
  WHATSAPP_NOTE: 'WHATSAPP_NOTE',
  CALL_NOTE: 'CALL_NOTE',
  INTERNAL_NOTE: 'INTERNAL_NOTE',
  SYSTEM_EVENT: 'SYSTEM_EVENT'
};

export type InteractionType = (typeof InteractionType)[keyof typeof InteractionType]


export const TaskType: {
  FOLLOW_UP: 'FOLLOW_UP',
  CALL: 'CALL',
  SEND_INFO: 'SEND_INFO',
  OTHER: 'OTHER'
};

export type TaskType = (typeof TaskType)[keyof typeof TaskType]


export const TaskStatus: {
  OPEN: 'OPEN',
  DONE: 'DONE',
  OVERDUE: 'OVERDUE',
  CANCELED: 'CANCELED'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]


export const AttributionMethod: {
  LINK: 'LINK',
  COUPON: 'COUPON',
  MANUAL: 'MANUAL'
};

export type AttributionMethod = (typeof AttributionMethod)[keyof typeof AttributionMethod]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type LeadStatus = $Enums.LeadStatus

export const LeadStatus: typeof $Enums.LeadStatus

export type ConversationChannel = $Enums.ConversationChannel

export const ConversationChannel: typeof $Enums.ConversationChannel

export type ConversationStatus = $Enums.ConversationStatus

export const ConversationStatus: typeof $Enums.ConversationStatus

export type InteractionType = $Enums.InteractionType

export const InteractionType: typeof $Enums.InteractionType

export type TaskType = $Enums.TaskType

export const TaskType: typeof $Enums.TaskType

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

export type AttributionMethod = $Enums.AttributionMethod

export const AttributionMethod: typeof $Enums.AttributionMethod

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Businesses
 * const businesses = await prisma.business.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Businesses
   * const businesses = await prisma.business.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.business`: Exposes CRUD operations for the **Business** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Businesses
    * const businesses = await prisma.business.findMany()
    * ```
    */
  get business(): Prisma.BusinessDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.agent`: Exposes CRUD operations for the **Agent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Agents
    * const agents = await prisma.agent.findMany()
    * ```
    */
  get agent(): Prisma.AgentDelegate<ExtArgs>;

  /**
   * `prisma.lead`: Exposes CRUD operations for the **Lead** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leads
    * const leads = await prisma.lead.findMany()
    * ```
    */
  get lead(): Prisma.LeadDelegate<ExtArgs>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs>;

  /**
   * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conversations
    * const conversations = await prisma.conversation.findMany()
    * ```
    */
  get conversation(): Prisma.ConversationDelegate<ExtArgs>;

  /**
   * `prisma.interaction`: Exposes CRUD operations for the **Interaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Interactions
    * const interactions = await prisma.interaction.findMany()
    * ```
    */
  get interaction(): Prisma.InteractionDelegate<ExtArgs>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs>;

  /**
   * `prisma.attribution`: Exposes CRUD operations for the **Attribution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attributions
    * const attributions = await prisma.attribution.findMany()
    * ```
    */
  get attribution(): Prisma.AttributionDelegate<ExtArgs>;

  /**
   * `prisma.auditEvent`: Exposes CRUD operations for the **AuditEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditEvents
    * const auditEvents = await prisma.auditEvent.findMany()
    * ```
    */
  get auditEvent(): Prisma.AuditEventDelegate<ExtArgs>;
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
  export import NotFoundError = runtime.NotFoundError

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
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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
    Business: 'Business',
    User: 'User',
    Agent: 'Agent',
    Lead: 'Lead',
    Customer: 'Customer',
    Conversation: 'Conversation',
    Interaction: 'Interaction',
    Task: 'Task',
    Attribution: 'Attribution',
    AuditEvent: 'AuditEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "business" | "user" | "agent" | "lead" | "customer" | "conversation" | "interaction" | "task" | "attribution" | "auditEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Business: {
        payload: Prisma.$BusinessPayload<ExtArgs>
        fields: Prisma.BusinessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BusinessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BusinessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findFirst: {
            args: Prisma.BusinessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BusinessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findMany: {
            args: Prisma.BusinessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          create: {
            args: Prisma.BusinessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          createMany: {
            args: Prisma.BusinessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BusinessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          delete: {
            args: Prisma.BusinessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          update: {
            args: Prisma.BusinessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          deleteMany: {
            args: Prisma.BusinessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BusinessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BusinessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          aggregate: {
            args: Prisma.BusinessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBusiness>
          }
          groupBy: {
            args: Prisma.BusinessGroupByArgs<ExtArgs>
            result: $Utils.Optional<BusinessGroupByOutputType>[]
          }
          count: {
            args: Prisma.BusinessCountArgs<ExtArgs>
            result: $Utils.Optional<BusinessCountAggregateOutputType> | number
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
      Agent: {
        payload: Prisma.$AgentPayload<ExtArgs>
        fields: Prisma.AgentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>
          }
          findFirst: {
            args: Prisma.AgentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>
          }
          findMany: {
            args: Prisma.AgentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>[]
          }
          create: {
            args: Prisma.AgentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>
          }
          createMany: {
            args: Prisma.AgentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>[]
          }
          delete: {
            args: Prisma.AgentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>
          }
          update: {
            args: Prisma.AgentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>
          }
          deleteMany: {
            args: Prisma.AgentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AgentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentPayload>
          }
          aggregate: {
            args: Prisma.AgentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgent>
          }
          groupBy: {
            args: Prisma.AgentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentCountArgs<ExtArgs>
            result: $Utils.Optional<AgentCountAggregateOutputType> | number
          }
        }
      }
      Lead: {
        payload: Prisma.$LeadPayload<ExtArgs>
        fields: Prisma.LeadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findFirst: {
            args: Prisma.LeadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findMany: {
            args: Prisma.LeadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          create: {
            args: Prisma.LeadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          createMany: {
            args: Prisma.LeadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          delete: {
            args: Prisma.LeadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          update: {
            args: Prisma.LeadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          deleteMany: {
            args: Prisma.LeadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LeadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          aggregate: {
            args: Prisma.LeadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLead>
          }
          groupBy: {
            args: Prisma.LeadGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeadGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeadCountArgs<ExtArgs>
            result: $Utils.Optional<LeadCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Conversation: {
        payload: Prisma.$ConversationPayload<ExtArgs>
        fields: Prisma.ConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findFirst: {
            args: Prisma.ConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findMany: {
            args: Prisma.ConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          create: {
            args: Prisma.ConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          createMany: {
            args: Prisma.ConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          delete: {
            args: Prisma.ConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          update: {
            args: Prisma.ConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          aggregate: {
            args: Prisma.ConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversation>
          }
          groupBy: {
            args: Prisma.ConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationCountAggregateOutputType> | number
          }
        }
      }
      Interaction: {
        payload: Prisma.$InteractionPayload<ExtArgs>
        fields: Prisma.InteractionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InteractionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InteractionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>
          }
          findFirst: {
            args: Prisma.InteractionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InteractionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>
          }
          findMany: {
            args: Prisma.InteractionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>[]
          }
          create: {
            args: Prisma.InteractionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>
          }
          createMany: {
            args: Prisma.InteractionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InteractionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>[]
          }
          delete: {
            args: Prisma.InteractionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>
          }
          update: {
            args: Prisma.InteractionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>
          }
          deleteMany: {
            args: Prisma.InteractionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InteractionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InteractionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionPayload>
          }
          aggregate: {
            args: Prisma.InteractionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInteraction>
          }
          groupBy: {
            args: Prisma.InteractionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InteractionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InteractionCountArgs<ExtArgs>
            result: $Utils.Optional<InteractionCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      Attribution: {
        payload: Prisma.$AttributionPayload<ExtArgs>
        fields: Prisma.AttributionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AttributionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AttributionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>
          }
          findFirst: {
            args: Prisma.AttributionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AttributionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>
          }
          findMany: {
            args: Prisma.AttributionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>[]
          }
          create: {
            args: Prisma.AttributionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>
          }
          createMany: {
            args: Prisma.AttributionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AttributionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>[]
          }
          delete: {
            args: Prisma.AttributionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>
          }
          update: {
            args: Prisma.AttributionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>
          }
          deleteMany: {
            args: Prisma.AttributionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AttributionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AttributionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttributionPayload>
          }
          aggregate: {
            args: Prisma.AttributionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttribution>
          }
          groupBy: {
            args: Prisma.AttributionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AttributionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AttributionCountArgs<ExtArgs>
            result: $Utils.Optional<AttributionCountAggregateOutputType> | number
          }
        }
      }
      AuditEvent: {
        payload: Prisma.$AuditEventPayload<ExtArgs>
        fields: Prisma.AuditEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findFirst: {
            args: Prisma.AuditEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findMany: {
            args: Prisma.AuditEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          create: {
            args: Prisma.AuditEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          createMany: {
            args: Prisma.AuditEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          delete: {
            args: Prisma.AuditEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          update: {
            args: Prisma.AuditEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          deleteMany: {
            args: Prisma.AuditEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          aggregate: {
            args: Prisma.AuditEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditEvent>
          }
          groupBy: {
            args: Prisma.AuditEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditEventCountArgs<ExtArgs>
            result: $Utils.Optional<AuditEventCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type BusinessCountOutputType
   */

  export type BusinessCountOutputType = {
    users: number
    agents: number
    leads: number
    customers: number
    conversations: number
    tasks: number
    attributions: number
    audits: number
    interactions: number
  }

  export type BusinessCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | BusinessCountOutputTypeCountUsersArgs
    agents?: boolean | BusinessCountOutputTypeCountAgentsArgs
    leads?: boolean | BusinessCountOutputTypeCountLeadsArgs
    customers?: boolean | BusinessCountOutputTypeCountCustomersArgs
    conversations?: boolean | BusinessCountOutputTypeCountConversationsArgs
    tasks?: boolean | BusinessCountOutputTypeCountTasksArgs
    attributions?: boolean | BusinessCountOutputTypeCountAttributionsArgs
    audits?: boolean | BusinessCountOutputTypeCountAuditsArgs
    interactions?: boolean | BusinessCountOutputTypeCountInteractionsArgs
  }

  // Custom InputTypes
  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessCountOutputType
     */
    select?: BusinessCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountAgentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountLeadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountCustomersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountAttributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttributionWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountAuditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountInteractionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteractionWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    conversations: number
    tasks: number
    auditEvents: number
    leadsOwned: number
    customersOwned: number
    interactionsAuthored: number
    businessesOwned: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversations?: boolean | UserCountOutputTypeCountConversationsArgs
    tasks?: boolean | UserCountOutputTypeCountTasksArgs
    auditEvents?: boolean | UserCountOutputTypeCountAuditEventsArgs
    leadsOwned?: boolean | UserCountOutputTypeCountLeadsOwnedArgs
    customersOwned?: boolean | UserCountOutputTypeCountCustomersOwnedArgs
    interactionsAuthored?: boolean | UserCountOutputTypeCountInteractionsAuthoredArgs
    businessesOwned?: boolean | UserCountOutputTypeCountBusinessesOwnedArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLeadsOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCustomersOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInteractionsAuthoredArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteractionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBusinessesOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessWhereInput
  }


  /**
   * Count Type AgentCountOutputType
   */

  export type AgentCountOutputType = {
    attributions: number
    conversations: number
  }

  export type AgentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attributions?: boolean | AgentCountOutputTypeCountAttributionsArgs
    conversations?: boolean | AgentCountOutputTypeCountConversationsArgs
  }

  // Custom InputTypes
  /**
   * AgentCountOutputType without action
   */
  export type AgentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentCountOutputType
     */
    select?: AgentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgentCountOutputType without action
   */
  export type AgentCountOutputTypeCountAttributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttributionWhereInput
  }

  /**
   * AgentCountOutputType without action
   */
  export type AgentCountOutputTypeCountConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
  }


  /**
   * Count Type LeadCountOutputType
   */

  export type LeadCountOutputType = {
    conversations: number
    tasks: number
    attributions: number
  }

  export type LeadCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversations?: boolean | LeadCountOutputTypeCountConversationsArgs
    tasks?: boolean | LeadCountOutputTypeCountTasksArgs
    attributions?: boolean | LeadCountOutputTypeCountAttributionsArgs
  }

  // Custom InputTypes
  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeadCountOutputType
     */
    select?: LeadCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * LeadCountOutputType without action
   */
  export type LeadCountOutputTypeCountAttributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttributionWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    conversations: number
    tasks: number
    attributions: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversations?: boolean | CustomerCountOutputTypeCountConversationsArgs
    tasks?: boolean | CustomerCountOutputTypeCountTasksArgs
    attributions?: boolean | CustomerCountOutputTypeCountAttributionsArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountConversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountAttributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttributionWhereInput
  }


  /**
   * Count Type ConversationCountOutputType
   */

  export type ConversationCountOutputType = {
    messages: number
    tasks: number
  }

  export type ConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ConversationCountOutputTypeCountMessagesArgs
    tasks?: boolean | ConversationCountOutputTypeCountTasksArgs
  }

  // Custom InputTypes
  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationCountOutputType
     */
    select?: ConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteractionWhereInput
  }

  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Business
   */

  export type AggregateBusiness = {
    _count: BusinessCountAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  export type BusinessMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    status: string | null
    ownerUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BusinessMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    status: string | null
    ownerUserId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BusinessCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    status: number
    ownerUserId: number
    createdAt: number
    updatedAt: number
    settings: number
    _all: number
  }


  export type BusinessMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
    ownerUserId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BusinessMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
    ownerUserId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BusinessCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    status?: true
    ownerUserId?: true
    createdAt?: true
    updatedAt?: true
    settings?: true
    _all?: true
  }

  export type BusinessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Business to aggregate.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Businesses
    **/
    _count?: true | BusinessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BusinessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BusinessMaxAggregateInputType
  }

  export type GetBusinessAggregateType<T extends BusinessAggregateArgs> = {
        [P in keyof T & keyof AggregateBusiness]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBusiness[P]>
      : GetScalarType<T[P], AggregateBusiness[P]>
  }




  export type BusinessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessWhereInput
    orderBy?: BusinessOrderByWithAggregationInput | BusinessOrderByWithAggregationInput[]
    by: BusinessScalarFieldEnum[] | BusinessScalarFieldEnum
    having?: BusinessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BusinessCountAggregateInputType | true
    _min?: BusinessMinAggregateInputType
    _max?: BusinessMaxAggregateInputType
  }

  export type BusinessGroupByOutputType = {
    id: string
    name: string
    slug: string
    status: string
    ownerUserId: string | null
    createdAt: Date
    updatedAt: Date
    settings: JsonValue | null
    _count: BusinessCountAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  type GetBusinessGroupByPayload<T extends BusinessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BusinessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BusinessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BusinessGroupByOutputType[P]>
            : GetScalarType<T[P], BusinessGroupByOutputType[P]>
        }
      >
    >


  export type BusinessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    ownerUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    settings?: boolean
    users?: boolean | Business$usersArgs<ExtArgs>
    agents?: boolean | Business$agentsArgs<ExtArgs>
    leads?: boolean | Business$leadsArgs<ExtArgs>
    customers?: boolean | Business$customersArgs<ExtArgs>
    conversations?: boolean | Business$conversationsArgs<ExtArgs>
    tasks?: boolean | Business$tasksArgs<ExtArgs>
    attributions?: boolean | Business$attributionsArgs<ExtArgs>
    audits?: boolean | Business$auditsArgs<ExtArgs>
    interactions?: boolean | Business$interactionsArgs<ExtArgs>
    owner?: boolean | Business$ownerArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    ownerUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    settings?: boolean
    owner?: boolean | Business$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    status?: boolean
    ownerUserId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    settings?: boolean
  }

  export type BusinessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Business$usersArgs<ExtArgs>
    agents?: boolean | Business$agentsArgs<ExtArgs>
    leads?: boolean | Business$leadsArgs<ExtArgs>
    customers?: boolean | Business$customersArgs<ExtArgs>
    conversations?: boolean | Business$conversationsArgs<ExtArgs>
    tasks?: boolean | Business$tasksArgs<ExtArgs>
    attributions?: boolean | Business$attributionsArgs<ExtArgs>
    audits?: boolean | Business$auditsArgs<ExtArgs>
    interactions?: boolean | Business$interactionsArgs<ExtArgs>
    owner?: boolean | Business$ownerArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BusinessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Business$ownerArgs<ExtArgs>
  }

  export type $BusinessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Business"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      agents: Prisma.$AgentPayload<ExtArgs>[]
      leads: Prisma.$LeadPayload<ExtArgs>[]
      customers: Prisma.$CustomerPayload<ExtArgs>[]
      conversations: Prisma.$ConversationPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      attributions: Prisma.$AttributionPayload<ExtArgs>[]
      audits: Prisma.$AuditEventPayload<ExtArgs>[]
      interactions: Prisma.$InteractionPayload<ExtArgs>[]
      owner: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      status: string
      ownerUserId: string | null
      createdAt: Date
      updatedAt: Date
      /**
       * הגדרות עסק – SLA, תבניות הודעה וכו' (JSON חופשי)
       */
      settings: Prisma.JsonValue | null
    }, ExtArgs["result"]["business"]>
    composites: {}
  }

  type BusinessGetPayload<S extends boolean | null | undefined | BusinessDefaultArgs> = $Result.GetResult<Prisma.$BusinessPayload, S>

  type BusinessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BusinessFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BusinessCountAggregateInputType | true
    }

  export interface BusinessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Business'], meta: { name: 'Business' } }
    /**
     * Find zero or one Business that matches the filter.
     * @param {BusinessFindUniqueArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BusinessFindUniqueArgs>(args: SelectSubset<T, BusinessFindUniqueArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Business that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BusinessFindUniqueOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BusinessFindUniqueOrThrowArgs>(args: SelectSubset<T, BusinessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Business that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BusinessFindFirstArgs>(args?: SelectSubset<T, BusinessFindFirstArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Business that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BusinessFindFirstOrThrowArgs>(args?: SelectSubset<T, BusinessFindFirstOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Businesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Businesses
     * const businesses = await prisma.business.findMany()
     * 
     * // Get first 10 Businesses
     * const businesses = await prisma.business.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const businessWithIdOnly = await prisma.business.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BusinessFindManyArgs>(args?: SelectSubset<T, BusinessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Business.
     * @param {BusinessCreateArgs} args - Arguments to create a Business.
     * @example
     * // Create one Business
     * const Business = await prisma.business.create({
     *   data: {
     *     // ... data to create a Business
     *   }
     * })
     * 
     */
    create<T extends BusinessCreateArgs>(args: SelectSubset<T, BusinessCreateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Businesses.
     * @param {BusinessCreateManyArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BusinessCreateManyArgs>(args?: SelectSubset<T, BusinessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Businesses and returns the data saved in the database.
     * @param {BusinessCreateManyAndReturnArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Businesses and only return the `id`
     * const businessWithIdOnly = await prisma.business.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BusinessCreateManyAndReturnArgs>(args?: SelectSubset<T, BusinessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Business.
     * @param {BusinessDeleteArgs} args - Arguments to delete one Business.
     * @example
     * // Delete one Business
     * const Business = await prisma.business.delete({
     *   where: {
     *     // ... filter to delete one Business
     *   }
     * })
     * 
     */
    delete<T extends BusinessDeleteArgs>(args: SelectSubset<T, BusinessDeleteArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Business.
     * @param {BusinessUpdateArgs} args - Arguments to update one Business.
     * @example
     * // Update one Business
     * const business = await prisma.business.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BusinessUpdateArgs>(args: SelectSubset<T, BusinessUpdateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Businesses.
     * @param {BusinessDeleteManyArgs} args - Arguments to filter Businesses to delete.
     * @example
     * // Delete a few Businesses
     * const { count } = await prisma.business.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BusinessDeleteManyArgs>(args?: SelectSubset<T, BusinessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Businesses
     * const business = await prisma.business.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BusinessUpdateManyArgs>(args: SelectSubset<T, BusinessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Business.
     * @param {BusinessUpsertArgs} args - Arguments to update or create a Business.
     * @example
     * // Update or create a Business
     * const business = await prisma.business.upsert({
     *   create: {
     *     // ... data to create a Business
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Business we want to update
     *   }
     * })
     */
    upsert<T extends BusinessUpsertArgs>(args: SelectSubset<T, BusinessUpsertArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessCountArgs} args - Arguments to filter Businesses to count.
     * @example
     * // Count the number of Businesses
     * const count = await prisma.business.count({
     *   where: {
     *     // ... the filter for the Businesses we want to count
     *   }
     * })
    **/
    count<T extends BusinessCountArgs>(
      args?: Subset<T, BusinessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BusinessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BusinessAggregateArgs>(args: Subset<T, BusinessAggregateArgs>): Prisma.PrismaPromise<GetBusinessAggregateType<T>>

    /**
     * Group by Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessGroupByArgs} args - Group by arguments.
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
      T extends BusinessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BusinessGroupByArgs['orderBy'] }
        : { orderBy?: BusinessGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BusinessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Business model
   */
  readonly fields: BusinessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Business.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BusinessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Business$usersArgs<ExtArgs> = {}>(args?: Subset<T, Business$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    agents<T extends Business$agentsArgs<ExtArgs> = {}>(args?: Subset<T, Business$agentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findMany"> | Null>
    leads<T extends Business$leadsArgs<ExtArgs> = {}>(args?: Subset<T, Business$leadsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany"> | Null>
    customers<T extends Business$customersArgs<ExtArgs> = {}>(args?: Subset<T, Business$customersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany"> | Null>
    conversations<T extends Business$conversationsArgs<ExtArgs> = {}>(args?: Subset<T, Business$conversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends Business$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Business$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    attributions<T extends Business$attributionsArgs<ExtArgs> = {}>(args?: Subset<T, Business$attributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findMany"> | Null>
    audits<T extends Business$auditsArgs<ExtArgs> = {}>(args?: Subset<T, Business$auditsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany"> | Null>
    interactions<T extends Business$interactionsArgs<ExtArgs> = {}>(args?: Subset<T, Business$interactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findMany"> | Null>
    owner<T extends Business$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Business$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Business model
   */ 
  interface BusinessFieldRefs {
    readonly id: FieldRef<"Business", 'String'>
    readonly name: FieldRef<"Business", 'String'>
    readonly slug: FieldRef<"Business", 'String'>
    readonly status: FieldRef<"Business", 'String'>
    readonly ownerUserId: FieldRef<"Business", 'String'>
    readonly createdAt: FieldRef<"Business", 'DateTime'>
    readonly updatedAt: FieldRef<"Business", 'DateTime'>
    readonly settings: FieldRef<"Business", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Business findUnique
   */
  export type BusinessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findUniqueOrThrow
   */
  export type BusinessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findFirst
   */
  export type BusinessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findFirstOrThrow
   */
  export type BusinessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findMany
   */
  export type BusinessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Businesses to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business create
   */
  export type BusinessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to create a Business.
     */
    data: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
  }

  /**
   * Business createMany
   */
  export type BusinessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Business createManyAndReturn
   */
  export type BusinessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Business update
   */
  export type BusinessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to update a Business.
     */
    data: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
    /**
     * Choose, which Business to update.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business updateMany
   */
  export type BusinessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Businesses.
     */
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyInput>
    /**
     * Filter which Businesses to update
     */
    where?: BusinessWhereInput
  }

  /**
   * Business upsert
   */
  export type BusinessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The filter to search for the Business to update in case it exists.
     */
    where: BusinessWhereUniqueInput
    /**
     * In case the Business found by the `where` argument doesn't exist, create a new Business with this data.
     */
    create: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
    /**
     * In case the Business was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
  }

  /**
   * Business delete
   */
  export type BusinessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter which Business to delete.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business deleteMany
   */
  export type BusinessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Businesses to delete
     */
    where?: BusinessWhereInput
  }

  /**
   * Business.users
   */
  export type Business$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Business.agents
   */
  export type Business$agentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    where?: AgentWhereInput
    orderBy?: AgentOrderByWithRelationInput | AgentOrderByWithRelationInput[]
    cursor?: AgentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentScalarFieldEnum | AgentScalarFieldEnum[]
  }

  /**
   * Business.leads
   */
  export type Business$leadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    cursor?: LeadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Business.customers
   */
  export type Business$customersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    cursor?: CustomerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Business.conversations
   */
  export type Business$conversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    cursor?: ConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Business.tasks
   */
  export type Business$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Business.attributions
   */
  export type Business$attributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    where?: AttributionWhereInput
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    cursor?: AttributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttributionScalarFieldEnum | AttributionScalarFieldEnum[]
  }

  /**
   * Business.audits
   */
  export type Business$auditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    cursor?: AuditEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * Business.interactions
   */
  export type Business$interactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    where?: InteractionWhereInput
    orderBy?: InteractionOrderByWithRelationInput | InteractionOrderByWithRelationInput[]
    cursor?: InteractionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InteractionScalarFieldEnum | InteractionScalarFieldEnum[]
  }

  /**
   * Business.owner
   */
  export type Business$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Business without action
   */
  export type BusinessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
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
    email: string | null
    phone: string | null
    name: string | null
    role: $Enums.UserRole | null
    locale: string | null
    isActive: boolean | null
    passwordHash: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    name: string | null
    role: $Enums.UserRole | null
    locale: string | null
    isActive: boolean | null
    passwordHash: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    name: number
    role: number
    locale: number
    isActive: number
    passwordHash: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    businessId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    name?: true
    role?: true
    locale?: true
    isActive?: true
    passwordHash?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    name?: true
    role?: true
    locale?: true
    isActive?: true
    passwordHash?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    name?: true
    role?: true
    locale?: true
    isActive?: true
    passwordHash?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
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
    email: string
    phone: string | null
    name: string
    role: $Enums.UserRole
    locale: string | null
    isActive: boolean
    passwordHash: string
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    businessId: string | null
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
    email?: boolean
    phone?: boolean
    name?: boolean
    role?: boolean
    locale?: boolean
    isActive?: boolean
    passwordHash?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    business?: boolean | User$businessArgs<ExtArgs>
    conversations?: boolean | User$conversationsArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    auditEvents?: boolean | User$auditEventsArgs<ExtArgs>
    leadsOwned?: boolean | User$leadsOwnedArgs<ExtArgs>
    customersOwned?: boolean | User$customersOwnedArgs<ExtArgs>
    interactionsAuthored?: boolean | User$interactionsAuthoredArgs<ExtArgs>
    businessesOwned?: boolean | User$businessesOwnedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    name?: boolean
    role?: boolean
    locale?: boolean
    isActive?: boolean
    passwordHash?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    business?: boolean | User$businessArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    name?: boolean
    role?: boolean
    locale?: boolean
    isActive?: boolean
    passwordHash?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | User$businessArgs<ExtArgs>
    conversations?: boolean | User$conversationsArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    auditEvents?: boolean | User$auditEventsArgs<ExtArgs>
    leadsOwned?: boolean | User$leadsOwnedArgs<ExtArgs>
    customersOwned?: boolean | User$customersOwnedArgs<ExtArgs>
    interactionsAuthored?: boolean | User$interactionsAuthoredArgs<ExtArgs>
    businessesOwned?: boolean | User$businessesOwnedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | User$businessArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs> | null
      conversations: Prisma.$ConversationPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      auditEvents: Prisma.$AuditEventPayload<ExtArgs>[]
      leadsOwned: Prisma.$LeadPayload<ExtArgs>[]
      customersOwned: Prisma.$CustomerPayload<ExtArgs>[]
      interactionsAuthored: Prisma.$InteractionPayload<ExtArgs>[]
      businessesOwned: Prisma.$BusinessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      phone: string | null
      name: string
      role: $Enums.UserRole
      locale: string | null
      isActive: boolean
      passwordHash: string
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
      businessId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
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
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

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
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

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
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

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
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

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
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

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
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

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
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

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
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

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
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

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
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


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
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends User$businessArgs<ExtArgs> = {}>(args?: Subset<T, User$businessArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    conversations<T extends User$conversationsArgs<ExtArgs> = {}>(args?: Subset<T, User$conversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends User$tasksArgs<ExtArgs> = {}>(args?: Subset<T, User$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    auditEvents<T extends User$auditEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany"> | Null>
    leadsOwned<T extends User$leadsOwnedArgs<ExtArgs> = {}>(args?: Subset<T, User$leadsOwnedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany"> | Null>
    customersOwned<T extends User$customersOwnedArgs<ExtArgs> = {}>(args?: Subset<T, User$customersOwnedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany"> | Null>
    interactionsAuthored<T extends User$interactionsAuthoredArgs<ExtArgs> = {}>(args?: Subset<T, User$interactionsAuthoredArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findMany"> | Null>
    businessesOwned<T extends User$businessesOwnedArgs<ExtArgs> = {}>(args?: Subset<T, User$businessesOwnedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findMany"> | Null>
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
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly locale: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly businessId: FieldRef<"User", 'String'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
  }

  /**
   * User.business
   */
  export type User$businessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    where?: BusinessWhereInput
  }

  /**
   * User.conversations
   */
  export type User$conversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    cursor?: ConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * User.tasks
   */
  export type User$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.auditEvents
   */
  export type User$auditEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    cursor?: AuditEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * User.leadsOwned
   */
  export type User$leadsOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    cursor?: LeadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * User.customersOwned
   */
  export type User$customersOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    cursor?: CustomerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * User.interactionsAuthored
   */
  export type User$interactionsAuthoredArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    where?: InteractionWhereInput
    orderBy?: InteractionOrderByWithRelationInput | InteractionOrderByWithRelationInput[]
    cursor?: InteractionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InteractionScalarFieldEnum | InteractionScalarFieldEnum[]
  }

  /**
   * User.businessesOwned
   */
  export type User$businessesOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    where?: BusinessWhereInput
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    cursor?: BusinessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Agent
   */

  export type AggregateAgent = {
    _count: AgentCountAggregateOutputType | null
    _min: AgentMinAggregateOutputType | null
    _max: AgentMaxAggregateOutputType | null
  }

  export type AgentMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    name: string | null
    phone: string | null
    referralUrl: string | null
    couponCode: string | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    name: string | null
    phone: string | null
    referralUrl: string | null
    couponCode: string | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AgentCountAggregateOutputType = {
    id: number
    businessId: number
    name: number
    phone: number
    referralUrl: number
    couponCode: number
    status: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AgentMinAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    phone?: true
    referralUrl?: true
    couponCode?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentMaxAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    phone?: true
    referralUrl?: true
    couponCode?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AgentCountAggregateInputType = {
    id?: true
    businessId?: true
    name?: true
    phone?: true
    referralUrl?: true
    couponCode?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AgentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Agent to aggregate.
     */
    where?: AgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agents to fetch.
     */
    orderBy?: AgentOrderByWithRelationInput | AgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Agents
    **/
    _count?: true | AgentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentMaxAggregateInputType
  }

  export type GetAgentAggregateType<T extends AgentAggregateArgs> = {
        [P in keyof T & keyof AggregateAgent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgent[P]>
      : GetScalarType<T[P], AggregateAgent[P]>
  }




  export type AgentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentWhereInput
    orderBy?: AgentOrderByWithAggregationInput | AgentOrderByWithAggregationInput[]
    by: AgentScalarFieldEnum[] | AgentScalarFieldEnum
    having?: AgentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentCountAggregateInputType | true
    _min?: AgentMinAggregateInputType
    _max?: AgentMaxAggregateInputType
  }

  export type AgentGroupByOutputType = {
    id: string
    businessId: string
    name: string
    phone: string | null
    referralUrl: string | null
    couponCode: string | null
    status: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: AgentCountAggregateOutputType | null
    _min: AgentMinAggregateOutputType | null
    _max: AgentMaxAggregateOutputType | null
  }

  type GetAgentGroupByPayload<T extends AgentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentGroupByOutputType[P]>
            : GetScalarType<T[P], AgentGroupByOutputType[P]>
        }
      >
    >


  export type AgentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    name?: boolean
    phone?: boolean
    referralUrl?: boolean
    couponCode?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    attributions?: boolean | Agent$attributionsArgs<ExtArgs>
    conversations?: boolean | Agent$conversationsArgs<ExtArgs>
    _count?: boolean | AgentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agent"]>

  export type AgentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    name?: boolean
    phone?: boolean
    referralUrl?: boolean
    couponCode?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agent"]>

  export type AgentSelectScalar = {
    id?: boolean
    businessId?: boolean
    name?: boolean
    phone?: boolean
    referralUrl?: boolean
    couponCode?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AgentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    attributions?: boolean | Agent$attributionsArgs<ExtArgs>
    conversations?: boolean | Agent$conversationsArgs<ExtArgs>
    _count?: boolean | AgentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $AgentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Agent"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      attributions: Prisma.$AttributionPayload<ExtArgs>[]
      conversations: Prisma.$ConversationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      name: string
      phone: string | null
      referralUrl: string | null
      couponCode: string | null
      status: string
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["agent"]>
    composites: {}
  }

  type AgentGetPayload<S extends boolean | null | undefined | AgentDefaultArgs> = $Result.GetResult<Prisma.$AgentPayload, S>

  type AgentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AgentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AgentCountAggregateInputType | true
    }

  export interface AgentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Agent'], meta: { name: 'Agent' } }
    /**
     * Find zero or one Agent that matches the filter.
     * @param {AgentFindUniqueArgs} args - Arguments to find a Agent
     * @example
     * // Get one Agent
     * const agent = await prisma.agent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentFindUniqueArgs>(args: SelectSubset<T, AgentFindUniqueArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Agent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AgentFindUniqueOrThrowArgs} args - Arguments to find a Agent
     * @example
     * // Get one Agent
     * const agent = await prisma.agent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Agent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentFindFirstArgs} args - Arguments to find a Agent
     * @example
     * // Get one Agent
     * const agent = await prisma.agent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentFindFirstArgs>(args?: SelectSubset<T, AgentFindFirstArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Agent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentFindFirstOrThrowArgs} args - Arguments to find a Agent
     * @example
     * // Get one Agent
     * const agent = await prisma.agent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Agents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Agents
     * const agents = await prisma.agent.findMany()
     * 
     * // Get first 10 Agents
     * const agents = await prisma.agent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentWithIdOnly = await prisma.agent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentFindManyArgs>(args?: SelectSubset<T, AgentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Agent.
     * @param {AgentCreateArgs} args - Arguments to create a Agent.
     * @example
     * // Create one Agent
     * const Agent = await prisma.agent.create({
     *   data: {
     *     // ... data to create a Agent
     *   }
     * })
     * 
     */
    create<T extends AgentCreateArgs>(args: SelectSubset<T, AgentCreateArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Agents.
     * @param {AgentCreateManyArgs} args - Arguments to create many Agents.
     * @example
     * // Create many Agents
     * const agent = await prisma.agent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentCreateManyArgs>(args?: SelectSubset<T, AgentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Agents and returns the data saved in the database.
     * @param {AgentCreateManyAndReturnArgs} args - Arguments to create many Agents.
     * @example
     * // Create many Agents
     * const agent = await prisma.agent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Agents and only return the `id`
     * const agentWithIdOnly = await prisma.agent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Agent.
     * @param {AgentDeleteArgs} args - Arguments to delete one Agent.
     * @example
     * // Delete one Agent
     * const Agent = await prisma.agent.delete({
     *   where: {
     *     // ... filter to delete one Agent
     *   }
     * })
     * 
     */
    delete<T extends AgentDeleteArgs>(args: SelectSubset<T, AgentDeleteArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Agent.
     * @param {AgentUpdateArgs} args - Arguments to update one Agent.
     * @example
     * // Update one Agent
     * const agent = await prisma.agent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentUpdateArgs>(args: SelectSubset<T, AgentUpdateArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Agents.
     * @param {AgentDeleteManyArgs} args - Arguments to filter Agents to delete.
     * @example
     * // Delete a few Agents
     * const { count } = await prisma.agent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentDeleteManyArgs>(args?: SelectSubset<T, AgentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Agents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Agents
     * const agent = await prisma.agent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentUpdateManyArgs>(args: SelectSubset<T, AgentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Agent.
     * @param {AgentUpsertArgs} args - Arguments to update or create a Agent.
     * @example
     * // Update or create a Agent
     * const agent = await prisma.agent.upsert({
     *   create: {
     *     // ... data to create a Agent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Agent we want to update
     *   }
     * })
     */
    upsert<T extends AgentUpsertArgs>(args: SelectSubset<T, AgentUpsertArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Agents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentCountArgs} args - Arguments to filter Agents to count.
     * @example
     * // Count the number of Agents
     * const count = await prisma.agent.count({
     *   where: {
     *     // ... the filter for the Agents we want to count
     *   }
     * })
    **/
    count<T extends AgentCountArgs>(
      args?: Subset<T, AgentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Agent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AgentAggregateArgs>(args: Subset<T, AgentAggregateArgs>): Prisma.PrismaPromise<GetAgentAggregateType<T>>

    /**
     * Group by Agent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentGroupByArgs} args - Group by arguments.
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
      T extends AgentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentGroupByArgs['orderBy'] }
        : { orderBy?: AgentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AgentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Agent model
   */
  readonly fields: AgentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Agent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    attributions<T extends Agent$attributionsArgs<ExtArgs> = {}>(args?: Subset<T, Agent$attributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findMany"> | Null>
    conversations<T extends Agent$conversationsArgs<ExtArgs> = {}>(args?: Subset<T, Agent$conversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Agent model
   */ 
  interface AgentFieldRefs {
    readonly id: FieldRef<"Agent", 'String'>
    readonly businessId: FieldRef<"Agent", 'String'>
    readonly name: FieldRef<"Agent", 'String'>
    readonly phone: FieldRef<"Agent", 'String'>
    readonly referralUrl: FieldRef<"Agent", 'String'>
    readonly couponCode: FieldRef<"Agent", 'String'>
    readonly status: FieldRef<"Agent", 'String'>
    readonly notes: FieldRef<"Agent", 'String'>
    readonly createdAt: FieldRef<"Agent", 'DateTime'>
    readonly updatedAt: FieldRef<"Agent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Agent findUnique
   */
  export type AgentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * Filter, which Agent to fetch.
     */
    where: AgentWhereUniqueInput
  }

  /**
   * Agent findUniqueOrThrow
   */
  export type AgentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * Filter, which Agent to fetch.
     */
    where: AgentWhereUniqueInput
  }

  /**
   * Agent findFirst
   */
  export type AgentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * Filter, which Agent to fetch.
     */
    where?: AgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agents to fetch.
     */
    orderBy?: AgentOrderByWithRelationInput | AgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Agents.
     */
    cursor?: AgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Agents.
     */
    distinct?: AgentScalarFieldEnum | AgentScalarFieldEnum[]
  }

  /**
   * Agent findFirstOrThrow
   */
  export type AgentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * Filter, which Agent to fetch.
     */
    where?: AgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agents to fetch.
     */
    orderBy?: AgentOrderByWithRelationInput | AgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Agents.
     */
    cursor?: AgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Agents.
     */
    distinct?: AgentScalarFieldEnum | AgentScalarFieldEnum[]
  }

  /**
   * Agent findMany
   */
  export type AgentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * Filter, which Agents to fetch.
     */
    where?: AgentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Agents to fetch.
     */
    orderBy?: AgentOrderByWithRelationInput | AgentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Agents.
     */
    cursor?: AgentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Agents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Agents.
     */
    skip?: number
    distinct?: AgentScalarFieldEnum | AgentScalarFieldEnum[]
  }

  /**
   * Agent create
   */
  export type AgentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * The data needed to create a Agent.
     */
    data: XOR<AgentCreateInput, AgentUncheckedCreateInput>
  }

  /**
   * Agent createMany
   */
  export type AgentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Agents.
     */
    data: AgentCreateManyInput | AgentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Agent createManyAndReturn
   */
  export type AgentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Agents.
     */
    data: AgentCreateManyInput | AgentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Agent update
   */
  export type AgentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * The data needed to update a Agent.
     */
    data: XOR<AgentUpdateInput, AgentUncheckedUpdateInput>
    /**
     * Choose, which Agent to update.
     */
    where: AgentWhereUniqueInput
  }

  /**
   * Agent updateMany
   */
  export type AgentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Agents.
     */
    data: XOR<AgentUpdateManyMutationInput, AgentUncheckedUpdateManyInput>
    /**
     * Filter which Agents to update
     */
    where?: AgentWhereInput
  }

  /**
   * Agent upsert
   */
  export type AgentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * The filter to search for the Agent to update in case it exists.
     */
    where: AgentWhereUniqueInput
    /**
     * In case the Agent found by the `where` argument doesn't exist, create a new Agent with this data.
     */
    create: XOR<AgentCreateInput, AgentUncheckedCreateInput>
    /**
     * In case the Agent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentUpdateInput, AgentUncheckedUpdateInput>
  }

  /**
   * Agent delete
   */
  export type AgentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    /**
     * Filter which Agent to delete.
     */
    where: AgentWhereUniqueInput
  }

  /**
   * Agent deleteMany
   */
  export type AgentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Agents to delete
     */
    where?: AgentWhereInput
  }

  /**
   * Agent.attributions
   */
  export type Agent$attributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    where?: AttributionWhereInput
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    cursor?: AttributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttributionScalarFieldEnum | AttributionScalarFieldEnum[]
  }

  /**
   * Agent.conversations
   */
  export type Agent$conversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    cursor?: ConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Agent without action
   */
  export type AgentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
  }


  /**
   * Model Lead
   */

  export type AggregateLead = {
    _count: LeadCountAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  export type LeadMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    ownerId: string | null
    status: $Enums.LeadStatus | null
    source: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    phoneNormalized: string | null
    email: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    ownerId: string | null
    status: $Enums.LeadStatus | null
    source: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    phoneNormalized: string | null
    email: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadCountAggregateOutputType = {
    id: number
    businessId: number
    ownerId: number
    status: number
    source: number
    firstName: number
    lastName: number
    phone: number
    phoneNormalized: number
    email: number
    tags: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LeadMinAggregateInputType = {
    id?: true
    businessId?: true
    ownerId?: true
    status?: true
    source?: true
    firstName?: true
    lastName?: true
    phone?: true
    phoneNormalized?: true
    email?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadMaxAggregateInputType = {
    id?: true
    businessId?: true
    ownerId?: true
    status?: true
    source?: true
    firstName?: true
    lastName?: true
    phone?: true
    phoneNormalized?: true
    email?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadCountAggregateInputType = {
    id?: true
    businessId?: true
    ownerId?: true
    status?: true
    source?: true
    firstName?: true
    lastName?: true
    phone?: true
    phoneNormalized?: true
    email?: true
    tags?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LeadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lead to aggregate.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leads
    **/
    _count?: true | LeadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeadMaxAggregateInputType
  }

  export type GetLeadAggregateType<T extends LeadAggregateArgs> = {
        [P in keyof T & keyof AggregateLead]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLead[P]>
      : GetScalarType<T[P], AggregateLead[P]>
  }




  export type LeadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithAggregationInput | LeadOrderByWithAggregationInput[]
    by: LeadScalarFieldEnum[] | LeadScalarFieldEnum
    having?: LeadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeadCountAggregateInputType | true
    _min?: LeadMinAggregateInputType
    _max?: LeadMaxAggregateInputType
  }

  export type LeadGroupByOutputType = {
    id: string
    businessId: string
    ownerId: string | null
    status: $Enums.LeadStatus
    source: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    phoneNormalized: string | null
    email: string | null
    tags: JsonValue | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: LeadCountAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  type GetLeadGroupByPayload<T extends LeadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeadGroupByOutputType[P]>
            : GetScalarType<T[P], LeadGroupByOutputType[P]>
        }
      >
    >


  export type LeadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    ownerId?: boolean
    status?: boolean
    source?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    phoneNormalized?: boolean
    email?: boolean
    tags?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Lead$ownerArgs<ExtArgs>
    customer?: boolean | Lead$customerArgs<ExtArgs>
    conversations?: boolean | Lead$conversationsArgs<ExtArgs>
    tasks?: boolean | Lead$tasksArgs<ExtArgs>
    attributions?: boolean | Lead$attributionsArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    ownerId?: boolean
    status?: boolean
    source?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    phoneNormalized?: boolean
    email?: boolean
    tags?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Lead$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectScalar = {
    id?: boolean
    businessId?: boolean
    ownerId?: boolean
    status?: boolean
    source?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    phoneNormalized?: boolean
    email?: boolean
    tags?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LeadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Lead$ownerArgs<ExtArgs>
    customer?: boolean | Lead$customerArgs<ExtArgs>
    conversations?: boolean | Lead$conversationsArgs<ExtArgs>
    tasks?: boolean | Lead$tasksArgs<ExtArgs>
    attributions?: boolean | Lead$attributionsArgs<ExtArgs>
    _count?: boolean | LeadCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeadIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Lead$ownerArgs<ExtArgs>
  }

  export type $LeadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lead"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      owner: Prisma.$UserPayload<ExtArgs> | null
      customer: Prisma.$CustomerPayload<ExtArgs> | null
      conversations: Prisma.$ConversationPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      attributions: Prisma.$AttributionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      ownerId: string | null
      status: $Enums.LeadStatus
      source: string | null
      firstName: string | null
      lastName: string | null
      phone: string | null
      phoneNormalized: string | null
      email: string | null
      tags: Prisma.JsonValue | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lead"]>
    composites: {}
  }

  type LeadGetPayload<S extends boolean | null | undefined | LeadDefaultArgs> = $Result.GetResult<Prisma.$LeadPayload, S>

  type LeadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LeadFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LeadCountAggregateInputType | true
    }

  export interface LeadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lead'], meta: { name: 'Lead' } }
    /**
     * Find zero or one Lead that matches the filter.
     * @param {LeadFindUniqueArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeadFindUniqueArgs>(args: SelectSubset<T, LeadFindUniqueArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Lead that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LeadFindUniqueOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeadFindUniqueOrThrowArgs>(args: SelectSubset<T, LeadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Lead that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeadFindFirstArgs>(args?: SelectSubset<T, LeadFindFirstArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Lead that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeadFindFirstOrThrowArgs>(args?: SelectSubset<T, LeadFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Leads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leads
     * const leads = await prisma.lead.findMany()
     * 
     * // Get first 10 Leads
     * const leads = await prisma.lead.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leadWithIdOnly = await prisma.lead.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeadFindManyArgs>(args?: SelectSubset<T, LeadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Lead.
     * @param {LeadCreateArgs} args - Arguments to create a Lead.
     * @example
     * // Create one Lead
     * const Lead = await prisma.lead.create({
     *   data: {
     *     // ... data to create a Lead
     *   }
     * })
     * 
     */
    create<T extends LeadCreateArgs>(args: SelectSubset<T, LeadCreateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Leads.
     * @param {LeadCreateManyArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeadCreateManyArgs>(args?: SelectSubset<T, LeadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leads and returns the data saved in the database.
     * @param {LeadCreateManyAndReturnArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeadCreateManyAndReturnArgs>(args?: SelectSubset<T, LeadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Lead.
     * @param {LeadDeleteArgs} args - Arguments to delete one Lead.
     * @example
     * // Delete one Lead
     * const Lead = await prisma.lead.delete({
     *   where: {
     *     // ... filter to delete one Lead
     *   }
     * })
     * 
     */
    delete<T extends LeadDeleteArgs>(args: SelectSubset<T, LeadDeleteArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Lead.
     * @param {LeadUpdateArgs} args - Arguments to update one Lead.
     * @example
     * // Update one Lead
     * const lead = await prisma.lead.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeadUpdateArgs>(args: SelectSubset<T, LeadUpdateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Leads.
     * @param {LeadDeleteManyArgs} args - Arguments to filter Leads to delete.
     * @example
     * // Delete a few Leads
     * const { count } = await prisma.lead.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeadDeleteManyArgs>(args?: SelectSubset<T, LeadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeadUpdateManyArgs>(args: SelectSubset<T, LeadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Lead.
     * @param {LeadUpsertArgs} args - Arguments to update or create a Lead.
     * @example
     * // Update or create a Lead
     * const lead = await prisma.lead.upsert({
     *   create: {
     *     // ... data to create a Lead
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lead we want to update
     *   }
     * })
     */
    upsert<T extends LeadUpsertArgs>(args: SelectSubset<T, LeadUpsertArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadCountArgs} args - Arguments to filter Leads to count.
     * @example
     * // Count the number of Leads
     * const count = await prisma.lead.count({
     *   where: {
     *     // ... the filter for the Leads we want to count
     *   }
     * })
    **/
    count<T extends LeadCountArgs>(
      args?: Subset<T, LeadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LeadAggregateArgs>(args: Subset<T, LeadAggregateArgs>): Prisma.PrismaPromise<GetLeadAggregateType<T>>

    /**
     * Group by Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadGroupByArgs} args - Group by arguments.
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
      T extends LeadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeadGroupByArgs['orderBy'] }
        : { orderBy?: LeadGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LeadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lead model
   */
  readonly fields: LeadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lead.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    owner<T extends Lead$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Lead$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    customer<T extends Lead$customerArgs<ExtArgs> = {}>(args?: Subset<T, Lead$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    conversations<T extends Lead$conversationsArgs<ExtArgs> = {}>(args?: Subset<T, Lead$conversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends Lead$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Lead$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    attributions<T extends Lead$attributionsArgs<ExtArgs> = {}>(args?: Subset<T, Lead$attributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Lead model
   */ 
  interface LeadFieldRefs {
    readonly id: FieldRef<"Lead", 'String'>
    readonly businessId: FieldRef<"Lead", 'String'>
    readonly ownerId: FieldRef<"Lead", 'String'>
    readonly status: FieldRef<"Lead", 'LeadStatus'>
    readonly source: FieldRef<"Lead", 'String'>
    readonly firstName: FieldRef<"Lead", 'String'>
    readonly lastName: FieldRef<"Lead", 'String'>
    readonly phone: FieldRef<"Lead", 'String'>
    readonly phoneNormalized: FieldRef<"Lead", 'String'>
    readonly email: FieldRef<"Lead", 'String'>
    readonly tags: FieldRef<"Lead", 'Json'>
    readonly notes: FieldRef<"Lead", 'String'>
    readonly createdAt: FieldRef<"Lead", 'DateTime'>
    readonly updatedAt: FieldRef<"Lead", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Lead findUnique
   */
  export type LeadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findUniqueOrThrow
   */
  export type LeadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findFirst
   */
  export type LeadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findFirstOrThrow
   */
  export type LeadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findMany
   */
  export type LeadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter, which Leads to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead create
   */
  export type LeadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to create a Lead.
     */
    data: XOR<LeadCreateInput, LeadUncheckedCreateInput>
  }

  /**
   * Lead createMany
   */
  export type LeadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lead createManyAndReturn
   */
  export type LeadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lead update
   */
  export type LeadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The data needed to update a Lead.
     */
    data: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
    /**
     * Choose, which Lead to update.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead updateMany
   */
  export type LeadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
  }

  /**
   * Lead upsert
   */
  export type LeadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * The filter to search for the Lead to update in case it exists.
     */
    where: LeadWhereUniqueInput
    /**
     * In case the Lead found by the `where` argument doesn't exist, create a new Lead with this data.
     */
    create: XOR<LeadCreateInput, LeadUncheckedCreateInput>
    /**
     * In case the Lead was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
  }

  /**
   * Lead delete
   */
  export type LeadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    /**
     * Filter which Lead to delete.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead deleteMany
   */
  export type LeadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leads to delete
     */
    where?: LeadWhereInput
  }

  /**
   * Lead.owner
   */
  export type Lead$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Lead.customer
   */
  export type Lead$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Lead.conversations
   */
  export type Lead$conversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    cursor?: ConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Lead.tasks
   */
  export type Lead$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Lead.attributions
   */
  export type Lead$attributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    where?: AttributionWhereInput
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    cursor?: AttributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttributionScalarFieldEnum | AttributionScalarFieldEnum[]
  }

  /**
   * Lead without action
   */
  export type LeadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    leadId: string | null
    ownerId: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    phoneNormalized: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    leadId: string | null
    ownerId: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    phoneNormalized: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    businessId: number
    leadId: number
    ownerId: number
    firstName: number
    lastName: number
    phone: number
    phoneNormalized: number
    email: number
    tags: number
    address: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerMinAggregateInputType = {
    id?: true
    businessId?: true
    leadId?: true
    ownerId?: true
    firstName?: true
    lastName?: true
    phone?: true
    phoneNormalized?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    businessId?: true
    leadId?: true
    ownerId?: true
    firstName?: true
    lastName?: true
    phone?: true
    phoneNormalized?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    businessId?: true
    leadId?: true
    ownerId?: true
    firstName?: true
    lastName?: true
    phone?: true
    phoneNormalized?: true
    email?: true
    tags?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    businessId: string
    leadId: string | null
    ownerId: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    phoneNormalized: string | null
    email: string | null
    tags: JsonValue | null
    address: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    leadId?: boolean
    ownerId?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    phoneNormalized?: boolean
    email?: boolean
    tags?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    lead?: boolean | Customer$leadArgs<ExtArgs>
    owner?: boolean | Customer$ownerArgs<ExtArgs>
    conversations?: boolean | Customer$conversationsArgs<ExtArgs>
    tasks?: boolean | Customer$tasksArgs<ExtArgs>
    attributions?: boolean | Customer$attributionsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    leadId?: boolean
    ownerId?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    phoneNormalized?: boolean
    email?: boolean
    tags?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    lead?: boolean | Customer$leadArgs<ExtArgs>
    owner?: boolean | Customer$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    businessId?: boolean
    leadId?: boolean
    ownerId?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    phoneNormalized?: boolean
    email?: boolean
    tags?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    lead?: boolean | Customer$leadArgs<ExtArgs>
    owner?: boolean | Customer$ownerArgs<ExtArgs>
    conversations?: boolean | Customer$conversationsArgs<ExtArgs>
    tasks?: boolean | Customer$tasksArgs<ExtArgs>
    attributions?: boolean | Customer$attributionsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    lead?: boolean | Customer$leadArgs<ExtArgs>
    owner?: boolean | Customer$ownerArgs<ExtArgs>
  }

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      lead: Prisma.$LeadPayload<ExtArgs> | null
      owner: Prisma.$UserPayload<ExtArgs> | null
      conversations: Prisma.$ConversationPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      attributions: Prisma.$AttributionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      leadId: string | null
      ownerId: string | null
      firstName: string | null
      lastName: string | null
      phone: string | null
      phoneNormalized: string | null
      email: string | null
      tags: Prisma.JsonValue | null
      address: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
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
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    lead<T extends Customer$leadArgs<ExtArgs> = {}>(args?: Subset<T, Customer$leadArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    owner<T extends Customer$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Customer$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    conversations<T extends Customer$conversationsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$conversationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends Customer$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Customer$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    attributions<T extends Customer$attributionsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$attributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Customer model
   */ 
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly businessId: FieldRef<"Customer", 'String'>
    readonly leadId: FieldRef<"Customer", 'String'>
    readonly ownerId: FieldRef<"Customer", 'String'>
    readonly firstName: FieldRef<"Customer", 'String'>
    readonly lastName: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly phoneNormalized: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly tags: FieldRef<"Customer", 'Json'>
    readonly address: FieldRef<"Customer", 'Json'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer.lead
   */
  export type Customer$leadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
  }

  /**
   * Customer.owner
   */
  export type Customer$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Customer.conversations
   */
  export type Customer$conversationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    cursor?: ConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Customer.tasks
   */
  export type Customer$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Customer.attributions
   */
  export type Customer$attributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    where?: AttributionWhereInput
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    cursor?: AttributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttributionScalarFieldEnum | AttributionScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Conversation
   */

  export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  export type ConversationMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    channel: $Enums.ConversationChannel | null
    status: $Enums.ConversationStatus | null
    subject: string | null
    ownerId: string | null
    leadId: string | null
    customerId: string | null
    agentId: string | null
    nextFollowUpAt: Date | null
    slaBreachedAt: Date | null
    closedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    channel: $Enums.ConversationChannel | null
    status: $Enums.ConversationStatus | null
    subject: string | null
    ownerId: string | null
    leadId: string | null
    customerId: string | null
    agentId: string | null
    nextFollowUpAt: Date | null
    slaBreachedAt: Date | null
    closedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationCountAggregateOutputType = {
    id: number
    businessId: number
    channel: number
    status: number
    subject: number
    ownerId: number
    leadId: number
    customerId: number
    agentId: number
    nextFollowUpAt: number
    slaBreachedAt: number
    closedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConversationMinAggregateInputType = {
    id?: true
    businessId?: true
    channel?: true
    status?: true
    subject?: true
    ownerId?: true
    leadId?: true
    customerId?: true
    agentId?: true
    nextFollowUpAt?: true
    slaBreachedAt?: true
    closedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationMaxAggregateInputType = {
    id?: true
    businessId?: true
    channel?: true
    status?: true
    subject?: true
    ownerId?: true
    leadId?: true
    customerId?: true
    agentId?: true
    nextFollowUpAt?: true
    slaBreachedAt?: true
    closedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationCountAggregateInputType = {
    id?: true
    businessId?: true
    channel?: true
    status?: true
    subject?: true
    ownerId?: true
    leadId?: true
    customerId?: true
    agentId?: true
    nextFollowUpAt?: true
    slaBreachedAt?: true
    closedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversation to aggregate.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conversations
    **/
    _count?: true | ConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMaxAggregateInputType
  }

  export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversation[P]>
      : GetScalarType<T[P], AggregateConversation[P]>
  }




  export type ConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithAggregationInput | ConversationOrderByWithAggregationInput[]
    by: ConversationScalarFieldEnum[] | ConversationScalarFieldEnum
    having?: ConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationCountAggregateInputType | true
    _min?: ConversationMinAggregateInputType
    _max?: ConversationMaxAggregateInputType
  }

  export type ConversationGroupByOutputType = {
    id: string
    businessId: string
    channel: $Enums.ConversationChannel
    status: $Enums.ConversationStatus
    subject: string | null
    ownerId: string | null
    leadId: string | null
    customerId: string | null
    agentId: string | null
    nextFollowUpAt: Date | null
    slaBreachedAt: Date | null
    closedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    channel?: boolean
    status?: boolean
    subject?: boolean
    ownerId?: boolean
    leadId?: boolean
    customerId?: boolean
    agentId?: boolean
    nextFollowUpAt?: boolean
    slaBreachedAt?: boolean
    closedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Conversation$ownerArgs<ExtArgs>
    lead?: boolean | Conversation$leadArgs<ExtArgs>
    customer?: boolean | Conversation$customerArgs<ExtArgs>
    agent?: boolean | Conversation$agentArgs<ExtArgs>
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    tasks?: boolean | Conversation$tasksArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    channel?: boolean
    status?: boolean
    subject?: boolean
    ownerId?: boolean
    leadId?: boolean
    customerId?: boolean
    agentId?: boolean
    nextFollowUpAt?: boolean
    slaBreachedAt?: boolean
    closedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Conversation$ownerArgs<ExtArgs>
    lead?: boolean | Conversation$leadArgs<ExtArgs>
    customer?: boolean | Conversation$customerArgs<ExtArgs>
    agent?: boolean | Conversation$agentArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectScalar = {
    id?: boolean
    businessId?: boolean
    channel?: boolean
    status?: boolean
    subject?: boolean
    ownerId?: boolean
    leadId?: boolean
    customerId?: boolean
    agentId?: boolean
    nextFollowUpAt?: boolean
    slaBreachedAt?: boolean
    closedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Conversation$ownerArgs<ExtArgs>
    lead?: boolean | Conversation$leadArgs<ExtArgs>
    customer?: boolean | Conversation$customerArgs<ExtArgs>
    agent?: boolean | Conversation$agentArgs<ExtArgs>
    messages?: boolean | Conversation$messagesArgs<ExtArgs>
    tasks?: boolean | Conversation$tasksArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Conversation$ownerArgs<ExtArgs>
    lead?: boolean | Conversation$leadArgs<ExtArgs>
    customer?: boolean | Conversation$customerArgs<ExtArgs>
    agent?: boolean | Conversation$agentArgs<ExtArgs>
  }

  export type $ConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conversation"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      owner: Prisma.$UserPayload<ExtArgs> | null
      lead: Prisma.$LeadPayload<ExtArgs> | null
      customer: Prisma.$CustomerPayload<ExtArgs> | null
      agent: Prisma.$AgentPayload<ExtArgs> | null
      messages: Prisma.$InteractionPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      channel: $Enums.ConversationChannel
      status: $Enums.ConversationStatus
      subject: string | null
      ownerId: string | null
      leadId: string | null
      customerId: string | null
      agentId: string | null
      nextFollowUpAt: Date | null
      slaBreachedAt: Date | null
      closedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["conversation"]>
    composites: {}
  }

  type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = $Result.GetResult<Prisma.$ConversationPayload, S>

  type ConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConversationCountAggregateInputType | true
    }

  export interface ConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conversation'], meta: { name: 'Conversation' } }
    /**
     * Find zero or one Conversation that matches the filter.
     * @param {ConversationFindUniqueArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationFindUniqueArgs>(args: SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Conversation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConversationFindUniqueOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Conversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationFindFirstArgs>(args?: SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Conversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Conversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conversations
     * const conversations = await prisma.conversation.findMany()
     * 
     * // Get first 10 Conversations
     * const conversations = await prisma.conversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationWithIdOnly = await prisma.conversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationFindManyArgs>(args?: SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Conversation.
     * @param {ConversationCreateArgs} args - Arguments to create a Conversation.
     * @example
     * // Create one Conversation
     * const Conversation = await prisma.conversation.create({
     *   data: {
     *     // ... data to create a Conversation
     *   }
     * })
     * 
     */
    create<T extends ConversationCreateArgs>(args: SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Conversations.
     * @param {ConversationCreateManyArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationCreateManyArgs>(args?: SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conversations and returns the data saved in the database.
     * @param {ConversationCreateManyAndReturnArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Conversation.
     * @param {ConversationDeleteArgs} args - Arguments to delete one Conversation.
     * @example
     * // Delete one Conversation
     * const Conversation = await prisma.conversation.delete({
     *   where: {
     *     // ... filter to delete one Conversation
     *   }
     * })
     * 
     */
    delete<T extends ConversationDeleteArgs>(args: SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Conversation.
     * @param {ConversationUpdateArgs} args - Arguments to update one Conversation.
     * @example
     * // Update one Conversation
     * const conversation = await prisma.conversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationUpdateArgs>(args: SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Conversations.
     * @param {ConversationDeleteManyArgs} args - Arguments to filter Conversations to delete.
     * @example
     * // Delete a few Conversations
     * const { count } = await prisma.conversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationDeleteManyArgs>(args?: SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationUpdateManyArgs>(args: SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Conversation.
     * @param {ConversationUpsertArgs} args - Arguments to update or create a Conversation.
     * @example
     * // Update or create a Conversation
     * const conversation = await prisma.conversation.upsert({
     *   create: {
     *     // ... data to create a Conversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conversation we want to update
     *   }
     * })
     */
    upsert<T extends ConversationUpsertArgs>(args: SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationCountArgs} args - Arguments to filter Conversations to count.
     * @example
     * // Count the number of Conversations
     * const count = await prisma.conversation.count({
     *   where: {
     *     // ... the filter for the Conversations we want to count
     *   }
     * })
    **/
    count<T extends ConversationCountArgs>(
      args?: Subset<T, ConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConversationAggregateArgs>(args: Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>

    /**
     * Group by Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationGroupByArgs} args - Group by arguments.
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
      T extends ConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConversationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conversation model
   */
  readonly fields: ConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    owner<T extends Conversation$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    lead<T extends Conversation$leadArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$leadArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    customer<T extends Conversation$customerArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    agent<T extends Conversation$agentArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$agentArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    messages<T extends Conversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends Conversation$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Conversation model
   */ 
  interface ConversationFieldRefs {
    readonly id: FieldRef<"Conversation", 'String'>
    readonly businessId: FieldRef<"Conversation", 'String'>
    readonly channel: FieldRef<"Conversation", 'ConversationChannel'>
    readonly status: FieldRef<"Conversation", 'ConversationStatus'>
    readonly subject: FieldRef<"Conversation", 'String'>
    readonly ownerId: FieldRef<"Conversation", 'String'>
    readonly leadId: FieldRef<"Conversation", 'String'>
    readonly customerId: FieldRef<"Conversation", 'String'>
    readonly agentId: FieldRef<"Conversation", 'String'>
    readonly nextFollowUpAt: FieldRef<"Conversation", 'DateTime'>
    readonly slaBreachedAt: FieldRef<"Conversation", 'DateTime'>
    readonly closedAt: FieldRef<"Conversation", 'DateTime'>
    readonly createdAt: FieldRef<"Conversation", 'DateTime'>
    readonly updatedAt: FieldRef<"Conversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Conversation findUnique
   */
  export type ConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findUniqueOrThrow
   */
  export type ConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findFirst
   */
  export type ConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findFirstOrThrow
   */
  export type ConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findMany
   */
  export type ConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversations to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation create
   */
  export type ConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a Conversation.
     */
    data: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
  }

  /**
   * Conversation createMany
   */
  export type ConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation createManyAndReturn
   */
  export type ConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Conversation update
   */
  export type ConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a Conversation.
     */
    data: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
    /**
     * Choose, which Conversation to update.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation updateMany
   */
  export type ConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
  }

  /**
   * Conversation upsert
   */
  export type ConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the Conversation to update in case it exists.
     */
    where: ConversationWhereUniqueInput
    /**
     * In case the Conversation found by the `where` argument doesn't exist, create a new Conversation with this data.
     */
    create: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
    /**
     * In case the Conversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
  }

  /**
   * Conversation delete
   */
  export type ConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter which Conversation to delete.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation deleteMany
   */
  export type ConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversations to delete
     */
    where?: ConversationWhereInput
  }

  /**
   * Conversation.owner
   */
  export type Conversation$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Conversation.lead
   */
  export type Conversation$leadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
  }

  /**
   * Conversation.customer
   */
  export type Conversation$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Conversation.agent
   */
  export type Conversation$agentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Agent
     */
    select?: AgentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentInclude<ExtArgs> | null
    where?: AgentWhereInput
  }

  /**
   * Conversation.messages
   */
  export type Conversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    where?: InteractionWhereInput
    orderBy?: InteractionOrderByWithRelationInput | InteractionOrderByWithRelationInput[]
    cursor?: InteractionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InteractionScalarFieldEnum | InteractionScalarFieldEnum[]
  }

  /**
   * Conversation.tasks
   */
  export type Conversation$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Conversation without action
   */
  export type ConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
  }


  /**
   * Model Interaction
   */

  export type AggregateInteraction = {
    _count: InteractionCountAggregateOutputType | null
    _min: InteractionMinAggregateOutputType | null
    _max: InteractionMaxAggregateOutputType | null
  }

  export type InteractionMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    conversationId: string | null
    type: $Enums.InteractionType | null
    direction: string | null
    body: string | null
    createdById: string | null
    createdAt: Date | null
  }

  export type InteractionMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    conversationId: string | null
    type: $Enums.InteractionType | null
    direction: string | null
    body: string | null
    createdById: string | null
    createdAt: Date | null
  }

  export type InteractionCountAggregateOutputType = {
    id: number
    businessId: number
    conversationId: number
    type: number
    direction: number
    body: number
    metadata: number
    createdById: number
    createdAt: number
    _all: number
  }


  export type InteractionMinAggregateInputType = {
    id?: true
    businessId?: true
    conversationId?: true
    type?: true
    direction?: true
    body?: true
    createdById?: true
    createdAt?: true
  }

  export type InteractionMaxAggregateInputType = {
    id?: true
    businessId?: true
    conversationId?: true
    type?: true
    direction?: true
    body?: true
    createdById?: true
    createdAt?: true
  }

  export type InteractionCountAggregateInputType = {
    id?: true
    businessId?: true
    conversationId?: true
    type?: true
    direction?: true
    body?: true
    metadata?: true
    createdById?: true
    createdAt?: true
    _all?: true
  }

  export type InteractionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Interaction to aggregate.
     */
    where?: InteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interactions to fetch.
     */
    orderBy?: InteractionOrderByWithRelationInput | InteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Interactions
    **/
    _count?: true | InteractionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InteractionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InteractionMaxAggregateInputType
  }

  export type GetInteractionAggregateType<T extends InteractionAggregateArgs> = {
        [P in keyof T & keyof AggregateInteraction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInteraction[P]>
      : GetScalarType<T[P], AggregateInteraction[P]>
  }




  export type InteractionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteractionWhereInput
    orderBy?: InteractionOrderByWithAggregationInput | InteractionOrderByWithAggregationInput[]
    by: InteractionScalarFieldEnum[] | InteractionScalarFieldEnum
    having?: InteractionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InteractionCountAggregateInputType | true
    _min?: InteractionMinAggregateInputType
    _max?: InteractionMaxAggregateInputType
  }

  export type InteractionGroupByOutputType = {
    id: string
    businessId: string
    conversationId: string
    type: $Enums.InteractionType
    direction: string | null
    body: string
    metadata: JsonValue | null
    createdById: string | null
    createdAt: Date
    _count: InteractionCountAggregateOutputType | null
    _min: InteractionMinAggregateOutputType | null
    _max: InteractionMaxAggregateOutputType | null
  }

  type GetInteractionGroupByPayload<T extends InteractionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InteractionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InteractionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InteractionGroupByOutputType[P]>
            : GetScalarType<T[P], InteractionGroupByOutputType[P]>
        }
      >
    >


  export type InteractionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    conversationId?: boolean
    type?: boolean
    direction?: boolean
    body?: boolean
    metadata?: boolean
    createdById?: boolean
    createdAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
    createdBy?: boolean | Interaction$createdByArgs<ExtArgs>
  }, ExtArgs["result"]["interaction"]>

  export type InteractionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    conversationId?: boolean
    type?: boolean
    direction?: boolean
    body?: boolean
    metadata?: boolean
    createdById?: boolean
    createdAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
    createdBy?: boolean | Interaction$createdByArgs<ExtArgs>
  }, ExtArgs["result"]["interaction"]>

  export type InteractionSelectScalar = {
    id?: boolean
    businessId?: boolean
    conversationId?: boolean
    type?: boolean
    direction?: boolean
    body?: boolean
    metadata?: boolean
    createdById?: boolean
    createdAt?: boolean
  }

  export type InteractionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
    createdBy?: boolean | Interaction$createdByArgs<ExtArgs>
  }
  export type InteractionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
    createdBy?: boolean | Interaction$createdByArgs<ExtArgs>
  }

  export type $InteractionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Interaction"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      conversation: Prisma.$ConversationPayload<ExtArgs>
      createdBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      conversationId: string
      type: $Enums.InteractionType
      /**
       * inbound/outbound/internal
       */
      direction: string | null
      body: string
      metadata: Prisma.JsonValue | null
      createdById: string | null
      createdAt: Date
    }, ExtArgs["result"]["interaction"]>
    composites: {}
  }

  type InteractionGetPayload<S extends boolean | null | undefined | InteractionDefaultArgs> = $Result.GetResult<Prisma.$InteractionPayload, S>

  type InteractionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InteractionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InteractionCountAggregateInputType | true
    }

  export interface InteractionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Interaction'], meta: { name: 'Interaction' } }
    /**
     * Find zero or one Interaction that matches the filter.
     * @param {InteractionFindUniqueArgs} args - Arguments to find a Interaction
     * @example
     * // Get one Interaction
     * const interaction = await prisma.interaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InteractionFindUniqueArgs>(args: SelectSubset<T, InteractionFindUniqueArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Interaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InteractionFindUniqueOrThrowArgs} args - Arguments to find a Interaction
     * @example
     * // Get one Interaction
     * const interaction = await prisma.interaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InteractionFindUniqueOrThrowArgs>(args: SelectSubset<T, InteractionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Interaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionFindFirstArgs} args - Arguments to find a Interaction
     * @example
     * // Get one Interaction
     * const interaction = await prisma.interaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InteractionFindFirstArgs>(args?: SelectSubset<T, InteractionFindFirstArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Interaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionFindFirstOrThrowArgs} args - Arguments to find a Interaction
     * @example
     * // Get one Interaction
     * const interaction = await prisma.interaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InteractionFindFirstOrThrowArgs>(args?: SelectSubset<T, InteractionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Interactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Interactions
     * const interactions = await prisma.interaction.findMany()
     * 
     * // Get first 10 Interactions
     * const interactions = await prisma.interaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const interactionWithIdOnly = await prisma.interaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InteractionFindManyArgs>(args?: SelectSubset<T, InteractionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Interaction.
     * @param {InteractionCreateArgs} args - Arguments to create a Interaction.
     * @example
     * // Create one Interaction
     * const Interaction = await prisma.interaction.create({
     *   data: {
     *     // ... data to create a Interaction
     *   }
     * })
     * 
     */
    create<T extends InteractionCreateArgs>(args: SelectSubset<T, InteractionCreateArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Interactions.
     * @param {InteractionCreateManyArgs} args - Arguments to create many Interactions.
     * @example
     * // Create many Interactions
     * const interaction = await prisma.interaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InteractionCreateManyArgs>(args?: SelectSubset<T, InteractionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Interactions and returns the data saved in the database.
     * @param {InteractionCreateManyAndReturnArgs} args - Arguments to create many Interactions.
     * @example
     * // Create many Interactions
     * const interaction = await prisma.interaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Interactions and only return the `id`
     * const interactionWithIdOnly = await prisma.interaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InteractionCreateManyAndReturnArgs>(args?: SelectSubset<T, InteractionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Interaction.
     * @param {InteractionDeleteArgs} args - Arguments to delete one Interaction.
     * @example
     * // Delete one Interaction
     * const Interaction = await prisma.interaction.delete({
     *   where: {
     *     // ... filter to delete one Interaction
     *   }
     * })
     * 
     */
    delete<T extends InteractionDeleteArgs>(args: SelectSubset<T, InteractionDeleteArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Interaction.
     * @param {InteractionUpdateArgs} args - Arguments to update one Interaction.
     * @example
     * // Update one Interaction
     * const interaction = await prisma.interaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InteractionUpdateArgs>(args: SelectSubset<T, InteractionUpdateArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Interactions.
     * @param {InteractionDeleteManyArgs} args - Arguments to filter Interactions to delete.
     * @example
     * // Delete a few Interactions
     * const { count } = await prisma.interaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InteractionDeleteManyArgs>(args?: SelectSubset<T, InteractionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Interactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Interactions
     * const interaction = await prisma.interaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InteractionUpdateManyArgs>(args: SelectSubset<T, InteractionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Interaction.
     * @param {InteractionUpsertArgs} args - Arguments to update or create a Interaction.
     * @example
     * // Update or create a Interaction
     * const interaction = await prisma.interaction.upsert({
     *   create: {
     *     // ... data to create a Interaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Interaction we want to update
     *   }
     * })
     */
    upsert<T extends InteractionUpsertArgs>(args: SelectSubset<T, InteractionUpsertArgs<ExtArgs>>): Prisma__InteractionClient<$Result.GetResult<Prisma.$InteractionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Interactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionCountArgs} args - Arguments to filter Interactions to count.
     * @example
     * // Count the number of Interactions
     * const count = await prisma.interaction.count({
     *   where: {
     *     // ... the filter for the Interactions we want to count
     *   }
     * })
    **/
    count<T extends InteractionCountArgs>(
      args?: Subset<T, InteractionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InteractionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Interaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InteractionAggregateArgs>(args: Subset<T, InteractionAggregateArgs>): Prisma.PrismaPromise<GetInteractionAggregateType<T>>

    /**
     * Group by Interaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionGroupByArgs} args - Group by arguments.
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
      T extends InteractionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InteractionGroupByArgs['orderBy'] }
        : { orderBy?: InteractionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InteractionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInteractionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Interaction model
   */
  readonly fields: InteractionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Interaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InteractionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    conversation<T extends ConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConversationDefaultArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    createdBy<T extends Interaction$createdByArgs<ExtArgs> = {}>(args?: Subset<T, Interaction$createdByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Interaction model
   */ 
  interface InteractionFieldRefs {
    readonly id: FieldRef<"Interaction", 'String'>
    readonly businessId: FieldRef<"Interaction", 'String'>
    readonly conversationId: FieldRef<"Interaction", 'String'>
    readonly type: FieldRef<"Interaction", 'InteractionType'>
    readonly direction: FieldRef<"Interaction", 'String'>
    readonly body: FieldRef<"Interaction", 'String'>
    readonly metadata: FieldRef<"Interaction", 'Json'>
    readonly createdById: FieldRef<"Interaction", 'String'>
    readonly createdAt: FieldRef<"Interaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Interaction findUnique
   */
  export type InteractionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * Filter, which Interaction to fetch.
     */
    where: InteractionWhereUniqueInput
  }

  /**
   * Interaction findUniqueOrThrow
   */
  export type InteractionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * Filter, which Interaction to fetch.
     */
    where: InteractionWhereUniqueInput
  }

  /**
   * Interaction findFirst
   */
  export type InteractionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * Filter, which Interaction to fetch.
     */
    where?: InteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interactions to fetch.
     */
    orderBy?: InteractionOrderByWithRelationInput | InteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Interactions.
     */
    cursor?: InteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Interactions.
     */
    distinct?: InteractionScalarFieldEnum | InteractionScalarFieldEnum[]
  }

  /**
   * Interaction findFirstOrThrow
   */
  export type InteractionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * Filter, which Interaction to fetch.
     */
    where?: InteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interactions to fetch.
     */
    orderBy?: InteractionOrderByWithRelationInput | InteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Interactions.
     */
    cursor?: InteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Interactions.
     */
    distinct?: InteractionScalarFieldEnum | InteractionScalarFieldEnum[]
  }

  /**
   * Interaction findMany
   */
  export type InteractionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * Filter, which Interactions to fetch.
     */
    where?: InteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Interactions to fetch.
     */
    orderBy?: InteractionOrderByWithRelationInput | InteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Interactions.
     */
    cursor?: InteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Interactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Interactions.
     */
    skip?: number
    distinct?: InteractionScalarFieldEnum | InteractionScalarFieldEnum[]
  }

  /**
   * Interaction create
   */
  export type InteractionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * The data needed to create a Interaction.
     */
    data: XOR<InteractionCreateInput, InteractionUncheckedCreateInput>
  }

  /**
   * Interaction createMany
   */
  export type InteractionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Interactions.
     */
    data: InteractionCreateManyInput | InteractionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Interaction createManyAndReturn
   */
  export type InteractionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Interactions.
     */
    data: InteractionCreateManyInput | InteractionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Interaction update
   */
  export type InteractionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * The data needed to update a Interaction.
     */
    data: XOR<InteractionUpdateInput, InteractionUncheckedUpdateInput>
    /**
     * Choose, which Interaction to update.
     */
    where: InteractionWhereUniqueInput
  }

  /**
   * Interaction updateMany
   */
  export type InteractionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Interactions.
     */
    data: XOR<InteractionUpdateManyMutationInput, InteractionUncheckedUpdateManyInput>
    /**
     * Filter which Interactions to update
     */
    where?: InteractionWhereInput
  }

  /**
   * Interaction upsert
   */
  export type InteractionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * The filter to search for the Interaction to update in case it exists.
     */
    where: InteractionWhereUniqueInput
    /**
     * In case the Interaction found by the `where` argument doesn't exist, create a new Interaction with this data.
     */
    create: XOR<InteractionCreateInput, InteractionUncheckedCreateInput>
    /**
     * In case the Interaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InteractionUpdateInput, InteractionUncheckedUpdateInput>
  }

  /**
   * Interaction delete
   */
  export type InteractionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
    /**
     * Filter which Interaction to delete.
     */
    where: InteractionWhereUniqueInput
  }

  /**
   * Interaction deleteMany
   */
  export type InteractionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Interactions to delete
     */
    where?: InteractionWhereInput
  }

  /**
   * Interaction.createdBy
   */
  export type Interaction$createdByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Interaction without action
   */
  export type InteractionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Interaction
     */
    select?: InteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    ownerId: string | null
    leadId: string | null
    customerId: string | null
    conversationId: string | null
    title: string | null
    description: string | null
    type: $Enums.TaskType | null
    status: $Enums.TaskStatus | null
    dueAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    ownerId: string | null
    leadId: string | null
    customerId: string | null
    conversationId: string | null
    title: string | null
    description: string | null
    type: $Enums.TaskType | null
    status: $Enums.TaskStatus | null
    dueAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    businessId: number
    ownerId: number
    leadId: number
    customerId: number
    conversationId: number
    title: number
    description: number
    type: number
    status: number
    dueAt: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskMinAggregateInputType = {
    id?: true
    businessId?: true
    ownerId?: true
    leadId?: true
    customerId?: true
    conversationId?: true
    title?: true
    description?: true
    type?: true
    status?: true
    dueAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    businessId?: true
    ownerId?: true
    leadId?: true
    customerId?: true
    conversationId?: true
    title?: true
    description?: true
    type?: true
    status?: true
    dueAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    businessId?: true
    ownerId?: true
    leadId?: true
    customerId?: true
    conversationId?: true
    title?: true
    description?: true
    type?: true
    status?: true
    dueAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    businessId: string
    ownerId: string | null
    leadId: string | null
    customerId: string | null
    conversationId: string | null
    title: string
    description: string | null
    type: $Enums.TaskType
    status: $Enums.TaskStatus
    dueAt: Date
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    ownerId?: boolean
    leadId?: boolean
    customerId?: boolean
    conversationId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    dueAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Task$ownerArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
    customer?: boolean | Task$customerArgs<ExtArgs>
    conversation?: boolean | Task$conversationArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    ownerId?: boolean
    leadId?: boolean
    customerId?: boolean
    conversationId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    dueAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Task$ownerArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
    customer?: boolean | Task$customerArgs<ExtArgs>
    conversation?: boolean | Task$conversationArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    businessId?: boolean
    ownerId?: boolean
    leadId?: boolean
    customerId?: boolean
    conversationId?: boolean
    title?: boolean
    description?: boolean
    type?: boolean
    status?: boolean
    dueAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Task$ownerArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
    customer?: boolean | Task$customerArgs<ExtArgs>
    conversation?: boolean | Task$conversationArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    owner?: boolean | Task$ownerArgs<ExtArgs>
    lead?: boolean | Task$leadArgs<ExtArgs>
    customer?: boolean | Task$customerArgs<ExtArgs>
    conversation?: boolean | Task$conversationArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      owner: Prisma.$UserPayload<ExtArgs> | null
      lead: Prisma.$LeadPayload<ExtArgs> | null
      customer: Prisma.$CustomerPayload<ExtArgs> | null
      conversation: Prisma.$ConversationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      ownerId: string | null
      leadId: string | null
      customerId: string | null
      conversationId: string | null
      title: string
      description: string | null
      type: $Enums.TaskType
      status: $Enums.TaskStatus
      dueAt: Date
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
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
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    owner<T extends Task$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Task$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    lead<T extends Task$leadArgs<ExtArgs> = {}>(args?: Subset<T, Task$leadArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    customer<T extends Task$customerArgs<ExtArgs> = {}>(args?: Subset<T, Task$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    conversation<T extends Task$conversationArgs<ExtArgs> = {}>(args?: Subset<T, Task$conversationArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Task model
   */ 
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly businessId: FieldRef<"Task", 'String'>
    readonly ownerId: FieldRef<"Task", 'String'>
    readonly leadId: FieldRef<"Task", 'String'>
    readonly customerId: FieldRef<"Task", 'String'>
    readonly conversationId: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly type: FieldRef<"Task", 'TaskType'>
    readonly status: FieldRef<"Task", 'TaskStatus'>
    readonly dueAt: FieldRef<"Task", 'DateTime'>
    readonly completedAt: FieldRef<"Task", 'DateTime'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }

  /**
   * Task.owner
   */
  export type Task$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Task.lead
   */
  export type Task$leadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
  }

  /**
   * Task.customer
   */
  export type Task$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Task.conversation
   */
  export type Task$conversationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    where?: ConversationWhereInput
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model Attribution
   */

  export type AggregateAttribution = {
    _count: AttributionCountAggregateOutputType | null
    _min: AttributionMinAggregateOutputType | null
    _max: AttributionMaxAggregateOutputType | null
  }

  export type AttributionMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    agentId: string | null
    method: $Enums.AttributionMethod | null
    leadId: string | null
    customerId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type AttributionMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    agentId: string | null
    method: $Enums.AttributionMethod | null
    leadId: string | null
    customerId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type AttributionCountAggregateOutputType = {
    id: number
    businessId: number
    agentId: number
    method: number
    leadId: number
    customerId: number
    notes: number
    createdAt: number
    _all: number
  }


  export type AttributionMinAggregateInputType = {
    id?: true
    businessId?: true
    agentId?: true
    method?: true
    leadId?: true
    customerId?: true
    notes?: true
    createdAt?: true
  }

  export type AttributionMaxAggregateInputType = {
    id?: true
    businessId?: true
    agentId?: true
    method?: true
    leadId?: true
    customerId?: true
    notes?: true
    createdAt?: true
  }

  export type AttributionCountAggregateInputType = {
    id?: true
    businessId?: true
    agentId?: true
    method?: true
    leadId?: true
    customerId?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type AttributionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attribution to aggregate.
     */
    where?: AttributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attributions to fetch.
     */
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AttributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Attributions
    **/
    _count?: true | AttributionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AttributionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AttributionMaxAggregateInputType
  }

  export type GetAttributionAggregateType<T extends AttributionAggregateArgs> = {
        [P in keyof T & keyof AggregateAttribution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttribution[P]>
      : GetScalarType<T[P], AggregateAttribution[P]>
  }




  export type AttributionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttributionWhereInput
    orderBy?: AttributionOrderByWithAggregationInput | AttributionOrderByWithAggregationInput[]
    by: AttributionScalarFieldEnum[] | AttributionScalarFieldEnum
    having?: AttributionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AttributionCountAggregateInputType | true
    _min?: AttributionMinAggregateInputType
    _max?: AttributionMaxAggregateInputType
  }

  export type AttributionGroupByOutputType = {
    id: string
    businessId: string
    agentId: string
    method: $Enums.AttributionMethod
    leadId: string | null
    customerId: string | null
    notes: string | null
    createdAt: Date
    _count: AttributionCountAggregateOutputType | null
    _min: AttributionMinAggregateOutputType | null
    _max: AttributionMaxAggregateOutputType | null
  }

  type GetAttributionGroupByPayload<T extends AttributionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AttributionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AttributionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttributionGroupByOutputType[P]>
            : GetScalarType<T[P], AttributionGroupByOutputType[P]>
        }
      >
    >


  export type AttributionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    agentId?: boolean
    method?: boolean
    leadId?: boolean
    customerId?: boolean
    notes?: boolean
    createdAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    agent?: boolean | AgentDefaultArgs<ExtArgs>
    lead?: boolean | Attribution$leadArgs<ExtArgs>
    customer?: boolean | Attribution$customerArgs<ExtArgs>
  }, ExtArgs["result"]["attribution"]>

  export type AttributionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    agentId?: boolean
    method?: boolean
    leadId?: boolean
    customerId?: boolean
    notes?: boolean
    createdAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    agent?: boolean | AgentDefaultArgs<ExtArgs>
    lead?: boolean | Attribution$leadArgs<ExtArgs>
    customer?: boolean | Attribution$customerArgs<ExtArgs>
  }, ExtArgs["result"]["attribution"]>

  export type AttributionSelectScalar = {
    id?: boolean
    businessId?: boolean
    agentId?: boolean
    method?: boolean
    leadId?: boolean
    customerId?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type AttributionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    agent?: boolean | AgentDefaultArgs<ExtArgs>
    lead?: boolean | Attribution$leadArgs<ExtArgs>
    customer?: boolean | Attribution$customerArgs<ExtArgs>
  }
  export type AttributionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    agent?: boolean | AgentDefaultArgs<ExtArgs>
    lead?: boolean | Attribution$leadArgs<ExtArgs>
    customer?: boolean | Attribution$customerArgs<ExtArgs>
  }

  export type $AttributionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Attribution"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      agent: Prisma.$AgentPayload<ExtArgs>
      lead: Prisma.$LeadPayload<ExtArgs> | null
      customer: Prisma.$CustomerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      agentId: string
      method: $Enums.AttributionMethod
      leadId: string | null
      customerId: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["attribution"]>
    composites: {}
  }

  type AttributionGetPayload<S extends boolean | null | undefined | AttributionDefaultArgs> = $Result.GetResult<Prisma.$AttributionPayload, S>

  type AttributionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AttributionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AttributionCountAggregateInputType | true
    }

  export interface AttributionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Attribution'], meta: { name: 'Attribution' } }
    /**
     * Find zero or one Attribution that matches the filter.
     * @param {AttributionFindUniqueArgs} args - Arguments to find a Attribution
     * @example
     * // Get one Attribution
     * const attribution = await prisma.attribution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AttributionFindUniqueArgs>(args: SelectSubset<T, AttributionFindUniqueArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Attribution that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AttributionFindUniqueOrThrowArgs} args - Arguments to find a Attribution
     * @example
     * // Get one Attribution
     * const attribution = await prisma.attribution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AttributionFindUniqueOrThrowArgs>(args: SelectSubset<T, AttributionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Attribution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttributionFindFirstArgs} args - Arguments to find a Attribution
     * @example
     * // Get one Attribution
     * const attribution = await prisma.attribution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AttributionFindFirstArgs>(args?: SelectSubset<T, AttributionFindFirstArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Attribution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttributionFindFirstOrThrowArgs} args - Arguments to find a Attribution
     * @example
     * // Get one Attribution
     * const attribution = await prisma.attribution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AttributionFindFirstOrThrowArgs>(args?: SelectSubset<T, AttributionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Attributions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttributionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attributions
     * const attributions = await prisma.attribution.findMany()
     * 
     * // Get first 10 Attributions
     * const attributions = await prisma.attribution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const attributionWithIdOnly = await prisma.attribution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AttributionFindManyArgs>(args?: SelectSubset<T, AttributionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Attribution.
     * @param {AttributionCreateArgs} args - Arguments to create a Attribution.
     * @example
     * // Create one Attribution
     * const Attribution = await prisma.attribution.create({
     *   data: {
     *     // ... data to create a Attribution
     *   }
     * })
     * 
     */
    create<T extends AttributionCreateArgs>(args: SelectSubset<T, AttributionCreateArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Attributions.
     * @param {AttributionCreateManyArgs} args - Arguments to create many Attributions.
     * @example
     * // Create many Attributions
     * const attribution = await prisma.attribution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AttributionCreateManyArgs>(args?: SelectSubset<T, AttributionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Attributions and returns the data saved in the database.
     * @param {AttributionCreateManyAndReturnArgs} args - Arguments to create many Attributions.
     * @example
     * // Create many Attributions
     * const attribution = await prisma.attribution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Attributions and only return the `id`
     * const attributionWithIdOnly = await prisma.attribution.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AttributionCreateManyAndReturnArgs>(args?: SelectSubset<T, AttributionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Attribution.
     * @param {AttributionDeleteArgs} args - Arguments to delete one Attribution.
     * @example
     * // Delete one Attribution
     * const Attribution = await prisma.attribution.delete({
     *   where: {
     *     // ... filter to delete one Attribution
     *   }
     * })
     * 
     */
    delete<T extends AttributionDeleteArgs>(args: SelectSubset<T, AttributionDeleteArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Attribution.
     * @param {AttributionUpdateArgs} args - Arguments to update one Attribution.
     * @example
     * // Update one Attribution
     * const attribution = await prisma.attribution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AttributionUpdateArgs>(args: SelectSubset<T, AttributionUpdateArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Attributions.
     * @param {AttributionDeleteManyArgs} args - Arguments to filter Attributions to delete.
     * @example
     * // Delete a few Attributions
     * const { count } = await prisma.attribution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AttributionDeleteManyArgs>(args?: SelectSubset<T, AttributionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attributions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttributionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attributions
     * const attribution = await prisma.attribution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AttributionUpdateManyArgs>(args: SelectSubset<T, AttributionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Attribution.
     * @param {AttributionUpsertArgs} args - Arguments to update or create a Attribution.
     * @example
     * // Update or create a Attribution
     * const attribution = await prisma.attribution.upsert({
     *   create: {
     *     // ... data to create a Attribution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attribution we want to update
     *   }
     * })
     */
    upsert<T extends AttributionUpsertArgs>(args: SelectSubset<T, AttributionUpsertArgs<ExtArgs>>): Prisma__AttributionClient<$Result.GetResult<Prisma.$AttributionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Attributions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttributionCountArgs} args - Arguments to filter Attributions to count.
     * @example
     * // Count the number of Attributions
     * const count = await prisma.attribution.count({
     *   where: {
     *     // ... the filter for the Attributions we want to count
     *   }
     * })
    **/
    count<T extends AttributionCountArgs>(
      args?: Subset<T, AttributionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttributionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attribution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttributionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AttributionAggregateArgs>(args: Subset<T, AttributionAggregateArgs>): Prisma.PrismaPromise<GetAttributionAggregateType<T>>

    /**
     * Group by Attribution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttributionGroupByArgs} args - Group by arguments.
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
      T extends AttributionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttributionGroupByArgs['orderBy'] }
        : { orderBy?: AttributionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AttributionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttributionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Attribution model
   */
  readonly fields: AttributionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Attribution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttributionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    agent<T extends AgentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentDefaultArgs<ExtArgs>>): Prisma__AgentClient<$Result.GetResult<Prisma.$AgentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    lead<T extends Attribution$leadArgs<ExtArgs> = {}>(args?: Subset<T, Attribution$leadArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    customer<T extends Attribution$customerArgs<ExtArgs> = {}>(args?: Subset<T, Attribution$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Attribution model
   */ 
  interface AttributionFieldRefs {
    readonly id: FieldRef<"Attribution", 'String'>
    readonly businessId: FieldRef<"Attribution", 'String'>
    readonly agentId: FieldRef<"Attribution", 'String'>
    readonly method: FieldRef<"Attribution", 'AttributionMethod'>
    readonly leadId: FieldRef<"Attribution", 'String'>
    readonly customerId: FieldRef<"Attribution", 'String'>
    readonly notes: FieldRef<"Attribution", 'String'>
    readonly createdAt: FieldRef<"Attribution", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Attribution findUnique
   */
  export type AttributionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * Filter, which Attribution to fetch.
     */
    where: AttributionWhereUniqueInput
  }

  /**
   * Attribution findUniqueOrThrow
   */
  export type AttributionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * Filter, which Attribution to fetch.
     */
    where: AttributionWhereUniqueInput
  }

  /**
   * Attribution findFirst
   */
  export type AttributionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * Filter, which Attribution to fetch.
     */
    where?: AttributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attributions to fetch.
     */
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attributions.
     */
    cursor?: AttributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attributions.
     */
    distinct?: AttributionScalarFieldEnum | AttributionScalarFieldEnum[]
  }

  /**
   * Attribution findFirstOrThrow
   */
  export type AttributionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * Filter, which Attribution to fetch.
     */
    where?: AttributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attributions to fetch.
     */
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attributions.
     */
    cursor?: AttributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attributions.
     */
    distinct?: AttributionScalarFieldEnum | AttributionScalarFieldEnum[]
  }

  /**
   * Attribution findMany
   */
  export type AttributionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * Filter, which Attributions to fetch.
     */
    where?: AttributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attributions to fetch.
     */
    orderBy?: AttributionOrderByWithRelationInput | AttributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Attributions.
     */
    cursor?: AttributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attributions.
     */
    skip?: number
    distinct?: AttributionScalarFieldEnum | AttributionScalarFieldEnum[]
  }

  /**
   * Attribution create
   */
  export type AttributionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * The data needed to create a Attribution.
     */
    data: XOR<AttributionCreateInput, AttributionUncheckedCreateInput>
  }

  /**
   * Attribution createMany
   */
  export type AttributionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Attributions.
     */
    data: AttributionCreateManyInput | AttributionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Attribution createManyAndReturn
   */
  export type AttributionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Attributions.
     */
    data: AttributionCreateManyInput | AttributionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Attribution update
   */
  export type AttributionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * The data needed to update a Attribution.
     */
    data: XOR<AttributionUpdateInput, AttributionUncheckedUpdateInput>
    /**
     * Choose, which Attribution to update.
     */
    where: AttributionWhereUniqueInput
  }

  /**
   * Attribution updateMany
   */
  export type AttributionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Attributions.
     */
    data: XOR<AttributionUpdateManyMutationInput, AttributionUncheckedUpdateManyInput>
    /**
     * Filter which Attributions to update
     */
    where?: AttributionWhereInput
  }

  /**
   * Attribution upsert
   */
  export type AttributionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * The filter to search for the Attribution to update in case it exists.
     */
    where: AttributionWhereUniqueInput
    /**
     * In case the Attribution found by the `where` argument doesn't exist, create a new Attribution with this data.
     */
    create: XOR<AttributionCreateInput, AttributionUncheckedCreateInput>
    /**
     * In case the Attribution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttributionUpdateInput, AttributionUncheckedUpdateInput>
  }

  /**
   * Attribution delete
   */
  export type AttributionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
    /**
     * Filter which Attribution to delete.
     */
    where: AttributionWhereUniqueInput
  }

  /**
   * Attribution deleteMany
   */
  export type AttributionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attributions to delete
     */
    where?: AttributionWhereInput
  }

  /**
   * Attribution.lead
   */
  export type Attribution$leadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeadInclude<ExtArgs> | null
    where?: LeadWhereInput
  }

  /**
   * Attribution.customer
   */
  export type Attribution$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Attribution without action
   */
  export type AttributionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribution
     */
    select?: AttributionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttributionInclude<ExtArgs> | null
  }


  /**
   * Model AuditEvent
   */

  export type AggregateAuditEvent = {
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  export type AuditEventMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    actorId: string | null
    entity: string | null
    entityId: string | null
    action: string | null
    createdAt: Date | null
  }

  export type AuditEventMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    actorId: string | null
    entity: string | null
    entityId: string | null
    action: string | null
    createdAt: Date | null
  }

  export type AuditEventCountAggregateOutputType = {
    id: number
    businessId: number
    actorId: number
    entity: number
    entityId: number
    action: number
    before: number
    after: number
    createdAt: number
    _all: number
  }


  export type AuditEventMinAggregateInputType = {
    id?: true
    businessId?: true
    actorId?: true
    entity?: true
    entityId?: true
    action?: true
    createdAt?: true
  }

  export type AuditEventMaxAggregateInputType = {
    id?: true
    businessId?: true
    actorId?: true
    entity?: true
    entityId?: true
    action?: true
    createdAt?: true
  }

  export type AuditEventCountAggregateInputType = {
    id?: true
    businessId?: true
    actorId?: true
    entity?: true
    entityId?: true
    action?: true
    before?: true
    after?: true
    createdAt?: true
    _all?: true
  }

  export type AuditEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvent to aggregate.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditEvents
    **/
    _count?: true | AuditEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditEventMaxAggregateInputType
  }

  export type GetAuditEventAggregateType<T extends AuditEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditEvent[P]>
      : GetScalarType<T[P], AggregateAuditEvent[P]>
  }




  export type AuditEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithAggregationInput | AuditEventOrderByWithAggregationInput[]
    by: AuditEventScalarFieldEnum[] | AuditEventScalarFieldEnum
    having?: AuditEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditEventCountAggregateInputType | true
    _min?: AuditEventMinAggregateInputType
    _max?: AuditEventMaxAggregateInputType
  }

  export type AuditEventGroupByOutputType = {
    id: string
    businessId: string
    actorId: string | null
    entity: string
    entityId: string
    action: string
    before: JsonValue | null
    after: JsonValue | null
    createdAt: Date
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  type GetAuditEventGroupByPayload<T extends AuditEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
            : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
        }
      >
    >


  export type AuditEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    actorId?: boolean
    entity?: boolean
    entityId?: boolean
    action?: boolean
    before?: boolean
    after?: boolean
    createdAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    actor?: boolean | AuditEvent$actorArgs<ExtArgs>
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    actorId?: boolean
    entity?: boolean
    entityId?: boolean
    action?: boolean
    before?: boolean
    after?: boolean
    createdAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    actor?: boolean | AuditEvent$actorArgs<ExtArgs>
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectScalar = {
    id?: boolean
    businessId?: boolean
    actorId?: boolean
    entity?: boolean
    entityId?: boolean
    action?: boolean
    before?: boolean
    after?: boolean
    createdAt?: boolean
  }

  export type AuditEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    actor?: boolean | AuditEvent$actorArgs<ExtArgs>
  }
  export type AuditEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    actor?: boolean | AuditEvent$actorArgs<ExtArgs>
  }

  export type $AuditEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditEvent"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      actor: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      actorId: string | null
      entity: string
      entityId: string
      action: string
      before: Prisma.JsonValue | null
      after: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["auditEvent"]>
    composites: {}
  }

  type AuditEventGetPayload<S extends boolean | null | undefined | AuditEventDefaultArgs> = $Result.GetResult<Prisma.$AuditEventPayload, S>

  type AuditEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditEventCountAggregateInputType | true
    }

  export interface AuditEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditEvent'], meta: { name: 'AuditEvent' } }
    /**
     * Find zero or one AuditEvent that matches the filter.
     * @param {AuditEventFindUniqueArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditEventFindUniqueArgs>(args: SelectSubset<T, AuditEventFindUniqueArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditEventFindUniqueOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditEventFindFirstArgs>(args?: SelectSubset<T, AuditEventFindFirstArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany()
     * 
     * // Get first 10 AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditEventFindManyArgs>(args?: SelectSubset<T, AuditEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditEvent.
     * @param {AuditEventCreateArgs} args - Arguments to create a AuditEvent.
     * @example
     * // Create one AuditEvent
     * const AuditEvent = await prisma.auditEvent.create({
     *   data: {
     *     // ... data to create a AuditEvent
     *   }
     * })
     * 
     */
    create<T extends AuditEventCreateArgs>(args: SelectSubset<T, AuditEventCreateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditEvents.
     * @param {AuditEventCreateManyArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditEventCreateManyArgs>(args?: SelectSubset<T, AuditEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditEvents and returns the data saved in the database.
     * @param {AuditEventCreateManyAndReturnArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditEvent.
     * @param {AuditEventDeleteArgs} args - Arguments to delete one AuditEvent.
     * @example
     * // Delete one AuditEvent
     * const AuditEvent = await prisma.auditEvent.delete({
     *   where: {
     *     // ... filter to delete one AuditEvent
     *   }
     * })
     * 
     */
    delete<T extends AuditEventDeleteArgs>(args: SelectSubset<T, AuditEventDeleteArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditEvent.
     * @param {AuditEventUpdateArgs} args - Arguments to update one AuditEvent.
     * @example
     * // Update one AuditEvent
     * const auditEvent = await prisma.auditEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditEventUpdateArgs>(args: SelectSubset<T, AuditEventUpdateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditEvents.
     * @param {AuditEventDeleteManyArgs} args - Arguments to filter AuditEvents to delete.
     * @example
     * // Delete a few AuditEvents
     * const { count } = await prisma.auditEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditEventDeleteManyArgs>(args?: SelectSubset<T, AuditEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditEventUpdateManyArgs>(args: SelectSubset<T, AuditEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditEvent.
     * @param {AuditEventUpsertArgs} args - Arguments to update or create a AuditEvent.
     * @example
     * // Update or create a AuditEvent
     * const auditEvent = await prisma.auditEvent.upsert({
     *   create: {
     *     // ... data to create a AuditEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditEvent we want to update
     *   }
     * })
     */
    upsert<T extends AuditEventUpsertArgs>(args: SelectSubset<T, AuditEventUpsertArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventCountArgs} args - Arguments to filter AuditEvents to count.
     * @example
     * // Count the number of AuditEvents
     * const count = await prisma.auditEvent.count({
     *   where: {
     *     // ... the filter for the AuditEvents we want to count
     *   }
     * })
    **/
    count<T extends AuditEventCountArgs>(
      args?: Subset<T, AuditEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditEventAggregateArgs>(args: Subset<T, AuditEventAggregateArgs>): Prisma.PrismaPromise<GetAuditEventAggregateType<T>>

    /**
     * Group by AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventGroupByArgs} args - Group by arguments.
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
      T extends AuditEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditEventGroupByArgs['orderBy'] }
        : { orderBy?: AuditEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditEvent model
   */
  readonly fields: AuditEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    actor<T extends AuditEvent$actorArgs<ExtArgs> = {}>(args?: Subset<T, AuditEvent$actorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the AuditEvent model
   */ 
  interface AuditEventFieldRefs {
    readonly id: FieldRef<"AuditEvent", 'String'>
    readonly businessId: FieldRef<"AuditEvent", 'String'>
    readonly actorId: FieldRef<"AuditEvent", 'String'>
    readonly entity: FieldRef<"AuditEvent", 'String'>
    readonly entityId: FieldRef<"AuditEvent", 'String'>
    readonly action: FieldRef<"AuditEvent", 'String'>
    readonly before: FieldRef<"AuditEvent", 'Json'>
    readonly after: FieldRef<"AuditEvent", 'Json'>
    readonly createdAt: FieldRef<"AuditEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditEvent findUnique
   */
  export type AuditEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findUniqueOrThrow
   */
  export type AuditEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findFirst
   */
  export type AuditEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findFirstOrThrow
   */
  export type AuditEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findMany
   */
  export type AuditEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvents to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent create
   */
  export type AuditEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditEvent.
     */
    data: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
  }

  /**
   * AuditEvent createMany
   */
  export type AuditEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent createManyAndReturn
   */
  export type AuditEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditEvent update
   */
  export type AuditEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditEvent.
     */
    data: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
    /**
     * Choose, which AuditEvent to update.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent updateMany
   */
  export type AuditEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
  }

  /**
   * AuditEvent upsert
   */
  export type AuditEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditEvent to update in case it exists.
     */
    where: AuditEventWhereUniqueInput
    /**
     * In case the AuditEvent found by the `where` argument doesn't exist, create a new AuditEvent with this data.
     */
    create: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
    /**
     * In case the AuditEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
  }

  /**
   * AuditEvent delete
   */
  export type AuditEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter which AuditEvent to delete.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent deleteMany
   */
  export type AuditEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvents to delete
     */
    where?: AuditEventWhereInput
  }

  /**
   * AuditEvent.actor
   */
  export type AuditEvent$actorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditEvent without action
   */
  export type AuditEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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


  export const BusinessScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    status: 'status',
    ownerUserId: 'ownerUserId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    settings: 'settings'
  };

  export type BusinessScalarFieldEnum = (typeof BusinessScalarFieldEnum)[keyof typeof BusinessScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    phone: 'phone',
    name: 'name',
    role: 'role',
    locale: 'locale',
    isActive: 'isActive',
    passwordHash: 'passwordHash',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AgentScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    name: 'name',
    phone: 'phone',
    referralUrl: 'referralUrl',
    couponCode: 'couponCode',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AgentScalarFieldEnum = (typeof AgentScalarFieldEnum)[keyof typeof AgentScalarFieldEnum]


  export const LeadScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    ownerId: 'ownerId',
    status: 'status',
    source: 'source',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    phoneNormalized: 'phoneNormalized',
    email: 'email',
    tags: 'tags',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LeadScalarFieldEnum = (typeof LeadScalarFieldEnum)[keyof typeof LeadScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    leadId: 'leadId',
    ownerId: 'ownerId',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    phoneNormalized: 'phoneNormalized',
    email: 'email',
    tags: 'tags',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const ConversationScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    channel: 'channel',
    status: 'status',
    subject: 'subject',
    ownerId: 'ownerId',
    leadId: 'leadId',
    customerId: 'customerId',
    agentId: 'agentId',
    nextFollowUpAt: 'nextFollowUpAt',
    slaBreachedAt: 'slaBreachedAt',
    closedAt: 'closedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum]


  export const InteractionScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    conversationId: 'conversationId',
    type: 'type',
    direction: 'direction',
    body: 'body',
    metadata: 'metadata',
    createdById: 'createdById',
    createdAt: 'createdAt'
  };

  export type InteractionScalarFieldEnum = (typeof InteractionScalarFieldEnum)[keyof typeof InteractionScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    ownerId: 'ownerId',
    leadId: 'leadId',
    customerId: 'customerId',
    conversationId: 'conversationId',
    title: 'title',
    description: 'description',
    type: 'type',
    status: 'status',
    dueAt: 'dueAt',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const AttributionScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    agentId: 'agentId',
    method: 'method',
    leadId: 'leadId',
    customerId: 'customerId',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type AttributionScalarFieldEnum = (typeof AttributionScalarFieldEnum)[keyof typeof AttributionScalarFieldEnum]


  export const AuditEventScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    actorId: 'actorId',
    entity: 'entity',
    entityId: 'entityId',
    action: 'action',
    before: 'before',
    after: 'after',
    createdAt: 'createdAt'
  };

  export type AuditEventScalarFieldEnum = (typeof AuditEventScalarFieldEnum)[keyof typeof AuditEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'LeadStatus'
   */
  export type EnumLeadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadStatus'>
    


  /**
   * Reference to a field of type 'LeadStatus[]'
   */
  export type ListEnumLeadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadStatus[]'>
    


  /**
   * Reference to a field of type 'ConversationChannel'
   */
  export type EnumConversationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationChannel'>
    


  /**
   * Reference to a field of type 'ConversationChannel[]'
   */
  export type ListEnumConversationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationChannel[]'>
    


  /**
   * Reference to a field of type 'ConversationStatus'
   */
  export type EnumConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationStatus'>
    


  /**
   * Reference to a field of type 'ConversationStatus[]'
   */
  export type ListEnumConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationStatus[]'>
    


  /**
   * Reference to a field of type 'InteractionType'
   */
  export type EnumInteractionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InteractionType'>
    


  /**
   * Reference to a field of type 'InteractionType[]'
   */
  export type ListEnumInteractionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InteractionType[]'>
    


  /**
   * Reference to a field of type 'TaskType'
   */
  export type EnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType'>
    


  /**
   * Reference to a field of type 'TaskType[]'
   */
  export type ListEnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType[]'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'AttributionMethod'
   */
  export type EnumAttributionMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttributionMethod'>
    


  /**
   * Reference to a field of type 'AttributionMethod[]'
   */
  export type ListEnumAttributionMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttributionMethod[]'>
    


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


  export type BusinessWhereInput = {
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    id?: StringFilter<"Business"> | string
    name?: StringFilter<"Business"> | string
    slug?: StringFilter<"Business"> | string
    status?: StringFilter<"Business"> | string
    ownerUserId?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    settings?: JsonNullableFilter<"Business">
    users?: UserListRelationFilter
    agents?: AgentListRelationFilter
    leads?: LeadListRelationFilter
    customers?: CustomerListRelationFilter
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    attributions?: AttributionListRelationFilter
    audits?: AuditEventListRelationFilter
    interactions?: InteractionListRelationFilter
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type BusinessOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    ownerUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    settings?: SortOrderInput | SortOrder
    users?: UserOrderByRelationAggregateInput
    agents?: AgentOrderByRelationAggregateInput
    leads?: LeadOrderByRelationAggregateInput
    customers?: CustomerOrderByRelationAggregateInput
    conversations?: ConversationOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    attributions?: AttributionOrderByRelationAggregateInput
    audits?: AuditEventOrderByRelationAggregateInput
    interactions?: InteractionOrderByRelationAggregateInput
    owner?: UserOrderByWithRelationInput
  }

  export type BusinessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    name?: StringFilter<"Business"> | string
    status?: StringFilter<"Business"> | string
    ownerUserId?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    settings?: JsonNullableFilter<"Business">
    users?: UserListRelationFilter
    agents?: AgentListRelationFilter
    leads?: LeadListRelationFilter
    customers?: CustomerListRelationFilter
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    attributions?: AttributionListRelationFilter
    audits?: AuditEventListRelationFilter
    interactions?: InteractionListRelationFilter
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id" | "slug">

  export type BusinessOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    ownerUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    settings?: SortOrderInput | SortOrder
    _count?: BusinessCountOrderByAggregateInput
    _max?: BusinessMaxOrderByAggregateInput
    _min?: BusinessMinOrderByAggregateInput
  }

  export type BusinessScalarWhereWithAggregatesInput = {
    AND?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    OR?: BusinessScalarWhereWithAggregatesInput[]
    NOT?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Business"> | string
    name?: StringWithAggregatesFilter<"Business"> | string
    slug?: StringWithAggregatesFilter<"Business"> | string
    status?: StringWithAggregatesFilter<"Business"> | string
    ownerUserId?: StringNullableWithAggregatesFilter<"Business"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
    settings?: JsonNullableWithAggregatesFilter<"Business">
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    locale?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    passwordHash?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    businessId?: StringNullableFilter<"User"> | string | null
    business?: XOR<BusinessNullableRelationFilter, BusinessWhereInput> | null
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    auditEvents?: AuditEventListRelationFilter
    leadsOwned?: LeadListRelationFilter
    customersOwned?: CustomerListRelationFilter
    interactionsAuthored?: InteractionListRelationFilter
    businessesOwned?: BusinessListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    name?: SortOrder
    role?: SortOrder
    locale?: SortOrderInput | SortOrder
    isActive?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrderInput | SortOrder
    business?: BusinessOrderByWithRelationInput
    conversations?: ConversationOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    auditEvents?: AuditEventOrderByRelationAggregateInput
    leadsOwned?: LeadOrderByRelationAggregateInput
    customersOwned?: CustomerOrderByRelationAggregateInput
    interactionsAuthored?: InteractionOrderByRelationAggregateInput
    businessesOwned?: BusinessOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    phone?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    locale?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    passwordHash?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    businessId?: StringNullableFilter<"User"> | string | null
    business?: XOR<BusinessNullableRelationFilter, BusinessWhereInput> | null
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    auditEvents?: AuditEventListRelationFilter
    leadsOwned?: LeadListRelationFilter
    customersOwned?: CustomerListRelationFilter
    interactionsAuthored?: InteractionListRelationFilter
    businessesOwned?: BusinessListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    name?: SortOrder
    role?: SortOrder
    locale?: SortOrderInput | SortOrder
    isActive?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    locale?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    businessId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type AgentWhereInput = {
    AND?: AgentWhereInput | AgentWhereInput[]
    OR?: AgentWhereInput[]
    NOT?: AgentWhereInput | AgentWhereInput[]
    id?: StringFilter<"Agent"> | string
    businessId?: StringFilter<"Agent"> | string
    name?: StringFilter<"Agent"> | string
    phone?: StringNullableFilter<"Agent"> | string | null
    referralUrl?: StringNullableFilter<"Agent"> | string | null
    couponCode?: StringNullableFilter<"Agent"> | string | null
    status?: StringFilter<"Agent"> | string
    notes?: StringNullableFilter<"Agent"> | string | null
    createdAt?: DateTimeFilter<"Agent"> | Date | string
    updatedAt?: DateTimeFilter<"Agent"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    attributions?: AttributionListRelationFilter
    conversations?: ConversationListRelationFilter
  }

  export type AgentOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    referralUrl?: SortOrderInput | SortOrder
    couponCode?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    attributions?: AttributionOrderByRelationAggregateInput
    conversations?: ConversationOrderByRelationAggregateInput
  }

  export type AgentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    businessId_couponCode?: AgentBusinessIdCouponCodeCompoundUniqueInput
    AND?: AgentWhereInput | AgentWhereInput[]
    OR?: AgentWhereInput[]
    NOT?: AgentWhereInput | AgentWhereInput[]
    businessId?: StringFilter<"Agent"> | string
    name?: StringFilter<"Agent"> | string
    phone?: StringNullableFilter<"Agent"> | string | null
    referralUrl?: StringNullableFilter<"Agent"> | string | null
    couponCode?: StringNullableFilter<"Agent"> | string | null
    status?: StringFilter<"Agent"> | string
    notes?: StringNullableFilter<"Agent"> | string | null
    createdAt?: DateTimeFilter<"Agent"> | Date | string
    updatedAt?: DateTimeFilter<"Agent"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    attributions?: AttributionListRelationFilter
    conversations?: ConversationListRelationFilter
  }, "id" | "businessId_couponCode">

  export type AgentOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    referralUrl?: SortOrderInput | SortOrder
    couponCode?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AgentCountOrderByAggregateInput
    _max?: AgentMaxOrderByAggregateInput
    _min?: AgentMinOrderByAggregateInput
  }

  export type AgentScalarWhereWithAggregatesInput = {
    AND?: AgentScalarWhereWithAggregatesInput | AgentScalarWhereWithAggregatesInput[]
    OR?: AgentScalarWhereWithAggregatesInput[]
    NOT?: AgentScalarWhereWithAggregatesInput | AgentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Agent"> | string
    businessId?: StringWithAggregatesFilter<"Agent"> | string
    name?: StringWithAggregatesFilter<"Agent"> | string
    phone?: StringNullableWithAggregatesFilter<"Agent"> | string | null
    referralUrl?: StringNullableWithAggregatesFilter<"Agent"> | string | null
    couponCode?: StringNullableWithAggregatesFilter<"Agent"> | string | null
    status?: StringWithAggregatesFilter<"Agent"> | string
    notes?: StringNullableWithAggregatesFilter<"Agent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Agent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Agent"> | Date | string
  }

  export type LeadWhereInput = {
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    id?: StringFilter<"Lead"> | string
    businessId?: StringFilter<"Lead"> | string
    ownerId?: StringNullableFilter<"Lead"> | string | null
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    source?: StringNullableFilter<"Lead"> | string | null
    firstName?: StringNullableFilter<"Lead"> | string | null
    lastName?: StringNullableFilter<"Lead"> | string | null
    phone?: StringNullableFilter<"Lead"> | string | null
    phoneNormalized?: StringNullableFilter<"Lead"> | string | null
    email?: StringNullableFilter<"Lead"> | string | null
    tags?: JsonNullableFilter<"Lead">
    notes?: StringNullableFilter<"Lead"> | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    attributions?: AttributionListRelationFilter
  }

  export type LeadOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    status?: SortOrder
    source?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    phoneNormalized?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    conversations?: ConversationOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    attributions?: AttributionOrderByRelationAggregateInput
  }

  export type LeadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    businessId_phoneNormalized?: LeadBusinessIdPhoneNormalizedCompoundUniqueInput
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    businessId?: StringFilter<"Lead"> | string
    ownerId?: StringNullableFilter<"Lead"> | string | null
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    source?: StringNullableFilter<"Lead"> | string | null
    firstName?: StringNullableFilter<"Lead"> | string | null
    lastName?: StringNullableFilter<"Lead"> | string | null
    phone?: StringNullableFilter<"Lead"> | string | null
    phoneNormalized?: StringNullableFilter<"Lead"> | string | null
    email?: StringNullableFilter<"Lead"> | string | null
    tags?: JsonNullableFilter<"Lead">
    notes?: StringNullableFilter<"Lead"> | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    attributions?: AttributionListRelationFilter
  }, "id" | "businessId_phoneNormalized">

  export type LeadOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    status?: SortOrder
    source?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    phoneNormalized?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LeadCountOrderByAggregateInput
    _max?: LeadMaxOrderByAggregateInput
    _min?: LeadMinOrderByAggregateInput
  }

  export type LeadScalarWhereWithAggregatesInput = {
    AND?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    OR?: LeadScalarWhereWithAggregatesInput[]
    NOT?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lead"> | string
    businessId?: StringWithAggregatesFilter<"Lead"> | string
    ownerId?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    status?: EnumLeadStatusWithAggregatesFilter<"Lead"> | $Enums.LeadStatus
    source?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    firstName?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    phoneNormalized?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    email?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    tags?: JsonNullableWithAggregatesFilter<"Lead">
    notes?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    businessId?: StringFilter<"Customer"> | string
    leadId?: StringNullableFilter<"Customer"> | string | null
    ownerId?: StringNullableFilter<"Customer"> | string | null
    firstName?: StringNullableFilter<"Customer"> | string | null
    lastName?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    phoneNormalized?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    tags?: JsonNullableFilter<"Customer">
    address?: JsonNullableFilter<"Customer">
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    attributions?: AttributionListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    leadId?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    phoneNormalized?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    lead?: LeadOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
    conversations?: ConversationOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    attributions?: AttributionOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    leadId?: string
    businessId_phoneNormalized?: CustomerBusinessIdPhoneNormalizedCompoundUniqueInput
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    businessId?: StringFilter<"Customer"> | string
    ownerId?: StringNullableFilter<"Customer"> | string | null
    firstName?: StringNullableFilter<"Customer"> | string | null
    lastName?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    phoneNormalized?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    tags?: JsonNullableFilter<"Customer">
    address?: JsonNullableFilter<"Customer">
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    conversations?: ConversationListRelationFilter
    tasks?: TaskListRelationFilter
    attributions?: AttributionListRelationFilter
  }, "id" | "leadId" | "businessId_phoneNormalized">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    leadId?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    phoneNormalized?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    businessId?: StringWithAggregatesFilter<"Customer"> | string
    leadId?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    ownerId?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    firstName?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phoneNormalized?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    tags?: JsonNullableWithAggregatesFilter<"Customer">
    address?: JsonNullableWithAggregatesFilter<"Customer">
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type ConversationWhereInput = {
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    id?: StringFilter<"Conversation"> | string
    businessId?: StringFilter<"Conversation"> | string
    channel?: EnumConversationChannelFilter<"Conversation"> | $Enums.ConversationChannel
    status?: EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus
    subject?: StringNullableFilter<"Conversation"> | string | null
    ownerId?: StringNullableFilter<"Conversation"> | string | null
    leadId?: StringNullableFilter<"Conversation"> | string | null
    customerId?: StringNullableFilter<"Conversation"> | string | null
    agentId?: StringNullableFilter<"Conversation"> | string | null
    nextFollowUpAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    slaBreachedAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    closedAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    agent?: XOR<AgentNullableRelationFilter, AgentWhereInput> | null
    messages?: InteractionListRelationFilter
    tasks?: TaskListRelationFilter
  }

  export type ConversationOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    subject?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    leadId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    agentId?: SortOrderInput | SortOrder
    nextFollowUpAt?: SortOrderInput | SortOrder
    slaBreachedAt?: SortOrderInput | SortOrder
    closedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
    lead?: LeadOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    agent?: AgentOrderByWithRelationInput
    messages?: InteractionOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
  }

  export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    businessId?: StringFilter<"Conversation"> | string
    channel?: EnumConversationChannelFilter<"Conversation"> | $Enums.ConversationChannel
    status?: EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus
    subject?: StringNullableFilter<"Conversation"> | string | null
    ownerId?: StringNullableFilter<"Conversation"> | string | null
    leadId?: StringNullableFilter<"Conversation"> | string | null
    customerId?: StringNullableFilter<"Conversation"> | string | null
    agentId?: StringNullableFilter<"Conversation"> | string | null
    nextFollowUpAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    slaBreachedAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    closedAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    agent?: XOR<AgentNullableRelationFilter, AgentWhereInput> | null
    messages?: InteractionListRelationFilter
    tasks?: TaskListRelationFilter
  }, "id">

  export type ConversationOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    subject?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    leadId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    agentId?: SortOrderInput | SortOrder
    nextFollowUpAt?: SortOrderInput | SortOrder
    slaBreachedAt?: SortOrderInput | SortOrder
    closedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConversationCountOrderByAggregateInput
    _max?: ConversationMaxOrderByAggregateInput
    _min?: ConversationMinOrderByAggregateInput
  }

  export type ConversationScalarWhereWithAggregatesInput = {
    AND?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    OR?: ConversationScalarWhereWithAggregatesInput[]
    NOT?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conversation"> | string
    businessId?: StringWithAggregatesFilter<"Conversation"> | string
    channel?: EnumConversationChannelWithAggregatesFilter<"Conversation"> | $Enums.ConversationChannel
    status?: EnumConversationStatusWithAggregatesFilter<"Conversation"> | $Enums.ConversationStatus
    subject?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    ownerId?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    leadId?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    customerId?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    agentId?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    nextFollowUpAt?: DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null
    slaBreachedAt?: DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null
    closedAt?: DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
  }

  export type InteractionWhereInput = {
    AND?: InteractionWhereInput | InteractionWhereInput[]
    OR?: InteractionWhereInput[]
    NOT?: InteractionWhereInput | InteractionWhereInput[]
    id?: StringFilter<"Interaction"> | string
    businessId?: StringFilter<"Interaction"> | string
    conversationId?: StringFilter<"Interaction"> | string
    type?: EnumInteractionTypeFilter<"Interaction"> | $Enums.InteractionType
    direction?: StringNullableFilter<"Interaction"> | string | null
    body?: StringFilter<"Interaction"> | string
    metadata?: JsonNullableFilter<"Interaction">
    createdById?: StringNullableFilter<"Interaction"> | string | null
    createdAt?: DateTimeFilter<"Interaction"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    conversation?: XOR<ConversationRelationFilter, ConversationWhereInput>
    createdBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type InteractionOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    conversationId?: SortOrder
    type?: SortOrder
    direction?: SortOrderInput | SortOrder
    body?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    conversation?: ConversationOrderByWithRelationInput
    createdBy?: UserOrderByWithRelationInput
  }

  export type InteractionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InteractionWhereInput | InteractionWhereInput[]
    OR?: InteractionWhereInput[]
    NOT?: InteractionWhereInput | InteractionWhereInput[]
    businessId?: StringFilter<"Interaction"> | string
    conversationId?: StringFilter<"Interaction"> | string
    type?: EnumInteractionTypeFilter<"Interaction"> | $Enums.InteractionType
    direction?: StringNullableFilter<"Interaction"> | string | null
    body?: StringFilter<"Interaction"> | string
    metadata?: JsonNullableFilter<"Interaction">
    createdById?: StringNullableFilter<"Interaction"> | string | null
    createdAt?: DateTimeFilter<"Interaction"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    conversation?: XOR<ConversationRelationFilter, ConversationWhereInput>
    createdBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type InteractionOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    conversationId?: SortOrder
    type?: SortOrder
    direction?: SortOrderInput | SortOrder
    body?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InteractionCountOrderByAggregateInput
    _max?: InteractionMaxOrderByAggregateInput
    _min?: InteractionMinOrderByAggregateInput
  }

  export type InteractionScalarWhereWithAggregatesInput = {
    AND?: InteractionScalarWhereWithAggregatesInput | InteractionScalarWhereWithAggregatesInput[]
    OR?: InteractionScalarWhereWithAggregatesInput[]
    NOT?: InteractionScalarWhereWithAggregatesInput | InteractionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Interaction"> | string
    businessId?: StringWithAggregatesFilter<"Interaction"> | string
    conversationId?: StringWithAggregatesFilter<"Interaction"> | string
    type?: EnumInteractionTypeWithAggregatesFilter<"Interaction"> | $Enums.InteractionType
    direction?: StringNullableWithAggregatesFilter<"Interaction"> | string | null
    body?: StringWithAggregatesFilter<"Interaction"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Interaction">
    createdById?: StringNullableWithAggregatesFilter<"Interaction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Interaction"> | Date | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    businessId?: StringFilter<"Task"> | string
    ownerId?: StringNullableFilter<"Task"> | string | null
    leadId?: StringNullableFilter<"Task"> | string | null
    customerId?: StringNullableFilter<"Task"> | string | null
    conversationId?: StringNullableFilter<"Task"> | string | null
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    type?: EnumTaskTypeFilter<"Task"> | $Enums.TaskType
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    conversation?: XOR<ConversationNullableRelationFilter, ConversationWhereInput> | null
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    leadId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    conversationId?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
    lead?: LeadOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    conversation?: ConversationOrderByWithRelationInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    businessId?: StringFilter<"Task"> | string
    ownerId?: StringNullableFilter<"Task"> | string | null
    leadId?: StringNullableFilter<"Task"> | string | null
    customerId?: StringNullableFilter<"Task"> | string | null
    conversationId?: StringNullableFilter<"Task"> | string | null
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    type?: EnumTaskTypeFilter<"Task"> | $Enums.TaskType
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
    conversation?: XOR<ConversationNullableRelationFilter, ConversationWhereInput> | null
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    leadId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    conversationId?: SortOrderInput | SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    businessId?: StringWithAggregatesFilter<"Task"> | string
    ownerId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    leadId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    customerId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    conversationId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringNullableWithAggregatesFilter<"Task"> | string | null
    type?: EnumTaskTypeWithAggregatesFilter<"Task"> | $Enums.TaskType
    status?: EnumTaskStatusWithAggregatesFilter<"Task"> | $Enums.TaskStatus
    dueAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
  }

  export type AttributionWhereInput = {
    AND?: AttributionWhereInput | AttributionWhereInput[]
    OR?: AttributionWhereInput[]
    NOT?: AttributionWhereInput | AttributionWhereInput[]
    id?: StringFilter<"Attribution"> | string
    businessId?: StringFilter<"Attribution"> | string
    agentId?: StringFilter<"Attribution"> | string
    method?: EnumAttributionMethodFilter<"Attribution"> | $Enums.AttributionMethod
    leadId?: StringNullableFilter<"Attribution"> | string | null
    customerId?: StringNullableFilter<"Attribution"> | string | null
    notes?: StringNullableFilter<"Attribution"> | string | null
    createdAt?: DateTimeFilter<"Attribution"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    agent?: XOR<AgentRelationFilter, AgentWhereInput>
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
  }

  export type AttributionOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    agentId?: SortOrder
    method?: SortOrder
    leadId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    agent?: AgentOrderByWithRelationInput
    lead?: LeadOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
  }

  export type AttributionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AttributionWhereInput | AttributionWhereInput[]
    OR?: AttributionWhereInput[]
    NOT?: AttributionWhereInput | AttributionWhereInput[]
    businessId?: StringFilter<"Attribution"> | string
    agentId?: StringFilter<"Attribution"> | string
    method?: EnumAttributionMethodFilter<"Attribution"> | $Enums.AttributionMethod
    leadId?: StringNullableFilter<"Attribution"> | string | null
    customerId?: StringNullableFilter<"Attribution"> | string | null
    notes?: StringNullableFilter<"Attribution"> | string | null
    createdAt?: DateTimeFilter<"Attribution"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    agent?: XOR<AgentRelationFilter, AgentWhereInput>
    lead?: XOR<LeadNullableRelationFilter, LeadWhereInput> | null
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
  }, "id">

  export type AttributionOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    agentId?: SortOrder
    method?: SortOrder
    leadId?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AttributionCountOrderByAggregateInput
    _max?: AttributionMaxOrderByAggregateInput
    _min?: AttributionMinOrderByAggregateInput
  }

  export type AttributionScalarWhereWithAggregatesInput = {
    AND?: AttributionScalarWhereWithAggregatesInput | AttributionScalarWhereWithAggregatesInput[]
    OR?: AttributionScalarWhereWithAggregatesInput[]
    NOT?: AttributionScalarWhereWithAggregatesInput | AttributionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Attribution"> | string
    businessId?: StringWithAggregatesFilter<"Attribution"> | string
    agentId?: StringWithAggregatesFilter<"Attribution"> | string
    method?: EnumAttributionMethodWithAggregatesFilter<"Attribution"> | $Enums.AttributionMethod
    leadId?: StringNullableWithAggregatesFilter<"Attribution"> | string | null
    customerId?: StringNullableWithAggregatesFilter<"Attribution"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Attribution"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Attribution"> | Date | string
  }

  export type AuditEventWhereInput = {
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    businessId?: StringFilter<"AuditEvent"> | string
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    entity?: StringFilter<"AuditEvent"> | string
    entityId?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    before?: JsonNullableFilter<"AuditEvent">
    after?: JsonNullableFilter<"AuditEvent">
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    actor?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type AuditEventOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    actorId?: SortOrderInput | SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    before?: SortOrderInput | SortOrder
    after?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    actor?: UserOrderByWithRelationInput
  }

  export type AuditEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    businessId?: StringFilter<"AuditEvent"> | string
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    entity?: StringFilter<"AuditEvent"> | string
    entityId?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    before?: JsonNullableFilter<"AuditEvent">
    after?: JsonNullableFilter<"AuditEvent">
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    actor?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditEventOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    actorId?: SortOrderInput | SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    before?: SortOrderInput | SortOrder
    after?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditEventCountOrderByAggregateInput
    _max?: AuditEventMaxOrderByAggregateInput
    _min?: AuditEventMinOrderByAggregateInput
  }

  export type AuditEventScalarWhereWithAggregatesInput = {
    AND?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    OR?: AuditEventScalarWhereWithAggregatesInput[]
    NOT?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditEvent"> | string
    businessId?: StringWithAggregatesFilter<"AuditEvent"> | string
    actorId?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    entity?: StringWithAggregatesFilter<"AuditEvent"> | string
    entityId?: StringWithAggregatesFilter<"AuditEvent"> | string
    action?: StringWithAggregatesFilter<"AuditEvent"> | string
    before?: JsonNullableWithAggregatesFilter<"AuditEvent">
    after?: JsonNullableWithAggregatesFilter<"AuditEvent">
    createdAt?: DateTimeWithAggregatesFilter<"AuditEvent"> | Date | string
  }

  export type BusinessCreateInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateManyInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BusinessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BusinessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserCreateInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AgentCreateInput = {
    id?: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAgentsInput
    attributions?: AttributionCreateNestedManyWithoutAgentInput
    conversations?: ConversationCreateNestedManyWithoutAgentInput
  }

  export type AgentUncheckedCreateInput = {
    id?: string
    businessId: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributions?: AttributionUncheckedCreateNestedManyWithoutAgentInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAgentsNestedInput
    attributions?: AttributionUpdateManyWithoutAgentNestedInput
    conversations?: ConversationUpdateManyWithoutAgentNestedInput
  }

  export type AgentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributions?: AttributionUncheckedUpdateManyWithoutAgentNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type AgentCreateManyInput = {
    id?: string
    businessId: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadCreateInput = {
    id?: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutLeadsInput
    owner?: UserCreateNestedOneWithoutLeadsOwnedInput
    customer?: CustomerCreateNestedOneWithoutLeadInput
    conversations?: ConversationCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    attributions?: AttributionCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerUncheckedCreateNestedOneWithoutLeadInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutLeadsNestedInput
    owner?: UserUpdateOneWithoutLeadsOwnedNestedInput
    customer?: CustomerUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUncheckedUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadCreateManyInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerCreateInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
    lead?: LeadCreateNestedOneWithoutCustomerInput
    owner?: UserCreateNestedOneWithoutCustomersOwnedInput
    conversations?: ConversationCreateNestedManyWithoutCustomerInput
    tasks?: TaskCreateNestedManyWithoutCustomerInput
    attributions?: AttributionCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    businessId: string
    leadId?: string | null
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutCustomerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutCustomerInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
    lead?: LeadUpdateOneWithoutCustomerNestedInput
    owner?: UserUpdateOneWithoutCustomersOwnedNestedInput
    conversations?: ConversationUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    businessId: string
    leadId?: string | null
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutConversationsInput
    owner?: UserCreateNestedOneWithoutConversationsInput
    lead?: LeadCreateNestedOneWithoutConversationsInput
    customer?: CustomerCreateNestedOneWithoutConversationsInput
    agent?: AgentCreateNestedOneWithoutConversationsInput
    messages?: InteractionCreateNestedManyWithoutConversationInput
    tasks?: TaskCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: InteractionUncheckedCreateNestedManyWithoutConversationInput
    tasks?: TaskUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutConversationsNestedInput
    owner?: UserUpdateOneWithoutConversationsNestedInput
    lead?: LeadUpdateOneWithoutConversationsNestedInput
    customer?: CustomerUpdateOneWithoutConversationsNestedInput
    agent?: AgentUpdateOneWithoutConversationsNestedInput
    messages?: InteractionUpdateManyWithoutConversationNestedInput
    tasks?: TaskUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: InteractionUncheckedUpdateManyWithoutConversationNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationCreateManyInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionCreateInput = {
    id?: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutInteractionsInput
    conversation: ConversationCreateNestedOneWithoutMessagesInput
    createdBy?: UserCreateNestedOneWithoutInteractionsAuthoredInput
  }

  export type InteractionUncheckedCreateInput = {
    id?: string
    businessId: string
    conversationId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
  }

  export type InteractionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutInteractionsNestedInput
    conversation?: ConversationUpdateOneRequiredWithoutMessagesNestedInput
    createdBy?: UserUpdateOneWithoutInteractionsAuthoredNestedInput
  }

  export type InteractionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionCreateManyInput = {
    id?: string
    businessId: string
    conversationId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
  }

  export type InteractionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutTasksInput
    owner?: UserCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
    customer?: CustomerCreateNestedOneWithoutTasksInput
    conversation?: ConversationCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutTasksNestedInput
    owner?: UserUpdateOneWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
    customer?: CustomerUpdateOneWithoutTasksNestedInput
    conversation?: ConversationUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionCreateInput = {
    id?: string
    method: $Enums.AttributionMethod
    notes?: string | null
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutAttributionsInput
    agent: AgentCreateNestedOneWithoutAttributionsInput
    lead?: LeadCreateNestedOneWithoutAttributionsInput
    customer?: CustomerCreateNestedOneWithoutAttributionsInput
  }

  export type AttributionUncheckedCreateInput = {
    id?: string
    businessId: string
    agentId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type AttributionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAttributionsNestedInput
    agent?: AgentUpdateOneRequiredWithoutAttributionsNestedInput
    lead?: LeadUpdateOneWithoutAttributionsNestedInput
    customer?: CustomerUpdateOneWithoutAttributionsNestedInput
  }

  export type AttributionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionCreateManyInput = {
    id?: string
    businessId: string
    agentId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type AttributionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateInput = {
    id?: string
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutAuditsInput
    actor?: UserCreateNestedOneWithoutAuditEventsInput
  }

  export type AuditEventUncheckedCreateInput = {
    id?: string
    businessId: string
    actorId?: string | null
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAuditsNestedInput
    actor?: UserUpdateOneWithoutAuditEventsNestedInput
  }

  export type AuditEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateManyInput = {
    id?: string
    businessId: string
    actorId?: string | null
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type AgentListRelationFilter = {
    every?: AgentWhereInput
    some?: AgentWhereInput
    none?: AgentWhereInput
  }

  export type LeadListRelationFilter = {
    every?: LeadWhereInput
    some?: LeadWhereInput
    none?: LeadWhereInput
  }

  export type CustomerListRelationFilter = {
    every?: CustomerWhereInput
    some?: CustomerWhereInput
    none?: CustomerWhereInput
  }

  export type ConversationListRelationFilter = {
    every?: ConversationWhereInput
    some?: ConversationWhereInput
    none?: ConversationWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type AttributionListRelationFilter = {
    every?: AttributionWhereInput
    some?: AttributionWhereInput
    none?: AttributionWhereInput
  }

  export type AuditEventListRelationFilter = {
    every?: AuditEventWhereInput
    some?: AuditEventWhereInput
    none?: AuditEventWhereInput
  }

  export type InteractionListRelationFilter = {
    every?: InteractionWhereInput
    some?: InteractionWhereInput
    none?: InteractionWhereInput
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeadOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AttributionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InteractionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BusinessCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    ownerUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    settings?: SortOrder
  }

  export type BusinessMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    ownerUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BusinessMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    ownerUserId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type BusinessNullableRelationFilter = {
    is?: BusinessWhereInput | null
    isNot?: BusinessWhereInput | null
  }

  export type BusinessListRelationFilter = {
    every?: BusinessWhereInput
    some?: BusinessWhereInput
    none?: BusinessWhereInput
  }

  export type BusinessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    role?: SortOrder
    locale?: SortOrder
    isActive?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    role?: SortOrder
    locale?: SortOrder
    isActive?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    name?: SortOrder
    role?: SortOrder
    locale?: SortOrder
    isActive?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type BusinessRelationFilter = {
    is?: BusinessWhereInput
    isNot?: BusinessWhereInput
  }

  export type AgentBusinessIdCouponCodeCompoundUniqueInput = {
    businessId: string
    couponCode: string
  }

  export type AgentCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    referralUrl?: SortOrder
    couponCode?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    referralUrl?: SortOrder
    couponCode?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AgentMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    referralUrl?: SortOrder
    couponCode?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumLeadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusFilter<$PrismaModel> | $Enums.LeadStatus
  }

  export type CustomerNullableRelationFilter = {
    is?: CustomerWhereInput | null
    isNot?: CustomerWhereInput | null
  }

  export type LeadBusinessIdPhoneNormalizedCompoundUniqueInput = {
    businessId: string
    phoneNormalized: string
  }

  export type LeadCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    source?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    phoneNormalized?: SortOrder
    email?: SortOrder
    tags?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    source?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    phoneNormalized?: SortOrder
    email?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    source?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    phoneNormalized?: SortOrder
    email?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumLeadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadStatusFilter<$PrismaModel>
    _max?: NestedEnumLeadStatusFilter<$PrismaModel>
  }

  export type LeadNullableRelationFilter = {
    is?: LeadWhereInput | null
    isNot?: LeadWhereInput | null
  }

  export type CustomerBusinessIdPhoneNormalizedCompoundUniqueInput = {
    businessId: string
    phoneNormalized: string
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    leadId?: SortOrder
    ownerId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    phoneNormalized?: SortOrder
    email?: SortOrder
    tags?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    leadId?: SortOrder
    ownerId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    phoneNormalized?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    leadId?: SortOrder
    ownerId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    phoneNormalized?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumConversationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelFilter<$PrismaModel> | $Enums.ConversationChannel
  }

  export type EnumConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusFilter<$PrismaModel> | $Enums.ConversationStatus
  }

  export type AgentNullableRelationFilter = {
    is?: AgentWhereInput | null
    isNot?: AgentWhereInput | null
  }

  export type ConversationCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    subject?: SortOrder
    ownerId?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    agentId?: SortOrder
    nextFollowUpAt?: SortOrder
    slaBreachedAt?: SortOrder
    closedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    subject?: SortOrder
    ownerId?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    agentId?: SortOrder
    nextFollowUpAt?: SortOrder
    slaBreachedAt?: SortOrder
    closedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    subject?: SortOrder
    ownerId?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    agentId?: SortOrder
    nextFollowUpAt?: SortOrder
    slaBreachedAt?: SortOrder
    closedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumConversationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelWithAggregatesFilter<$PrismaModel> | $Enums.ConversationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationChannelFilter<$PrismaModel>
    _max?: NestedEnumConversationChannelFilter<$PrismaModel>
  }

  export type EnumConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConversationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationStatusFilter<$PrismaModel>
    _max?: NestedEnumConversationStatusFilter<$PrismaModel>
  }

  export type EnumInteractionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionType | EnumInteractionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionTypeFilter<$PrismaModel> | $Enums.InteractionType
  }

  export type ConversationRelationFilter = {
    is?: ConversationWhereInput
    isNot?: ConversationWhereInput
  }

  export type InteractionCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    conversationId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    body?: SortOrder
    metadata?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type InteractionMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    conversationId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    body?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type InteractionMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    conversationId?: SortOrder
    type?: SortOrder
    direction?: SortOrder
    body?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumInteractionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionType | EnumInteractionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionTypeWithAggregatesFilter<$PrismaModel> | $Enums.InteractionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInteractionTypeFilter<$PrismaModel>
    _max?: NestedEnumInteractionTypeFilter<$PrismaModel>
  }

  export type EnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type ConversationNullableRelationFilter = {
    is?: ConversationWhereInput | null
    isNot?: ConversationWhereInput | null
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    conversationId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    conversationId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    ownerId?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    conversationId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    type?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type EnumAttributionMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.AttributionMethod | EnumAttributionMethodFieldRefInput<$PrismaModel>
    in?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumAttributionMethodFilter<$PrismaModel> | $Enums.AttributionMethod
  }

  export type AgentRelationFilter = {
    is?: AgentWhereInput
    isNot?: AgentWhereInput
  }

  export type AttributionCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    agentId?: SortOrder
    method?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type AttributionMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    agentId?: SortOrder
    method?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type AttributionMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    agentId?: SortOrder
    method?: SortOrder
    leadId?: SortOrder
    customerId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAttributionMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttributionMethod | EnumAttributionMethodFieldRefInput<$PrismaModel>
    in?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumAttributionMethodWithAggregatesFilter<$PrismaModel> | $Enums.AttributionMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttributionMethodFilter<$PrismaModel>
    _max?: NestedEnumAttributionMethodFilter<$PrismaModel>
  }

  export type AuditEventCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    actorId?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    before?: SortOrder
    after?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    actorId?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    actorId?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type UserCreateNestedManyWithoutBusinessInput = {
    create?: XOR<UserCreateWithoutBusinessInput, UserUncheckedCreateWithoutBusinessInput> | UserCreateWithoutBusinessInput[] | UserUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBusinessInput | UserCreateOrConnectWithoutBusinessInput[]
    createMany?: UserCreateManyBusinessInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AgentCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AgentCreateWithoutBusinessInput, AgentUncheckedCreateWithoutBusinessInput> | AgentCreateWithoutBusinessInput[] | AgentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AgentCreateOrConnectWithoutBusinessInput | AgentCreateOrConnectWithoutBusinessInput[]
    createMany?: AgentCreateManyBusinessInputEnvelope
    connect?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
  }

  export type LeadCreateNestedManyWithoutBusinessInput = {
    create?: XOR<LeadCreateWithoutBusinessInput, LeadUncheckedCreateWithoutBusinessInput> | LeadCreateWithoutBusinessInput[] | LeadUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutBusinessInput | LeadCreateOrConnectWithoutBusinessInput[]
    createMany?: LeadCreateManyBusinessInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type CustomerCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type ConversationCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ConversationCreateWithoutBusinessInput, ConversationUncheckedCreateWithoutBusinessInput> | ConversationCreateWithoutBusinessInput[] | ConversationUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutBusinessInput | ConversationCreateOrConnectWithoutBusinessInput[]
    createMany?: ConversationCreateManyBusinessInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutBusinessInput = {
    create?: XOR<TaskCreateWithoutBusinessInput, TaskUncheckedCreateWithoutBusinessInput> | TaskCreateWithoutBusinessInput[] | TaskUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutBusinessInput | TaskCreateOrConnectWithoutBusinessInput[]
    createMany?: TaskCreateManyBusinessInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AttributionCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AttributionCreateWithoutBusinessInput, AttributionUncheckedCreateWithoutBusinessInput> | AttributionCreateWithoutBusinessInput[] | AttributionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutBusinessInput | AttributionCreateOrConnectWithoutBusinessInput[]
    createMany?: AttributionCreateManyBusinessInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type AuditEventCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AuditEventCreateWithoutBusinessInput, AuditEventUncheckedCreateWithoutBusinessInput> | AuditEventCreateWithoutBusinessInput[] | AuditEventUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutBusinessInput | AuditEventCreateOrConnectWithoutBusinessInput[]
    createMany?: AuditEventCreateManyBusinessInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type InteractionCreateNestedManyWithoutBusinessInput = {
    create?: XOR<InteractionCreateWithoutBusinessInput, InteractionUncheckedCreateWithoutBusinessInput> | InteractionCreateWithoutBusinessInput[] | InteractionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutBusinessInput | InteractionCreateOrConnectWithoutBusinessInput[]
    createMany?: InteractionCreateManyBusinessInputEnvelope
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutBusinessesOwnedInput = {
    create?: XOR<UserCreateWithoutBusinessesOwnedInput, UserUncheckedCreateWithoutBusinessesOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutBusinessesOwnedInput
    connect?: UserWhereUniqueInput
  }

  export type UserUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<UserCreateWithoutBusinessInput, UserUncheckedCreateWithoutBusinessInput> | UserCreateWithoutBusinessInput[] | UserUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBusinessInput | UserCreateOrConnectWithoutBusinessInput[]
    createMany?: UserCreateManyBusinessInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AgentUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AgentCreateWithoutBusinessInput, AgentUncheckedCreateWithoutBusinessInput> | AgentCreateWithoutBusinessInput[] | AgentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AgentCreateOrConnectWithoutBusinessInput | AgentCreateOrConnectWithoutBusinessInput[]
    createMany?: AgentCreateManyBusinessInputEnvelope
    connect?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
  }

  export type LeadUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<LeadCreateWithoutBusinessInput, LeadUncheckedCreateWithoutBusinessInput> | LeadCreateWithoutBusinessInput[] | LeadUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutBusinessInput | LeadCreateOrConnectWithoutBusinessInput[]
    createMany?: LeadCreateManyBusinessInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type CustomerUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type ConversationUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ConversationCreateWithoutBusinessInput, ConversationUncheckedCreateWithoutBusinessInput> | ConversationCreateWithoutBusinessInput[] | ConversationUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutBusinessInput | ConversationCreateOrConnectWithoutBusinessInput[]
    createMany?: ConversationCreateManyBusinessInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<TaskCreateWithoutBusinessInput, TaskUncheckedCreateWithoutBusinessInput> | TaskCreateWithoutBusinessInput[] | TaskUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutBusinessInput | TaskCreateOrConnectWithoutBusinessInput[]
    createMany?: TaskCreateManyBusinessInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AttributionUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AttributionCreateWithoutBusinessInput, AttributionUncheckedCreateWithoutBusinessInput> | AttributionCreateWithoutBusinessInput[] | AttributionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutBusinessInput | AttributionCreateOrConnectWithoutBusinessInput[]
    createMany?: AttributionCreateManyBusinessInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type AuditEventUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AuditEventCreateWithoutBusinessInput, AuditEventUncheckedCreateWithoutBusinessInput> | AuditEventCreateWithoutBusinessInput[] | AuditEventUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutBusinessInput | AuditEventCreateOrConnectWithoutBusinessInput[]
    createMany?: AuditEventCreateManyBusinessInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type InteractionUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<InteractionCreateWithoutBusinessInput, InteractionUncheckedCreateWithoutBusinessInput> | InteractionCreateWithoutBusinessInput[] | InteractionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutBusinessInput | InteractionCreateOrConnectWithoutBusinessInput[]
    createMany?: InteractionCreateManyBusinessInputEnvelope
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<UserCreateWithoutBusinessInput, UserUncheckedCreateWithoutBusinessInput> | UserCreateWithoutBusinessInput[] | UserUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBusinessInput | UserCreateOrConnectWithoutBusinessInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutBusinessInput | UserUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: UserCreateManyBusinessInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutBusinessInput | UserUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: UserUpdateManyWithWhereWithoutBusinessInput | UserUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AgentUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AgentCreateWithoutBusinessInput, AgentUncheckedCreateWithoutBusinessInput> | AgentCreateWithoutBusinessInput[] | AgentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AgentCreateOrConnectWithoutBusinessInput | AgentCreateOrConnectWithoutBusinessInput[]
    upsert?: AgentUpsertWithWhereUniqueWithoutBusinessInput | AgentUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AgentCreateManyBusinessInputEnvelope
    set?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    disconnect?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    delete?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    connect?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    update?: AgentUpdateWithWhereUniqueWithoutBusinessInput | AgentUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AgentUpdateManyWithWhereWithoutBusinessInput | AgentUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AgentScalarWhereInput | AgentScalarWhereInput[]
  }

  export type LeadUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<LeadCreateWithoutBusinessInput, LeadUncheckedCreateWithoutBusinessInput> | LeadCreateWithoutBusinessInput[] | LeadUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutBusinessInput | LeadCreateOrConnectWithoutBusinessInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutBusinessInput | LeadUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: LeadCreateManyBusinessInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutBusinessInput | LeadUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutBusinessInput | LeadUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type CustomerUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutBusinessInput | CustomerUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutBusinessInput | CustomerUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutBusinessInput | CustomerUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type ConversationUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ConversationCreateWithoutBusinessInput, ConversationUncheckedCreateWithoutBusinessInput> | ConversationCreateWithoutBusinessInput[] | ConversationUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutBusinessInput | ConversationCreateOrConnectWithoutBusinessInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutBusinessInput | ConversationUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ConversationCreateManyBusinessInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutBusinessInput | ConversationUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutBusinessInput | ConversationUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<TaskCreateWithoutBusinessInput, TaskUncheckedCreateWithoutBusinessInput> | TaskCreateWithoutBusinessInput[] | TaskUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutBusinessInput | TaskCreateOrConnectWithoutBusinessInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutBusinessInput | TaskUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: TaskCreateManyBusinessInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutBusinessInput | TaskUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutBusinessInput | TaskUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AttributionUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AttributionCreateWithoutBusinessInput, AttributionUncheckedCreateWithoutBusinessInput> | AttributionCreateWithoutBusinessInput[] | AttributionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutBusinessInput | AttributionCreateOrConnectWithoutBusinessInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutBusinessInput | AttributionUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AttributionCreateManyBusinessInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutBusinessInput | AttributionUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutBusinessInput | AttributionUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type AuditEventUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AuditEventCreateWithoutBusinessInput, AuditEventUncheckedCreateWithoutBusinessInput> | AuditEventCreateWithoutBusinessInput[] | AuditEventUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutBusinessInput | AuditEventCreateOrConnectWithoutBusinessInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutBusinessInput | AuditEventUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AuditEventCreateManyBusinessInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutBusinessInput | AuditEventUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutBusinessInput | AuditEventUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type InteractionUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<InteractionCreateWithoutBusinessInput, InteractionUncheckedCreateWithoutBusinessInput> | InteractionCreateWithoutBusinessInput[] | InteractionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutBusinessInput | InteractionCreateOrConnectWithoutBusinessInput[]
    upsert?: InteractionUpsertWithWhereUniqueWithoutBusinessInput | InteractionUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: InteractionCreateManyBusinessInputEnvelope
    set?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    disconnect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    delete?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    update?: InteractionUpdateWithWhereUniqueWithoutBusinessInput | InteractionUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: InteractionUpdateManyWithWhereWithoutBusinessInput | InteractionUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
  }

  export type UserUpdateOneWithoutBusinessesOwnedNestedInput = {
    create?: XOR<UserCreateWithoutBusinessesOwnedInput, UserUncheckedCreateWithoutBusinessesOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutBusinessesOwnedInput
    upsert?: UserUpsertWithoutBusinessesOwnedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBusinessesOwnedInput, UserUpdateWithoutBusinessesOwnedInput>, UserUncheckedUpdateWithoutBusinessesOwnedInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<UserCreateWithoutBusinessInput, UserUncheckedCreateWithoutBusinessInput> | UserCreateWithoutBusinessInput[] | UserUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: UserCreateOrConnectWithoutBusinessInput | UserCreateOrConnectWithoutBusinessInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutBusinessInput | UserUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: UserCreateManyBusinessInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutBusinessInput | UserUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: UserUpdateManyWithWhereWithoutBusinessInput | UserUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AgentUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AgentCreateWithoutBusinessInput, AgentUncheckedCreateWithoutBusinessInput> | AgentCreateWithoutBusinessInput[] | AgentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AgentCreateOrConnectWithoutBusinessInput | AgentCreateOrConnectWithoutBusinessInput[]
    upsert?: AgentUpsertWithWhereUniqueWithoutBusinessInput | AgentUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AgentCreateManyBusinessInputEnvelope
    set?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    disconnect?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    delete?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    connect?: AgentWhereUniqueInput | AgentWhereUniqueInput[]
    update?: AgentUpdateWithWhereUniqueWithoutBusinessInput | AgentUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AgentUpdateManyWithWhereWithoutBusinessInput | AgentUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AgentScalarWhereInput | AgentScalarWhereInput[]
  }

  export type LeadUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<LeadCreateWithoutBusinessInput, LeadUncheckedCreateWithoutBusinessInput> | LeadCreateWithoutBusinessInput[] | LeadUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutBusinessInput | LeadCreateOrConnectWithoutBusinessInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutBusinessInput | LeadUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: LeadCreateManyBusinessInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutBusinessInput | LeadUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutBusinessInput | LeadUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type CustomerUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutBusinessInput | CustomerUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutBusinessInput | CustomerUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutBusinessInput | CustomerUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type ConversationUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ConversationCreateWithoutBusinessInput, ConversationUncheckedCreateWithoutBusinessInput> | ConversationCreateWithoutBusinessInput[] | ConversationUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutBusinessInput | ConversationCreateOrConnectWithoutBusinessInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutBusinessInput | ConversationUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ConversationCreateManyBusinessInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutBusinessInput | ConversationUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutBusinessInput | ConversationUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<TaskCreateWithoutBusinessInput, TaskUncheckedCreateWithoutBusinessInput> | TaskCreateWithoutBusinessInput[] | TaskUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutBusinessInput | TaskCreateOrConnectWithoutBusinessInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutBusinessInput | TaskUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: TaskCreateManyBusinessInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutBusinessInput | TaskUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutBusinessInput | TaskUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AttributionUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AttributionCreateWithoutBusinessInput, AttributionUncheckedCreateWithoutBusinessInput> | AttributionCreateWithoutBusinessInput[] | AttributionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutBusinessInput | AttributionCreateOrConnectWithoutBusinessInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutBusinessInput | AttributionUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AttributionCreateManyBusinessInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutBusinessInput | AttributionUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutBusinessInput | AttributionUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type AuditEventUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AuditEventCreateWithoutBusinessInput, AuditEventUncheckedCreateWithoutBusinessInput> | AuditEventCreateWithoutBusinessInput[] | AuditEventUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutBusinessInput | AuditEventCreateOrConnectWithoutBusinessInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutBusinessInput | AuditEventUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AuditEventCreateManyBusinessInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutBusinessInput | AuditEventUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutBusinessInput | AuditEventUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type InteractionUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<InteractionCreateWithoutBusinessInput, InteractionUncheckedCreateWithoutBusinessInput> | InteractionCreateWithoutBusinessInput[] | InteractionUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutBusinessInput | InteractionCreateOrConnectWithoutBusinessInput[]
    upsert?: InteractionUpsertWithWhereUniqueWithoutBusinessInput | InteractionUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: InteractionCreateManyBusinessInputEnvelope
    set?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    disconnect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    delete?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    update?: InteractionUpdateWithWhereUniqueWithoutBusinessInput | InteractionUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: InteractionUpdateManyWithWhereWithoutBusinessInput | InteractionUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutUsersInput = {
    create?: XOR<BusinessCreateWithoutUsersInput, BusinessUncheckedCreateWithoutUsersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutUsersInput
    connect?: BusinessWhereUniqueInput
  }

  export type ConversationCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ConversationCreateWithoutOwnerInput, ConversationUncheckedCreateWithoutOwnerInput> | ConversationCreateWithoutOwnerInput[] | ConversationUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutOwnerInput | ConversationCreateOrConnectWithoutOwnerInput[]
    createMany?: ConversationCreateManyOwnerInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutOwnerInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AuditEventCreateNestedManyWithoutActorInput = {
    create?: XOR<AuditEventCreateWithoutActorInput, AuditEventUncheckedCreateWithoutActorInput> | AuditEventCreateWithoutActorInput[] | AuditEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutActorInput | AuditEventCreateOrConnectWithoutActorInput[]
    createMany?: AuditEventCreateManyActorInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type LeadCreateNestedManyWithoutOwnerInput = {
    create?: XOR<LeadCreateWithoutOwnerInput, LeadUncheckedCreateWithoutOwnerInput> | LeadCreateWithoutOwnerInput[] | LeadUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutOwnerInput | LeadCreateOrConnectWithoutOwnerInput[]
    createMany?: LeadCreateManyOwnerInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type CustomerCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CustomerCreateWithoutOwnerInput, CustomerUncheckedCreateWithoutOwnerInput> | CustomerCreateWithoutOwnerInput[] | CustomerUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutOwnerInput | CustomerCreateOrConnectWithoutOwnerInput[]
    createMany?: CustomerCreateManyOwnerInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type InteractionCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<InteractionCreateWithoutCreatedByInput, InteractionUncheckedCreateWithoutCreatedByInput> | InteractionCreateWithoutCreatedByInput[] | InteractionUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutCreatedByInput | InteractionCreateOrConnectWithoutCreatedByInput[]
    createMany?: InteractionCreateManyCreatedByInputEnvelope
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
  }

  export type BusinessCreateNestedManyWithoutOwnerInput = {
    create?: XOR<BusinessCreateWithoutOwnerInput, BusinessUncheckedCreateWithoutOwnerInput> | BusinessCreateWithoutOwnerInput[] | BusinessUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutOwnerInput | BusinessCreateOrConnectWithoutOwnerInput[]
    createMany?: BusinessCreateManyOwnerInputEnvelope
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
  }

  export type ConversationUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ConversationCreateWithoutOwnerInput, ConversationUncheckedCreateWithoutOwnerInput> | ConversationCreateWithoutOwnerInput[] | ConversationUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutOwnerInput | ConversationCreateOrConnectWithoutOwnerInput[]
    createMany?: ConversationCreateManyOwnerInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AuditEventUncheckedCreateNestedManyWithoutActorInput = {
    create?: XOR<AuditEventCreateWithoutActorInput, AuditEventUncheckedCreateWithoutActorInput> | AuditEventCreateWithoutActorInput[] | AuditEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutActorInput | AuditEventCreateOrConnectWithoutActorInput[]
    createMany?: AuditEventCreateManyActorInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type LeadUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<LeadCreateWithoutOwnerInput, LeadUncheckedCreateWithoutOwnerInput> | LeadCreateWithoutOwnerInput[] | LeadUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutOwnerInput | LeadCreateOrConnectWithoutOwnerInput[]
    createMany?: LeadCreateManyOwnerInputEnvelope
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
  }

  export type CustomerUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CustomerCreateWithoutOwnerInput, CustomerUncheckedCreateWithoutOwnerInput> | CustomerCreateWithoutOwnerInput[] | CustomerUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutOwnerInput | CustomerCreateOrConnectWithoutOwnerInput[]
    createMany?: CustomerCreateManyOwnerInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type InteractionUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<InteractionCreateWithoutCreatedByInput, InteractionUncheckedCreateWithoutCreatedByInput> | InteractionCreateWithoutCreatedByInput[] | InteractionUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutCreatedByInput | InteractionCreateOrConnectWithoutCreatedByInput[]
    createMany?: InteractionCreateManyCreatedByInputEnvelope
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
  }

  export type BusinessUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<BusinessCreateWithoutOwnerInput, BusinessUncheckedCreateWithoutOwnerInput> | BusinessCreateWithoutOwnerInput[] | BusinessUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutOwnerInput | BusinessCreateOrConnectWithoutOwnerInput[]
    createMany?: BusinessCreateManyOwnerInputEnvelope
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BusinessUpdateOneWithoutUsersNestedInput = {
    create?: XOR<BusinessCreateWithoutUsersInput, BusinessUncheckedCreateWithoutUsersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutUsersInput
    upsert?: BusinessUpsertWithoutUsersInput
    disconnect?: BusinessWhereInput | boolean
    delete?: BusinessWhereInput | boolean
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutUsersInput, BusinessUpdateWithoutUsersInput>, BusinessUncheckedUpdateWithoutUsersInput>
  }

  export type ConversationUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ConversationCreateWithoutOwnerInput, ConversationUncheckedCreateWithoutOwnerInput> | ConversationCreateWithoutOwnerInput[] | ConversationUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutOwnerInput | ConversationCreateOrConnectWithoutOwnerInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutOwnerInput | ConversationUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ConversationCreateManyOwnerInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutOwnerInput | ConversationUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutOwnerInput | ConversationUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutOwnerInput | TaskUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutOwnerInput | TaskUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutOwnerInput | TaskUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AuditEventUpdateManyWithoutActorNestedInput = {
    create?: XOR<AuditEventCreateWithoutActorInput, AuditEventUncheckedCreateWithoutActorInput> | AuditEventCreateWithoutActorInput[] | AuditEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutActorInput | AuditEventCreateOrConnectWithoutActorInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutActorInput | AuditEventUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: AuditEventCreateManyActorInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutActorInput | AuditEventUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutActorInput | AuditEventUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type LeadUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<LeadCreateWithoutOwnerInput, LeadUncheckedCreateWithoutOwnerInput> | LeadCreateWithoutOwnerInput[] | LeadUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutOwnerInput | LeadCreateOrConnectWithoutOwnerInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutOwnerInput | LeadUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: LeadCreateManyOwnerInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutOwnerInput | LeadUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutOwnerInput | LeadUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type CustomerUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CustomerCreateWithoutOwnerInput, CustomerUncheckedCreateWithoutOwnerInput> | CustomerCreateWithoutOwnerInput[] | CustomerUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutOwnerInput | CustomerCreateOrConnectWithoutOwnerInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutOwnerInput | CustomerUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CustomerCreateManyOwnerInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutOwnerInput | CustomerUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutOwnerInput | CustomerUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type InteractionUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<InteractionCreateWithoutCreatedByInput, InteractionUncheckedCreateWithoutCreatedByInput> | InteractionCreateWithoutCreatedByInput[] | InteractionUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutCreatedByInput | InteractionCreateOrConnectWithoutCreatedByInput[]
    upsert?: InteractionUpsertWithWhereUniqueWithoutCreatedByInput | InteractionUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: InteractionCreateManyCreatedByInputEnvelope
    set?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    disconnect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    delete?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    update?: InteractionUpdateWithWhereUniqueWithoutCreatedByInput | InteractionUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: InteractionUpdateManyWithWhereWithoutCreatedByInput | InteractionUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
  }

  export type BusinessUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<BusinessCreateWithoutOwnerInput, BusinessUncheckedCreateWithoutOwnerInput> | BusinessCreateWithoutOwnerInput[] | BusinessUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutOwnerInput | BusinessCreateOrConnectWithoutOwnerInput[]
    upsert?: BusinessUpsertWithWhereUniqueWithoutOwnerInput | BusinessUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: BusinessCreateManyOwnerInputEnvelope
    set?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    disconnect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    delete?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    update?: BusinessUpdateWithWhereUniqueWithoutOwnerInput | BusinessUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: BusinessUpdateManyWithWhereWithoutOwnerInput | BusinessUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
  }

  export type ConversationUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ConversationCreateWithoutOwnerInput, ConversationUncheckedCreateWithoutOwnerInput> | ConversationCreateWithoutOwnerInput[] | ConversationUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutOwnerInput | ConversationCreateOrConnectWithoutOwnerInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutOwnerInput | ConversationUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ConversationCreateManyOwnerInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutOwnerInput | ConversationUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutOwnerInput | ConversationUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput> | TaskCreateWithoutOwnerInput[] | TaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutOwnerInput | TaskCreateOrConnectWithoutOwnerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutOwnerInput | TaskUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: TaskCreateManyOwnerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutOwnerInput | TaskUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutOwnerInput | TaskUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AuditEventUncheckedUpdateManyWithoutActorNestedInput = {
    create?: XOR<AuditEventCreateWithoutActorInput, AuditEventUncheckedCreateWithoutActorInput> | AuditEventCreateWithoutActorInput[] | AuditEventUncheckedCreateWithoutActorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutActorInput | AuditEventCreateOrConnectWithoutActorInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutActorInput | AuditEventUpsertWithWhereUniqueWithoutActorInput[]
    createMany?: AuditEventCreateManyActorInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutActorInput | AuditEventUpdateWithWhereUniqueWithoutActorInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutActorInput | AuditEventUpdateManyWithWhereWithoutActorInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type LeadUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<LeadCreateWithoutOwnerInput, LeadUncheckedCreateWithoutOwnerInput> | LeadCreateWithoutOwnerInput[] | LeadUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: LeadCreateOrConnectWithoutOwnerInput | LeadCreateOrConnectWithoutOwnerInput[]
    upsert?: LeadUpsertWithWhereUniqueWithoutOwnerInput | LeadUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: LeadCreateManyOwnerInputEnvelope
    set?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    disconnect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    delete?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    connect?: LeadWhereUniqueInput | LeadWhereUniqueInput[]
    update?: LeadUpdateWithWhereUniqueWithoutOwnerInput | LeadUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: LeadUpdateManyWithWhereWithoutOwnerInput | LeadUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: LeadScalarWhereInput | LeadScalarWhereInput[]
  }

  export type CustomerUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CustomerCreateWithoutOwnerInput, CustomerUncheckedCreateWithoutOwnerInput> | CustomerCreateWithoutOwnerInput[] | CustomerUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutOwnerInput | CustomerCreateOrConnectWithoutOwnerInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutOwnerInput | CustomerUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CustomerCreateManyOwnerInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutOwnerInput | CustomerUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutOwnerInput | CustomerUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type InteractionUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<InteractionCreateWithoutCreatedByInput, InteractionUncheckedCreateWithoutCreatedByInput> | InteractionCreateWithoutCreatedByInput[] | InteractionUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutCreatedByInput | InteractionCreateOrConnectWithoutCreatedByInput[]
    upsert?: InteractionUpsertWithWhereUniqueWithoutCreatedByInput | InteractionUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: InteractionCreateManyCreatedByInputEnvelope
    set?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    disconnect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    delete?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    update?: InteractionUpdateWithWhereUniqueWithoutCreatedByInput | InteractionUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: InteractionUpdateManyWithWhereWithoutCreatedByInput | InteractionUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
  }

  export type BusinessUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<BusinessCreateWithoutOwnerInput, BusinessUncheckedCreateWithoutOwnerInput> | BusinessCreateWithoutOwnerInput[] | BusinessUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutOwnerInput | BusinessCreateOrConnectWithoutOwnerInput[]
    upsert?: BusinessUpsertWithWhereUniqueWithoutOwnerInput | BusinessUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: BusinessCreateManyOwnerInputEnvelope
    set?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    disconnect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    delete?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    update?: BusinessUpdateWithWhereUniqueWithoutOwnerInput | BusinessUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: BusinessUpdateManyWithWhereWithoutOwnerInput | BusinessUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutAgentsInput = {
    create?: XOR<BusinessCreateWithoutAgentsInput, BusinessUncheckedCreateWithoutAgentsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAgentsInput
    connect?: BusinessWhereUniqueInput
  }

  export type AttributionCreateNestedManyWithoutAgentInput = {
    create?: XOR<AttributionCreateWithoutAgentInput, AttributionUncheckedCreateWithoutAgentInput> | AttributionCreateWithoutAgentInput[] | AttributionUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutAgentInput | AttributionCreateOrConnectWithoutAgentInput[]
    createMany?: AttributionCreateManyAgentInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type ConversationCreateNestedManyWithoutAgentInput = {
    create?: XOR<ConversationCreateWithoutAgentInput, ConversationUncheckedCreateWithoutAgentInput> | ConversationCreateWithoutAgentInput[] | ConversationUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutAgentInput | ConversationCreateOrConnectWithoutAgentInput[]
    createMany?: ConversationCreateManyAgentInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type AttributionUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<AttributionCreateWithoutAgentInput, AttributionUncheckedCreateWithoutAgentInput> | AttributionCreateWithoutAgentInput[] | AttributionUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutAgentInput | AttributionCreateOrConnectWithoutAgentInput[]
    createMany?: AttributionCreateManyAgentInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type ConversationUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<ConversationCreateWithoutAgentInput, ConversationUncheckedCreateWithoutAgentInput> | ConversationCreateWithoutAgentInput[] | ConversationUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutAgentInput | ConversationCreateOrConnectWithoutAgentInput[]
    createMany?: ConversationCreateManyAgentInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type BusinessUpdateOneRequiredWithoutAgentsNestedInput = {
    create?: XOR<BusinessCreateWithoutAgentsInput, BusinessUncheckedCreateWithoutAgentsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAgentsInput
    upsert?: BusinessUpsertWithoutAgentsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutAgentsInput, BusinessUpdateWithoutAgentsInput>, BusinessUncheckedUpdateWithoutAgentsInput>
  }

  export type AttributionUpdateManyWithoutAgentNestedInput = {
    create?: XOR<AttributionCreateWithoutAgentInput, AttributionUncheckedCreateWithoutAgentInput> | AttributionCreateWithoutAgentInput[] | AttributionUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutAgentInput | AttributionCreateOrConnectWithoutAgentInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutAgentInput | AttributionUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: AttributionCreateManyAgentInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutAgentInput | AttributionUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutAgentInput | AttributionUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type ConversationUpdateManyWithoutAgentNestedInput = {
    create?: XOR<ConversationCreateWithoutAgentInput, ConversationUncheckedCreateWithoutAgentInput> | ConversationCreateWithoutAgentInput[] | ConversationUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutAgentInput | ConversationCreateOrConnectWithoutAgentInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutAgentInput | ConversationUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: ConversationCreateManyAgentInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutAgentInput | ConversationUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutAgentInput | ConversationUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type AttributionUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<AttributionCreateWithoutAgentInput, AttributionUncheckedCreateWithoutAgentInput> | AttributionCreateWithoutAgentInput[] | AttributionUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutAgentInput | AttributionCreateOrConnectWithoutAgentInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutAgentInput | AttributionUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: AttributionCreateManyAgentInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutAgentInput | AttributionUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutAgentInput | AttributionUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type ConversationUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<ConversationCreateWithoutAgentInput, ConversationUncheckedCreateWithoutAgentInput> | ConversationCreateWithoutAgentInput[] | ConversationUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutAgentInput | ConversationCreateOrConnectWithoutAgentInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutAgentInput | ConversationUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: ConversationCreateManyAgentInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutAgentInput | ConversationUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutAgentInput | ConversationUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutLeadsInput = {
    create?: XOR<BusinessCreateWithoutLeadsInput, BusinessUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutLeadsInput
    connect?: BusinessWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutLeadsOwnedInput = {
    create?: XOR<UserCreateWithoutLeadsOwnedInput, UserUncheckedCreateWithoutLeadsOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeadsOwnedInput
    connect?: UserWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutLeadInput = {
    create?: XOR<CustomerCreateWithoutLeadInput, CustomerUncheckedCreateWithoutLeadInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLeadInput
    connect?: CustomerWhereUniqueInput
  }

  export type ConversationCreateNestedManyWithoutLeadInput = {
    create?: XOR<ConversationCreateWithoutLeadInput, ConversationUncheckedCreateWithoutLeadInput> | ConversationCreateWithoutLeadInput[] | ConversationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutLeadInput | ConversationCreateOrConnectWithoutLeadInput[]
    createMany?: ConversationCreateManyLeadInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutLeadInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AttributionCreateNestedManyWithoutLeadInput = {
    create?: XOR<AttributionCreateWithoutLeadInput, AttributionUncheckedCreateWithoutLeadInput> | AttributionCreateWithoutLeadInput[] | AttributionUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutLeadInput | AttributionCreateOrConnectWithoutLeadInput[]
    createMany?: AttributionCreateManyLeadInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type CustomerUncheckedCreateNestedOneWithoutLeadInput = {
    create?: XOR<CustomerCreateWithoutLeadInput, CustomerUncheckedCreateWithoutLeadInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLeadInput
    connect?: CustomerWhereUniqueInput
  }

  export type ConversationUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<ConversationCreateWithoutLeadInput, ConversationUncheckedCreateWithoutLeadInput> | ConversationCreateWithoutLeadInput[] | ConversationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutLeadInput | ConversationCreateOrConnectWithoutLeadInput[]
    createMany?: ConversationCreateManyLeadInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AttributionUncheckedCreateNestedManyWithoutLeadInput = {
    create?: XOR<AttributionCreateWithoutLeadInput, AttributionUncheckedCreateWithoutLeadInput> | AttributionCreateWithoutLeadInput[] | AttributionUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutLeadInput | AttributionCreateOrConnectWithoutLeadInput[]
    createMany?: AttributionCreateManyLeadInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type EnumLeadStatusFieldUpdateOperationsInput = {
    set?: $Enums.LeadStatus
  }

  export type BusinessUpdateOneRequiredWithoutLeadsNestedInput = {
    create?: XOR<BusinessCreateWithoutLeadsInput, BusinessUncheckedCreateWithoutLeadsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutLeadsInput
    upsert?: BusinessUpsertWithoutLeadsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutLeadsInput, BusinessUpdateWithoutLeadsInput>, BusinessUncheckedUpdateWithoutLeadsInput>
  }

  export type UserUpdateOneWithoutLeadsOwnedNestedInput = {
    create?: XOR<UserCreateWithoutLeadsOwnedInput, UserUncheckedCreateWithoutLeadsOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeadsOwnedInput
    upsert?: UserUpsertWithoutLeadsOwnedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLeadsOwnedInput, UserUpdateWithoutLeadsOwnedInput>, UserUncheckedUpdateWithoutLeadsOwnedInput>
  }

  export type CustomerUpdateOneWithoutLeadNestedInput = {
    create?: XOR<CustomerCreateWithoutLeadInput, CustomerUncheckedCreateWithoutLeadInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLeadInput
    upsert?: CustomerUpsertWithoutLeadInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutLeadInput, CustomerUpdateWithoutLeadInput>, CustomerUncheckedUpdateWithoutLeadInput>
  }

  export type ConversationUpdateManyWithoutLeadNestedInput = {
    create?: XOR<ConversationCreateWithoutLeadInput, ConversationUncheckedCreateWithoutLeadInput> | ConversationCreateWithoutLeadInput[] | ConversationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutLeadInput | ConversationCreateOrConnectWithoutLeadInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutLeadInput | ConversationUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: ConversationCreateManyLeadInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutLeadInput | ConversationUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutLeadInput | ConversationUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutLeadNestedInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutLeadInput | TaskUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutLeadInput | TaskUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutLeadInput | TaskUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AttributionUpdateManyWithoutLeadNestedInput = {
    create?: XOR<AttributionCreateWithoutLeadInput, AttributionUncheckedCreateWithoutLeadInput> | AttributionCreateWithoutLeadInput[] | AttributionUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutLeadInput | AttributionCreateOrConnectWithoutLeadInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutLeadInput | AttributionUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: AttributionCreateManyLeadInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutLeadInput | AttributionUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutLeadInput | AttributionUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type CustomerUncheckedUpdateOneWithoutLeadNestedInput = {
    create?: XOR<CustomerCreateWithoutLeadInput, CustomerUncheckedCreateWithoutLeadInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutLeadInput
    upsert?: CustomerUpsertWithoutLeadInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutLeadInput, CustomerUpdateWithoutLeadInput>, CustomerUncheckedUpdateWithoutLeadInput>
  }

  export type ConversationUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<ConversationCreateWithoutLeadInput, ConversationUncheckedCreateWithoutLeadInput> | ConversationCreateWithoutLeadInput[] | ConversationUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutLeadInput | ConversationCreateOrConnectWithoutLeadInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutLeadInput | ConversationUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: ConversationCreateManyLeadInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutLeadInput | ConversationUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutLeadInput | ConversationUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput> | TaskCreateWithoutLeadInput[] | TaskUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutLeadInput | TaskCreateOrConnectWithoutLeadInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutLeadInput | TaskUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: TaskCreateManyLeadInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutLeadInput | TaskUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutLeadInput | TaskUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AttributionUncheckedUpdateManyWithoutLeadNestedInput = {
    create?: XOR<AttributionCreateWithoutLeadInput, AttributionUncheckedCreateWithoutLeadInput> | AttributionCreateWithoutLeadInput[] | AttributionUncheckedCreateWithoutLeadInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutLeadInput | AttributionCreateOrConnectWithoutLeadInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutLeadInput | AttributionUpsertWithWhereUniqueWithoutLeadInput[]
    createMany?: AttributionCreateManyLeadInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutLeadInput | AttributionUpdateWithWhereUniqueWithoutLeadInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutLeadInput | AttributionUpdateManyWithWhereWithoutLeadInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutCustomersInput = {
    create?: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCustomersInput
    connect?: BusinessWhereUniqueInput
  }

  export type LeadCreateNestedOneWithoutCustomerInput = {
    create?: XOR<LeadCreateWithoutCustomerInput, LeadUncheckedCreateWithoutCustomerInput>
    connectOrCreate?: LeadCreateOrConnectWithoutCustomerInput
    connect?: LeadWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCustomersOwnedInput = {
    create?: XOR<UserCreateWithoutCustomersOwnedInput, UserUncheckedCreateWithoutCustomersOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomersOwnedInput
    connect?: UserWhereUniqueInput
  }

  export type ConversationCreateNestedManyWithoutCustomerInput = {
    create?: XOR<ConversationCreateWithoutCustomerInput, ConversationUncheckedCreateWithoutCustomerInput> | ConversationCreateWithoutCustomerInput[] | ConversationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutCustomerInput | ConversationCreateOrConnectWithoutCustomerInput[]
    createMany?: ConversationCreateManyCustomerInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutCustomerInput = {
    create?: XOR<TaskCreateWithoutCustomerInput, TaskUncheckedCreateWithoutCustomerInput> | TaskCreateWithoutCustomerInput[] | TaskUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutCustomerInput | TaskCreateOrConnectWithoutCustomerInput[]
    createMany?: TaskCreateManyCustomerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AttributionCreateNestedManyWithoutCustomerInput = {
    create?: XOR<AttributionCreateWithoutCustomerInput, AttributionUncheckedCreateWithoutCustomerInput> | AttributionCreateWithoutCustomerInput[] | AttributionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutCustomerInput | AttributionCreateOrConnectWithoutCustomerInput[]
    createMany?: AttributionCreateManyCustomerInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type ConversationUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<ConversationCreateWithoutCustomerInput, ConversationUncheckedCreateWithoutCustomerInput> | ConversationCreateWithoutCustomerInput[] | ConversationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutCustomerInput | ConversationCreateOrConnectWithoutCustomerInput[]
    createMany?: ConversationCreateManyCustomerInputEnvelope
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<TaskCreateWithoutCustomerInput, TaskUncheckedCreateWithoutCustomerInput> | TaskCreateWithoutCustomerInput[] | TaskUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutCustomerInput | TaskCreateOrConnectWithoutCustomerInput[]
    createMany?: TaskCreateManyCustomerInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type AttributionUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<AttributionCreateWithoutCustomerInput, AttributionUncheckedCreateWithoutCustomerInput> | AttributionCreateWithoutCustomerInput[] | AttributionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutCustomerInput | AttributionCreateOrConnectWithoutCustomerInput[]
    createMany?: AttributionCreateManyCustomerInputEnvelope
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
  }

  export type BusinessUpdateOneRequiredWithoutCustomersNestedInput = {
    create?: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCustomersInput
    upsert?: BusinessUpsertWithoutCustomersInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutCustomersInput, BusinessUpdateWithoutCustomersInput>, BusinessUncheckedUpdateWithoutCustomersInput>
  }

  export type LeadUpdateOneWithoutCustomerNestedInput = {
    create?: XOR<LeadCreateWithoutCustomerInput, LeadUncheckedCreateWithoutCustomerInput>
    connectOrCreate?: LeadCreateOrConnectWithoutCustomerInput
    upsert?: LeadUpsertWithoutCustomerInput
    disconnect?: LeadWhereInput | boolean
    delete?: LeadWhereInput | boolean
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutCustomerInput, LeadUpdateWithoutCustomerInput>, LeadUncheckedUpdateWithoutCustomerInput>
  }

  export type UserUpdateOneWithoutCustomersOwnedNestedInput = {
    create?: XOR<UserCreateWithoutCustomersOwnedInput, UserUncheckedCreateWithoutCustomersOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomersOwnedInput
    upsert?: UserUpsertWithoutCustomersOwnedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCustomersOwnedInput, UserUpdateWithoutCustomersOwnedInput>, UserUncheckedUpdateWithoutCustomersOwnedInput>
  }

  export type ConversationUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<ConversationCreateWithoutCustomerInput, ConversationUncheckedCreateWithoutCustomerInput> | ConversationCreateWithoutCustomerInput[] | ConversationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutCustomerInput | ConversationCreateOrConnectWithoutCustomerInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutCustomerInput | ConversationUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: ConversationCreateManyCustomerInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutCustomerInput | ConversationUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutCustomerInput | ConversationUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<TaskCreateWithoutCustomerInput, TaskUncheckedCreateWithoutCustomerInput> | TaskCreateWithoutCustomerInput[] | TaskUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutCustomerInput | TaskCreateOrConnectWithoutCustomerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutCustomerInput | TaskUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: TaskCreateManyCustomerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutCustomerInput | TaskUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutCustomerInput | TaskUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AttributionUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<AttributionCreateWithoutCustomerInput, AttributionUncheckedCreateWithoutCustomerInput> | AttributionCreateWithoutCustomerInput[] | AttributionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutCustomerInput | AttributionCreateOrConnectWithoutCustomerInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutCustomerInput | AttributionUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: AttributionCreateManyCustomerInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutCustomerInput | AttributionUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutCustomerInput | AttributionUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type ConversationUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<ConversationCreateWithoutCustomerInput, ConversationUncheckedCreateWithoutCustomerInput> | ConversationCreateWithoutCustomerInput[] | ConversationUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: ConversationCreateOrConnectWithoutCustomerInput | ConversationCreateOrConnectWithoutCustomerInput[]
    upsert?: ConversationUpsertWithWhereUniqueWithoutCustomerInput | ConversationUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: ConversationCreateManyCustomerInputEnvelope
    set?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    disconnect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    delete?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    connect?: ConversationWhereUniqueInput | ConversationWhereUniqueInput[]
    update?: ConversationUpdateWithWhereUniqueWithoutCustomerInput | ConversationUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: ConversationUpdateManyWithWhereWithoutCustomerInput | ConversationUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<TaskCreateWithoutCustomerInput, TaskUncheckedCreateWithoutCustomerInput> | TaskCreateWithoutCustomerInput[] | TaskUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutCustomerInput | TaskCreateOrConnectWithoutCustomerInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutCustomerInput | TaskUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: TaskCreateManyCustomerInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutCustomerInput | TaskUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutCustomerInput | TaskUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type AttributionUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<AttributionCreateWithoutCustomerInput, AttributionUncheckedCreateWithoutCustomerInput> | AttributionCreateWithoutCustomerInput[] | AttributionUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: AttributionCreateOrConnectWithoutCustomerInput | AttributionCreateOrConnectWithoutCustomerInput[]
    upsert?: AttributionUpsertWithWhereUniqueWithoutCustomerInput | AttributionUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: AttributionCreateManyCustomerInputEnvelope
    set?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    disconnect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    delete?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    connect?: AttributionWhereUniqueInput | AttributionWhereUniqueInput[]
    update?: AttributionUpdateWithWhereUniqueWithoutCustomerInput | AttributionUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: AttributionUpdateManyWithWhereWithoutCustomerInput | AttributionUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutConversationsInput = {
    create?: XOR<BusinessCreateWithoutConversationsInput, BusinessUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutConversationsInput
    connect?: BusinessWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutConversationsInput = {
    create?: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConversationsInput
    connect?: UserWhereUniqueInput
  }

  export type LeadCreateNestedOneWithoutConversationsInput = {
    create?: XOR<LeadCreateWithoutConversationsInput, LeadUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutConversationsInput
    connect?: LeadWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutConversationsInput = {
    create?: XOR<CustomerCreateWithoutConversationsInput, CustomerUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutConversationsInput
    connect?: CustomerWhereUniqueInput
  }

  export type AgentCreateNestedOneWithoutConversationsInput = {
    create?: XOR<AgentCreateWithoutConversationsInput, AgentUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: AgentCreateOrConnectWithoutConversationsInput
    connect?: AgentWhereUniqueInput
  }

  export type InteractionCreateNestedManyWithoutConversationInput = {
    create?: XOR<InteractionCreateWithoutConversationInput, InteractionUncheckedCreateWithoutConversationInput> | InteractionCreateWithoutConversationInput[] | InteractionUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutConversationInput | InteractionCreateOrConnectWithoutConversationInput[]
    createMany?: InteractionCreateManyConversationInputEnvelope
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutConversationInput = {
    create?: XOR<TaskCreateWithoutConversationInput, TaskUncheckedCreateWithoutConversationInput> | TaskCreateWithoutConversationInput[] | TaskUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutConversationInput | TaskCreateOrConnectWithoutConversationInput[]
    createMany?: TaskCreateManyConversationInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type InteractionUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<InteractionCreateWithoutConversationInput, InteractionUncheckedCreateWithoutConversationInput> | InteractionCreateWithoutConversationInput[] | InteractionUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutConversationInput | InteractionCreateOrConnectWithoutConversationInput[]
    createMany?: InteractionCreateManyConversationInputEnvelope
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<TaskCreateWithoutConversationInput, TaskUncheckedCreateWithoutConversationInput> | TaskCreateWithoutConversationInput[] | TaskUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutConversationInput | TaskCreateOrConnectWithoutConversationInput[]
    createMany?: TaskCreateManyConversationInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type EnumConversationChannelFieldUpdateOperationsInput = {
    set?: $Enums.ConversationChannel
  }

  export type EnumConversationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConversationStatus
  }

  export type BusinessUpdateOneRequiredWithoutConversationsNestedInput = {
    create?: XOR<BusinessCreateWithoutConversationsInput, BusinessUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutConversationsInput
    upsert?: BusinessUpsertWithoutConversationsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutConversationsInput, BusinessUpdateWithoutConversationsInput>, BusinessUncheckedUpdateWithoutConversationsInput>
  }

  export type UserUpdateOneWithoutConversationsNestedInput = {
    create?: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutConversationsInput
    upsert?: UserUpsertWithoutConversationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutConversationsInput, UserUpdateWithoutConversationsInput>, UserUncheckedUpdateWithoutConversationsInput>
  }

  export type LeadUpdateOneWithoutConversationsNestedInput = {
    create?: XOR<LeadCreateWithoutConversationsInput, LeadUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutConversationsInput
    upsert?: LeadUpsertWithoutConversationsInput
    disconnect?: LeadWhereInput | boolean
    delete?: LeadWhereInput | boolean
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutConversationsInput, LeadUpdateWithoutConversationsInput>, LeadUncheckedUpdateWithoutConversationsInput>
  }

  export type CustomerUpdateOneWithoutConversationsNestedInput = {
    create?: XOR<CustomerCreateWithoutConversationsInput, CustomerUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutConversationsInput
    upsert?: CustomerUpsertWithoutConversationsInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutConversationsInput, CustomerUpdateWithoutConversationsInput>, CustomerUncheckedUpdateWithoutConversationsInput>
  }

  export type AgentUpdateOneWithoutConversationsNestedInput = {
    create?: XOR<AgentCreateWithoutConversationsInput, AgentUncheckedCreateWithoutConversationsInput>
    connectOrCreate?: AgentCreateOrConnectWithoutConversationsInput
    upsert?: AgentUpsertWithoutConversationsInput
    disconnect?: AgentWhereInput | boolean
    delete?: AgentWhereInput | boolean
    connect?: AgentWhereUniqueInput
    update?: XOR<XOR<AgentUpdateToOneWithWhereWithoutConversationsInput, AgentUpdateWithoutConversationsInput>, AgentUncheckedUpdateWithoutConversationsInput>
  }

  export type InteractionUpdateManyWithoutConversationNestedInput = {
    create?: XOR<InteractionCreateWithoutConversationInput, InteractionUncheckedCreateWithoutConversationInput> | InteractionCreateWithoutConversationInput[] | InteractionUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutConversationInput | InteractionCreateOrConnectWithoutConversationInput[]
    upsert?: InteractionUpsertWithWhereUniqueWithoutConversationInput | InteractionUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: InteractionCreateManyConversationInputEnvelope
    set?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    disconnect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    delete?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    update?: InteractionUpdateWithWhereUniqueWithoutConversationInput | InteractionUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: InteractionUpdateManyWithWhereWithoutConversationInput | InteractionUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutConversationNestedInput = {
    create?: XOR<TaskCreateWithoutConversationInput, TaskUncheckedCreateWithoutConversationInput> | TaskCreateWithoutConversationInput[] | TaskUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutConversationInput | TaskCreateOrConnectWithoutConversationInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutConversationInput | TaskUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: TaskCreateManyConversationInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutConversationInput | TaskUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutConversationInput | TaskUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type InteractionUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<InteractionCreateWithoutConversationInput, InteractionUncheckedCreateWithoutConversationInput> | InteractionCreateWithoutConversationInput[] | InteractionUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: InteractionCreateOrConnectWithoutConversationInput | InteractionCreateOrConnectWithoutConversationInput[]
    upsert?: InteractionUpsertWithWhereUniqueWithoutConversationInput | InteractionUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: InteractionCreateManyConversationInputEnvelope
    set?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    disconnect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    delete?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    connect?: InteractionWhereUniqueInput | InteractionWhereUniqueInput[]
    update?: InteractionUpdateWithWhereUniqueWithoutConversationInput | InteractionUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: InteractionUpdateManyWithWhereWithoutConversationInput | InteractionUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<TaskCreateWithoutConversationInput, TaskUncheckedCreateWithoutConversationInput> | TaskCreateWithoutConversationInput[] | TaskUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutConversationInput | TaskCreateOrConnectWithoutConversationInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutConversationInput | TaskUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: TaskCreateManyConversationInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutConversationInput | TaskUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutConversationInput | TaskUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutInteractionsInput = {
    create?: XOR<BusinessCreateWithoutInteractionsInput, BusinessUncheckedCreateWithoutInteractionsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutInteractionsInput
    connect?: BusinessWhereUniqueInput
  }

  export type ConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutInteractionsAuthoredInput = {
    create?: XOR<UserCreateWithoutInteractionsAuthoredInput, UserUncheckedCreateWithoutInteractionsAuthoredInput>
    connectOrCreate?: UserCreateOrConnectWithoutInteractionsAuthoredInput
    connect?: UserWhereUniqueInput
  }

  export type EnumInteractionTypeFieldUpdateOperationsInput = {
    set?: $Enums.InteractionType
  }

  export type BusinessUpdateOneRequiredWithoutInteractionsNestedInput = {
    create?: XOR<BusinessCreateWithoutInteractionsInput, BusinessUncheckedCreateWithoutInteractionsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutInteractionsInput
    upsert?: BusinessUpsertWithoutInteractionsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutInteractionsInput, BusinessUpdateWithoutInteractionsInput>, BusinessUncheckedUpdateWithoutInteractionsInput>
  }

  export type ConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutMessagesInput
    upsert?: ConversationUpsertWithoutMessagesInput
    connect?: ConversationWhereUniqueInput
    update?: XOR<XOR<ConversationUpdateToOneWithWhereWithoutMessagesInput, ConversationUpdateWithoutMessagesInput>, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateOneWithoutInteractionsAuthoredNestedInput = {
    create?: XOR<UserCreateWithoutInteractionsAuthoredInput, UserUncheckedCreateWithoutInteractionsAuthoredInput>
    connectOrCreate?: UserCreateOrConnectWithoutInteractionsAuthoredInput
    upsert?: UserUpsertWithoutInteractionsAuthoredInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutInteractionsAuthoredInput, UserUpdateWithoutInteractionsAuthoredInput>, UserUncheckedUpdateWithoutInteractionsAuthoredInput>
  }

  export type BusinessCreateNestedOneWithoutTasksInput = {
    create?: XOR<BusinessCreateWithoutTasksInput, BusinessUncheckedCreateWithoutTasksInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutTasksInput
    connect?: BusinessWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTasksInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    connect?: UserWhereUniqueInput
  }

  export type LeadCreateNestedOneWithoutTasksInput = {
    create?: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
    connectOrCreate?: LeadCreateOrConnectWithoutTasksInput
    connect?: LeadWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutTasksInput = {
    create?: XOR<CustomerCreateWithoutTasksInput, CustomerUncheckedCreateWithoutTasksInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutTasksInput
    connect?: CustomerWhereUniqueInput
  }

  export type ConversationCreateNestedOneWithoutTasksInput = {
    create?: XOR<ConversationCreateWithoutTasksInput, ConversationUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutTasksInput
    connect?: ConversationWhereUniqueInput
  }

  export type EnumTaskTypeFieldUpdateOperationsInput = {
    set?: $Enums.TaskType
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type BusinessUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<BusinessCreateWithoutTasksInput, BusinessUncheckedCreateWithoutTasksInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutTasksInput
    upsert?: BusinessUpsertWithoutTasksInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutTasksInput, BusinessUpdateWithoutTasksInput>, BusinessUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateOneWithoutTasksNestedInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    upsert?: UserUpsertWithoutTasksInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTasksInput, UserUpdateWithoutTasksInput>, UserUncheckedUpdateWithoutTasksInput>
  }

  export type LeadUpdateOneWithoutTasksNestedInput = {
    create?: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
    connectOrCreate?: LeadCreateOrConnectWithoutTasksInput
    upsert?: LeadUpsertWithoutTasksInput
    disconnect?: LeadWhereInput | boolean
    delete?: LeadWhereInput | boolean
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutTasksInput, LeadUpdateWithoutTasksInput>, LeadUncheckedUpdateWithoutTasksInput>
  }

  export type CustomerUpdateOneWithoutTasksNestedInput = {
    create?: XOR<CustomerCreateWithoutTasksInput, CustomerUncheckedCreateWithoutTasksInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutTasksInput
    upsert?: CustomerUpsertWithoutTasksInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutTasksInput, CustomerUpdateWithoutTasksInput>, CustomerUncheckedUpdateWithoutTasksInput>
  }

  export type ConversationUpdateOneWithoutTasksNestedInput = {
    create?: XOR<ConversationCreateWithoutTasksInput, ConversationUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutTasksInput
    upsert?: ConversationUpsertWithoutTasksInput
    disconnect?: ConversationWhereInput | boolean
    delete?: ConversationWhereInput | boolean
    connect?: ConversationWhereUniqueInput
    update?: XOR<XOR<ConversationUpdateToOneWithWhereWithoutTasksInput, ConversationUpdateWithoutTasksInput>, ConversationUncheckedUpdateWithoutTasksInput>
  }

  export type BusinessCreateNestedOneWithoutAttributionsInput = {
    create?: XOR<BusinessCreateWithoutAttributionsInput, BusinessUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAttributionsInput
    connect?: BusinessWhereUniqueInput
  }

  export type AgentCreateNestedOneWithoutAttributionsInput = {
    create?: XOR<AgentCreateWithoutAttributionsInput, AgentUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: AgentCreateOrConnectWithoutAttributionsInput
    connect?: AgentWhereUniqueInput
  }

  export type LeadCreateNestedOneWithoutAttributionsInput = {
    create?: XOR<LeadCreateWithoutAttributionsInput, LeadUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutAttributionsInput
    connect?: LeadWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutAttributionsInput = {
    create?: XOR<CustomerCreateWithoutAttributionsInput, CustomerUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutAttributionsInput
    connect?: CustomerWhereUniqueInput
  }

  export type EnumAttributionMethodFieldUpdateOperationsInput = {
    set?: $Enums.AttributionMethod
  }

  export type BusinessUpdateOneRequiredWithoutAttributionsNestedInput = {
    create?: XOR<BusinessCreateWithoutAttributionsInput, BusinessUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAttributionsInput
    upsert?: BusinessUpsertWithoutAttributionsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutAttributionsInput, BusinessUpdateWithoutAttributionsInput>, BusinessUncheckedUpdateWithoutAttributionsInput>
  }

  export type AgentUpdateOneRequiredWithoutAttributionsNestedInput = {
    create?: XOR<AgentCreateWithoutAttributionsInput, AgentUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: AgentCreateOrConnectWithoutAttributionsInput
    upsert?: AgentUpsertWithoutAttributionsInput
    connect?: AgentWhereUniqueInput
    update?: XOR<XOR<AgentUpdateToOneWithWhereWithoutAttributionsInput, AgentUpdateWithoutAttributionsInput>, AgentUncheckedUpdateWithoutAttributionsInput>
  }

  export type LeadUpdateOneWithoutAttributionsNestedInput = {
    create?: XOR<LeadCreateWithoutAttributionsInput, LeadUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: LeadCreateOrConnectWithoutAttributionsInput
    upsert?: LeadUpsertWithoutAttributionsInput
    disconnect?: LeadWhereInput | boolean
    delete?: LeadWhereInput | boolean
    connect?: LeadWhereUniqueInput
    update?: XOR<XOR<LeadUpdateToOneWithWhereWithoutAttributionsInput, LeadUpdateWithoutAttributionsInput>, LeadUncheckedUpdateWithoutAttributionsInput>
  }

  export type CustomerUpdateOneWithoutAttributionsNestedInput = {
    create?: XOR<CustomerCreateWithoutAttributionsInput, CustomerUncheckedCreateWithoutAttributionsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutAttributionsInput
    upsert?: CustomerUpsertWithoutAttributionsInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutAttributionsInput, CustomerUpdateWithoutAttributionsInput>, CustomerUncheckedUpdateWithoutAttributionsInput>
  }

  export type BusinessCreateNestedOneWithoutAuditsInput = {
    create?: XOR<BusinessCreateWithoutAuditsInput, BusinessUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAuditsInput
    connect?: BusinessWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAuditEventsInput = {
    create?: XOR<UserCreateWithoutAuditEventsInput, UserUncheckedCreateWithoutAuditEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditEventsInput
    connect?: UserWhereUniqueInput
  }

  export type BusinessUpdateOneRequiredWithoutAuditsNestedInput = {
    create?: XOR<BusinessCreateWithoutAuditsInput, BusinessUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAuditsInput
    upsert?: BusinessUpsertWithoutAuditsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutAuditsInput, BusinessUpdateWithoutAuditsInput>, BusinessUncheckedUpdateWithoutAuditsInput>
  }

  export type UserUpdateOneWithoutAuditEventsNestedInput = {
    create?: XOR<UserCreateWithoutAuditEventsInput, UserUncheckedCreateWithoutAuditEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditEventsInput
    upsert?: UserUpsertWithoutAuditEventsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditEventsInput, UserUpdateWithoutAuditEventsInput>, UserUncheckedUpdateWithoutAuditEventsInput>
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
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumLeadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusFilter<$PrismaModel> | $Enums.LeadStatus
  }

  export type NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadStatusFilter<$PrismaModel>
    _max?: NestedEnumLeadStatusFilter<$PrismaModel>
  }

  export type NestedEnumConversationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelFilter<$PrismaModel> | $Enums.ConversationChannel
  }

  export type NestedEnumConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusFilter<$PrismaModel> | $Enums.ConversationStatus
  }

  export type NestedEnumConversationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationChannel | EnumConversationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationChannel[] | ListEnumConversationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationChannelWithAggregatesFilter<$PrismaModel> | $Enums.ConversationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationChannelFilter<$PrismaModel>
    _max?: NestedEnumConversationChannelFilter<$PrismaModel>
  }

  export type NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConversationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationStatusFilter<$PrismaModel>
    _max?: NestedEnumConversationStatusFilter<$PrismaModel>
  }

  export type NestedEnumInteractionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionType | EnumInteractionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionTypeFilter<$PrismaModel> | $Enums.InteractionType
  }

  export type NestedEnumInteractionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionType | EnumInteractionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionType[] | ListEnumInteractionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionTypeWithAggregatesFilter<$PrismaModel> | $Enums.InteractionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInteractionTypeFilter<$PrismaModel>
    _max?: NestedEnumInteractionTypeFilter<$PrismaModel>
  }

  export type NestedEnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type NestedEnumAttributionMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.AttributionMethod | EnumAttributionMethodFieldRefInput<$PrismaModel>
    in?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumAttributionMethodFilter<$PrismaModel> | $Enums.AttributionMethod
  }

  export type NestedEnumAttributionMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttributionMethod | EnumAttributionMethodFieldRefInput<$PrismaModel>
    in?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttributionMethod[] | ListEnumAttributionMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumAttributionMethodWithAggregatesFilter<$PrismaModel> | $Enums.AttributionMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttributionMethodFilter<$PrismaModel>
    _max?: NestedEnumAttributionMethodFilter<$PrismaModel>
  }

  export type UserCreateWithoutBusinessInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutBusinessInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutBusinessInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBusinessInput, UserUncheckedCreateWithoutBusinessInput>
  }

  export type UserCreateManyBusinessInputEnvelope = {
    data: UserCreateManyBusinessInput | UserCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type AgentCreateWithoutBusinessInput = {
    id?: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributions?: AttributionCreateNestedManyWithoutAgentInput
    conversations?: ConversationCreateNestedManyWithoutAgentInput
  }

  export type AgentUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributions?: AttributionUncheckedCreateNestedManyWithoutAgentInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentCreateOrConnectWithoutBusinessInput = {
    where: AgentWhereUniqueInput
    create: XOR<AgentCreateWithoutBusinessInput, AgentUncheckedCreateWithoutBusinessInput>
  }

  export type AgentCreateManyBusinessInputEnvelope = {
    data: AgentCreateManyBusinessInput | AgentCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type LeadCreateWithoutBusinessInput = {
    id?: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutLeadsOwnedInput
    customer?: CustomerCreateNestedOneWithoutLeadInput
    conversations?: ConversationCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    attributions?: AttributionCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutBusinessInput = {
    id?: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerUncheckedCreateNestedOneWithoutLeadInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutBusinessInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutBusinessInput, LeadUncheckedCreateWithoutBusinessInput>
  }

  export type LeadCreateManyBusinessInputEnvelope = {
    data: LeadCreateManyBusinessInput | LeadCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type CustomerCreateWithoutBusinessInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    lead?: LeadCreateNestedOneWithoutCustomerInput
    owner?: UserCreateNestedOneWithoutCustomersOwnedInput
    conversations?: ConversationCreateNestedManyWithoutCustomerInput
    tasks?: TaskCreateNestedManyWithoutCustomerInput
    attributions?: AttributionCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutBusinessInput = {
    id?: string
    leadId?: string | null
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutCustomerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutCustomerInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput>
  }

  export type CustomerCreateManyBusinessInputEnvelope = {
    data: CustomerCreateManyBusinessInput | CustomerCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type ConversationCreateWithoutBusinessInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutConversationsInput
    lead?: LeadCreateNestedOneWithoutConversationsInput
    customer?: CustomerCreateNestedOneWithoutConversationsInput
    agent?: AgentCreateNestedOneWithoutConversationsInput
    messages?: InteractionCreateNestedManyWithoutConversationInput
    tasks?: TaskCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutBusinessInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: InteractionUncheckedCreateNestedManyWithoutConversationInput
    tasks?: TaskUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutBusinessInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutBusinessInput, ConversationUncheckedCreateWithoutBusinessInput>
  }

  export type ConversationCreateManyBusinessInputEnvelope = {
    data: ConversationCreateManyBusinessInput | ConversationCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutBusinessInput = {
    id?: string
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
    customer?: CustomerCreateNestedOneWithoutTasksInput
    conversation?: ConversationCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutBusinessInput = {
    id?: string
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutBusinessInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutBusinessInput, TaskUncheckedCreateWithoutBusinessInput>
  }

  export type TaskCreateManyBusinessInputEnvelope = {
    data: TaskCreateManyBusinessInput | TaskCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type AttributionCreateWithoutBusinessInput = {
    id?: string
    method: $Enums.AttributionMethod
    notes?: string | null
    createdAt?: Date | string
    agent: AgentCreateNestedOneWithoutAttributionsInput
    lead?: LeadCreateNestedOneWithoutAttributionsInput
    customer?: CustomerCreateNestedOneWithoutAttributionsInput
  }

  export type AttributionUncheckedCreateWithoutBusinessInput = {
    id?: string
    agentId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type AttributionCreateOrConnectWithoutBusinessInput = {
    where: AttributionWhereUniqueInput
    create: XOR<AttributionCreateWithoutBusinessInput, AttributionUncheckedCreateWithoutBusinessInput>
  }

  export type AttributionCreateManyBusinessInputEnvelope = {
    data: AttributionCreateManyBusinessInput | AttributionCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type AuditEventCreateWithoutBusinessInput = {
    id?: string
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    actor?: UserCreateNestedOneWithoutAuditEventsInput
  }

  export type AuditEventUncheckedCreateWithoutBusinessInput = {
    id?: string
    actorId?: string | null
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditEventCreateOrConnectWithoutBusinessInput = {
    where: AuditEventWhereUniqueInput
    create: XOR<AuditEventCreateWithoutBusinessInput, AuditEventUncheckedCreateWithoutBusinessInput>
  }

  export type AuditEventCreateManyBusinessInputEnvelope = {
    data: AuditEventCreateManyBusinessInput | AuditEventCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type InteractionCreateWithoutBusinessInput = {
    id?: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    conversation: ConversationCreateNestedOneWithoutMessagesInput
    createdBy?: UserCreateNestedOneWithoutInteractionsAuthoredInput
  }

  export type InteractionUncheckedCreateWithoutBusinessInput = {
    id?: string
    conversationId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
  }

  export type InteractionCreateOrConnectWithoutBusinessInput = {
    where: InteractionWhereUniqueInput
    create: XOR<InteractionCreateWithoutBusinessInput, InteractionUncheckedCreateWithoutBusinessInput>
  }

  export type InteractionCreateManyBusinessInputEnvelope = {
    data: InteractionCreateManyBusinessInput | InteractionCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutBusinessesOwnedInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutBusinessesOwnedInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutBusinessesOwnedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBusinessesOwnedInput, UserUncheckedCreateWithoutBusinessesOwnedInput>
  }

  export type UserUpsertWithWhereUniqueWithoutBusinessInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutBusinessInput, UserUncheckedUpdateWithoutBusinessInput>
    create: XOR<UserCreateWithoutBusinessInput, UserUncheckedCreateWithoutBusinessInput>
  }

  export type UserUpdateWithWhereUniqueWithoutBusinessInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutBusinessInput, UserUncheckedUpdateWithoutBusinessInput>
  }

  export type UserUpdateManyWithWhereWithoutBusinessInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutBusinessInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    locale?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    passwordHash?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    businessId?: StringNullableFilter<"User"> | string | null
  }

  export type AgentUpsertWithWhereUniqueWithoutBusinessInput = {
    where: AgentWhereUniqueInput
    update: XOR<AgentUpdateWithoutBusinessInput, AgentUncheckedUpdateWithoutBusinessInput>
    create: XOR<AgentCreateWithoutBusinessInput, AgentUncheckedCreateWithoutBusinessInput>
  }

  export type AgentUpdateWithWhereUniqueWithoutBusinessInput = {
    where: AgentWhereUniqueInput
    data: XOR<AgentUpdateWithoutBusinessInput, AgentUncheckedUpdateWithoutBusinessInput>
  }

  export type AgentUpdateManyWithWhereWithoutBusinessInput = {
    where: AgentScalarWhereInput
    data: XOR<AgentUpdateManyMutationInput, AgentUncheckedUpdateManyWithoutBusinessInput>
  }

  export type AgentScalarWhereInput = {
    AND?: AgentScalarWhereInput | AgentScalarWhereInput[]
    OR?: AgentScalarWhereInput[]
    NOT?: AgentScalarWhereInput | AgentScalarWhereInput[]
    id?: StringFilter<"Agent"> | string
    businessId?: StringFilter<"Agent"> | string
    name?: StringFilter<"Agent"> | string
    phone?: StringNullableFilter<"Agent"> | string | null
    referralUrl?: StringNullableFilter<"Agent"> | string | null
    couponCode?: StringNullableFilter<"Agent"> | string | null
    status?: StringFilter<"Agent"> | string
    notes?: StringNullableFilter<"Agent"> | string | null
    createdAt?: DateTimeFilter<"Agent"> | Date | string
    updatedAt?: DateTimeFilter<"Agent"> | Date | string
  }

  export type LeadUpsertWithWhereUniqueWithoutBusinessInput = {
    where: LeadWhereUniqueInput
    update: XOR<LeadUpdateWithoutBusinessInput, LeadUncheckedUpdateWithoutBusinessInput>
    create: XOR<LeadCreateWithoutBusinessInput, LeadUncheckedCreateWithoutBusinessInput>
  }

  export type LeadUpdateWithWhereUniqueWithoutBusinessInput = {
    where: LeadWhereUniqueInput
    data: XOR<LeadUpdateWithoutBusinessInput, LeadUncheckedUpdateWithoutBusinessInput>
  }

  export type LeadUpdateManyWithWhereWithoutBusinessInput = {
    where: LeadScalarWhereInput
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyWithoutBusinessInput>
  }

  export type LeadScalarWhereInput = {
    AND?: LeadScalarWhereInput | LeadScalarWhereInput[]
    OR?: LeadScalarWhereInput[]
    NOT?: LeadScalarWhereInput | LeadScalarWhereInput[]
    id?: StringFilter<"Lead"> | string
    businessId?: StringFilter<"Lead"> | string
    ownerId?: StringNullableFilter<"Lead"> | string | null
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    source?: StringNullableFilter<"Lead"> | string | null
    firstName?: StringNullableFilter<"Lead"> | string | null
    lastName?: StringNullableFilter<"Lead"> | string | null
    phone?: StringNullableFilter<"Lead"> | string | null
    phoneNormalized?: StringNullableFilter<"Lead"> | string | null
    email?: StringNullableFilter<"Lead"> | string | null
    tags?: JsonNullableFilter<"Lead">
    notes?: StringNullableFilter<"Lead"> | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
  }

  export type CustomerUpsertWithWhereUniqueWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    update: XOR<CustomerUpdateWithoutBusinessInput, CustomerUncheckedUpdateWithoutBusinessInput>
    create: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput>
  }

  export type CustomerUpdateWithWhereUniqueWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    data: XOR<CustomerUpdateWithoutBusinessInput, CustomerUncheckedUpdateWithoutBusinessInput>
  }

  export type CustomerUpdateManyWithWhereWithoutBusinessInput = {
    where: CustomerScalarWhereInput
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyWithoutBusinessInput>
  }

  export type CustomerScalarWhereInput = {
    AND?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    OR?: CustomerScalarWhereInput[]
    NOT?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    id?: StringFilter<"Customer"> | string
    businessId?: StringFilter<"Customer"> | string
    leadId?: StringNullableFilter<"Customer"> | string | null
    ownerId?: StringNullableFilter<"Customer"> | string | null
    firstName?: StringNullableFilter<"Customer"> | string | null
    lastName?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    phoneNormalized?: StringNullableFilter<"Customer"> | string | null
    email?: StringNullableFilter<"Customer"> | string | null
    tags?: JsonNullableFilter<"Customer">
    address?: JsonNullableFilter<"Customer">
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
  }

  export type ConversationUpsertWithWhereUniqueWithoutBusinessInput = {
    where: ConversationWhereUniqueInput
    update: XOR<ConversationUpdateWithoutBusinessInput, ConversationUncheckedUpdateWithoutBusinessInput>
    create: XOR<ConversationCreateWithoutBusinessInput, ConversationUncheckedCreateWithoutBusinessInput>
  }

  export type ConversationUpdateWithWhereUniqueWithoutBusinessInput = {
    where: ConversationWhereUniqueInput
    data: XOR<ConversationUpdateWithoutBusinessInput, ConversationUncheckedUpdateWithoutBusinessInput>
  }

  export type ConversationUpdateManyWithWhereWithoutBusinessInput = {
    where: ConversationScalarWhereInput
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyWithoutBusinessInput>
  }

  export type ConversationScalarWhereInput = {
    AND?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
    OR?: ConversationScalarWhereInput[]
    NOT?: ConversationScalarWhereInput | ConversationScalarWhereInput[]
    id?: StringFilter<"Conversation"> | string
    businessId?: StringFilter<"Conversation"> | string
    channel?: EnumConversationChannelFilter<"Conversation"> | $Enums.ConversationChannel
    status?: EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus
    subject?: StringNullableFilter<"Conversation"> | string | null
    ownerId?: StringNullableFilter<"Conversation"> | string | null
    leadId?: StringNullableFilter<"Conversation"> | string | null
    customerId?: StringNullableFilter<"Conversation"> | string | null
    agentId?: StringNullableFilter<"Conversation"> | string | null
    nextFollowUpAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    slaBreachedAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    closedAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
  }

  export type TaskUpsertWithWhereUniqueWithoutBusinessInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutBusinessInput, TaskUncheckedUpdateWithoutBusinessInput>
    create: XOR<TaskCreateWithoutBusinessInput, TaskUncheckedCreateWithoutBusinessInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutBusinessInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutBusinessInput, TaskUncheckedUpdateWithoutBusinessInput>
  }

  export type TaskUpdateManyWithWhereWithoutBusinessInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutBusinessInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    businessId?: StringFilter<"Task"> | string
    ownerId?: StringNullableFilter<"Task"> | string | null
    leadId?: StringNullableFilter<"Task"> | string | null
    customerId?: StringNullableFilter<"Task"> | string | null
    conversationId?: StringNullableFilter<"Task"> | string | null
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    type?: EnumTaskTypeFilter<"Task"> | $Enums.TaskType
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    dueAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
  }

  export type AttributionUpsertWithWhereUniqueWithoutBusinessInput = {
    where: AttributionWhereUniqueInput
    update: XOR<AttributionUpdateWithoutBusinessInput, AttributionUncheckedUpdateWithoutBusinessInput>
    create: XOR<AttributionCreateWithoutBusinessInput, AttributionUncheckedCreateWithoutBusinessInput>
  }

  export type AttributionUpdateWithWhereUniqueWithoutBusinessInput = {
    where: AttributionWhereUniqueInput
    data: XOR<AttributionUpdateWithoutBusinessInput, AttributionUncheckedUpdateWithoutBusinessInput>
  }

  export type AttributionUpdateManyWithWhereWithoutBusinessInput = {
    where: AttributionScalarWhereInput
    data: XOR<AttributionUpdateManyMutationInput, AttributionUncheckedUpdateManyWithoutBusinessInput>
  }

  export type AttributionScalarWhereInput = {
    AND?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
    OR?: AttributionScalarWhereInput[]
    NOT?: AttributionScalarWhereInput | AttributionScalarWhereInput[]
    id?: StringFilter<"Attribution"> | string
    businessId?: StringFilter<"Attribution"> | string
    agentId?: StringFilter<"Attribution"> | string
    method?: EnumAttributionMethodFilter<"Attribution"> | $Enums.AttributionMethod
    leadId?: StringNullableFilter<"Attribution"> | string | null
    customerId?: StringNullableFilter<"Attribution"> | string | null
    notes?: StringNullableFilter<"Attribution"> | string | null
    createdAt?: DateTimeFilter<"Attribution"> | Date | string
  }

  export type AuditEventUpsertWithWhereUniqueWithoutBusinessInput = {
    where: AuditEventWhereUniqueInput
    update: XOR<AuditEventUpdateWithoutBusinessInput, AuditEventUncheckedUpdateWithoutBusinessInput>
    create: XOR<AuditEventCreateWithoutBusinessInput, AuditEventUncheckedCreateWithoutBusinessInput>
  }

  export type AuditEventUpdateWithWhereUniqueWithoutBusinessInput = {
    where: AuditEventWhereUniqueInput
    data: XOR<AuditEventUpdateWithoutBusinessInput, AuditEventUncheckedUpdateWithoutBusinessInput>
  }

  export type AuditEventUpdateManyWithWhereWithoutBusinessInput = {
    where: AuditEventScalarWhereInput
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyWithoutBusinessInput>
  }

  export type AuditEventScalarWhereInput = {
    AND?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
    OR?: AuditEventScalarWhereInput[]
    NOT?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    businessId?: StringFilter<"AuditEvent"> | string
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    entity?: StringFilter<"AuditEvent"> | string
    entityId?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    before?: JsonNullableFilter<"AuditEvent">
    after?: JsonNullableFilter<"AuditEvent">
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }

  export type InteractionUpsertWithWhereUniqueWithoutBusinessInput = {
    where: InteractionWhereUniqueInput
    update: XOR<InteractionUpdateWithoutBusinessInput, InteractionUncheckedUpdateWithoutBusinessInput>
    create: XOR<InteractionCreateWithoutBusinessInput, InteractionUncheckedCreateWithoutBusinessInput>
  }

  export type InteractionUpdateWithWhereUniqueWithoutBusinessInput = {
    where: InteractionWhereUniqueInput
    data: XOR<InteractionUpdateWithoutBusinessInput, InteractionUncheckedUpdateWithoutBusinessInput>
  }

  export type InteractionUpdateManyWithWhereWithoutBusinessInput = {
    where: InteractionScalarWhereInput
    data: XOR<InteractionUpdateManyMutationInput, InteractionUncheckedUpdateManyWithoutBusinessInput>
  }

  export type InteractionScalarWhereInput = {
    AND?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
    OR?: InteractionScalarWhereInput[]
    NOT?: InteractionScalarWhereInput | InteractionScalarWhereInput[]
    id?: StringFilter<"Interaction"> | string
    businessId?: StringFilter<"Interaction"> | string
    conversationId?: StringFilter<"Interaction"> | string
    type?: EnumInteractionTypeFilter<"Interaction"> | $Enums.InteractionType
    direction?: StringNullableFilter<"Interaction"> | string | null
    body?: StringFilter<"Interaction"> | string
    metadata?: JsonNullableFilter<"Interaction">
    createdById?: StringNullableFilter<"Interaction"> | string | null
    createdAt?: DateTimeFilter<"Interaction"> | Date | string
  }

  export type UserUpsertWithoutBusinessesOwnedInput = {
    update: XOR<UserUpdateWithoutBusinessesOwnedInput, UserUncheckedUpdateWithoutBusinessesOwnedInput>
    create: XOR<UserCreateWithoutBusinessesOwnedInput, UserUncheckedCreateWithoutBusinessesOwnedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBusinessesOwnedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBusinessesOwnedInput, UserUncheckedUpdateWithoutBusinessesOwnedInput>
  }

  export type UserUpdateWithoutBusinessesOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutBusinessesOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type BusinessCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutUsersInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutUsersInput, BusinessUncheckedCreateWithoutUsersInput>
  }

  export type ConversationCreateWithoutOwnerInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutConversationsInput
    lead?: LeadCreateNestedOneWithoutConversationsInput
    customer?: CustomerCreateNestedOneWithoutConversationsInput
    agent?: AgentCreateNestedOneWithoutConversationsInput
    messages?: InteractionCreateNestedManyWithoutConversationInput
    tasks?: TaskCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutOwnerInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: InteractionUncheckedCreateNestedManyWithoutConversationInput
    tasks?: TaskUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutOwnerInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutOwnerInput, ConversationUncheckedCreateWithoutOwnerInput>
  }

  export type ConversationCreateManyOwnerInputEnvelope = {
    data: ConversationCreateManyOwnerInput | ConversationCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutOwnerInput = {
    id?: string
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
    customer?: CustomerCreateNestedOneWithoutTasksInput
    conversation?: ConversationCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutOwnerInput = {
    id?: string
    businessId: string
    leadId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutOwnerInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput>
  }

  export type TaskCreateManyOwnerInputEnvelope = {
    data: TaskCreateManyOwnerInput | TaskCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type AuditEventCreateWithoutActorInput = {
    id?: string
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutAuditsInput
  }

  export type AuditEventUncheckedCreateWithoutActorInput = {
    id?: string
    businessId: string
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditEventCreateOrConnectWithoutActorInput = {
    where: AuditEventWhereUniqueInput
    create: XOR<AuditEventCreateWithoutActorInput, AuditEventUncheckedCreateWithoutActorInput>
  }

  export type AuditEventCreateManyActorInputEnvelope = {
    data: AuditEventCreateManyActorInput | AuditEventCreateManyActorInput[]
    skipDuplicates?: boolean
  }

  export type LeadCreateWithoutOwnerInput = {
    id?: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutLeadsInput
    customer?: CustomerCreateNestedOneWithoutLeadInput
    conversations?: ConversationCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    attributions?: AttributionCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutOwnerInput = {
    id?: string
    businessId: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerUncheckedCreateNestedOneWithoutLeadInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutOwnerInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutOwnerInput, LeadUncheckedCreateWithoutOwnerInput>
  }

  export type LeadCreateManyOwnerInputEnvelope = {
    data: LeadCreateManyOwnerInput | LeadCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type CustomerCreateWithoutOwnerInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
    lead?: LeadCreateNestedOneWithoutCustomerInput
    conversations?: ConversationCreateNestedManyWithoutCustomerInput
    tasks?: TaskCreateNestedManyWithoutCustomerInput
    attributions?: AttributionCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutOwnerInput = {
    id?: string
    businessId: string
    leadId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutCustomerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutCustomerInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutOwnerInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutOwnerInput, CustomerUncheckedCreateWithoutOwnerInput>
  }

  export type CustomerCreateManyOwnerInputEnvelope = {
    data: CustomerCreateManyOwnerInput | CustomerCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type InteractionCreateWithoutCreatedByInput = {
    id?: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutInteractionsInput
    conversation: ConversationCreateNestedOneWithoutMessagesInput
  }

  export type InteractionUncheckedCreateWithoutCreatedByInput = {
    id?: string
    businessId: string
    conversationId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type InteractionCreateOrConnectWithoutCreatedByInput = {
    where: InteractionWhereUniqueInput
    create: XOR<InteractionCreateWithoutCreatedByInput, InteractionUncheckedCreateWithoutCreatedByInput>
  }

  export type InteractionCreateManyCreatedByInputEnvelope = {
    data: InteractionCreateManyCreatedByInput | InteractionCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type BusinessCreateWithoutOwnerInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutOwnerInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutOwnerInput, BusinessUncheckedCreateWithoutOwnerInput>
  }

  export type BusinessCreateManyOwnerInputEnvelope = {
    data: BusinessCreateManyOwnerInput | BusinessCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutUsersInput = {
    update: XOR<BusinessUpdateWithoutUsersInput, BusinessUncheckedUpdateWithoutUsersInput>
    create: XOR<BusinessCreateWithoutUsersInput, BusinessUncheckedCreateWithoutUsersInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutUsersInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutUsersInput, BusinessUncheckedUpdateWithoutUsersInput>
  }

  export type BusinessUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ConversationUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ConversationWhereUniqueInput
    update: XOR<ConversationUpdateWithoutOwnerInput, ConversationUncheckedUpdateWithoutOwnerInput>
    create: XOR<ConversationCreateWithoutOwnerInput, ConversationUncheckedCreateWithoutOwnerInput>
  }

  export type ConversationUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ConversationWhereUniqueInput
    data: XOR<ConversationUpdateWithoutOwnerInput, ConversationUncheckedUpdateWithoutOwnerInput>
  }

  export type ConversationUpdateManyWithWhereWithoutOwnerInput = {
    where: ConversationScalarWhereInput
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyWithoutOwnerInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutOwnerInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutOwnerInput, TaskUncheckedUpdateWithoutOwnerInput>
    create: XOR<TaskCreateWithoutOwnerInput, TaskUncheckedCreateWithoutOwnerInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutOwnerInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutOwnerInput, TaskUncheckedUpdateWithoutOwnerInput>
  }

  export type TaskUpdateManyWithWhereWithoutOwnerInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutOwnerInput>
  }

  export type AuditEventUpsertWithWhereUniqueWithoutActorInput = {
    where: AuditEventWhereUniqueInput
    update: XOR<AuditEventUpdateWithoutActorInput, AuditEventUncheckedUpdateWithoutActorInput>
    create: XOR<AuditEventCreateWithoutActorInput, AuditEventUncheckedCreateWithoutActorInput>
  }

  export type AuditEventUpdateWithWhereUniqueWithoutActorInput = {
    where: AuditEventWhereUniqueInput
    data: XOR<AuditEventUpdateWithoutActorInput, AuditEventUncheckedUpdateWithoutActorInput>
  }

  export type AuditEventUpdateManyWithWhereWithoutActorInput = {
    where: AuditEventScalarWhereInput
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyWithoutActorInput>
  }

  export type LeadUpsertWithWhereUniqueWithoutOwnerInput = {
    where: LeadWhereUniqueInput
    update: XOR<LeadUpdateWithoutOwnerInput, LeadUncheckedUpdateWithoutOwnerInput>
    create: XOR<LeadCreateWithoutOwnerInput, LeadUncheckedCreateWithoutOwnerInput>
  }

  export type LeadUpdateWithWhereUniqueWithoutOwnerInput = {
    where: LeadWhereUniqueInput
    data: XOR<LeadUpdateWithoutOwnerInput, LeadUncheckedUpdateWithoutOwnerInput>
  }

  export type LeadUpdateManyWithWhereWithoutOwnerInput = {
    where: LeadScalarWhereInput
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyWithoutOwnerInput>
  }

  export type CustomerUpsertWithWhereUniqueWithoutOwnerInput = {
    where: CustomerWhereUniqueInput
    update: XOR<CustomerUpdateWithoutOwnerInput, CustomerUncheckedUpdateWithoutOwnerInput>
    create: XOR<CustomerCreateWithoutOwnerInput, CustomerUncheckedCreateWithoutOwnerInput>
  }

  export type CustomerUpdateWithWhereUniqueWithoutOwnerInput = {
    where: CustomerWhereUniqueInput
    data: XOR<CustomerUpdateWithoutOwnerInput, CustomerUncheckedUpdateWithoutOwnerInput>
  }

  export type CustomerUpdateManyWithWhereWithoutOwnerInput = {
    where: CustomerScalarWhereInput
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyWithoutOwnerInput>
  }

  export type InteractionUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: InteractionWhereUniqueInput
    update: XOR<InteractionUpdateWithoutCreatedByInput, InteractionUncheckedUpdateWithoutCreatedByInput>
    create: XOR<InteractionCreateWithoutCreatedByInput, InteractionUncheckedCreateWithoutCreatedByInput>
  }

  export type InteractionUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: InteractionWhereUniqueInput
    data: XOR<InteractionUpdateWithoutCreatedByInput, InteractionUncheckedUpdateWithoutCreatedByInput>
  }

  export type InteractionUpdateManyWithWhereWithoutCreatedByInput = {
    where: InteractionScalarWhereInput
    data: XOR<InteractionUpdateManyMutationInput, InteractionUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type BusinessUpsertWithWhereUniqueWithoutOwnerInput = {
    where: BusinessWhereUniqueInput
    update: XOR<BusinessUpdateWithoutOwnerInput, BusinessUncheckedUpdateWithoutOwnerInput>
    create: XOR<BusinessCreateWithoutOwnerInput, BusinessUncheckedCreateWithoutOwnerInput>
  }

  export type BusinessUpdateWithWhereUniqueWithoutOwnerInput = {
    where: BusinessWhereUniqueInput
    data: XOR<BusinessUpdateWithoutOwnerInput, BusinessUncheckedUpdateWithoutOwnerInput>
  }

  export type BusinessUpdateManyWithWhereWithoutOwnerInput = {
    where: BusinessScalarWhereInput
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyWithoutOwnerInput>
  }

  export type BusinessScalarWhereInput = {
    AND?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
    OR?: BusinessScalarWhereInput[]
    NOT?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
    id?: StringFilter<"Business"> | string
    name?: StringFilter<"Business"> | string
    slug?: StringFilter<"Business"> | string
    status?: StringFilter<"Business"> | string
    ownerUserId?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    settings?: JsonNullableFilter<"Business">
  }

  export type BusinessCreateWithoutAgentsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutAgentsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutAgentsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutAgentsInput, BusinessUncheckedCreateWithoutAgentsInput>
  }

  export type AttributionCreateWithoutAgentInput = {
    id?: string
    method: $Enums.AttributionMethod
    notes?: string | null
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutAttributionsInput
    lead?: LeadCreateNestedOneWithoutAttributionsInput
    customer?: CustomerCreateNestedOneWithoutAttributionsInput
  }

  export type AttributionUncheckedCreateWithoutAgentInput = {
    id?: string
    businessId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type AttributionCreateOrConnectWithoutAgentInput = {
    where: AttributionWhereUniqueInput
    create: XOR<AttributionCreateWithoutAgentInput, AttributionUncheckedCreateWithoutAgentInput>
  }

  export type AttributionCreateManyAgentInputEnvelope = {
    data: AttributionCreateManyAgentInput | AttributionCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type ConversationCreateWithoutAgentInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutConversationsInput
    owner?: UserCreateNestedOneWithoutConversationsInput
    lead?: LeadCreateNestedOneWithoutConversationsInput
    customer?: CustomerCreateNestedOneWithoutConversationsInput
    messages?: InteractionCreateNestedManyWithoutConversationInput
    tasks?: TaskCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutAgentInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: InteractionUncheckedCreateNestedManyWithoutConversationInput
    tasks?: TaskUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutAgentInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutAgentInput, ConversationUncheckedCreateWithoutAgentInput>
  }

  export type ConversationCreateManyAgentInputEnvelope = {
    data: ConversationCreateManyAgentInput | ConversationCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutAgentsInput = {
    update: XOR<BusinessUpdateWithoutAgentsInput, BusinessUncheckedUpdateWithoutAgentsInput>
    create: XOR<BusinessCreateWithoutAgentsInput, BusinessUncheckedCreateWithoutAgentsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutAgentsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutAgentsInput, BusinessUncheckedUpdateWithoutAgentsInput>
  }

  export type BusinessUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutAgentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type AttributionUpsertWithWhereUniqueWithoutAgentInput = {
    where: AttributionWhereUniqueInput
    update: XOR<AttributionUpdateWithoutAgentInput, AttributionUncheckedUpdateWithoutAgentInput>
    create: XOR<AttributionCreateWithoutAgentInput, AttributionUncheckedCreateWithoutAgentInput>
  }

  export type AttributionUpdateWithWhereUniqueWithoutAgentInput = {
    where: AttributionWhereUniqueInput
    data: XOR<AttributionUpdateWithoutAgentInput, AttributionUncheckedUpdateWithoutAgentInput>
  }

  export type AttributionUpdateManyWithWhereWithoutAgentInput = {
    where: AttributionScalarWhereInput
    data: XOR<AttributionUpdateManyMutationInput, AttributionUncheckedUpdateManyWithoutAgentInput>
  }

  export type ConversationUpsertWithWhereUniqueWithoutAgentInput = {
    where: ConversationWhereUniqueInput
    update: XOR<ConversationUpdateWithoutAgentInput, ConversationUncheckedUpdateWithoutAgentInput>
    create: XOR<ConversationCreateWithoutAgentInput, ConversationUncheckedCreateWithoutAgentInput>
  }

  export type ConversationUpdateWithWhereUniqueWithoutAgentInput = {
    where: ConversationWhereUniqueInput
    data: XOR<ConversationUpdateWithoutAgentInput, ConversationUncheckedUpdateWithoutAgentInput>
  }

  export type ConversationUpdateManyWithWhereWithoutAgentInput = {
    where: ConversationScalarWhereInput
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyWithoutAgentInput>
  }

  export type BusinessCreateWithoutLeadsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutLeadsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutLeadsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutLeadsInput, BusinessUncheckedCreateWithoutLeadsInput>
  }

  export type UserCreateWithoutLeadsOwnedInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutLeadsOwnedInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutLeadsOwnedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLeadsOwnedInput, UserUncheckedCreateWithoutLeadsOwnedInput>
  }

  export type CustomerCreateWithoutLeadInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
    owner?: UserCreateNestedOneWithoutCustomersOwnedInput
    conversations?: ConversationCreateNestedManyWithoutCustomerInput
    tasks?: TaskCreateNestedManyWithoutCustomerInput
    attributions?: AttributionCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutLeadInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutCustomerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutCustomerInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutLeadInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutLeadInput, CustomerUncheckedCreateWithoutLeadInput>
  }

  export type ConversationCreateWithoutLeadInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutConversationsInput
    owner?: UserCreateNestedOneWithoutConversationsInput
    customer?: CustomerCreateNestedOneWithoutConversationsInput
    agent?: AgentCreateNestedOneWithoutConversationsInput
    messages?: InteractionCreateNestedManyWithoutConversationInput
    tasks?: TaskCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutLeadInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: InteractionUncheckedCreateNestedManyWithoutConversationInput
    tasks?: TaskUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutLeadInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutLeadInput, ConversationUncheckedCreateWithoutLeadInput>
  }

  export type ConversationCreateManyLeadInputEnvelope = {
    data: ConversationCreateManyLeadInput | ConversationCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutLeadInput = {
    id?: string
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutTasksInput
    owner?: UserCreateNestedOneWithoutTasksInput
    customer?: CustomerCreateNestedOneWithoutTasksInput
    conversation?: ConversationCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutLeadInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutLeadInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput>
  }

  export type TaskCreateManyLeadInputEnvelope = {
    data: TaskCreateManyLeadInput | TaskCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type AttributionCreateWithoutLeadInput = {
    id?: string
    method: $Enums.AttributionMethod
    notes?: string | null
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutAttributionsInput
    agent: AgentCreateNestedOneWithoutAttributionsInput
    customer?: CustomerCreateNestedOneWithoutAttributionsInput
  }

  export type AttributionUncheckedCreateWithoutLeadInput = {
    id?: string
    businessId: string
    agentId: string
    method: $Enums.AttributionMethod
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type AttributionCreateOrConnectWithoutLeadInput = {
    where: AttributionWhereUniqueInput
    create: XOR<AttributionCreateWithoutLeadInput, AttributionUncheckedCreateWithoutLeadInput>
  }

  export type AttributionCreateManyLeadInputEnvelope = {
    data: AttributionCreateManyLeadInput | AttributionCreateManyLeadInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutLeadsInput = {
    update: XOR<BusinessUpdateWithoutLeadsInput, BusinessUncheckedUpdateWithoutLeadsInput>
    create: XOR<BusinessCreateWithoutLeadsInput, BusinessUncheckedCreateWithoutLeadsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutLeadsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutLeadsInput, BusinessUncheckedUpdateWithoutLeadsInput>
  }

  export type BusinessUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutLeadsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type UserUpsertWithoutLeadsOwnedInput = {
    update: XOR<UserUpdateWithoutLeadsOwnedInput, UserUncheckedUpdateWithoutLeadsOwnedInput>
    create: XOR<UserCreateWithoutLeadsOwnedInput, UserUncheckedCreateWithoutLeadsOwnedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLeadsOwnedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLeadsOwnedInput, UserUncheckedUpdateWithoutLeadsOwnedInput>
  }

  export type UserUpdateWithoutLeadsOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutLeadsOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type CustomerUpsertWithoutLeadInput = {
    update: XOR<CustomerUpdateWithoutLeadInput, CustomerUncheckedUpdateWithoutLeadInput>
    create: XOR<CustomerCreateWithoutLeadInput, CustomerUncheckedCreateWithoutLeadInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutLeadInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutLeadInput, CustomerUncheckedUpdateWithoutLeadInput>
  }

  export type CustomerUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
    owner?: UserUpdateOneWithoutCustomersOwnedNestedInput
    conversations?: ConversationUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type ConversationUpsertWithWhereUniqueWithoutLeadInput = {
    where: ConversationWhereUniqueInput
    update: XOR<ConversationUpdateWithoutLeadInput, ConversationUncheckedUpdateWithoutLeadInput>
    create: XOR<ConversationCreateWithoutLeadInput, ConversationUncheckedCreateWithoutLeadInput>
  }

  export type ConversationUpdateWithWhereUniqueWithoutLeadInput = {
    where: ConversationWhereUniqueInput
    data: XOR<ConversationUpdateWithoutLeadInput, ConversationUncheckedUpdateWithoutLeadInput>
  }

  export type ConversationUpdateManyWithWhereWithoutLeadInput = {
    where: ConversationScalarWhereInput
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyWithoutLeadInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutLeadInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutLeadInput, TaskUncheckedUpdateWithoutLeadInput>
    create: XOR<TaskCreateWithoutLeadInput, TaskUncheckedCreateWithoutLeadInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutLeadInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutLeadInput, TaskUncheckedUpdateWithoutLeadInput>
  }

  export type TaskUpdateManyWithWhereWithoutLeadInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutLeadInput>
  }

  export type AttributionUpsertWithWhereUniqueWithoutLeadInput = {
    where: AttributionWhereUniqueInput
    update: XOR<AttributionUpdateWithoutLeadInput, AttributionUncheckedUpdateWithoutLeadInput>
    create: XOR<AttributionCreateWithoutLeadInput, AttributionUncheckedCreateWithoutLeadInput>
  }

  export type AttributionUpdateWithWhereUniqueWithoutLeadInput = {
    where: AttributionWhereUniqueInput
    data: XOR<AttributionUpdateWithoutLeadInput, AttributionUncheckedUpdateWithoutLeadInput>
  }

  export type AttributionUpdateManyWithWhereWithoutLeadInput = {
    where: AttributionScalarWhereInput
    data: XOR<AttributionUpdateManyMutationInput, AttributionUncheckedUpdateManyWithoutLeadInput>
  }

  export type BusinessCreateWithoutCustomersInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutCustomersInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutCustomersInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
  }

  export type LeadCreateWithoutCustomerInput = {
    id?: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutLeadsInput
    owner?: UserCreateNestedOneWithoutLeadsOwnedInput
    conversations?: ConversationCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    attributions?: AttributionCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutCustomerInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutCustomerInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutCustomerInput, LeadUncheckedCreateWithoutCustomerInput>
  }

  export type UserCreateWithoutCustomersOwnedInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutCustomersOwnedInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutCustomersOwnedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCustomersOwnedInput, UserUncheckedCreateWithoutCustomersOwnedInput>
  }

  export type ConversationCreateWithoutCustomerInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutConversationsInput
    owner?: UserCreateNestedOneWithoutConversationsInput
    lead?: LeadCreateNestedOneWithoutConversationsInput
    agent?: AgentCreateNestedOneWithoutConversationsInput
    messages?: InteractionCreateNestedManyWithoutConversationInput
    tasks?: TaskCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutCustomerInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: InteractionUncheckedCreateNestedManyWithoutConversationInput
    tasks?: TaskUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutCustomerInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutCustomerInput, ConversationUncheckedCreateWithoutCustomerInput>
  }

  export type ConversationCreateManyCustomerInputEnvelope = {
    data: ConversationCreateManyCustomerInput | ConversationCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutCustomerInput = {
    id?: string
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutTasksInput
    owner?: UserCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
    conversation?: ConversationCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutCustomerInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    leadId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutCustomerInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutCustomerInput, TaskUncheckedCreateWithoutCustomerInput>
  }

  export type TaskCreateManyCustomerInputEnvelope = {
    data: TaskCreateManyCustomerInput | TaskCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type AttributionCreateWithoutCustomerInput = {
    id?: string
    method: $Enums.AttributionMethod
    notes?: string | null
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutAttributionsInput
    agent: AgentCreateNestedOneWithoutAttributionsInput
    lead?: LeadCreateNestedOneWithoutAttributionsInput
  }

  export type AttributionUncheckedCreateWithoutCustomerInput = {
    id?: string
    businessId: string
    agentId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type AttributionCreateOrConnectWithoutCustomerInput = {
    where: AttributionWhereUniqueInput
    create: XOR<AttributionCreateWithoutCustomerInput, AttributionUncheckedCreateWithoutCustomerInput>
  }

  export type AttributionCreateManyCustomerInputEnvelope = {
    data: AttributionCreateManyCustomerInput | AttributionCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutCustomersInput = {
    update: XOR<BusinessUpdateWithoutCustomersInput, BusinessUncheckedUpdateWithoutCustomersInput>
    create: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutCustomersInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutCustomersInput, BusinessUncheckedUpdateWithoutCustomersInput>
  }

  export type BusinessUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type LeadUpsertWithoutCustomerInput = {
    update: XOR<LeadUpdateWithoutCustomerInput, LeadUncheckedUpdateWithoutCustomerInput>
    create: XOR<LeadCreateWithoutCustomerInput, LeadUncheckedCreateWithoutCustomerInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutCustomerInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutCustomerInput, LeadUncheckedUpdateWithoutCustomerInput>
  }

  export type LeadUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutLeadsNestedInput
    owner?: UserUpdateOneWithoutLeadsOwnedNestedInput
    conversations?: ConversationUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type UserUpsertWithoutCustomersOwnedInput = {
    update: XOR<UserUpdateWithoutCustomersOwnedInput, UserUncheckedUpdateWithoutCustomersOwnedInput>
    create: XOR<UserCreateWithoutCustomersOwnedInput, UserUncheckedCreateWithoutCustomersOwnedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCustomersOwnedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCustomersOwnedInput, UserUncheckedUpdateWithoutCustomersOwnedInput>
  }

  export type UserUpdateWithoutCustomersOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutCustomersOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type ConversationUpsertWithWhereUniqueWithoutCustomerInput = {
    where: ConversationWhereUniqueInput
    update: XOR<ConversationUpdateWithoutCustomerInput, ConversationUncheckedUpdateWithoutCustomerInput>
    create: XOR<ConversationCreateWithoutCustomerInput, ConversationUncheckedCreateWithoutCustomerInput>
  }

  export type ConversationUpdateWithWhereUniqueWithoutCustomerInput = {
    where: ConversationWhereUniqueInput
    data: XOR<ConversationUpdateWithoutCustomerInput, ConversationUncheckedUpdateWithoutCustomerInput>
  }

  export type ConversationUpdateManyWithWhereWithoutCustomerInput = {
    where: ConversationScalarWhereInput
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyWithoutCustomerInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutCustomerInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutCustomerInput, TaskUncheckedUpdateWithoutCustomerInput>
    create: XOR<TaskCreateWithoutCustomerInput, TaskUncheckedCreateWithoutCustomerInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutCustomerInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutCustomerInput, TaskUncheckedUpdateWithoutCustomerInput>
  }

  export type TaskUpdateManyWithWhereWithoutCustomerInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutCustomerInput>
  }

  export type AttributionUpsertWithWhereUniqueWithoutCustomerInput = {
    where: AttributionWhereUniqueInput
    update: XOR<AttributionUpdateWithoutCustomerInput, AttributionUncheckedUpdateWithoutCustomerInput>
    create: XOR<AttributionCreateWithoutCustomerInput, AttributionUncheckedCreateWithoutCustomerInput>
  }

  export type AttributionUpdateWithWhereUniqueWithoutCustomerInput = {
    where: AttributionWhereUniqueInput
    data: XOR<AttributionUpdateWithoutCustomerInput, AttributionUncheckedUpdateWithoutCustomerInput>
  }

  export type AttributionUpdateManyWithWhereWithoutCustomerInput = {
    where: AttributionScalarWhereInput
    data: XOR<AttributionUpdateManyMutationInput, AttributionUncheckedUpdateManyWithoutCustomerInput>
  }

  export type BusinessCreateWithoutConversationsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutConversationsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutConversationsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutConversationsInput, BusinessUncheckedCreateWithoutConversationsInput>
  }

  export type UserCreateWithoutConversationsInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutConversationsInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutConversationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
  }

  export type LeadCreateWithoutConversationsInput = {
    id?: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutLeadsInput
    owner?: UserCreateNestedOneWithoutLeadsOwnedInput
    customer?: CustomerCreateNestedOneWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
    attributions?: AttributionCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutConversationsInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerUncheckedCreateNestedOneWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutConversationsInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutConversationsInput, LeadUncheckedCreateWithoutConversationsInput>
  }

  export type CustomerCreateWithoutConversationsInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
    lead?: LeadCreateNestedOneWithoutCustomerInput
    owner?: UserCreateNestedOneWithoutCustomersOwnedInput
    tasks?: TaskCreateNestedManyWithoutCustomerInput
    attributions?: AttributionCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutConversationsInput = {
    id?: string
    businessId: string
    leadId?: string | null
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutCustomerInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutConversationsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutConversationsInput, CustomerUncheckedCreateWithoutConversationsInput>
  }

  export type AgentCreateWithoutConversationsInput = {
    id?: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAgentsInput
    attributions?: AttributionCreateNestedManyWithoutAgentInput
  }

  export type AgentUncheckedCreateWithoutConversationsInput = {
    id?: string
    businessId: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributions?: AttributionUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentCreateOrConnectWithoutConversationsInput = {
    where: AgentWhereUniqueInput
    create: XOR<AgentCreateWithoutConversationsInput, AgentUncheckedCreateWithoutConversationsInput>
  }

  export type InteractionCreateWithoutConversationInput = {
    id?: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    business: BusinessCreateNestedOneWithoutInteractionsInput
    createdBy?: UserCreateNestedOneWithoutInteractionsAuthoredInput
  }

  export type InteractionUncheckedCreateWithoutConversationInput = {
    id?: string
    businessId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
  }

  export type InteractionCreateOrConnectWithoutConversationInput = {
    where: InteractionWhereUniqueInput
    create: XOR<InteractionCreateWithoutConversationInput, InteractionUncheckedCreateWithoutConversationInput>
  }

  export type InteractionCreateManyConversationInputEnvelope = {
    data: InteractionCreateManyConversationInput | InteractionCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutConversationInput = {
    id?: string
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutTasksInput
    owner?: UserCreateNestedOneWithoutTasksInput
    lead?: LeadCreateNestedOneWithoutTasksInput
    customer?: CustomerCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutConversationInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateOrConnectWithoutConversationInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutConversationInput, TaskUncheckedCreateWithoutConversationInput>
  }

  export type TaskCreateManyConversationInputEnvelope = {
    data: TaskCreateManyConversationInput | TaskCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutConversationsInput = {
    update: XOR<BusinessUpdateWithoutConversationsInput, BusinessUncheckedUpdateWithoutConversationsInput>
    create: XOR<BusinessCreateWithoutConversationsInput, BusinessUncheckedCreateWithoutConversationsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutConversationsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutConversationsInput, BusinessUncheckedUpdateWithoutConversationsInput>
  }

  export type BusinessUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type UserUpsertWithoutConversationsInput = {
    update: XOR<UserUpdateWithoutConversationsInput, UserUncheckedUpdateWithoutConversationsInput>
    create: XOR<UserCreateWithoutConversationsInput, UserUncheckedCreateWithoutConversationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutConversationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutConversationsInput, UserUncheckedUpdateWithoutConversationsInput>
  }

  export type UserUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type LeadUpsertWithoutConversationsInput = {
    update: XOR<LeadUpdateWithoutConversationsInput, LeadUncheckedUpdateWithoutConversationsInput>
    create: XOR<LeadCreateWithoutConversationsInput, LeadUncheckedCreateWithoutConversationsInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutConversationsInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutConversationsInput, LeadUncheckedUpdateWithoutConversationsInput>
  }

  export type LeadUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutLeadsNestedInput
    owner?: UserUpdateOneWithoutLeadsOwnedNestedInput
    customer?: CustomerUpdateOneWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUncheckedUpdateOneWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type CustomerUpsertWithoutConversationsInput = {
    update: XOR<CustomerUpdateWithoutConversationsInput, CustomerUncheckedUpdateWithoutConversationsInput>
    create: XOR<CustomerCreateWithoutConversationsInput, CustomerUncheckedCreateWithoutConversationsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutConversationsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutConversationsInput, CustomerUncheckedUpdateWithoutConversationsInput>
  }

  export type CustomerUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
    lead?: LeadUpdateOneWithoutCustomerNestedInput
    owner?: UserUpdateOneWithoutCustomersOwnedNestedInput
    tasks?: TaskUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type AgentUpsertWithoutConversationsInput = {
    update: XOR<AgentUpdateWithoutConversationsInput, AgentUncheckedUpdateWithoutConversationsInput>
    create: XOR<AgentCreateWithoutConversationsInput, AgentUncheckedCreateWithoutConversationsInput>
    where?: AgentWhereInput
  }

  export type AgentUpdateToOneWithWhereWithoutConversationsInput = {
    where?: AgentWhereInput
    data: XOR<AgentUpdateWithoutConversationsInput, AgentUncheckedUpdateWithoutConversationsInput>
  }

  export type AgentUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAgentsNestedInput
    attributions?: AttributionUpdateManyWithoutAgentNestedInput
  }

  export type AgentUncheckedUpdateWithoutConversationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributions?: AttributionUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type InteractionUpsertWithWhereUniqueWithoutConversationInput = {
    where: InteractionWhereUniqueInput
    update: XOR<InteractionUpdateWithoutConversationInput, InteractionUncheckedUpdateWithoutConversationInput>
    create: XOR<InteractionCreateWithoutConversationInput, InteractionUncheckedCreateWithoutConversationInput>
  }

  export type InteractionUpdateWithWhereUniqueWithoutConversationInput = {
    where: InteractionWhereUniqueInput
    data: XOR<InteractionUpdateWithoutConversationInput, InteractionUncheckedUpdateWithoutConversationInput>
  }

  export type InteractionUpdateManyWithWhereWithoutConversationInput = {
    where: InteractionScalarWhereInput
    data: XOR<InteractionUpdateManyMutationInput, InteractionUncheckedUpdateManyWithoutConversationInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutConversationInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutConversationInput, TaskUncheckedUpdateWithoutConversationInput>
    create: XOR<TaskCreateWithoutConversationInput, TaskUncheckedCreateWithoutConversationInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutConversationInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutConversationInput, TaskUncheckedUpdateWithoutConversationInput>
  }

  export type TaskUpdateManyWithWhereWithoutConversationInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutConversationInput>
  }

  export type BusinessCreateWithoutInteractionsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutInteractionsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutInteractionsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutInteractionsInput, BusinessUncheckedCreateWithoutInteractionsInput>
  }

  export type ConversationCreateWithoutMessagesInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutConversationsInput
    owner?: UserCreateNestedOneWithoutConversationsInput
    lead?: LeadCreateNestedOneWithoutConversationsInput
    customer?: CustomerCreateNestedOneWithoutConversationsInput
    agent?: AgentCreateNestedOneWithoutConversationsInput
    tasks?: TaskCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutMessagesInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
  }

  export type UserCreateWithoutInteractionsAuthoredInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutInteractionsAuthoredInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutInteractionsAuthoredInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutInteractionsAuthoredInput, UserUncheckedCreateWithoutInteractionsAuthoredInput>
  }

  export type BusinessUpsertWithoutInteractionsInput = {
    update: XOR<BusinessUpdateWithoutInteractionsInput, BusinessUncheckedUpdateWithoutInteractionsInput>
    create: XOR<BusinessCreateWithoutInteractionsInput, BusinessUncheckedCreateWithoutInteractionsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutInteractionsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutInteractionsInput, BusinessUncheckedUpdateWithoutInteractionsInput>
  }

  export type BusinessUpdateWithoutInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ConversationUpsertWithoutMessagesInput = {
    update: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ConversationCreateWithoutMessagesInput, ConversationUncheckedCreateWithoutMessagesInput>
    where?: ConversationWhereInput
  }

  export type ConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ConversationWhereInput
    data: XOR<ConversationUpdateWithoutMessagesInput, ConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutConversationsNestedInput
    owner?: UserUpdateOneWithoutConversationsNestedInput
    lead?: LeadUpdateOneWithoutConversationsNestedInput
    customer?: CustomerUpdateOneWithoutConversationsNestedInput
    agent?: AgentUpdateOneWithoutConversationsNestedInput
    tasks?: TaskUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type UserUpsertWithoutInteractionsAuthoredInput = {
    update: XOR<UserUpdateWithoutInteractionsAuthoredInput, UserUncheckedUpdateWithoutInteractionsAuthoredInput>
    create: XOR<UserCreateWithoutInteractionsAuthoredInput, UserUncheckedCreateWithoutInteractionsAuthoredInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutInteractionsAuthoredInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutInteractionsAuthoredInput, UserUncheckedUpdateWithoutInteractionsAuthoredInput>
  }

  export type UserUpdateWithoutInteractionsAuthoredInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutInteractionsAuthoredInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type BusinessCreateWithoutTasksInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutTasksInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutTasksInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutTasksInput, BusinessUncheckedCreateWithoutTasksInput>
  }

  export type UserCreateWithoutTasksInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventCreateNestedManyWithoutActorInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutTasksInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutActorInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
  }

  export type LeadCreateWithoutTasksInput = {
    id?: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutLeadsInput
    owner?: UserCreateNestedOneWithoutLeadsOwnedInput
    customer?: CustomerCreateNestedOneWithoutLeadInput
    conversations?: ConversationCreateNestedManyWithoutLeadInput
    attributions?: AttributionCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutTasksInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerUncheckedCreateNestedOneWithoutLeadInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutLeadInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutTasksInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
  }

  export type CustomerCreateWithoutTasksInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
    lead?: LeadCreateNestedOneWithoutCustomerInput
    owner?: UserCreateNestedOneWithoutCustomersOwnedInput
    conversations?: ConversationCreateNestedManyWithoutCustomerInput
    attributions?: AttributionCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutTasksInput = {
    id?: string
    businessId: string
    leadId?: string | null
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutCustomerInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutTasksInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutTasksInput, CustomerUncheckedCreateWithoutTasksInput>
  }

  export type ConversationCreateWithoutTasksInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutConversationsInput
    owner?: UserCreateNestedOneWithoutConversationsInput
    lead?: LeadCreateNestedOneWithoutConversationsInput
    customer?: CustomerCreateNestedOneWithoutConversationsInput
    agent?: AgentCreateNestedOneWithoutConversationsInput
    messages?: InteractionCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateWithoutTasksInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: InteractionUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationCreateOrConnectWithoutTasksInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutTasksInput, ConversationUncheckedCreateWithoutTasksInput>
  }

  export type BusinessUpsertWithoutTasksInput = {
    update: XOR<BusinessUpdateWithoutTasksInput, BusinessUncheckedUpdateWithoutTasksInput>
    create: XOR<BusinessCreateWithoutTasksInput, BusinessUncheckedCreateWithoutTasksInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutTasksInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutTasksInput, BusinessUncheckedUpdateWithoutTasksInput>
  }

  export type BusinessUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type UserUpsertWithoutTasksInput = {
    update: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type LeadUpsertWithoutTasksInput = {
    update: XOR<LeadUpdateWithoutTasksInput, LeadUncheckedUpdateWithoutTasksInput>
    create: XOR<LeadCreateWithoutTasksInput, LeadUncheckedCreateWithoutTasksInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutTasksInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutTasksInput, LeadUncheckedUpdateWithoutTasksInput>
  }

  export type LeadUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutLeadsNestedInput
    owner?: UserUpdateOneWithoutLeadsOwnedNestedInput
    customer?: CustomerUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUncheckedUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type CustomerUpsertWithoutTasksInput = {
    update: XOR<CustomerUpdateWithoutTasksInput, CustomerUncheckedUpdateWithoutTasksInput>
    create: XOR<CustomerCreateWithoutTasksInput, CustomerUncheckedCreateWithoutTasksInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutTasksInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutTasksInput, CustomerUncheckedUpdateWithoutTasksInput>
  }

  export type CustomerUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
    lead?: LeadUpdateOneWithoutCustomerNestedInput
    owner?: UserUpdateOneWithoutCustomersOwnedNestedInput
    conversations?: ConversationUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type ConversationUpsertWithoutTasksInput = {
    update: XOR<ConversationUpdateWithoutTasksInput, ConversationUncheckedUpdateWithoutTasksInput>
    create: XOR<ConversationCreateWithoutTasksInput, ConversationUncheckedCreateWithoutTasksInput>
    where?: ConversationWhereInput
  }

  export type ConversationUpdateToOneWithWhereWithoutTasksInput = {
    where?: ConversationWhereInput
    data: XOR<ConversationUpdateWithoutTasksInput, ConversationUncheckedUpdateWithoutTasksInput>
  }

  export type ConversationUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutConversationsNestedInput
    owner?: UserUpdateOneWithoutConversationsNestedInput
    lead?: LeadUpdateOneWithoutConversationsNestedInput
    customer?: CustomerUpdateOneWithoutConversationsNestedInput
    agent?: AgentUpdateOneWithoutConversationsNestedInput
    messages?: InteractionUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: InteractionUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type BusinessCreateWithoutAttributionsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    audits?: AuditEventCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutAttributionsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutAttributionsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutAttributionsInput, BusinessUncheckedCreateWithoutAttributionsInput>
  }

  export type AgentCreateWithoutAttributionsInput = {
    id?: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAgentsInput
    conversations?: ConversationCreateNestedManyWithoutAgentInput
  }

  export type AgentUncheckedCreateWithoutAttributionsInput = {
    id?: string
    businessId: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutAgentInput
  }

  export type AgentCreateOrConnectWithoutAttributionsInput = {
    where: AgentWhereUniqueInput
    create: XOR<AgentCreateWithoutAttributionsInput, AgentUncheckedCreateWithoutAttributionsInput>
  }

  export type LeadCreateWithoutAttributionsInput = {
    id?: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutLeadsInput
    owner?: UserCreateNestedOneWithoutLeadsOwnedInput
    customer?: CustomerCreateNestedOneWithoutLeadInput
    conversations?: ConversationCreateNestedManyWithoutLeadInput
    tasks?: TaskCreateNestedManyWithoutLeadInput
  }

  export type LeadUncheckedCreateWithoutAttributionsInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    customer?: CustomerUncheckedCreateNestedOneWithoutLeadInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutLeadInput
    tasks?: TaskUncheckedCreateNestedManyWithoutLeadInput
  }

  export type LeadCreateOrConnectWithoutAttributionsInput = {
    where: LeadWhereUniqueInput
    create: XOR<LeadCreateWithoutAttributionsInput, LeadUncheckedCreateWithoutAttributionsInput>
  }

  export type CustomerCreateWithoutAttributionsInput = {
    id?: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCustomersInput
    lead?: LeadCreateNestedOneWithoutCustomerInput
    owner?: UserCreateNestedOneWithoutCustomersOwnedInput
    conversations?: ConversationCreateNestedManyWithoutCustomerInput
    tasks?: TaskCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutAttributionsInput = {
    id?: string
    businessId: string
    leadId?: string | null
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    conversations?: ConversationUncheckedCreateNestedManyWithoutCustomerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutAttributionsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutAttributionsInput, CustomerUncheckedCreateWithoutAttributionsInput>
  }

  export type BusinessUpsertWithoutAttributionsInput = {
    update: XOR<BusinessUpdateWithoutAttributionsInput, BusinessUncheckedUpdateWithoutAttributionsInput>
    create: XOR<BusinessCreateWithoutAttributionsInput, BusinessUncheckedCreateWithoutAttributionsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutAttributionsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutAttributionsInput, BusinessUncheckedUpdateWithoutAttributionsInput>
  }

  export type BusinessUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type AgentUpsertWithoutAttributionsInput = {
    update: XOR<AgentUpdateWithoutAttributionsInput, AgentUncheckedUpdateWithoutAttributionsInput>
    create: XOR<AgentCreateWithoutAttributionsInput, AgentUncheckedCreateWithoutAttributionsInput>
    where?: AgentWhereInput
  }

  export type AgentUpdateToOneWithWhereWithoutAttributionsInput = {
    where?: AgentWhereInput
    data: XOR<AgentUpdateWithoutAttributionsInput, AgentUncheckedUpdateWithoutAttributionsInput>
  }

  export type AgentUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAgentsNestedInput
    conversations?: ConversationUpdateManyWithoutAgentNestedInput
  }

  export type AgentUncheckedUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type LeadUpsertWithoutAttributionsInput = {
    update: XOR<LeadUpdateWithoutAttributionsInput, LeadUncheckedUpdateWithoutAttributionsInput>
    create: XOR<LeadCreateWithoutAttributionsInput, LeadUncheckedCreateWithoutAttributionsInput>
    where?: LeadWhereInput
  }

  export type LeadUpdateToOneWithWhereWithoutAttributionsInput = {
    where?: LeadWhereInput
    data: XOR<LeadUpdateWithoutAttributionsInput, LeadUncheckedUpdateWithoutAttributionsInput>
  }

  export type LeadUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutLeadsNestedInput
    owner?: UserUpdateOneWithoutLeadsOwnedNestedInput
    customer?: CustomerUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUncheckedUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type CustomerUpsertWithoutAttributionsInput = {
    update: XOR<CustomerUpdateWithoutAttributionsInput, CustomerUncheckedUpdateWithoutAttributionsInput>
    create: XOR<CustomerCreateWithoutAttributionsInput, CustomerUncheckedCreateWithoutAttributionsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutAttributionsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutAttributionsInput, CustomerUncheckedUpdateWithoutAttributionsInput>
  }

  export type CustomerUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
    lead?: LeadUpdateOneWithoutCustomerNestedInput
    owner?: UserUpdateOneWithoutCustomersOwnedNestedInput
    conversations?: ConversationUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutAttributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type BusinessCreateWithoutAuditsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutBusinessInput
    agents?: AgentCreateNestedManyWithoutBusinessInput
    leads?: LeadCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    conversations?: ConversationCreateNestedManyWithoutBusinessInput
    tasks?: TaskCreateNestedManyWithoutBusinessInput
    attributions?: AttributionCreateNestedManyWithoutBusinessInput
    interactions?: InteractionCreateNestedManyWithoutBusinessInput
    owner?: UserCreateNestedOneWithoutBusinessesOwnedInput
  }

  export type BusinessUncheckedCreateWithoutAuditsInput = {
    id?: string
    name: string
    slug: string
    status?: string
    ownerUserId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutBusinessInput
    agents?: AgentUncheckedCreateNestedManyWithoutBusinessInput
    leads?: LeadUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    conversations?: ConversationUncheckedCreateNestedManyWithoutBusinessInput
    tasks?: TaskUncheckedCreateNestedManyWithoutBusinessInput
    attributions?: AttributionUncheckedCreateNestedManyWithoutBusinessInput
    interactions?: InteractionUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutAuditsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutAuditsInput, BusinessUncheckedCreateWithoutAuditsInput>
  }

  export type UserCreateWithoutAuditEventsInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business?: BusinessCreateNestedOneWithoutUsersInput
    conversations?: ConversationCreateNestedManyWithoutOwnerInput
    tasks?: TaskCreateNestedManyWithoutOwnerInput
    leadsOwned?: LeadCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutAuditEventsInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId?: string | null
    conversations?: ConversationUncheckedCreateNestedManyWithoutOwnerInput
    tasks?: TaskUncheckedCreateNestedManyWithoutOwnerInput
    leadsOwned?: LeadUncheckedCreateNestedManyWithoutOwnerInput
    customersOwned?: CustomerUncheckedCreateNestedManyWithoutOwnerInput
    interactionsAuthored?: InteractionUncheckedCreateNestedManyWithoutCreatedByInput
    businessesOwned?: BusinessUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutAuditEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditEventsInput, UserUncheckedCreateWithoutAuditEventsInput>
  }

  export type BusinessUpsertWithoutAuditsInput = {
    update: XOR<BusinessUpdateWithoutAuditsInput, BusinessUncheckedUpdateWithoutAuditsInput>
    create: XOR<BusinessCreateWithoutAuditsInput, BusinessUncheckedCreateWithoutAuditsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutAuditsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutAuditsInput, BusinessUncheckedUpdateWithoutAuditsInput>
  }

  export type BusinessUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
    owner?: UserUpdateOneWithoutBusinessesOwnedNestedInput
  }

  export type BusinessUncheckedUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ownerUserId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type UserUpsertWithoutAuditEventsInput = {
    update: XOR<UserUpdateWithoutAuditEventsInput, UserUncheckedUpdateWithoutAuditEventsInput>
    create: XOR<UserCreateWithoutAuditEventsInput, UserUncheckedCreateWithoutAuditEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditEventsInput, UserUncheckedUpdateWithoutAuditEventsInput>
  }

  export type UserUpdateWithoutAuditEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneWithoutUsersNestedInput
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: NullableStringFieldUpdateOperationsInput | string | null
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type UserCreateManyBusinessInput = {
    id?: string
    email: string
    phone?: string | null
    name: string
    role: $Enums.UserRole
    locale?: string | null
    isActive?: boolean
    passwordHash: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentCreateManyBusinessInput = {
    id?: string
    name: string
    phone?: string | null
    referralUrl?: string | null
    couponCode?: string | null
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadCreateManyBusinessInput = {
    id?: string
    ownerId?: string | null
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateManyBusinessInput = {
    id?: string
    leadId?: string | null
    ownerId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationCreateManyBusinessInput = {
    id?: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyBusinessInput = {
    id?: string
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttributionCreateManyBusinessInput = {
    id?: string
    agentId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type AuditEventCreateManyBusinessInput = {
    id?: string
    actorId?: string | null
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type InteractionCreateManyBusinessInput = {
    id?: string
    conversationId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutOwnerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutOwnerNestedInput
    auditEvents?: AuditEventUncheckedUpdateManyWithoutActorNestedInput
    leadsOwned?: LeadUncheckedUpdateManyWithoutOwnerNestedInput
    customersOwned?: CustomerUncheckedUpdateManyWithoutOwnerNestedInput
    interactionsAuthored?: InteractionUncheckedUpdateManyWithoutCreatedByNestedInput
    businessesOwned?: BusinessUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributions?: AttributionUpdateManyWithoutAgentNestedInput
    conversations?: ConversationUpdateManyWithoutAgentNestedInput
  }

  export type AgentUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributions?: AttributionUncheckedUpdateManyWithoutAgentNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type AgentUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    referralUrl?: NullableStringFieldUpdateOperationsInput | string | null
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutLeadsOwnedNestedInput
    customer?: CustomerUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUncheckedUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lead?: LeadUpdateOneWithoutCustomerNestedInput
    owner?: UserUpdateOneWithoutCustomersOwnedNestedInput
    conversations?: ConversationUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutConversationsNestedInput
    lead?: LeadUpdateOneWithoutConversationsNestedInput
    customer?: CustomerUpdateOneWithoutConversationsNestedInput
    agent?: AgentUpdateOneWithoutConversationsNestedInput
    messages?: InteractionUpdateManyWithoutConversationNestedInput
    tasks?: TaskUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: InteractionUncheckedUpdateManyWithoutConversationNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
    customer?: CustomerUpdateOneWithoutTasksNestedInput
    conversation?: ConversationUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: AgentUpdateOneRequiredWithoutAttributionsNestedInput
    lead?: LeadUpdateOneWithoutAttributionsNestedInput
    customer?: CustomerUpdateOneWithoutAttributionsNestedInput
  }

  export type AttributionUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actor?: UserUpdateOneWithoutAuditEventsNestedInput
  }

  export type AuditEventUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ConversationUpdateOneRequiredWithoutMessagesNestedInput
    createdBy?: UserUpdateOneWithoutInteractionsAuthoredNestedInput
  }

  export type InteractionUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateManyOwnerInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    leadId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyOwnerInput = {
    id?: string
    businessId: string
    leadId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditEventCreateManyActorInput = {
    id?: string
    businessId: string
    entity: string
    entityId: string
    action: string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LeadCreateManyOwnerInput = {
    id?: string
    businessId: string
    status?: $Enums.LeadStatus
    source?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateManyOwnerInput = {
    id?: string
    businessId: string
    leadId?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    phoneNormalized?: string | null
    email?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InteractionCreateManyCreatedByInput = {
    id?: string
    businessId: string
    conversationId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type BusinessCreateManyOwnerInput = {
    id?: string
    name: string
    slug: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ConversationUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutConversationsNestedInput
    lead?: LeadUpdateOneWithoutConversationsNestedInput
    customer?: CustomerUpdateOneWithoutConversationsNestedInput
    agent?: AgentUpdateOneWithoutConversationsNestedInput
    messages?: InteractionUpdateManyWithoutConversationNestedInput
    tasks?: TaskUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: InteractionUncheckedUpdateManyWithoutConversationNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
    customer?: CustomerUpdateOneWithoutTasksNestedInput
    conversation?: ConversationUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAuditsNestedInput
  }

  export type AuditEventUncheckedUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutLeadsNestedInput
    customer?: CustomerUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUpdateManyWithoutLeadNestedInput
    tasks?: TaskUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUncheckedUpdateOneWithoutLeadNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutLeadNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutLeadNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutLeadNestedInput
  }

  export type LeadUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    source?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
    lead?: LeadUpdateOneWithoutCustomerNestedInput
    conversations?: ConversationUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversations?: ConversationUncheckedUpdateManyWithoutCustomerNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutCustomerNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNormalized?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    address?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutInteractionsNestedInput
    conversation?: ConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type InteractionUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BusinessUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutBusinessNestedInput
    agents?: AgentUpdateManyWithoutBusinessNestedInput
    leads?: LeadUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutBusinessNestedInput
    agents?: AgentUncheckedUpdateManyWithoutBusinessNestedInput
    leads?: LeadUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    conversations?: ConversationUncheckedUpdateManyWithoutBusinessNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutBusinessNestedInput
    attributions?: AttributionUncheckedUpdateManyWithoutBusinessNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutBusinessNestedInput
    interactions?: InteractionUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AttributionCreateManyAgentInput = {
    id?: string
    businessId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ConversationCreateManyAgentInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttributionUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAttributionsNestedInput
    lead?: LeadUpdateOneWithoutAttributionsNestedInput
    customer?: CustomerUpdateOneWithoutAttributionsNestedInput
  }

  export type AttributionUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutConversationsNestedInput
    owner?: UserUpdateOneWithoutConversationsNestedInput
    lead?: LeadUpdateOneWithoutConversationsNestedInput
    customer?: CustomerUpdateOneWithoutConversationsNestedInput
    messages?: InteractionUpdateManyWithoutConversationNestedInput
    tasks?: TaskUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: InteractionUncheckedUpdateManyWithoutConversationNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateManyLeadInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    customerId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyLeadInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    customerId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttributionCreateManyLeadInput = {
    id?: string
    businessId: string
    agentId: string
    method: $Enums.AttributionMethod
    customerId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ConversationUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutConversationsNestedInput
    owner?: UserUpdateOneWithoutConversationsNestedInput
    customer?: CustomerUpdateOneWithoutConversationsNestedInput
    agent?: AgentUpdateOneWithoutConversationsNestedInput
    messages?: InteractionUpdateManyWithoutConversationNestedInput
    tasks?: TaskUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: InteractionUncheckedUpdateManyWithoutConversationNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutTasksNestedInput
    owner?: UserUpdateOneWithoutTasksNestedInput
    customer?: CustomerUpdateOneWithoutTasksNestedInput
    conversation?: ConversationUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAttributionsNestedInput
    agent?: AgentUpdateOneRequiredWithoutAttributionsNestedInput
    customer?: CustomerUpdateOneWithoutAttributionsNestedInput
  }

  export type AttributionUncheckedUpdateWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUncheckedUpdateManyWithoutLeadInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateManyCustomerInput = {
    id?: string
    businessId: string
    channel: $Enums.ConversationChannel
    status?: $Enums.ConversationStatus
    subject?: string | null
    ownerId?: string | null
    leadId?: string | null
    agentId?: string | null
    nextFollowUpAt?: Date | string | null
    slaBreachedAt?: Date | string | null
    closedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyCustomerInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    leadId?: string | null
    conversationId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttributionCreateManyCustomerInput = {
    id?: string
    businessId: string
    agentId: string
    method: $Enums.AttributionMethod
    leadId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ConversationUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutConversationsNestedInput
    owner?: UserUpdateOneWithoutConversationsNestedInput
    lead?: LeadUpdateOneWithoutConversationsNestedInput
    agent?: AgentUpdateOneWithoutConversationsNestedInput
    messages?: InteractionUpdateManyWithoutConversationNestedInput
    tasks?: TaskUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: InteractionUncheckedUpdateManyWithoutConversationNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    channel?: EnumConversationChannelFieldUpdateOperationsInput | $Enums.ConversationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    agentId?: NullableStringFieldUpdateOperationsInput | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    slaBreachedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutTasksNestedInput
    owner?: UserUpdateOneWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
    conversation?: ConversationUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    conversationId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAttributionsNestedInput
    agent?: AgentUpdateOneRequiredWithoutAttributionsNestedInput
    lead?: LeadUpdateOneWithoutAttributionsNestedInput
  }

  export type AttributionUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttributionUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    agentId?: StringFieldUpdateOperationsInput | string
    method?: EnumAttributionMethodFieldUpdateOperationsInput | $Enums.AttributionMethod
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionCreateManyConversationInput = {
    id?: string
    businessId: string
    type: $Enums.InteractionType
    direction?: string | null
    body: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
  }

  export type TaskCreateManyConversationInput = {
    id?: string
    businessId: string
    ownerId?: string | null
    leadId?: string | null
    customerId?: string | null
    title: string
    description?: string | null
    type?: $Enums.TaskType
    status?: $Enums.TaskStatus
    dueAt: Date | string
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InteractionUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutInteractionsNestedInput
    createdBy?: UserUpdateOneWithoutInteractionsAuthoredNestedInput
  }

  export type InteractionUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    type?: EnumInteractionTypeFieldUpdateOperationsInput | $Enums.InteractionType
    direction?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutTasksNestedInput
    owner?: UserUpdateOneWithoutTasksNestedInput
    lead?: LeadUpdateOneWithoutTasksNestedInput
    customer?: CustomerUpdateOneWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    dueAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use BusinessCountOutputTypeDefaultArgs instead
     */
    export type BusinessCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BusinessCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgentCountOutputTypeDefaultArgs instead
     */
    export type AgentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LeadCountOutputTypeDefaultArgs instead
     */
    export type LeadCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LeadCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerCountOutputTypeDefaultArgs instead
     */
    export type CustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConversationCountOutputTypeDefaultArgs instead
     */
    export type ConversationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConversationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BusinessDefaultArgs instead
     */
    export type BusinessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BusinessDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AgentDefaultArgs instead
     */
    export type AgentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AgentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LeadDefaultArgs instead
     */
    export type LeadArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LeadDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerDefaultArgs instead
     */
    export type CustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConversationDefaultArgs instead
     */
    export type ConversationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConversationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InteractionDefaultArgs instead
     */
    export type InteractionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InteractionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskDefaultArgs instead
     */
    export type TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AttributionDefaultArgs instead
     */
    export type AttributionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AttributionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditEventDefaultArgs instead
     */
    export type AuditEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditEventDefaultArgs<ExtArgs>

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