import BetaNode from "./BetaNode";
import DefNode from "./DefNode";
import LambdaNode from "./LambdaNode";
import LiteralNode from "./LiteralNode";
import CommentNode from "./CommentNode";


export default {
  def: DefNode,
  literal: LiteralNode,
  lambda: LambdaNode,
  beta: BetaNode,
  comment: CommentNode,
};