import { i } from "@instantdb/react-native";

const _schema = i.schema({
  // We inferred 3 attributes!
  // Take a look at this schema, and if everything looks good,
  // run `push schema` again to enforce the types.
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    inventory: i.entity({
      name: i.string(),
      qty: i.number(),
    }),
    messages: i.entity({
      createdAt: i.string(),
      text: i.string(),
    }),
    products: i.entity({
      name: i.string(),
      options: i.string(),
      publish: i.string(),
    }),
    todos: i.entity({
      createdAt: i.number(),
      done: i.boolean(),
      text: i.string(),
    }),
  },
  links: {
    inventory$files: {
      forward: {
        on: "inventory",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "inventory",
      },
    },
    inventory$users: {
      forward: {
        on: "inventory",
        has: "one",
        label: "$users",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "inventory",
      },
    },
    products$files: {
      forward: {
        on: "products",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "many",
        label: "products",
      },
    },
    products$users: {
      forward: {
        on: "products",
        has: "many",
        label: "$users",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "products",
      },
    },
    todos$users: {
      forward: {
        on: "todos",
        has: "many",
        label: "$users",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "todos",
      },
    },
  },
  // If you use presence, you can define a room schema here
  // https://www.instantdb.com/docs/presence-and-topics#typesafety
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
