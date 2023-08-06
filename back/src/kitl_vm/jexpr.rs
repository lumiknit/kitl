use std::collections::HashMap;
use std::vec::Vec;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JId {
  name: String,
  module: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum JExpr {
  Id(JId),
  Lit(serde_json::Value),
  App {
    fun: Box<u32>,
    arg: Box<u32>,
  },
  Fun {
    fallback: Box<u32>,
    arg: String,
    tag: Option<JId>,
    elems: Vec<String>,
    body: Box<u32>,
  },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum JDef {
  Expr {
    expr: Vec<JExpr>,
  },
  Tag {
    tags: Vec<JId>,
  },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JMetadata {
  name: String,
  version: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JModule {
  metadata: JMetadata,
  defs: HashMap<String, JDef>,
}

pub fn test() {
  let s = r#"
    {
      "metadata": {
        "name": "test",
        "version": "0.0.1"
      },
      "defs": {
        "test": {
          "type": "expr",
          "expr": {
            "type": "app",
            "fun": {
              "type": "id",
              "name": "test",
              "module": null
            },
            "arg": {
              "type": "lit",
              "value": 1
            }
          }
        }
      }
    }
  "#;
  let j: JModule = serde_json::from_str(s).unwrap();
  println!("{:?}", j);
}