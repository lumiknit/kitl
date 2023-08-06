use axum::{
  Router,
  routing::get,
};
use std::net::SocketAddr;

async fn root() -> &'static str {
  "Hello, World!"
}

#[tokio::main]
async fn main() {
  let app = Router::new()
    .route("/", get(root));

  let addr = SocketAddr::from(([127, 0, 0, 1], 5210));
  println!("Listening on {}", addr);
  axum::Server::bind(&addr)
    .serve(app.into_make_service())
    .await
    .unwrap();
}