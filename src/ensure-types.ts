import { isArray, isBoolean, isNumber, isString, isUndefined } from "lodash";

export const buildEnsurer = (fun: (val: any) => boolean) => (defaultValue?: any) => (value: any) => {
  if (fun(value)) {
    return value;
  }

  return defaultValue;
};

export const stringType = buildEnsurer(isString);
export const numberType = buildEnsurer(isNumber);
export const booleanType = buildEnsurer(isBoolean);

export type TType<T> = { [P in keyof T]: (value?: any) => any };

export interface Optional {
  [key: string]: any;
}

export const ensure = <P extends Optional>(config: TType<P>) => (partial?: Optional) => {
  let ensured = {};

  Object.keys(config).forEach((key: string) => {
    const value = partial && partial[key];
    const tester = config[key];

    if (tester) {
      const desired = tester(value);

      if (!isUndefined(desired)) {
        ensured = { ...ensured, [key]: desired };
      }
    }
  });

  return ensured as P;
};

export const ensureArray = <T>(builtEnsure: (partial: any) => T) => (value?: Optional[]) => {
  if (!isArray(value)) {
    return [];
  }

  return value.map(item => builtEnsure(item)) as T[];
};
