export function flattenObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    // Return non-object values as is
    return obj;
  }

  if (Array.isArray(obj)) {
    // Flatten arrays by recursively calling deepFlatten on each element
    return obj.reduce((acc: any[], item: any) => {
      return acc.concat(flattenObject(item));
    }, []);
  }

  // Flatten objects by recursively calling deepFlatten on each value
  return Object.keys(obj).reduce((acc: any, key: string) => {
    const value = obj[key];
    const flattenedValue = flattenObject(value);
    if (typeof flattenedValue === 'object' && !Array.isArray(flattenedValue)) {
      // Merge flattened object values into the parent object
      Object.keys(flattenedValue).forEach((nestedKey: string) => {
        acc[`${key}.${nestedKey}`] = flattenedValue[nestedKey];
      });
    } else {
      // Assign flattened non-object values directly
      acc[key] = flattenedValue;
    }
    return acc;
  }, {});
}
