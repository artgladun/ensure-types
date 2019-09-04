# ensure-types

Simple helpers to ensure uncertain interfaces in typescript.

Especially usefull when you are working with something you are not sure, i.e. responses from remote API.


##### Code example

```
interface IId {
  id: number;
}

const configIdType = {
  id: numberType(NaN),
};

const idType = ensure<IId>(configIdType);
```
```
interface IAttachment extends IId {
  publicUrl: string;
}

const configAttachmentType = {
  ...configIdType,
  publicUrl: stringType(""),
};

const attachmentType = ensure<IAttachment>(configAttachmentType);
```

```
interface IUser extends IId {
  avatar: IAttachment | null;
  active: boolean;
  firstName: string;
  lastName: string;
  documents: IAttachment[];
}

const configUserType: TType<IUser> = {
  ...configIdType,
  avatar: v => (isNil(v) ? null : attachmentType(v)),
  active: booleanType(false),
  firstName: stringType("Default Name firstName !=== string"),
  lastName: stringType(""),
  documents: ensureArray(attachmentType),
};

const userType = ensure<IUser>(configUserType);
const usersType = ensureArray(userType);

```

Instead of wrapping return interface in Partial or to avoid some future disappointments on API side, like i.e. returning null when we expect empty array. We can ensure what we expect and than use it without any risk.

```
const users = get<IUser[]>("/api/users").then(usersType);
```

Example with id it's not the best example but we can also use ensure to quickly create some initial values, i.e. form values.

```
const user = userType({ firstName: "Artur" })
```

##### Ensurers

Now this lib gives you only 3 ready ensurers - for simple types.

`stringType`, `numberType`, `booleanType`.

Do you need more? :)
