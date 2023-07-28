use std::collections::HashMap;
use std::vec::Vec;

use serde_json::Value;

pub type Index = u32;

#[derive(Clone, Debug)]
pub struct Id {
  pub id: String,
  pub module: String,
}

impl Id {
  pub fn from_json(val: &Value) -> Result<Self, String> {
    if let Value::Object(obj) = val {
      let id = obj
        .get("id")
        .ok_or("Expected id field for Id")?
        .as_str()
        .ok_or("Expected string for id field of Id")?;
      let module = obj
        .get("module")
        .ok_or("Expected module field for Id")?
        .as_str()
        .ok_or("Expected string for module field of Id")?;
      Ok(Id {
        id: id.to_string(),
        module: module.to_string(),
      })
    } else {
      Err(format!("Expected object for Id, got {:?}", val))
    }
  }
}

#[derive(Clone, Debug)]
pub enum Expr {
  Lit(Value),
  Fun(String, Index),
  App(Index, Index),
  Pat(Value, Index, Index),
  Id(Id),
}

impl Expr {
  pub fn from_json(val: &Value) -> Result<Expr, String> {
    if let Value::Object(obj) = val {
      let kind = obj
        .get("kind")
        .ok_or("Expected kind field for Expr")?
        .as_str()
        .ok_or("Expected string for kind field of Expr")?;
      match kind {
        "lit" => {
          let val = obj.get("val").ok_or("Expected val field for Expr")?;
          Ok(Expr::Lit(val.clone()))
        }
        "fun" => {
          let name = obj
            .get("name")
            .ok_or("Expected name field for Expr")?
            .as_str()
            .ok_or("Expected string for name field of Expr")?;
          let body = obj
            .get("body")
            .ok_or("Expected body field for Expr")?
            .as_u64()
            .ok_or("Expected u64 for body field of Expr")?;
          Ok(Expr::Fun(name.to_string(), body as Index))
        }
        "app" => {
          let fun = obj
            .get("fun")
            .ok_or("Expected fun field for Expr")?
            .as_u64()
            .ok_or("Expected u64 for fun field of Expr")?;
          let arg = obj
            .get("arg")
            .ok_or("Expected arg field for Expr")?
            .as_u64()
            .ok_or("Expected u64 for arg field of Expr")?;
          Ok(Expr::App(fun as Index, arg as Index))
        }
        "pat" => {
          let val = obj.get("val").ok_or("Expected val field for Expr")?;
          let fun = obj
            .get("fun")
            .ok_or("Expected fun field for Expr")?
            .as_u64()
            .ok_or("Expected u64 for fun field of Expr")?;
          let arg = obj
            .get("arg")
            .ok_or("Expected arg field for Expr")?
            .as_u64()
            .ok_or("Expected u64 for arg field of Expr")?;
          Ok(Expr::Pat(val.clone(), fun as Index, arg as Index))
        }
        "var" => Ok(Expr::Id(Id::from_json(val)?)),
        _ => Err(format!("Unknown kind for Expr: {}", kind)),
      }
    } else {
      Err(format!("Expected object for Expr, got {:?}", val))
    }
  }

  pub fn into_json(&self) -> Value {
    match self {
      Expr::Lit(val) => {
        let mut map = serde_json::Map::new();
        map.insert("kind".to_string(), Value::String("lit".to_string()));
        map.insert("val".to_string(), val.clone());
        Value::Object(map)
      }
      Expr::Fun(name, body) => {
        let mut map = serde_json::Map::new();
        map.insert("kind".to_string(), Value::String("fun".to_string()));
        map.insert("name".to_string(), Value::String(name.to_string()));
        map.insert("body".to_string(), Value::Number(body.clone().into()));
        Value::Object(map)
      }
      Expr::App(fun, arg) => {
        let mut map = serde_json::Map::new();
        map.insert("kind".to_string(), Value::String("app".to_string()));
        map.insert("fun".to_string(), Value::Number(fun.clone().into()));
        map.insert("arg".to_string(), Value::Number(arg.clone().into()));
        Value::Object(map)
      }
      Expr::Pat(val, fun, arg) => {
        let mut map = serde_json::Map::new();
        map.insert("kind".to_string(), Value::String("pat".to_string()));
        map.insert("val".to_string(), val.clone());
        map.insert("fun".to_string(), Value::Number(fun.clone().into()));
        map.insert("arg".to_string(), Value::Number(arg.clone().into()));
        Value::Object(map)
      }
      Expr::Id(id) => {
        let mut map = serde_json::Map::new();
        map.insert("kind".to_string(), Value::String("var".to_string()));
        map.insert("id".to_string(), Value::String(id.id.to_string()));
        map.insert("module".to_string(), Value::String(id.module.to_string()));
        Value::Object(map)
      }
    }
  }
}

#[derive(Clone, Debug)]
pub struct Def(Vec<Expr>);

impl Def {
  pub fn from_json(val: &Value) -> Result<Self, String> {
    if let Value::Array(arr) = val {
      let mut def = Vec::new();
      for v in arr {
        def.push(Expr::from_json(v)?);
      }
      Ok(Self(def))
    } else {
      Err(format!("Expected array for def, got {:?}", val))
    }
  }

  pub fn into_json(&self) -> Value {
    let mut arr = Vec::new();
    for v in self.0.iter() {
      arr.push(v.into_json());
    }
    Value::Array(arr)
  }
}

#[derive(Clone, Debug)]
pub struct Module {
  pub defs: HashMap<String, Def>,
}

impl Module {
  pub fn from_json(val: &Value) -> Result<Self, String> {
    if let Value::Object(map) = val {
      let mut defs: HashMap<String, Def> = HashMap::new();
      for (k, v) in map {
        defs.insert(k.to_string(), Def::from_json(v)?);
      }
      Ok(Self { defs })
    } else {
      Err(format!("Expected object for module, got {:?}", val))
    }
  }

  pub fn into_json(&self) -> Value {
    let mut map = serde_json::Map::new();
    for (k, v) in self.defs.iter() {
      map.insert(k.to_string(), v.into_json());
    }
    Value::Object(map)
  }
}

/* Json format parser */

pub fn parse_json(json: &str) -> Result<Module, String> {
  let result: Value = serde_json::from_str(json)
    .map_err(|e| format!("Failed to parse json: {}", e))?;
  Module::from_json(&result)
}

pub fn into_min_json(module: &Module) -> String {
  let result = module.into_json();
  serde_json::to_string(&result).unwrap()
}

pub fn into_json(module: &Module) -> String {
  let result = module.into_json();
  serde_json::to_string_pretty(&result).unwrap()
}
