import yaml from "js-yaml";

export type SortOptions = {
  all?: boolean;
  root?: true | string[];
  targets?: Record<string, true | string[]>;
  indent?: number;
  dryRun?: boolean;
};

export const applyFmtFromJsonToYaml = (
  json: object,
  options?: SortOptions
): string => {
  const { indent = 2, targets = {}, root = false, all = false } = options || {};

  if (Object.keys(targets).length <= 0) {
    return yaml.dump(json, { sortKeys: true, indent });
  }

  let current = all ? JSON.parse(yaml.dump(json, { sortKeys: true })) : json;

  if (root) {
    current = prioritySort(current, Array.isArray(root) ? root : []);
  }

  Object.entries(targets).forEach(([key, priorityKeys]) => {
    recursiveSort(
      current,
      key,
      Array.isArray(priorityKeys) ? priorityKeys : []
    );
  });

  return yaml.dump(current, { indent });
};

// TODO: target keyを正規表現で引っ掛けられるようにする
function recursiveSort(
  json: Record<string, any> | undefined,
  targetKey: string,
  priorityKeys: string[]
) {
  const firstDotIndex = targetKey.indexOf(".");
  const nestKeyExists = firstDotIndex >= 0;
  const _nestKey = targetKey.slice(firstDotIndex + 1);
  const _key = nestKeyExists ? targetKey.slice(0, firstDotIndex) : _nestKey;

  if(!json) return

  if (nestKeyExists) {
    if (_key === "[]" && Array.isArray(json[_key])) {
      json[_key].forEach((value: any) => {
        recursiveSort(value, _nestKey, priorityKeys);
      });
    } else if (_key === "*") {
      Object.keys(json).forEach((key) => {
        recursiveSort(json![key], _nestKey, priorityKeys);
      });
    } else {
      recursiveSort(json[_key], _nestKey, priorityKeys);
    }
  } else {
    if (_key === "[]" && Array.isArray(json)) {
      json = prioritySort(json, priorityKeys);
    } else if (_key === "*") {
      Object.keys(json).forEach((key) => {
        json![key] = prioritySort(json![key], priorityKeys);
      });
    } else if(json[_key]) {

      json[_key] = prioritySort(json[_key], priorityKeys);
    }
  }
}

function sortObjectByKeyNameList(
  data: Record<string, any>,
  sortWith: (...args: any) => any | string[]
) {
  let keys, sortFn;

  if (typeof sortWith === "function") {
    sortFn = sortWith;
  } else {
    keys = sortWith;
  }

  let objectKeys = Object.keys(data);

  keys ||= [] as string[];

  return keys.concat(objectKeys.sort(sortFn)).reduce(function (total, key) {
    if (objectKeys.indexOf(key) !== -1) {
      total[key] = data[key];
    }
    return total;
  }, {} as Record<string, any>);
}

function sortArrayByKeyNameList(
  data: Array<any>,
  sortWith: (...args: any) => any | string[]
) {
  let keys, sortFn;

  if (typeof sortWith === "function") {
    sortFn = sortWith;
  } else {
    keys = sortWith;
  }

  keys ||= [] as string[];

  return keys.concat(data.sort(sortFn));
}

function propComparator(
  priorityArr: Array<any> | unknown
): (a: string | number, b: string | number) => number {
  return function (a: string | number, b: string | number) {
    if (a === b) {
      return 0;
    }
    if (!Array.isArray(priorityArr)) {
      return 0;
    }
    const ia = priorityArr.indexOf(a);
    const ib = priorityArr.indexOf(b);
    if (ia !== -1) {
      return ib !== -1 ? ia - ib : -1;
    }
    return ib !== -1 || a > b ? 1 : a < b ? -1 : 0;
  };
}

function prioritySort(
  jsonProp: Record<string, any> | Array<any>,
  sortPriority: Array<any> | unknown
) {
  if (Array.isArray(jsonProp))
    return sortArrayByKeyNameList(jsonProp, propComparator(sortPriority));
  return sortObjectByKeyNameList(jsonProp, propComparator(sortPriority));
}
