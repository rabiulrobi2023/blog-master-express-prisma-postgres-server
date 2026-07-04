const pick = (obj: Record<string, any>, keys: string[]) => {
  const pickableField: Record<string, any> = {};
  for (const key of keys) {
    if (key in obj) {
      pickableField[key] = obj[key];
    }
  }
  return pickableField;
};

export default pick;
