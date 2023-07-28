pub mod kitl_vm;

fn main() {
  let src = r#"
    {
      "abc": []
    }
  "#;
  let parsed = kitl_vm::expr::parse_json(src).unwrap();
  println!("Parsed:\n{:?}", parsed);
  let min = kitl_vm::expr::into_min_json(&parsed);
  println!("Minified:\n{}", min);
  let pretty = kitl_vm::expr::into_json(&parsed);
  println!("Pretty:\n{}", pretty);
}
