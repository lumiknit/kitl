use std::collections::HashMap;
use std::vec::Vec;

#[derive(Clone, Copy, Debug)]
pub struct Idx(pub u32);

#[derive(Clone, Copy, Debug)]
pub struct Tag(pub u32);

#[derive(Clone, Copy, Debug)]
pub enum DefaultTags {
  None = 0,
  Null,
  False,
  True,
  Number,
  String,
  Array,
  Object,
  Closure,
  First, // First custom tag index.
}

impl TryFrom<u32> for DefaultTags {
  type Error = String;

  fn try_from(v: u32) -> Result<Self, Self::Error> {
    match v {
      0 => Ok(Self::None),
      1 => Ok(Self::Null),
      2 => Ok(Self::False),
      3 => Ok(Self::True),
      4 => Ok(Self::Number),
      5 => Ok(Self::String),
      6 => Ok(Self::Array),
      7 => Ok(Self::Object),
      8 => Ok(Self::Closure),
      _ => Err(format!("Unknown default tag {}", v)),
    }
  }
}

#[derive(Clone, Debug)]
pub enum Raw {
  Number(f64),
  String(String),
  Object(HashMap<String, Val>),
  Val(Val),
}

#[derive(Clone, Debug)]
pub struct Val {
  pub tag: Tag,
  pub elems: Vec<Raw>,
}

impl Val {
  pub const NULL: Self = Self {
    tag: Tag(DefaultTags::Null as u32),
    elems: vec![],
  };
  pub const FALSE: Self = Self {
    tag: Tag(DefaultTags::False as u32),
    elems: vec![],
  };
  pub const TRUE: Self = Self {
    tag: Tag(DefaultTags::True as u32),
    elems: vec![],
  };

  pub fn from_json(v: &serde_json::Value) -> Self {
    match v {
      serde_json::Value::Null => Self::NULL,
      serde_json::Value::Bool(false) => Self::FALSE,
      serde_json::Value::Bool(true) => Self::TRUE,
      serde_json::Value::Number(n) => Self {
        tag: Tag(DefaultTags::Number as u32),
        elems: vec![Raw::Number(n.as_f64().unwrap())],
      },
      serde_json::Value::String(s) => Self {
        tag: Tag(DefaultTags::String as u32),
        elems: vec![Raw::String(s.clone())],
      },
      serde_json::Value::Array(a) => Self {
        tag: Tag(DefaultTags::Array as u32),
        elems: a.iter().map(|v| Raw::Val(Self::from_json(v))).collect(),
      },
      serde_json::Value::Object(o) => Self {
        tag: Tag(DefaultTags::Object as u32),
        elems: vec![
          Raw::Object(
            o.iter()
              .map(|(k, v)| (k.clone(), Self::from_json(v)))
              .collect(),
          )
        ],
      },
    }
  }

  pub fn to_json(&self) -> Result<serde_json::Value, String> {
    match DefaultTags::try_from(self.tag.0)? {
      DefaultTags::Null => Ok(serde_json::Value::Null),
      DefaultTags::False => Ok(serde_json::Value::Bool(false)),
      DefaultTags::True => Ok(serde_json::Value::Bool(true)),
      DefaultTags::Number => {
        if let Some(Raw::Number(n)) = self.elems.get(0) {
          Ok(serde_json::Value::Number(serde_json::Number::from_f64(*n).unwrap()))
        } else {
          Err(format!(
            "Expected number in number tag, found {:?}",
            self.elems[0]
          ))
        }
      },
      DefaultTags::String => {
        if let Some(Raw::String(s)) = self.elems.get(0) {
          Ok(serde_json::Value::String(s.clone()))
        } else {
          Err(format!(
            "Expected string in string tag, found {:?}",
            self.elems[0]
          ))
        }
      }
      DefaultTags::Array => {
        let mut v = Vec::new();
        for elem in &self.elems {
          if let Raw::Val(val) = elem {
            v.push(val.to_json()?);
          } else {
            return Err(format!("Expected val in array tag, found {:?}", elem));
          }
        }
        Ok(serde_json::Value::Array(v))
      }
      DefaultTags::Object => {
        let mut h = serde_json::Map::new();
        if self.elems.len() != 1 {
          return Err(format!(
            "Expected 1 element in object tag, found {}",
            self.elems.len()
          ));
        }
        if let Raw::Object(o) = &self.elems[0] {
          for (k, v) in o {
            h.insert(k.clone(), v.to_json()?);
          }
          Ok(serde_json::Value::Object(h))
        } else {
          Err(format!(
            "Expected object in object tag, found {:?}",
            self.elems[0]
          ))
        }
      }
      _ => Err(format!("Unknown tag {}", self.tag.0)),
    }
  }
}

#[derive(Clone, Debug)]
pub struct Id {
  pub name: String,
  pub module: Option<String>,
}

#[derive(Clone, Debug)]
pub enum Expr {
  DefId(Id),
  FrameIdx(Idx),
  Lit(Val),
  App(Idx, Idx),
  Fun(
    Option<Idx>, // Fall-back function expr
    Option<Id>, // Allow tag identifier
    Vec<Idx>, // Up-value list
    Idx, // Body expr
  ),
}

#[derive(Clone, Debug)]
pub enum Def {
  Tag(Vec<Id>),
  Expr(Expr),
}

#[derive(Clone, Debug)]
pub struct LazyDef {
  pub def: Def,
  pub val: Option<Val>,
}

#[derive(Clone, Debug)]
pub struct Module {
  pub defs: HashMap<String, LazyDef>,
}
