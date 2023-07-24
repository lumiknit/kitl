export const builtins: { [key: string]: (a: any, b: any) => any } = {
  // JSON
  to_json: (cfg: any, b: any) => {
    try {
      if (typeof cfg === "object" && cfg.indent !== undefined) {
        return JSON.stringify(b, null, cfg.indent);
      } else {
        return JSON.stringify(b);
      }
    } catch {
      return null;
    }
  },
  from_json: (_: any, b: any) => {
    try {
      return JSON.parse(b);
    } catch {
      return null;
    }
  },

  // Equality
  "==": (a: any, b: any) => {
    return a === b;
  },
  "!=": (a: any, b: any) => {
    return a !== b;
  },

  // Null
  null: () => {
    return null;
  },
  is_null: (_: any, b: any) => {
    return b === null;
  },

  // Boolean
  true: () => {
    return true;
  },
  false: () => {
    return false;
  },
  is_boolean: (_: any, b: any) => {
    return typeof b === "boolean";
  },
  is_true: (_: any, b: any) => {
    return b === true;
  },
  is_false: (_: any, b: any) => {
    return b === false;
  },
  "&&": (a: any, b: any) => {
    return a === true && b === true;
  },
  "||": (a: any, b: any) => {
    return a === true || b === true;
  },
  "!": (_: any, b: any) => {
    return b === false;
  },

  // Number
  is_number: (_: any, b: any) => {
    return typeof b === "number";
  },
  is_integer: (_: any, b: any) => {
    return typeof b === "number" && Number.isInteger(b);
  },

  // Arithmetic
  "+": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    } else {
      return null;
    }
  },
  "-": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    } else {
      return null;
    }
  },
  "*": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return a * b;
    } else {
      return null;
    }
  },
  "/": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      const result = a / b;
      if (Number.isNaN(result)) return null;
      return result;
    } else {
      return null;
    }
  },
  "//": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      const result = a / b;
      if (Number.isNaN(result)) return null;
      return Math.floor(result);
    } else {
      return null;
    }
  },
  "%": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      const result = a % b;
      if (Number.isNaN(result)) return null;
      return Math.floor(result);
    } else {
      return null;
    }
  },
  "**": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      const result = Math.pow(a, b);
      if (Number.isNaN(result)) return null;
      return result;
    } else {
      return null;
    }
  },

  // Number Comparison
  ">": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return a > b;
    } else {
      return false;
    }
  },
  "<": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return a < b;
    } else {
      return false;
    }
  },
  ">=": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return a >= b;
    } else {
      return false;
    }
  },
  "<=": (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return a <= b;
    } else {
      return false;
    }
  },

  // Math
  abs: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.abs(b);
    } else {
      return null;
    }
  },
  round: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.round(b);
    } else {
      return null;
    }
  },
  ceil: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.ceil(b);
    } else {
      return null;
    }
  },
  floor: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.floor(b);
    } else {
      return null;
    }
  },
  sqrt: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.sqrt(b);
    } else {
      return null;
    }
  },
  log: (a: any, b: any) => {
    if (a === null) a = Math.E;
    if (typeof a === "number" && typeof b === "number") {
      const result = Math.log(b) / Math.log(a);
      if (Number.isNaN(result)) return null;
      return result;
    } else {
      return null;
    }
  },
  pow: (a: any, b: any) => {
    if (a === null) a = Math.E;
    if (typeof a === "number" && typeof b === "number") {
      const result = Math.pow(a, b);
      if (Number.isNaN(result)) return null;
      return result;
    } else {
      return null;
    }
  },
  sin: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.sin(b);
    } else {
      return null;
    }
  },
  cos: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.cos(b);
    } else {
      return null;
    }
  },
  tan: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.tan(b);
    } else {
      return null;
    }
  },
  asin: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.asin(b);
    } else {
      return null;
    }
  },
  acos: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.acos(b);
    } else {
      return null;
    }
  },
  atan: (_: any, b: any) => {
    if (typeof b === "number") {
      return Math.atan(b);
    } else {
      return null;
    }
  },
  atan2: (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
      return Math.atan2(a, b);
    } else {
      return null;
    }
  },

  // String
  is_string: (_: any, b: any) => {
    return typeof b === "string";
  },
  "s len": (_: any, b: any) => {
    if (typeof b === "string") {
      return b.length;
    } else {
      return null;
    }
  },
  slice: (a: any, b: any) => {
    if (typeof b !== "string") return null;
    if (typeof a === "number") {
      return b.slice(a);
    } else if (Array.isArray(a)) {
      if (a.length === 1 && typeof a[0] === "number") {
        return b.slice(a[0]);
      } else if (
        a.length === 2 &&
        typeof a[0] === "number" &&
        typeof a[1] === "number"
      ) {
        return b.slice(a[0], a[1]);
      }
    }
    return null;
  },

  // IO
  print: (_: any, b: any) => {
    console.log(b);
    return b;
  },
};
