(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
(function() {
  var closer, def, json_diff, type, _i, _len, _ref, _ref1, _ref2, _ref3,
    __slice = [].slice;

  json_diff = require('json-diff');

  closer = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window.closer : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self.closer : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global.closer : void 0) != null ? _ref : require('../src/closer');

  exports.toDeepEqual = function(expected) {
    this.message = function() {
      return 'actual != expected, diff is:\n' + json_diff.diffString(this.actual, expected);
    };
    return typeof json_diff.diff(this.actual, expected) === 'undefined';
  };

  _ref3 = ['keyword', 'vector', 'list', 'hash_$_set', 'hash_$_map'];
  for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
    type = _ref3[_i];
    exports[type] = (function(type2) {
      return function() {
        var items;
        items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        items = type2 === 'keyword' ? [closer.node('Literal', items[0])] : items;
        return closer.node('CallExpression', closer.node('Identifier', type2), items);
      };
    })(type);
  }

  exports.AssertArity = function(min, max) {
    var args;
    if (max == null) {
      max = null;
    }
    args = [exports.Literal(min)];
    if (max === Infinity) {
      args.push(exports.Identifier('Infinity'));
    }
    args.push(exports.MemberExpression(exports.Identifier('arguments'), exports.Identifier('length')));
    return exports.ExpressionStatement(exports.CallExpression(exports.MemberExpression(exports.Identifier('assertions'), exports.Identifier('arity')), args));
  };

  exports.DestructuringVector = function(id, destrucId, idx) {
    return exports.TryStatement(exports.BlockStatement(exports.VariableDeclaration(exports.VariableDeclarator(exports.Identifier(id), exports.CallExpression(exports.Identifier('nth'), [exports.Identifier(destrucId), exports.Literal(idx)])))), exports.CatchClause(exports.Identifier('__$error'), exports.BlockStatement(exports.IfStatement(exports.BinaryExpression('!==', exports.MemberExpression(exports.Identifier('__$error'), exports.Identifier('name')), exports.Literal('IndexOutOfBoundsError')), exports.ThrowStatement(exports.Identifier('__$error'))), exports.ExpressionStatement(exports.AssignmentExpression(exports.Identifier(id), exports.Literal(null))))));
  };

  exports.DestructuringVectorRest = function(id, destrucId, dropCount) {
    return exports.VariableDeclaration(exports.VariableDeclarator(exports.Identifier(id), exports.CallExpression(exports.Identifier('drop'), [exports.Literal(dropCount), exports.Identifier(destrucId)])));
  };

  exports.DestructuringMap = function(id, destrucId, key) {
    return exports.VariableDeclaration(exports.VariableDeclarator(exports.Identifier(id), exports.CallExpression(exports.Identifier('get'), [exports.Identifier(destrucId), key])));
  };

  def = function(type, initFn) {
    return exports[type] = function() {
      var obj;
      obj = initFn.apply(null, arguments) || {};
      obj.type = type;
      return obj;
    };
  };

  def('Identifier', function(name) {
    return {
      name: name
    };
  });

  def('Literal', function(value) {
    if (value == null) {
      value = null;
    }
    return {
      value: value
    };
  });

  def('ThisExpression', (function() {}));

  def('UnaryExpression', function(operator, argument) {
    return {
      operator: operator,
      argument: argument,
      prefix: true
    };
  });

  def('UpdateExpression', function(operator, argument) {
    return {
      operator: '++',
      argument: argument,
      prefix: true
    };
  });

  def('BinaryExpression', function(operator, left, right) {
    return {
      operator: operator,
      left: left,
      right: right
    };
  });

  def('LogicalExpression', function(operator, left, right) {
    return {
      operator: operator,
      left: left,
      right: right
    };
  });

  def('SequenceExpression', function() {
    var expressions;
    expressions = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      expressions: expressions
    };
  });

  def('ArrayExpression', function(elements) {
    return {
      elements: elements
    };
  });

  def('AssignmentExpression', function(left, right) {
    return {
      operator: '=',
      left: left,
      right: right
    };
  });

  def('CallExpression', function(callee, args) {
    return {
      callee: callee,
      "arguments": (typeof args !== 'undefined' ? args : [])
    };
  });

  def('MemberExpression', function(obj, prop, computed) {
    if (computed == null) {
      computed = false;
    }
    return {
      object: obj,
      property: prop,
      computed: computed
    };
  });

  def('NewExpression', function(callee, args) {
    return {
      callee: callee,
      "arguments": args
    };
  });

  def('ConditionalExpression', function(test, consequent, alternate) {
    return {
      test: test,
      consequent: consequent,
      alternate: alternate
    };
  });

  def('FunctionExpression', function(id, params, rest, body) {
    return {
      id: id,
      params: params,
      defaults: [],
      rest: rest,
      body: body,
      generator: false,
      expression: false
    };
  });

  def('EmptyStatement', (function() {}));

  def('ExpressionStatement', function(expression) {
    return {
      expression: expression
    };
  });

  def('ForStatement', function(init, test, update, body) {
    return {
      init: init,
      test: test,
      update: update,
      body: body
    };
  });

  def('WhileStatement', function(test, body) {
    return {
      test: test,
      body: body
    };
  });

  def('IfStatement', function(test, consequent, alternate) {
    return {
      test: test,
      consequent: consequent,
      alternate: (typeof alternate !== 'undefined' ? alternate : null)
    };
  });

  def('BreakStatement', function(label) {
    if (label == null) {
      label = null;
    }
    return {
      label: label
    };
  });

  def('ContinueStatement', function(label) {
    if (label == null) {
      label = null;
    }
    return {
      label: label
    };
  });

  def('ReturnStatement', function(argument) {
    return {
      argument: argument
    };
  });

  def('TryStatement', function(block, handler) {
    return {
      block: block,
      handlers: [handler],
      finalizer: null
    };
  });

  def('CatchClause', function(param, body) {
    return {
      param: param,
      guard: null,
      body: body
    };
  });

  def('ThrowStatement', function(argument) {
    return {
      argument: argument
    };
  });

  def('VariableDeclaration', function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      kind: 'var',
      declarations: args
    };
  });

  def('VariableDeclarator', function(id, init) {
    return {
      id: id,
      init: init
    };
  });

  def('BlockStatement', function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      body: args
    };
  });

  def('Program', function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return {
      body: args
    };
  });

}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/closer":3,"json-diff":15}],2:[function(require,module,exports){
(function (global){
(function() {
  var ArrayExpression, AssertArity, AssignmentExpression, BinaryExpression, BlockStatement, Boolean, BreakStatement, CallExpression, CatchClause, ConditionalExpression, ContinueStatement, DestructuringMap, DestructuringVector, DestructuringVectorRest, EmptyStatement, ExpressionStatement, Float, ForStatement, FunctionExpression, HashMap, HashSet, Identifier, IfStatement, Integer, Keyword, List, LogicalExpression, MemberExpression, NewExpression, Nil, Program, ReturnStatement, SequenceExpression, String, ThisExpression, ThrowStatement, TryStatement, UnaryExpression, UpdateExpression, VariableDeclaration, VariableDeclarator, Vector, WhileStatement, closer, eq, helpers, json_diff, looseEq, looseParseOpts, parseOpts, throws, _ref, _ref1, _ref2;

  closer = (_ref = (_ref1 = (_ref2 = typeof window !== "undefined" && window !== null ? window.closer : void 0) != null ? _ref2 : typeof self !== "undefined" && self !== null ? self.closer : void 0) != null ? _ref1 : typeof global !== "undefined" && global !== null ? global.closer : void 0) != null ? _ref : require('../src/closer');

  json_diff = require('json-diff');

  helpers = require('./closer-helpers');

  Integer = helpers.Literal;

  Float = helpers.Literal;

  String = helpers.Literal;

  Boolean = helpers.Literal;

  Nil = helpers.Literal;

  Keyword = helpers['keyword'];

  Vector = helpers['vector'];

  List = helpers['list'];

  HashSet = helpers['hash_$_set'];

  HashMap = helpers['hash_$_map'];

  AssertArity = helpers.AssertArity;

  DestructuringVector = helpers.DestructuringVector;

  DestructuringVectorRest = helpers.DestructuringVectorRest;

  DestructuringMap = helpers.DestructuringMap;

  Identifier = helpers.Identifier;

  ThisExpression = helpers.ThisExpression;

  UnaryExpression = helpers.UnaryExpression;

  UpdateExpression = helpers.UpdateExpression;

  BinaryExpression = helpers.BinaryExpression;

  LogicalExpression = helpers.LogicalExpression;

  SequenceExpression = helpers.SequenceExpression;

  ArrayExpression = helpers.ArrayExpression;

  AssignmentExpression = helpers.AssignmentExpression;

  CallExpression = helpers.CallExpression;

  MemberExpression = helpers.MemberExpression;

  NewExpression = helpers.NewExpression;

  ConditionalExpression = helpers.ConditionalExpression;

  FunctionExpression = helpers.FunctionExpression;

  EmptyStatement = helpers.EmptyStatement;

  ExpressionStatement = helpers.ExpressionStatement;

  ForStatement = helpers.ForStatement;

  WhileStatement = helpers.WhileStatement;

  IfStatement = helpers.IfStatement;

  BreakStatement = helpers.BreakStatement;

  ContinueStatement = helpers.ContinueStatement;

  ReturnStatement = helpers.ReturnStatement;

  TryStatement = helpers.TryStatement;

  CatchClause = helpers.CatchClause;

  ThrowStatement = helpers.ThrowStatement;

  VariableDeclaration = helpers.VariableDeclaration;

  VariableDeclarator = helpers.VariableDeclarator;

  BlockStatement = helpers.BlockStatement;

  Program = helpers.Program;

  beforeEach(function() {
    return this.addMatchers({
      toDeepEqual: helpers.toDeepEqual
    });
  });

  parseOpts = {
    loc: false,
    forceNoLoc: true
  };

  looseParseOpts = {
    loc: false,
    forceNoLoc: true,
    loose: true
  };

  eq = function(src, ast) {
    return expect(closer.parse(src, parseOpts)).toDeepEqual(ast);
  };

  looseEq = function(src, ast) {
    var actual;
    actual = closer.parse(src, looseParseOpts);
    delete actual.errors;
    return expect(actual).toDeepEqual(ast);
  };

  throws = function(src) {
    return expect(function() {
      return closer.parse(src, parseOpts);
    }).toThrow();
  };

  describe('Closer parser', function() {
    describe('Building blocks', function() {
      it('parses empty programs', function() {
        return eq('\n', Program());
      });
      it('parses commas as whitespace', function() {
        return eq(',,, ,,,  ,,\n', Program());
      });
      it('parses empty s-expressions', function() {
        return eq('()\n', Program(EmptyStatement()));
      });
      it('parses comments', function() {
        return eq('; Heading\n() ; trailing ()\r\n;\r;;;\n\r\r', Program(EmptyStatement()));
      });
      it('parses identifiers', function() {
        return eq('x\n', Program(ExpressionStatement(Identifier('x'))));
      });
      it('parses integer, float, string, boolean, and nil literals', function() {
        return eq('-24\n-23.67\n-22.45E-5\n""\n"string"\ntrue\nfalse\nnil\n', Program(ExpressionStatement(UnaryExpression('-', Integer(24))), ExpressionStatement(UnaryExpression('-', Float(23.67))), ExpressionStatement(UnaryExpression('-', Float(22.45e-5))), ExpressionStatement(String('')), ExpressionStatement(String('string')), ExpressionStatement(Boolean(true)), ExpressionStatement(Boolean(false)), ExpressionStatement(Nil())));
      });
      it('parses keywords', function() {
        return eq(':keyword', Program(ExpressionStatement(Keyword('keyword'))));
      });
      it('parses vector and list literals', function() {
        return eq('[] ["string" true] \'() \'("string" true)', Program(ExpressionStatement(Vector()), ExpressionStatement(Vector(String('string'), Boolean(true))), ExpressionStatement(List()), ExpressionStatement(List(String('string'), Boolean(true)))));
      });
      return it('parses set and map literals', function() {
        eq('#{} #{"string" true}', Program(ExpressionStatement(HashSet()), ExpressionStatement(HashSet(String('string'), Boolean(true)))));
        eq('{} {"string" true}', Program(ExpressionStatement(HashMap()), ExpressionStatement(HashMap(String('string'), Boolean(true)))));
        return throws('{1 2 3}');
      });
    });
    describe('Functions', function() {
      it('parses function calls with 0 arguments', function() {
        return eq('(fn-name)\n', Program(ExpressionStatement(CallExpression(MemberExpression(Identifier('fn_$_name'), Identifier('call')), [ThisExpression()]))));
      });
      it('parses function calls with > 0 arguments', function() {
        return eq('(fn-name arg1 arg2)\n', Program(ExpressionStatement(CallExpression(MemberExpression(Identifier('fn_$_name'), Identifier('call')), [ThisExpression(), Identifier('arg1'), Identifier('arg2')]))));
      });
      it('parses anonymous function definitions', function() {
        return eq('(fn [x] x)\n', Program(ExpressionStatement(FunctionExpression(null, [Identifier('x')], null, BlockStatement(AssertArity(1), ReturnStatement(Identifier('x')))))));
      });
      it('parses calls to anonymous functions', function() {
        return eq('((fn [x] x) 2)\n', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [Identifier('x')], null, BlockStatement(AssertArity(1), ReturnStatement(Identifier('x')))), Identifier('call')), [ThisExpression(), Integer(2)]))));
      });
      it('parses anonymous function literals', function() {
        return eq('(#(apply + % %2 %&) 1 2 3 4)', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [Identifier('__$1'), Identifier('__$2')], null, BlockStatement(AssertArity(2, Infinity), VariableDeclaration(VariableDeclarator(Identifier('__$rest'), CallExpression(Identifier('seq'), [CallExpression(MemberExpression(MemberExpression(MemberExpression(Identifier('Array'), Identifier('prototype')), Identifier('slice')), Identifier('call')), [Identifier('arguments'), Integer(2)])]))), ReturnStatement(CallExpression(MemberExpression(Identifier('apply'), Identifier('call')), [ThisExpression(), Identifier('_$PLUS_'), Identifier('__$1'), Identifier('__$2'), Identifier('__$rest')])))), Identifier('call')), [ThisExpression(), Integer(1), Integer(2), Integer(3), Integer(4)]))));
      });
      it('parses named function definitions', function() {
        return eq('(defn fn-name [x] x)\n', Program(VariableDeclaration(VariableDeclarator(Identifier('fn_$_name'), FunctionExpression(null, [Identifier('x')], null, BlockStatement(AssertArity(1), ReturnStatement(Identifier('x'))))))));
      });
      it('parses rest arguments', function() {
        return eq('(defn avg [& rest] (/ (apply + rest) (count rest)))\n', Program(VariableDeclaration(VariableDeclarator(Identifier('avg'), FunctionExpression(null, [], null, BlockStatement(AssertArity(0, Infinity), VariableDeclaration(VariableDeclarator(Identifier('rest'), CallExpression(Identifier('seq'), [CallExpression(MemberExpression(MemberExpression(MemberExpression(Identifier('Array'), Identifier('prototype')), Identifier('slice')), Identifier('call')), [Identifier('arguments'), Integer(0)])]))), ReturnStatement(CallExpression(MemberExpression(Identifier('_$SLASH_'), Identifier('call')), [ThisExpression(), CallExpression(MemberExpression(Identifier('apply'), Identifier('call')), [ThisExpression(), Identifier('_$PLUS_'), Identifier('rest')]), CallExpression(MemberExpression(Identifier('count'), Identifier('call')), [ThisExpression(), Identifier('rest')])]))))))));
      });
      return it('parses collections and keywords in function position', function() {
        eq('([1 2 3 4] 1)', Program(ExpressionStatement(CallExpression(MemberExpression(Vector(Integer(1), Integer(2), Integer(3), Integer(4)), Identifier('call')), [ThisExpression(), Integer(1)]))));
        eq('({1 2 3 4} 1)', Program(ExpressionStatement(CallExpression(MemberExpression(HashMap(Integer(1), Integer(2), Integer(3), Integer(4)), Identifier('call')), [ThisExpression(), Integer(1)]))));
        eq('(#{1 2 3 4} 1)', Program(ExpressionStatement(CallExpression(MemberExpression(HashSet(Integer(1), Integer(2), Integer(3), Integer(4)), Identifier('call')), [ThisExpression(), Integer(1)]))));
        return eq('(:key {:key :val})', Program(ExpressionStatement(CallExpression(MemberExpression(Keyword('key'), Identifier('call')), [ThisExpression(), HashMap(Keyword('key'), Keyword('val'))]))));
      });
    });
    describe('Conditional forms', function() {
      it('throws when given empty if forms', function() {
        return throws('(if)');
      });
      it('parses if forms without else', function() {
        return eq('(if (>= x 0) x)\n', Program(ExpressionStatement(ConditionalExpression(CallExpression(MemberExpression(Identifier('_$GT__$EQ_'), Identifier('call')), [ThisExpression(), Identifier('x'), Integer(0)]), Identifier('x'), Nil()))));
      });
      it('parses if-else forms', function() {
        return eq('(if (>= x 0) x (- x))\n', Program(ExpressionStatement(ConditionalExpression(CallExpression(MemberExpression(Identifier('_$GT__$EQ_'), Identifier('call')), [ThisExpression(), Identifier('x'), Integer(0)]), Identifier('x'), CallExpression(MemberExpression(Identifier('_$_'), Identifier('call')), [ThisExpression(), Identifier('x')])))));
      });
      it('parses if forms in function position', function() {
        return eq('(map #(if (even? %1) (- %) %) [1 2 3])', Program(ExpressionStatement(CallExpression(MemberExpression(Identifier('map'), Identifier('call')), [ThisExpression(), FunctionExpression(null, [Identifier('__$1')], null, BlockStatement(AssertArity(1), ReturnStatement(ConditionalExpression(CallExpression(MemberExpression(Identifier('even_$QMARK_'), Identifier('call')), [ThisExpression(), Identifier('__$1')]), CallExpression(MemberExpression(Identifier('_$_'), Identifier('call')), [ThisExpression(), Identifier('__$1')]), Identifier('__$1'))))), Vector(Integer(1), Integer(2), Integer(3))]))));
      });
      it('throws when given if forms with > 3 forms in their body', function() {
        return throws('(if true 1 2 3)');
      });
      it('throws when given empty if-not forms', function() {
        return throws('(if-not)');
      });
      it('parses if-not forms without else', function() {
        return eq('(if-not (>= x 0) x)\n', Program(ExpressionStatement(ConditionalExpression(CallExpression(Identifier('not'), [CallExpression(MemberExpression(Identifier('_$GT__$EQ_'), Identifier('call')), [ThisExpression(), Identifier('x'), Integer(0)])]), Identifier('x'), Nil()))));
      });
      it('parses if-not forms with else', function() {
        return eq('(if-not (>= x 0) x (- x))\n', Program(ExpressionStatement(ConditionalExpression(CallExpression(Identifier('not'), [CallExpression(MemberExpression(Identifier('_$GT__$EQ_'), Identifier('call')), [ThisExpression(), Identifier('x'), Integer(0)])]), Identifier('x'), CallExpression(MemberExpression(Identifier('_$_'), Identifier('call')), [ThisExpression(), Identifier('x')])))));
      });
      it('parses if-not forms in function position', function() {
        return eq('(map #(if-not (even? %1) (- %) %) [1 2 3])', Program(ExpressionStatement(CallExpression(MemberExpression(Identifier('map'), Identifier('call')), [ThisExpression(), FunctionExpression(null, [Identifier('__$1')], null, BlockStatement(AssertArity(1), ReturnStatement(ConditionalExpression(CallExpression(Identifier('not'), [CallExpression(MemberExpression(Identifier('even_$QMARK_'), Identifier('call')), [ThisExpression(), Identifier('__$1')])]), CallExpression(MemberExpression(Identifier('_$_'), Identifier('call')), [ThisExpression(), Identifier('__$1')]), Identifier('__$1'))))), Vector(Integer(1), Integer(2), Integer(3))]))));
      });
      it('throws when given if-not forms with > 3 forms in their body', function() {
        return throws('(if-not true 1 2 3)');
      });
      it('parses when forms', function() {
        return eq('(when (condition?) (println \"hello\") true)\n', Program(IfStatement(CallExpression(MemberExpression(Identifier('condition_$QMARK_'), Identifier('call')), [ThisExpression()]), BlockStatement(ExpressionStatement(CallExpression(MemberExpression(Identifier('println'), Identifier('call')), [ThisExpression(), String('hello')])), ExpressionStatement(Boolean(true))))));
      });
      return it('parses when-not forms', function() {
        return eq('(when-not (condition?) (println \"hello\") true)\n', Program(IfStatement(CallExpression(Identifier('not'), [CallExpression(MemberExpression(Identifier('condition_$QMARK_'), Identifier('call')), [ThisExpression()])]), BlockStatement(ExpressionStatement(CallExpression(MemberExpression(Identifier('println'), Identifier('call')), [ThisExpression(), String('hello')])), ExpressionStatement(Boolean(true))))));
      });
    });
    describe('Looping forms', function() {
      it('parses loop + recur forms', function() {
        eq('(loop [] (recur))', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(WhileStatement(Boolean(true), BlockStatement(BlockStatement(ContinueStatement()), BreakStatement())))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
        return eq('(loop [x 10] (when (> x 1) (.log console x) (recur (- x 2))))', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(VariableDeclaration(VariableDeclarator(Identifier('x'), Integer(10))), WhileStatement(Boolean(true), BlockStatement(IfStatement(CallExpression(MemberExpression(Identifier('_$GT_'), Identifier('call')), [ThisExpression(), Identifier('x'), Integer(1)]), BlockStatement(ExpressionStatement(CallExpression(MemberExpression(Identifier('console'), String('log'), true), [Identifier('x')])), BlockStatement(ExpressionStatement(AssignmentExpression(Identifier('__$recur0'), CallExpression(MemberExpression(Identifier('_$_'), Identifier('call')), [ThisExpression(), Identifier('x'), Integer(2)]))), ExpressionStatement(AssignmentExpression(Identifier('x'), Identifier('__$recur0'))), ContinueStatement())), ReturnStatement(Nil())), BreakStatement())))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      it('throws when given loop forms with an odd number of args in their bindings', function() {
        return throws('(loop [x] (recur 0))');
      });
      it('parses fn + recur forms', function() {
        return eq('(fn [n acc] (if (zero? n) acc (recur (dec n) (* acc n))))', Program(ExpressionStatement(FunctionExpression(null, [Identifier('n'), Identifier('acc')], null, BlockStatement(AssertArity(2), WhileStatement(Boolean(true), BlockStatement(IfStatement(CallExpression(MemberExpression(Identifier('zero_$QMARK_'), Identifier('call')), [ThisExpression(), Identifier('n')]), ReturnStatement(Identifier('acc')), BlockStatement(ExpressionStatement(AssignmentExpression(Identifier('__$recur0'), CallExpression(MemberExpression(Identifier('dec'), Identifier('call')), [ThisExpression(), Identifier('n')]))), ExpressionStatement(AssignmentExpression(Identifier('__$recur1'), CallExpression(MemberExpression(Identifier('_$STAR_'), Identifier('call')), [ThisExpression(), Identifier('acc'), Identifier('n')]))), ExpressionStatement(AssignmentExpression(Identifier('n'), Identifier('__$recur0'))), ExpressionStatement(AssignmentExpression(Identifier('acc'), Identifier('__$recur1'))), ContinueStatement())))))))));
      });
      it('parses dotimes forms', function() {
        return eq('(dotimes [i expr] (println i))', Program(ForStatement(VariableDeclaration(VariableDeclarator(Identifier('i'), Integer(0)), VariableDeclarator(Identifier('__$max0'), Identifier('expr'))), BinaryExpression('<', Identifier('i'), Identifier('__$max0')), UpdateExpression('++', Identifier('i')), BlockStatement(ExpressionStatement(CallExpression(MemberExpression(Identifier('println'), Identifier('call')), [ThisExpression(), Identifier('i')]))))));
      });
      it('throws when given dotimes forms with anything more or less than 1 binding', function() {
        throws('(dotimes [] (println 2))');
        return throws('(dotimes [i 5 j 10] (println i j))');
      });
      it('parses doseq forms', function() {
        return eq('(doseq [x (range 5)] (println x))', Program(ForStatement(VariableDeclaration(VariableDeclarator(Identifier('__$doseqSeq0'), CallExpression(MemberExpression(Identifier('range'), Identifier('call')), [ThisExpression(), Integer(5)])), VariableDeclarator(Identifier('x'), CallExpression(Identifier('first'), [Identifier('__$doseqSeq0')]))), BinaryExpression('!==', Identifier('x'), Nil()), SequenceExpression(AssignmentExpression(Identifier('__$doseqSeq0'), CallExpression(Identifier('rest'), [Identifier('__$doseqSeq0')])), AssignmentExpression(Identifier('x'), CallExpression(Identifier('first'), [Identifier('__$doseqSeq0')]))), BlockStatement(ExpressionStatement(CallExpression(MemberExpression(Identifier('println'), Identifier('call')), [ThisExpression(), Identifier('x')]))))));
      });
      it('throws when given doseq forms with anything more or less than 1 binding', function() {
        throws('(doseq [] (println 2))');
        return throws('(doseq [x (range 5) y (range 10)] (println x y))');
      });
      return it('parses while forms', function() {
        return eq('(while (< i 5) (set! i (inc i)))', Program(WhileStatement(CallExpression(MemberExpression(Identifier('_$LT_'), Identifier('call')), [ThisExpression(), Identifier('i'), Integer(5)]), BlockStatement(ExpressionStatement(AssignmentExpression(Identifier('i'), CallExpression(MemberExpression(Identifier('inc'), Identifier('call')), [ThisExpression(), Identifier('i')])))))));
      });
    });
    describe('Destructuring forms', function() {
      it('parses vector destructuring forms', function() {
        return eq('(defn fn-name [[a & b] c & [d & e :as coll]])', Program(VariableDeclaration(VariableDeclarator(Identifier('fn_$_name'), FunctionExpression(null, [Identifier('__$destruc0'), Identifier('c')], null, BlockStatement(AssertArity(2, Infinity), DestructuringVector('a', '__$destruc0', 0), DestructuringVectorRest('b', '__$destruc0', 1), VariableDeclaration(VariableDeclarator(Identifier('coll'), CallExpression(Identifier('seq'), [CallExpression(MemberExpression(MemberExpression(MemberExpression(Identifier('Array'), Identifier('prototype')), Identifier('slice')), Identifier('call')), [Identifier('arguments'), Integer(2)])]))), DestructuringVector('d', 'coll', 0), DestructuringVectorRest('e', 'coll', 1), ReturnStatement(Nil())))))));
      });
      it('parses map destructuring forms', function() {
        return eq('(defn fn-name [{:as m :keys [b] :strs [c] a :a}])', Program(VariableDeclaration(VariableDeclarator(Identifier('fn_$_name'), FunctionExpression(null, [Identifier('m')], null, BlockStatement(AssertArity(1), DestructuringMap('b', 'm', Keyword('b')), DestructuringMap('c', 'm', String('c')), DestructuringMap('a', 'm', Keyword('a')), ReturnStatement(Nil())))))));
      });
      return it('throws if a map is used to destructure rest args', function() {
        return throws('((fn [& {a :a}] a) {:a 2})');
      });
    });
    describe('Vars', function() {
      it('parses unbound var definitions', function() {
        return eq('(def var-name)', Program(VariableDeclaration(VariableDeclarator(Identifier('var_$_name'), null))));
      });
      it('parses vars bound to literals', function() {
        return eq('(def greeting \"Hello\")', Program(VariableDeclaration(VariableDeclarator(Identifier('greeting'), String('Hello')))));
      });
      it('throws when given def forms with > 2 arguments', function() {
        throws('(def a 2 3)');
        return throws('(def a 2 b 3)');
      });
      it('parses vars bound to expressions', function() {
        return eq('(def sum (+ 3 5))', Program(VariableDeclaration(VariableDeclarator(Identifier('sum'), CallExpression(MemberExpression(Identifier('_$PLUS_'), Identifier('call')), [ThisExpression(), Integer(3), Integer(5)])))));
      });
      it('parses vars bound to fn forms', function() {
        return eq('(def add (fn [& numbers] (apply + numbers)))', Program(VariableDeclaration(VariableDeclarator(Identifier('add'), FunctionExpression(null, [], null, BlockStatement(AssertArity(0, Infinity), VariableDeclaration(VariableDeclarator(Identifier('numbers'), CallExpression(Identifier('seq'), [CallExpression(MemberExpression(MemberExpression(MemberExpression(Identifier('Array'), Identifier('prototype')), Identifier('slice')), Identifier('call')), [Identifier('arguments'), Integer(0)])]))), ReturnStatement(CallExpression(MemberExpression(Identifier('apply'), Identifier('call')), [ThisExpression(), Identifier('_$PLUS_'), Identifier('numbers')]))))))));
      });
      it('parses var assignment forms like (set! var value)', function() {
        return eq('(set! x 4)', Program(ExpressionStatement(AssignmentExpression(Identifier('x'), Integer(4)))));
      });
      it('parses object property assignment forms like (set! (.prop obj) value)', function() {
        return eq('(set! (.length (to-array (range 5))) 3)', Program(ExpressionStatement(AssignmentExpression(MemberExpression(CallExpression(MemberExpression(Identifier('to_$_array'), Identifier('call')), [ThisExpression(), CallExpression(MemberExpression(Identifier('range'), Identifier('call')), [ThisExpression(), Integer(5)])]), Identifier('length')), Integer(3)))));
      });
      it('parses let forms with no bindings and no body', function() {
        return eq('(let [])', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(ReturnStatement(Nil()))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      it('parses let forms with non-empty bindings and non-empty body', function() {
        return eq('(let [x 3 y (- x)] (+ x y))', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(VariableDeclaration(VariableDeclarator(Identifier('x'), Integer(3))), VariableDeclaration(VariableDeclarator(Identifier('y'), CallExpression(MemberExpression(Identifier('_$_'), Identifier('call')), [ThisExpression(), Identifier('x')]))), ReturnStatement(CallExpression(MemberExpression(Identifier('_$PLUS_'), Identifier('call')), [ThisExpression(), Identifier('x'), Identifier('y')])))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      return it('throws when given let forms with an odd number of args in their bindings', function() {
        return throws('(let [x 1 y])');
      });
    });
    describe('JavaScript interop', function() {
      it('parses function-calling dot special forms', function() {
        return eq('(.move-x-y this 10 20)', Program(ExpressionStatement(CallExpression(MemberExpression(ThisExpression(), String('move-x-y'), true), [Integer(10), Integer(20)]))));
      });
      it('parses dot special forms representing property access or a 0-argument function-call', function() {
        return eq('(.pos this)', Program(ExpressionStatement(ConditionalExpression(LogicalExpression('&&', BinaryExpression('===', UnaryExpression('typeof', MemberExpression(ThisExpression(), String('pos'), true)), String('function')), BinaryExpression('===', MemberExpression(MemberExpression(ThisExpression(), String('pos'), true), Identifier('length')), Integer(0))), CallExpression(MemberExpression(ThisExpression(), String('pos'), true), []), MemberExpression(ThisExpression(), String('pos'), true)))));
      });
      it('throws when given dot special forms with no object in the callee position', function() {
        return throws('(.prop)');
      });
      it('parses new forms like (new Array 1 2 3)', function() {
        return eq('(new Array 1 2 3)', Program(ExpressionStatement(NewExpression(Identifier('Array'), [Integer(1), Integer(2), Integer(3)]))));
      });
      return it('parses the macro-variant of new forms like (Array. 1 2 3)', function() {
        return eq('(Array. 1 2 3)', Program(ExpressionStatement(NewExpression(Identifier('Array'), [Integer(1), Integer(2), Integer(3)]))));
      });
    });
    describe('Miscellaneous', function() {
      it('parses empty do forms', function() {
        return eq('(do)', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(ReturnStatement(Nil()))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      it('parses non-empty do forms', function() {
        return eq('(do (+ 1 2) (+ 3 4))', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(ExpressionStatement(CallExpression(MemberExpression(Identifier('_$PLUS_'), Identifier('call')), [ThisExpression(), Integer(1), Integer(2)])), ReturnStatement(CallExpression(MemberExpression(Identifier('_$PLUS_'), Identifier('call')), [ThisExpression(), Integer(3), Integer(4)])))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      it('parses logical expressions (and / or)', function() {
        eq('(and) (or)', Program(ExpressionStatement(Boolean(true)), ExpressionStatement(Nil())));
        eq('(and expr1 expr2 expr3)', Program(ExpressionStatement(LogicalExpression('&&', LogicalExpression('&&', Identifier('expr1'), Identifier('expr2')), Identifier('expr3')))));
        return eq('(or expr1 expr2 expr3)', Program(ExpressionStatement(LogicalExpression('||', LogicalExpression('||', Identifier('expr1'), Identifier('expr2')), Identifier('expr3')))));
      });
      return it('throws when given illegal tokens', function() {
        throws('(def $a 2)');
        return throws('(a || b)');
      });
    });
    describe('Loose mode', function() {
      it('parses incomplete forms in loose mode', function() {
        return looseEq('(let [x 1\n', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(VariableDeclaration(VariableDeclarator(Identifier('x'), Integer(1))), ReturnStatement(Nil()))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      it('parses forms with excess closing delimiters at the end', function() {
        return looseEq('(let [x 1])) )\n)', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(VariableDeclaration(VariableDeclarator(Identifier('x'), Integer(1))), ReturnStatement(Nil()))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      it('parses forms with unmatched closing delimiters at the end', function() {
        return looseEq('(let [x 1) \n  ]', Program(ExpressionStatement(CallExpression(MemberExpression(FunctionExpression(null, [], null, BlockStatement(VariableDeclaration(VariableDeclarator(Identifier('x'), Integer(1))), ReturnStatement(Nil()))), Identifier('call')), [ConditionalExpression(BinaryExpression('!==', UnaryExpression('typeof', ThisExpression()), String('undefined')), ThisExpression(), Nil())]))));
      });
      it('returns an empty AST for forms with excess closing delimiters in between', function() {
        return looseEq('(let [x 1)]\nx\n', Program());
      });
      it('returns an empty AST for forms with unmatched closing delimiters in between', function() {
        return looseEq('(let [x 1)]\nx\n', Program());
      });
      return it('never throws in loose mode, and always returns a valid AST, even when given illegal tokens', function() {
        return looseEq('$$$$$&^%&^#$%@:[|', Program());
      });
    });
    return xit('parses source locations');
  });

}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../src/closer":3,"./closer-helpers":1,"json-diff":15}],3:[function(require,module,exports){
(function() {
  var Closer, Parser, balanceDelimiters, builder, closer, con, nodes, oldParse, parser;

  parser = require('./parser').parser;

  nodes = require('./nodes');

  builder = {};

  nodes.defineNodes(builder);

  for (con in builder) {
    parser.yy[con] = function(a, b, c, d, e, f, g, h) {
      return builder[con](a, b, c, d, e, f, g, h);
    };
  }

  parser.yy.Node = function(type, a, b, c, d, e, f, g, h) {
    var buildName;
    buildName = type[0].toLowerCase() + type.slice(1);
    if (builder && buildName in builder) {
      return builder[buildName](a, b, c, d, e, f, g, h);
    } else {
      throw new ReferenceError("no such node type: " + type);
    }
  };

  parser.yy.locComb = function(start, end) {
    start.last_line = end.last_line;
    start.last_column = end.last_column;
    start.range = [start.range[0], end.range[1]];
    return start;
  };

  parser.yy.loc = function(loc) {
    if (!this.locations) {
      return null;
    }
    return {
      start: {
        line: this.startLine + loc.first_line - 1,
        column: loc.first_column
      },
      end: {
        line: this.startLine + loc.last_line - 1,
        column: loc.last_column
      },
      range: loc.range
    };
  };

  parser.lexer.options.ranges = true;

  oldParse = parser.parse;

  parser.parse = function(source, options) {
    this.yy.raw = [];
    this.yy.options = options;
    return oldParse.call(this, source);
  };

  Parser = (function() {
    function Parser(options) {
      this.yy.locs = options.loc !== false;
      this.yy.ranges = options.range === true;
      this.yy.locations = this.yy.locs || this.yy.ranges;
      this.yy.source = options.source || null;
      this.yy.startLine = options.line || 1;
      nodes.forceNoLoc = options.forceNoLoc;
    }

    return Parser;

  })();

  Parser.prototype = parser;

  balanceDelimiters = function(source) {
    var c, close, delims, existingClose, last, match, open, _i, _j, _len, _len1;
    match = {
      '(': ')',
      '[': ']',
      '{': '}'
    };
    open = /[(\[{]/g;
    close = /[)\]}]/g;
    existingClose = source.match(/[ \r\n)\]}]+$/);
    if (existingClose) {
      existingClose = existingClose[0];
      source = source.replace(existingClose, '');
      existingClose = existingClose.replace(/[ \r\n]+/g, '');
    } else {
      existingClose = '';
    }
    delims = [];
    for (_i = 0, _len = source.length; _i < _len; _i++) {
      c = source[_i];
      if (c.match(open)) {
        delims.push(c);
      } else if (c.match(close)) {
        last = delims[delims.length - 1];
        if (last) {
          if (c === match[last]) {
            delims.pop();
          } else {
            throw new Error("unmatched existing delimiters, can't balance");
          }
        } else {
          throw new Error("too many closing delimiters, can't balance");
        }
      }
    }
    delims.reverse();
    for (_j = 0, _len1 = delims.length; _j < _len1; _j++) {
      c = delims[_j];
      source += match[c];
    }
    return [source, delims.length - existingClose.length];
  };

  Closer = (function() {
    function Closer(options) {
      this.parser = new Parser(options);
    }

    Closer.prototype.parse = function(source, options) {
      var ast, e, unbalancedCount, _ref;
      if (options.loose === true) {
        try {
          _ref = balanceDelimiters(source), source = _ref[0], unbalancedCount = _ref[1];
          ast = this.parser.parse(source, options);
        } catch (_error) {
          e = _error;
          source = '';
          unbalancedCount = 0;
          ast = this.parser.parse(source, options);
        }
        if (!e && unbalancedCount > 0) {
          e = new Error("Missing " + unbalancedCount + " closing delimiters");
          e.startOffset = e.endOffset = source.length - 1;
          ast.errors = [e];
        }
      } else {
        ast = this.parser.parse(source, options);
      }
      return ast;
    };

    return Closer;

  })();

  closer = {
    parse: function(src, options) {
      if (options == null) {
        options = {};
      }
      return new Closer(options).parse(src, options);
    },
    node: parser.yy.Node
  };

  module.exports = closer;

  if (typeof self !== "undefined" && self !== null) {
    self.closer = closer;
  }

  if (typeof window !== "undefined" && window !== null) {
    window.closer = closer;
  }

}).call(this);

},{"./nodes":4,"./parser":5}],4:[function(require,module,exports){
(function() {
  exports.forceNoLoc = false;

  exports.defineNodes = function(builder) {
    var def, defaultIni, funIni;
    defaultIni = function(loc) {
      this.loc = loc;
      return this;
    };
    def = function(name, ini) {
      return builder[name[0].toLowerCase() + name.slice(1)] = function(a, b, c, d, e, f, g, h) {
        var obj;
        obj = {};
        obj.type = name;
        ini.call(obj, a, b, c, d, e, f, g, h);
        if (exports.forceNoLoc === true) {
          delete obj.loc;
        }
        return obj;
      };
    };
    def('Program', function(elements, loc) {
      this.body = elements;
      return this.loc = loc;
    });
    def('ExpressionStatement', function(expression, loc) {
      this.expression = expression;
      return this.loc = loc;
    });
    def('BlockStatement', function(body, loc) {
      this.body = body;
      return this.loc = loc;
    });
    def('EmptyStatement', defaultIni);
    def('Identifier', function(name, loc) {
      this.name = name;
      return this.loc = loc;
    });
    def('Literal', function(value, loc, raw) {
      this.value = value;
      return this.loc = loc;
    });
    def('ThisExpression', defaultIni);
    def('VariableDeclaration', function(kind, declarations, loc) {
      this.declarations = declarations;
      this.kind = kind;
      return this.loc = loc;
    });
    def('VariableDeclarator', function(id, init, loc) {
      this.id = id;
      this.init = init;
      return this.loc = loc;
    });
    def('ArrayExpression', function(elements, loc) {
      this.elements = elements;
      return this.loc = loc;
    });
    def('ObjectExpression', function(properties, loc) {
      this.properties = properties;
      return this.loc = loc;
    });
    funIni = function(ident, params, rest, body, isGen, isExp, loc) {
      this.id = ident;
      this.params = params;
      this.defaults = [];
      this.rest = rest;
      this.body = body;
      this.loc = loc;
      this.generator = isGen;
      return this.expression = isExp;
    };
    def('FunctionDeclaration', funIni);
    def('FunctionExpression', funIni);
    def('ReturnStatement', function(argument, loc) {
      this.argument = argument;
      return this.loc = loc;
    });
    def('TryStatement', function(block, handlers, finalizer, loc) {
      this.block = block;
      this.handlers = handlers || [];
      this.finalizer = finalizer;
      return this.loc = loc;
    });
    def('CatchClause', function(param, guard, body, loc) {
      this.param = param;
      this.guard = guard;
      this.body = body;
      return this.loc = loc;
    });
    def('ThrowStatement', function(argument, loc) {
      this.argument = argument;
      return this.loc = loc;
    });
    def('BreakStatement', function(label, loc) {
      this.label = label;
      return this.loc = loc;
    });
    def('ContinueStatement', function(label, loc) {
      this.label = label;
      return this.loc = loc;
    });
    def('ConditionalExpression', function(test, consequent, alternate, loc) {
      this.test = test;
      this.consequent = consequent;
      this.alternate = alternate;
      return this.loc = loc;
    });
    def('SequenceExpression', function(expressions, loc) {
      this.expressions = expressions;
      return this.loc = loc;
    });
    def('BinaryExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('AssignmentExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('LogicalExpression', function(op, left, right, loc) {
      this.operator = op;
      this.left = left;
      this.right = right;
      return this.loc = loc;
    });
    def('UnaryExpression', function(operator, argument, prefix, loc) {
      this.operator = operator;
      this.argument = argument;
      this.prefix = prefix;
      return this.loc = loc;
    });
    def('UpdateExpression', function(operator, argument, prefix, loc) {
      this.operator = operator;
      this.argument = argument;
      this.prefix = prefix;
      return this.loc = loc;
    });
    def('CallExpression', function(callee, args, loc) {
      this.callee = callee;
      this["arguments"] = args;
      return this.loc = loc;
    });
    def('NewExpression', function(callee, args, loc) {
      this.callee = callee;
      this["arguments"] = args;
      return this.loc = loc;
    });
    def('MemberExpression', function(object, property, computed, loc) {
      this.object = object;
      this.property = property;
      this.computed = computed;
      return this.loc = loc;
    });
    def('DebuggerStatement', defaultIni);
    def('Empty', defaultIni);
    def('WhileStatement', function(test, body, loc) {
      this.test = test;
      this.body = body;
      return this.loc = loc;
    });
    def('ForStatement', function(init, test, update, body, loc) {
      this.init = init;
      this.test = test;
      this.update = update;
      this.body = body;
      return this.loc = loc;
    });
    def('IfStatement', function(test, consequent, alternate, loc) {
      this.test = test;
      this.consequent = consequent;
      this.alternate = alternate;
      return this.loc = loc;
    });
    return def;
  };

}).call(this);

},{}],5:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,24],$V1=[1,23],$V2=[1,25],$V3=[1,10],$V4=[1,11],$V5=[1,12],$V6=[1,13],$V7=[1,14],$V8=[1,15],$V9=[1,19],$Va=[1,20],$Vb=[1,8],$Vc=[1,21],$Vd=[1,22],$Ve=[4,7,9,11,12,13,14,15,16,18,20,21,22,23,24,26,27,97],$Vf=[4,7,9,11,12,13,14,15,16,18,20,21,22,23,24,26,27,37,39,40,97],$Vg=[1,65],$Vh=[2,64],$Vi=[1,44],$Vj=[1,45],$Vk=[1,46],$Vl=[1,47],$Vm=[1,48],$Vn=[1,49],$Vo=[1,50],$Vp=[1,51],$Vq=[1,52],$Vr=[1,53],$Vs=[1,54],$Vt=[1,60],$Vu=[1,55],$Vv=[1,56],$Vw=[1,57],$Vx=[1,58],$Vy=[1,59],$Vz=[1,61],$VA=[1,43],$VB=[2,96],$VC=[4,7,9,11,12,13,14,15,16,18,21,22,24,26,27],$VD=[2,106],$VE=[2,91],$VF=[1,81],$VG=[2,102],$VH=[4,7,9,11,12,13,14,15,16,18,21,22,23,24,27],$VI=[2,27],$VJ=[4,18,20,24],$VK=[2,52],$VL=[20,37],$VM=[1,140],$VN=[1,141],$VO=[2,100],$VP=[4,18,20,24,35,37],$VQ=[4,7,9,11,12,13,14,15,16,18,20,21,22,24,27,35,37],$VR=[4,18,24,26,37,39,40],$VS=[1,166],$VT=[4,20],$VU=[2,2];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Identifier":3,"IDENTIFIER":4,"IdentifierList":5,"Keyword":6,"COLON":7,"AnonArg":8,"ANON_ARG":9,"Atom":10,"INTEGER":11,"FLOAT":12,"STRING":13,"true":14,"false":15,"nil":16,"CollectionLiteral":17,"[":18,"items":19,"]":20,"QUOTE":21,"(":22,")":23,"{":24,"SExprPairs[items]":25,"}":26,"SHARP":27,"Fn":28,"List":29,"AnonFnLiteral":30,"IdOrDestrucForm":31,"DestructuringForm":32,"IdOrDestrucList":33,"FnArgs":34,"&":35,"AsForm":36,"AS":37,"MapDestrucArgs":38,"KEYS":39,"STRS":40,"SExpr":41,"asForm":42,"FnArgsAndBody":43,"BlockStatementWithReturn":44,"FnDefinition":45,"FN":46,"DEFN":47,"ConditionalExpr":48,"IF":49,"SExpr[test]":50,"SExprStmt[consequent]":51,"alternate":52,"IF_NOT":53,"WHEN":54,"BlockStatement[consequent]":55,"WHEN_NOT":56,"LogicalExpr":57,"AND":58,"exprs":59,"OR":60,"VarDeclaration":61,"DEF":62,"init":63,"LetBinding":64,"LetBindings":65,"LetForm":66,"LET":67,"DoForm":68,"SetForm":69,"SETVAL":70,"DOT":71,"IDENTIFIER[prop]":72,"SExpr[obj]":73,"SExpr[val]":74,"LoopForm":75,"LOOP":76,"BlockStatement":77,"RecurForm":78,"RECUR":79,"args":80,"DoTimesForm":81,"DOTIMES":82,"DoSeqForm":83,"DOSEQ":84,"WhileForm":85,"WHILE":86,"DotForm":87,"NewForm":88,"NEW":89,"Identifier[konstructor]":90,"DO":91,"SExprStmt":92,"SExprPairs":93,"SExprs":94,"NonEmptyDoForm":95,"Program":96,"END-OF-FILE":97,"$accept":0,"$end":1},
terminals_: {2:"error",4:"IDENTIFIER",7:"COLON",9:"ANON_ARG",11:"INTEGER",12:"FLOAT",13:"STRING",14:"true",15:"false",16:"nil",18:"[",20:"]",21:"QUOTE",22:"(",23:")",24:"{",25:"SExprPairs[items]",26:"}",27:"SHARP",35:"&",37:"AS",39:"KEYS",40:"STRS",46:"FN",47:"DEFN",49:"IF",50:"SExpr[test]",51:"SExprStmt[consequent]",53:"IF_NOT",54:"WHEN",55:"BlockStatement[consequent]",56:"WHEN_NOT",58:"AND",60:"OR",62:"DEF",67:"LET",70:"SETVAL",71:"DOT",72:"IDENTIFIER[prop]",73:"SExpr[obj]",74:"SExpr[val]",76:"LOOP",79:"RECUR",82:"DOTIMES",84:"DOSEQ",86:"WHILE",89:"NEW",90:"Identifier[konstructor]",91:"DO",97:"END-OF-FILE"},
productions_: [0,[3,1],[5,0],[5,2],[6,2],[8,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[17,3],[17,4],[17,3],[17,4],[28,1],[28,1],[28,1],[28,3],[28,1],[28,1],[31,1],[31,1],[33,0],[33,2],[34,1],[34,3],[36,2],[38,0],[38,2],[38,5],[38,5],[38,3],[32,4],[32,3],[43,4],[45,2],[45,3],[30,4],[48,4],[48,4],[48,3],[48,3],[57,2],[57,2],[61,3],[64,2],[65,2],[65,0],[66,5],[69,3],[69,7],[75,5],[78,2],[81,6],[83,6],[85,3],[87,4],[88,3],[88,3],[29,0],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,2],[29,2],[41,1],[41,1],[41,3],[41,1],[92,1],[93,0],[93,3],[94,1],[94,2],[95,1],[68,1],[68,0],[77,1],[44,1],[96,2],[96,1],[19,0],[19,1],[42,0],[42,1],[52,0],[52,1],[59,0],[59,1],[63,0],[63,1],[80,0],[80,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

        this.$ = ($$[$0] === 'this')
            ? yy.Node('ThisExpression', yy.loc(_$[$0]))
            : yy.Node('Identifier', parseIdentifierName($$[$0]), yy.loc(_$[$0]));
    
break;
case 2: case 27: case 52: case 85:
 this.$ = []; 
break;
case 3: case 28: case 88:

        yy.locComb(this._$, _$[$0]);
        this.$ = $$[$0-1];
        $$[$0-1].push($$[$0]);
    
break;
case 4:
 this.$ = yy.Node('CallExpression', yy.Node('Identifier', 'keyword', yy.loc(this._$)), [yy.Node('Literal', $$[$0], yy.loc(this._$))], yy.loc(this._$)); 
break;
case 5:

        var name = $$[$0].slice(1);
        if (name === '') name = '1';
        if (name === '&') name = 'rest';
        var anonArgNum = (name === 'rest') ? 0 : Number(name);
        name = '__$' + name;
        this.$ = yy.Node('Identifier', name, yy.loc(_$[$0]));
        this.$.anonArg = true;
        this.$.anonArgNum = anonArgNum;
    
break;
case 6:
 this.$ = parseNumLiteral('Integer', $$[$0], yy.loc(_$[$0]), yy, yytext); 
break;
case 7:
 this.$ = parseNumLiteral('Float', $$[$0], yy.loc(_$[$0]), yy, yytext); 
break;
case 8:
 this.$ = parseLiteral('String', parseString($$[$0]), yy.loc(_$[$0]), yy.raw[yy.raw.length-1], yy); 
break;
case 9:
 this.$ = parseLiteral('Boolean', true, yy.loc(_$[$0]), yytext, yy); 
break;
case 10:
 this.$ = parseLiteral('Boolean', false, yy.loc(_$[$0]), yytext, yy); 
break;
case 11:
 this.$ = parseLiteral('Nil', null, yy.loc(_$[$0]), yytext, yy); 
break;
case 15:
 this.$ = parseCollectionLiteral('vector', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 16:
 this.$ = parseCollectionLiteral('list', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 17:
 this.$ = parseCollectionLiteral('hash-map', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 18:
 this.$ = parseCollectionLiteral('hash-set', getValueIfUndefined($$[$0-1], []), yy.loc(this._$), yy); 
break;
case 22: case 82:
 this.$ = $$[$0-1]; 
break;
case 29:
 this.$ = { fixed: $$[$0], rest: null }; 
break;
case 30:

        if ($$[$0].keys && $$[$0].ids) {
            throw new Error('Rest args cannot be destructured by a hash map');
        }
        this.$ = { fixed: $$[$0-2], rest: $$[$0] };
    
break;
case 31: case 40: case 80: case 81:
 this.$ = $$[$0]; 
break;
case 32:
 this.$ = { keys: [], ids: [] }; 
break;
case 33:

        $$[$0-1].destrucId = $$[$0];
        this.$ = $$[$0-1];
    
break;
case 34:

        var id;
        for (var i = 0, len = $$[$0-1].length; i < len; ++i) {
            id = $$[$0-1][i];
            $$[$0-4].ids.push(id);
            $$[$0-4].keys.push(yy.Node('CallExpression',
                yy.Node('Identifier', 'keyword', id.loc),
                [yy.Node('Literal', id.name, id.loc)], id.loc));
        }
        this.$ = $$[$0-4];
    
break;
case 35:

        var id;
        for (var i = 0, len = $$[$0-1].length; i < len; ++i) {
            id = $$[$0-1][i];
            $$[$0-4].ids.push(id);
            $$[$0-4].keys.push(yy.Node('Literal', id.name, id.loc));
        }
        this.$ = $$[$0-4];
    
break;
case 36:

        $$[$0-2].ids.push($$[$0-1]);
        $$[$0-2].keys.push($$[$0]);
        this.$ = $$[$0-2];
    
break;
case 37:

        this.$ = $$[$0-2];
        this.$.destrucId = getValueIfUndefined($$[$0-1], yy.Node('Identifier', null, yy.loc(_$[$0-3])));
    
break;
case 38:

        this.$ = $$[$0-1];
        this.$.destrucId = getValueIfUndefined(this.$.destrucId, yy.Node('Identifier', null, yy.loc(_$[$0-2])));
    
break;
case 39:

        var processed = processSeqDestrucForm($$[$0-2], yy);
        var ids = processed.ids;
        $$[$0].body = processed.stmts.concat($$[$0].body);

        var hasRecurForm = processRecurFormIfAny($$[$0], ids, yy);
        if (hasRecurForm) {
            var blockLoc = $$[$0].loc;
            $$[$0] = yy.Node('BlockStatement', [
                yy.Node('WhileStatement', yy.Node('Literal', true, blockLoc),
                    $$[$0], blockLoc)], blockLoc);
        }

        var arityCheck = createArityCheckStmt(ids.length, $$[$0-2].rest, yy.loc(_$[$0-2]), yy);
        $$[$0].body.unshift(arityCheck);

        this.$ = yy.Node('FunctionExpression', null, ids, null,
            $$[$0], false, false, yy.loc(_$[$0]));
    
break;
case 41:
 this.$ = parseVarDecl($$[$0-1], $$[$0], yy.loc(_$[$0-2]), yy); 
break;
case 42:

        var body = $$[$0-1], bodyLoc = _$[$0-1];
        var maxArgNum = 0;
        var hasRestArg = false;
        estraverse.traverse(body, {
            enter: function (node) {
                if (node.type === 'Identifier' && node.anonArg) {
                    if (node.anonArgNum === 0)   // 0 denotes rest arg
                        hasRestArg = true;
                    else if (node.anonArgNum > maxArgNum)
                        maxArgNum = node.anonArgNum;
                    delete node.anonArg;
                    delete node.anonArgNum;
                }
            }
        });
        var args = [];
        for (var i = 1; i <= maxArgNum; ++i) {
            args.push(yy.Node('Identifier', '__$' + i, yy.loc(_$[$0-1])));
        }
        body = wrapInExpressionStatement(body, yy);
        body = yy.Node('BlockStatement', [body], yy.loc(bodyLoc));
        createReturnStatementIfPossible(body, yy);
        if (hasRestArg) {
            var restId = yy.Node('Identifier', '__$rest', yy.loc(bodyLoc));
            var restDecl = createRestArgsDecl(restId, null, maxArgNum, yy.loc(bodyLoc), yy);
            body.body.unshift(restDecl);
        }

        var arityCheck = createArityCheckStmt(maxArgNum, hasRestArg, yy.loc(_$[$0-3]), yy);
        body.body.unshift(arityCheck);

        this.$ = yy.Node('FunctionExpression', null, args, null, body,
            false, false, yy.loc(_$[$0-3]));
    
break;
case 43:

        this.$ = yy.Node('IfStatement', $$[$0-2], $$[$0-1], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-3]));
        // for code like ((if true +) 1 2 3)
        if (this.$.consequent.type === 'ExpressionStatement' &&
            (this.$.alternate === null || this.$.alternate.type === 'ExpressionStatement')) {
            this.$.type = 'ConditionalExpression';
            this.$.consequent = this.$.consequent.expression;
            if (this.$.alternate === null)
                this.$.alternate = yy.Node('Literal', null, yy.loc(_$[$0-3]));
            else
                this.$.alternate = this.$.alternate.expression;
        }
    
break;
case 44:

        this.$ = yy.Node('IfStatement', $$[$0-2], $$[$0-1], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-3]));
        // for code like ((if-not true +) 1 2 3)
        if (this.$.consequent.type === 'ExpressionStatement' &&
            (this.$.alternate === null || this.$.alternate.type === 'ExpressionStatement')) {
            this.$.type = 'ConditionalExpression';
            var testLoc = yy.loc(_$[$0-2]);
            this.$.test = yy.Node('CallExpression', yy.Node('Identifier', 'not', testLoc),
                [this.$.test], testLoc);
            this.$.consequent = this.$.consequent.expression;
            if (this.$.alternate === null)
                this.$.alternate = yy.Node('Literal', null, yy.loc(_$[$0-3]));
            else
                this.$.alternate = this.$.alternate.expression;
        }
    
break;
case 45:

        this.$ = yy.Node('IfStatement', $$[$0-1], $$[$0], null, yy.loc(_$[$0-2]));
    
break;
case 46:

        this.$ = yy.Node('IfStatement', $$[$0-1], $$[$0], null, yy.loc(_$[$0-2]));
        var testLoc = yy.loc(_$[$0-1]);
        this.$.test = yy.Node('CallExpression', yy.Node('Identifier', 'not', testLoc),
            [this.$.test], testLoc);
    
break;
case 47:

        $$[$0] = getValueIfUndefined($$[$0], [yy.Node('Literal', true, yy.loc(_$[$0-1]))]);
        this.$ = parseLogicalExpr('&&', $$[$0], yy.loc(_$[$0-1]), yy);
    
break;
case 48:

        $$[$0] = getValueIfUndefined($$[$0], [yy.Node('Literal', null, yy.loc(_$[$0-1]))]);
        this.$ = parseLogicalExpr('||', $$[$0], yy.loc(_$[$0-1]), yy);
    
break;
case 49:
 this.$ = parseVarDecl($$[$0-1], $$[$0], yy.loc(this._$), yy); 
break;
case 50:

        var processed = processDestrucForm({ fixed: [$$[$0-1]], rest: null }, yy);
        this.$ = {
            decl: yy.Node('VariableDeclarator', processed.ids[0], getValueIfUndefined($$[$0], null), yy.loc(_$[$0-1])),
            stmts: processed.stmts
        };
    
break;
case 51:

        var decl = yy.Node('VariableDeclaration', 'var', [$$[$0].decl], yy.loc(_$[$0]));
        $$[$0-1].push({ decl: decl, stmts: $$[$0].stmts });
        this.$ = $$[$0-1];
    
break;
case 53:

        var body = [], i, len, letBinding;
        for (i = 0, len = $$[$0-2].length; i < len; ++i) {
            letBinding = $$[$0-2][i];
            body = body.concat([letBinding.decl]).concat(letBinding.stmts);
        }
        body = body.concat($$[$0]);
        this.$ = wrapInIIFE(body, yy.loc(_$[$0-4]), yy);
    
break;
case 54:
 this.$ = yy.Node('AssignmentExpression', '=', $$[$0-1], $$[$0], yy.loc(_$[$0-2])); 
break;
case 55:

        var lhs = yy.Node('MemberExpression', $$[$0-2],
            yy.Node('Identifier', $$[$0-3], yy.loc(_$[$0-3])),
            false, yy.loc(_$[$0-4]));
        this.$ = yy.Node('AssignmentExpression', '=', lhs, $$[$0], yy.loc(_$[$0-6]));
    
break;
case 56:

        var body = [], i, len, letBinding;
        for (i = 0, len = $$[$0-2].length; i < len; ++i) {
            letBinding = $$[$0-2][i];
            body.push(letBinding.decl);
            $$[$0].body = letBinding.stmts.concat($$[$0].body);
        }

        body.push($$[$0]);
        this.$ = wrapInIIFE(body, yy.loc(_$[$0-4]), yy);

        var blockBody = this.$.callee.object.body.body, whileBlock, whileBlockIdx, stmt;
        for (var i = 0, len = blockBody.length; i < len; ++i) {
            stmt = blockBody[i];
            if (stmt.type === 'BlockStatement') {
                whileBlockIdx = i;
                whileBlock = stmt;
            }
        }

        var actualArgs = [];
        for (var i = 0, len = $$[$0-2].length; i < len; ++i) {
            actualArgs.push($$[$0-2][i].decl.declarations[0].id);
        }

        processRecurFormIfAny(whileBlock, actualArgs, yy);

        var whileBody = whileBlock.body;
        var lastLoc = (whileBody.length > 0) ? (whileBody[whileBody.length-1].loc) : whileBlock.loc;
        whileBody.push(yy.Node('BreakStatement', null, lastLoc));
        blockBody[whileBlockIdx] = yy.Node('WhileStatement', yy.Node('Literal', true, yy.loc(_$[$0])),
            whileBlock, yy.loc(_$[$0]));
    
break;
case 57:

        $$[$0] = getValueIfUndefined($$[$0], []);
        var body = [], id, assignment, arg;
        for (var i = 0; i < $$[$0].length; ++i) {
            arg = $$[$0][i];
            id = yy.Node('Identifier', '__$recur' + i, arg.loc);
            id.recurArg = true;
            id.recurArgIdx = i;
            assignment = yy.Node('AssignmentExpression', '=', id, arg, arg.loc);
            body.push(wrapInExpressionStatement(assignment, yy));
        }
        this.$ = yy.Node('BlockStatement', body, yy.loc(_$[$0-1]));
        this.$.recurBlock = true;
    
break;
case 58:

        var init = parseVarDecl($$[$0-3],
            parseNumLiteral('Integer', '0', yy.loc(_$[$0-3]), yy),
            yy.loc(_$[$0-3]), yy);
        var maxId = yy.Node('Identifier', '__$max' + dotimesIdx++, yy.loc(_$[$0-2]));
        addVarDecl(init, maxId, $$[$0-2], yy.loc(_$[$0-2]), yy);
        var test = yy.Node('BinaryExpression', '<', $$[$0-3], maxId, yy.loc(_$[$0-3]));
        var update = yy.Node('UpdateExpression', '++', $$[$0-3], true, yy.loc(_$[$0-3]));
        var forLoop = yy.Node('ForStatement', init, test, update, $$[$0], yy.loc(_$[$0-5]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([forLoop], yy.loc(_$[$0-5]), yy);
        this.$ = forLoop;
    
break;
case 59:

        var idLoc = yy.loc(_$[$0-3]), sexprLoc = yy.loc(_$[$0-2]);
        var seqId = yy.Node('Identifier', '__$doseqSeq' + doseqIdx++, sexprLoc);
        var init = parseVarDecl(seqId, $$[$0-2], sexprLoc, yy);
        addVarDecl(init, $$[$0-3],
            yy.Node('CallExpression', yy.Node('Identifier', 'first', idLoc),
                [seqId], idLoc), idLoc, yy);
        var test = yy.Node('BinaryExpression', '!==', $$[$0-3],
            yy.Node('Literal', null, idLoc), idLoc);
        var seqUpdate = yy.Node('AssignmentExpression', '=', seqId,
            yy.Node('CallExpression', yy.Node('Identifier', 'rest', sexprLoc),
                [seqId], sexprLoc), sexprLoc);
        var idUpdate = yy.Node('AssignmentExpression', '=', $$[$0-3],
            yy.Node('CallExpression', yy.Node('Identifier', 'first', idLoc),
                [seqId], idLoc), idLoc);
        var update = yy.Node('SequenceExpression', [seqUpdate, idUpdate], idLoc);
        var forLoop = yy.Node('ForStatement', init, test, update, $$[$0], yy.loc(_$[$0-5]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([forLoop], yy.loc(_$[$0-5]), yy);
        this.$ = forLoop;
    
break;
case 60:

        var whileLoop = yy.Node('WhileStatement', $$[$0-1], $$[$0], yy.loc(_$[$0-2]));
        // wrapping it in an IIFE makes it not work in CodeCombat
        // see https://github.com/codecombat/aether/issues/49
        // this.$ = wrapInIIFE([whileLoop], yy.loc(_$[$0-2]), yy);
        this.$ = whileLoop;
    
break;
case 61:

        $$[$0] = getValueIfUndefined($$[$0], []);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Literal', $$[$0-2], yy.loc(_$[$0-2])),
            true, yy.loc(this._$));
        var fnCall = yy.Node('CallExpression', callee, $$[$0], yy.loc(this._$));
        if ($$[$0].length > 0) {
            this.$ = fnCall;
        } else {
            // (.prop obj) can either be a call to a 0-argument fn, or a property access.
            // if both are possible, the function call is chosen. This is as per Clojure.
            // see http://clojure.org/java_interop#Java%20Interop-The%20Dot%20special%20form
            // (typeof obj['prop'] === 'function' && obj['prop'].length === 0) ? obj['prop']() : obj['prop'];
            this.$ = yy.Node('ConditionalExpression',
                yy.Node('LogicalExpression', '&&',
                    yy.Node('BinaryExpression', '===',
                        yy.Node('UnaryExpression', 'typeof', callee, true, yy.loc(this._$)),
                        yy.Node('Literal', 'function', yy.loc(this._$)), yy.loc(this._$)),
                    yy.Node('BinaryExpression', '===',
                        yy.Node('MemberExpression', callee,
                            yy.Node('Identifier', 'length', yy.loc(this._$)),
                            false, yy.loc(this._$)),
                        yy.Node('Literal', 0, yy.loc(this._$)), yy.loc(this._$)),
                    yy.loc(this._$)),
                fnCall, callee, yy.loc(this._$));
        }
    
break;
case 62:

        this.$ = yy.Node('NewExpression', $$[$0-1], getValueIfUndefined($$[$0], []), yy.loc(_$[$0-2]));
    
break;
case 63:

        this.$ = yy.Node('NewExpression', $$[$0-2], getValueIfUndefined($$[$0], []), yy.loc(_$[$0-2]));
    
break;
case 64:
 this.$ = yy.Node('EmptyStatement', yy.loc(_$[$0])); 
break;
case 78:

        yy.locComb(this._$, _$[$0]);
        var callee = yy.Node('MemberExpression', $$[$0-1],
            yy.Node('Identifier', 'call', yy.loc(_$[$0-1])),
            false, yy.loc(_$[$0-1]));
        $$[$0] = getValueIfUndefined($$[$0], []);
        $$[$0].unshift(yy.Node('ThisExpression', yy.loc(_$[$0-1])));
        this.$ = yy.Node('CallExpression', callee, $$[$0], yy.loc(this._$));
    
break;
case 79:
 this.$ = wrapInIIFE($$[$0], yy.loc(_$[$0-1]), yy); 
break;
case 84:
 this.$ = wrapInExpressionStatement($$[$0], yy); 
break;
case 86:
 this.$ = $$[$0-2]; $$[$0-2].push($$[$0-1], $$[$0]); 
break;
case 87:
 this.$ = [$$[$0]]; 
break;
case 89:

        for (var i = 0, len = $$[$0].length; i < len; ++i) {
            $$[$0][i] = wrapInExpressionStatement($$[$0][i], yy);
        }
    
break;
case 91:

        // do forms evaluate to nil if the body is empty
        nilNode = parseLiteral('Nil', null, yy.loc(_$[$0]), yytext, yy);
        this.$ = [yy.Node('ExpressionStatement', nilNode, nilNode.loc)];
    
break;
case 92:

        this.$ = yy.Node('BlockStatement', $$[$0], yy.loc(_$[$0]));
    
break;
case 93:

        this.$ = createReturnStatementIfPossible($$[$0], yy);
    
break;
case 94:

        var prog = yy.Node('Program', $$[$0-1], yy.loc(_$[$0-1]));
        resetGeneratedIds();
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
case 95:

        var prog = yy.Node('Program', [], {
            end: { column: 0, line: 0 },
            start: { column: 0, line: 0 },
            range: [0, 0]
        });
        resetGeneratedIds();
        processLocsAndRanges(prog, yy.locs, yy.ranges);
        return prog;
    
break;
}
},
table: [{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:5,94:4,95:2,96:1,97:[1,3]},{1:[3]},{97:[1,26]},{1:[2,95]},o([23,97],[2,89],{10:6,17:7,30:9,6:16,3:17,8:18,41:27,4:$V0,7:$V1,9:$V2,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd}),o($Ve,[2,87]),o($Vf,[2,80]),o($Vf,[2,81]),{3:62,4:$V0,6:64,7:$V1,8:67,9:$V2,17:63,18:$V9,21:$Va,22:$Vg,23:$Vh,24:$Vc,27:$Vd,28:42,29:28,30:66,45:29,46:$Vi,47:$Vj,48:30,49:$Vk,53:$Vl,54:$Vm,56:$Vn,57:31,58:$Vo,60:$Vp,61:32,62:$Vq,66:33,67:$Vr,69:34,70:$Vs,71:$Vt,75:35,76:$Vu,78:36,79:$Vv,81:37,82:$Vw,83:38,84:$Vx,85:39,86:$Vy,87:40,88:41,89:$Vz,91:$VA},o($Vf,[2,83]),o($Vf,[2,6]),o($Vf,[2,7]),o($Vf,[2,8]),o($Vf,[2,9]),o($Vf,[2,10]),o($Vf,[2,11]),o($Vf,[2,12]),o($Vf,[2,13]),o($Vf,[2,14]),{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,19:68,20:$VB,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:5,94:69},{22:[1,70]},o($VC,[2,85],{93:71}),{22:[1,73],24:[1,72]},{4:[1,74]},o([4,7,9,11,12,13,14,15,16,18,20,21,22,23,24,26,27,35,37,39,40,71,97],[2,1]),o($Vf,[2,5]),{1:[2,94]},o($Ve,[2,88]),{23:[1,75]},{23:[2,65]},{23:[2,66]},{23:[2,67]},{23:[2,68]},{23:[2,69]},{23:[2,70]},{23:[2,71]},{23:[2,72]},{23:[2,73]},{23:[2,74]},{23:[2,75]},{23:[2,76]},{23:[2,77]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VD,24:$Vc,27:$Vd,30:9,41:5,80:76,94:77},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:78,94:4,95:79},{18:$VF,43:80},{3:82,4:$V0},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:83},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:84},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:85},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:86},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VG,24:$Vc,27:$Vd,30:9,41:5,59:87,94:88},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VG,24:$Vc,27:$Vd,30:9,41:5,59:89,94:88},{3:90,4:$V0},{18:[1,91]},{3:92,4:$V0,22:[1,93]},{18:[1,94]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VD,24:$Vc,27:$Vd,30:9,41:5,80:95,94:77},{18:[1,96]},{18:[1,97]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:98},{4:[1,99]},{3:100,4:$V0},o($VH,[2,19],{71:[1,101]}),o($VH,[2,20]),o($VH,[2,21]),{3:62,4:$V0,6:64,7:$V1,8:67,9:$V2,17:63,18:$V9,21:$Va,22:$Vg,23:$Vh,24:$Vc,27:$Vd,28:42,29:102,30:66,45:29,46:$Vi,47:$Vj,48:30,49:$Vk,53:$Vl,54:$Vm,56:$Vn,57:31,58:$Vo,60:$Vp,61:32,62:$Vq,66:33,67:$Vr,69:34,70:$Vs,71:$Vt,75:35,76:$Vu,78:36,79:$Vv,81:37,82:$Vw,83:38,84:$Vx,85:39,86:$Vy,87:40,88:41,89:$Vz,91:$VA},o($VH,[2,23]),o($VH,[2,24]),{20:[1,103]},o([20,23,26],[2,97],{10:6,17:7,30:9,6:16,3:17,8:18,41:27,4:$V0,7:$V1,9:$V2,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd}),{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,19:104,21:$Va,22:$Vb,23:$VB,24:$Vc,27:$Vd,30:9,41:5,94:69},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,26:[1,105],27:$Vd,30:9,41:106},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,19:107,21:$Va,22:$Vb,24:$Vc,26:$VB,27:$Vd,30:9,41:5,94:69},{3:62,4:$V0,6:64,7:$V1,8:67,9:$V2,17:63,18:$V9,21:$Va,22:$Vg,23:$Vh,24:$Vc,27:$Vd,28:42,29:108,30:66,45:29,46:$Vi,47:$Vj,48:30,49:$Vk,53:$Vl,54:$Vm,56:$Vn,57:31,58:$Vo,60:$Vp,61:32,62:$Vq,66:33,67:$Vr,69:34,70:$Vs,71:$Vt,75:35,76:$Vu,78:36,79:$Vv,81:37,82:$Vw,83:38,84:$Vx,85:39,86:$Vy,87:40,88:41,89:$Vz,91:$VA},o($Vf,[2,4]),o($Vf,[2,82]),{23:[2,78]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:[2,107],24:$Vc,27:$Vd,30:9,41:27},{23:[2,79]},{23:[2,90]},{23:[2,40]},o([4,18,20,24,35],$VI,{34:109,33:110}),{18:$VF,43:111},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:113,92:112},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:113,92:114},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:116,77:115,94:4,95:79},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:116,77:117,94:4,95:79},{23:[2,47]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:[2,103],24:$Vc,27:$Vd,30:9,41:27},{23:[2,48]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:[2,104],24:$Vc,27:$Vd,30:9,41:119,63:118},o($VJ,$VK,{65:120}),{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:121},{71:[1,122]},o($VJ,$VK,{65:123}),{23:[2,57]},{3:124,4:$V0},{3:125,4:$V0},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:116,77:126,94:4,95:79},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:127},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VD,24:$Vc,27:$Vd,30:9,41:5,80:128,94:77},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VD,24:$Vc,27:$Vd,30:9,41:5,80:129,94:77},{23:[1,130]},o($Vf,[2,15]),{23:[1,131]},o($Vf,[2,17]),{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:132},{26:[1,133]},{23:[1,134]},{20:[1,135]},o($VL,[2,29],{31:137,3:138,32:139,4:$V0,18:$VM,24:$VN,35:[1,136]}),{23:[2,41]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VO,24:$Vc,27:$Vd,30:9,41:113,52:142,92:143},o($VH,[2,84]),{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VO,24:$Vc,27:$Vd,30:9,41:113,52:144,92:143},{23:[2,45]},{23:[2,92]},{23:[2,46]},{23:[2,49]},{23:[2,105]},{3:138,4:$V0,18:$VM,20:[1,145],24:$VN,31:147,32:139,64:146},{23:[2,54]},{4:[1,148]},{3:138,4:$V0,18:$VM,20:[1,149],24:$VN,31:147,32:139,64:146},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:150},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:151},{23:[2,60]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VD,24:$Vc,27:$Vd,30:9,41:5,80:152,94:77},{23:[2,62]},{23:[2,63]},o($VH,[2,22]),o($Vf,[2,16]),o($VC,[2,86]),o($Vf,[2,18]),o($Vf,[2,42]),{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,44:153,68:116,77:154,94:4,95:79},{3:138,4:$V0,18:$VM,24:$VN,31:155,32:139},o($VP,[2,28]),o($VQ,[2,25]),o($VQ,[2,26]),o($VP,$VI,{33:110,34:156}),o($VR,[2,32],{38:157}),{23:[2,43]},{23:[2,101]},{23:[2,44]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:158,94:4,95:79},o($VJ,[2,51]),{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:159},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:160},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:116,77:161,94:4,95:79},{20:[1,162]},{20:[1,163]},{23:[2,61]},{23:[2,39]},{23:[2,93]},o($VL,[2,30]),{20:[2,98],36:165,37:$VS,42:164},{3:138,4:$V0,18:$VM,24:$VN,26:[1,167],31:171,32:139,36:168,37:$VS,39:[1,169],40:[1,170]},{23:[2,53]},o($VJ,[2,50]),{23:[1,172]},{23:[2,56]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:116,77:173,94:4,95:79},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,23:$VE,24:$Vc,27:$Vd,30:9,41:5,68:116,77:174,94:4,95:79},{20:[1,175]},{20:[2,99]},{3:176,4:$V0},o($VQ,[2,38]),o($VR,[2,33]),{18:[1,177]},{18:[1,178]},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:179},{3:17,4:$V0,6:16,7:$V1,8:18,9:$V2,10:6,11:$V3,12:$V4,13:$V5,14:$V6,15:$V7,16:$V8,17:7,18:$V9,21:$Va,22:$Vb,24:$Vc,27:$Vd,30:9,41:180},{23:[2,58]},{23:[2,59]},o($VQ,[2,37]),o([4,18,20,24,26,37,39,40],[2,31]),o($VT,$VU,{5:181}),o($VT,$VU,{5:182}),o($VR,[2,36]),{23:[2,55]},{3:184,4:$V0,20:[1,183]},{3:184,4:$V0,20:[1,185]},o($VR,[2,34]),o($VT,[2,3]),o($VR,[2,35])],
defaultActions: {3:[2,95],26:[2,94],29:[2,65],30:[2,66],31:[2,67],32:[2,68],33:[2,69],34:[2,70],35:[2,71],36:[2,72],37:[2,73],38:[2,74],39:[2,75],40:[2,76],41:[2,77],76:[2,78],78:[2,79],79:[2,90],80:[2,40],87:[2,47],89:[2,48],95:[2,57],111:[2,41],115:[2,45],116:[2,92],117:[2,46],118:[2,49],119:[2,105],121:[2,54],126:[2,60],128:[2,62],129:[2,63],142:[2,43],143:[2,101],144:[2,44],152:[2,61],153:[2,39],154:[2,93],158:[2,53],161:[2,56],165:[2,99],173:[2,58],174:[2,59],180:[2,55]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


var estraverse = require('estraverse');

var expressionTypes = ['ThisExpression', 'ArrayExpression', 'ObjectExpression',
    'FunctionExpression', 'ArrowExpression', 'SequenceExpression', 'Identifier',
    'UnaryExpression', 'BinaryExpression', 'AssignmentExpression', 'Literal',
    'UpdateExpression', 'LogicalExpression', 'ConditionalExpression',
    'NewExpression', 'CallExpression', 'MemberExpression'];

// indices for generated identifiers
var destrucArgIdx, doseqIdx, dotimesIdx;
resetGeneratedIds();
function resetGeneratedIds() {
    destrucArgIdx = doseqIdx = dotimesIdx = 0;
}

function processSeqDestrucForm(args, yy) {
    var i, len, arg;
    var fixed = args.fixed, rest = args.rest;
    var ids = [], stmts = [];
    for (i = 0, len = fixed.length; i < len; ++i) {
        arg = fixed[i];
        if (arg.type && arg.type === 'Identifier') {
            ids.push(arg);
        } else if (! arg.type) {
            arg.destrucId.name = arg.destrucId.name || '__$destruc' + destrucArgIdx++;
            ids.push(arg.destrucId);
            stmts = processChildDestrucForm(arg, stmts, yy);
        }
    }

    if (rest) {
        if (rest.type && rest.type === 'Identifier') {
            decl = createRestArgsDecl(rest, args.destrucId, fixed.length, rest.loc, yy);
            stmts.push(decl);
        } else if (! rest.type) {
            rest.destrucId.name = rest.destrucId.name || '__$destruc' + destrucArgIdx++;
            decl = createRestArgsDecl(rest.destrucId, args.destrucId, fixed.length, rest.destrucId.loc, yy);
            stmts.push(decl);
            stmts = processChildDestrucForm(rest, stmts, yy);
        }
    }

    return { ids: ids, pairs: [], stmts: stmts };
}

function processMapDestrucForm(args, yy) {
    var keys = args.keys, valIds = args.ids, key, id;
    var pairs = [], stmts = [];
    var decl, init, yyloc;
    for (var i = 0, len = valIds.length; i < len; ++i) {
        id = valIds[i], key = keys[i];
        if (id.type && id.type === 'Identifier') {
            yyloc = id.loc;
            init = yy.Node('CallExpression',
                yy.Node('Identifier', 'get', yyloc),
                [args.destrucId, key], yyloc);
            decl = parseVarDecl(id, init, yyloc, yy);
            stmts.push(decl);
        } else if (! id.type) {
            id.destrucId.name = id.destrucId.name || '__$destruc' + destrucArgIdx++;
            pairs.push({ id: id.destrucId, key: key });
            stmts = processChildDestrucForm(id, stmts, yy);
        }
    }
    return { ids: [], pairs: pairs, stmts: stmts };
}

function processDestrucForm(args, yy) {
    if (args.fixed !== undefined && args.rest !== undefined) {
        return processSeqDestrucForm(args, yy);
    } else if (args.keys !== undefined && args.ids !== undefined) {
        return processMapDestrucForm(args, yy);
    }
}

function processChildDestrucForm(arg, stmts, yy) {
    var i, len, processed = processDestrucForm(arg, yy);
    var processedId, processedKey, yyloc, init, decl, nilDecl, tryStmt, catchClause, errorId;
    for (i = 0, len = processed.ids.length; i < len; ++i) {
        processedId = processed.ids[i];
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'nth', yyloc),
            [arg.destrucId, yy.Node('Literal', i, yyloc)],
            yyloc);

        decl = parseVarDecl(processedId, init, processedId.loc, yy);
        nilDecl = parseVarDecl(processedId, yy.Node('Literal', null, yyloc), processedId.loc, yy);

        errorId = yy.Node('Identifier', '__$error', yyloc);
        catchClause = yy.Node('CatchClause', errorId, null,
            yy.Node('BlockStatement', [
                yy.Node('IfStatement',
                    yy.Node('BinaryExpression', '!==',
                        yy.Node('MemberExpression', errorId,
                            yy.Node('Identifier', 'name', yyloc), false, yyloc),
                        yy.Node('Literal', 'IndexOutOfBoundsError', yyloc),
                        yyloc),
                    yy.Node('ThrowStatement', errorId, yyloc),
                    null, yyloc),
                wrapInExpressionStatement(
                    yy.Node('AssignmentExpression', '=', processedId,
                        yy.Node('Literal', null, yyloc), yyloc),
                    yy)],
                yyloc),
            yyloc);

        tryStmt = yy.Node('TryStatement',
            yy.Node('BlockStatement', [decl], yyloc),
            [catchClause], null, yyloc);

        stmts.push(tryStmt);
    }
    for (i = 0, len = processed.pairs.length; i < len; ++i) {
        processedId = processed.pairs[i].id, processedKey = processed.pairs[i].key;
        yyloc = processedId.loc;
        init = yy.Node('CallExpression',
            yy.Node('Identifier', 'get', yyloc),
            [arg.destrucId, processedKey], yyloc);
        decl = parseVarDecl(processedId, init, yyloc, yy);
        stmts.push(decl);
    }
    return stmts.concat(processed.stmts);
}

function processRecurFormIfAny(rootNode, actualArgs, yy) {
    var hasRecurForm = false;
    estraverse.traverse(rootNode, {
        enter: function (node) {
            if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
                return estraverse.VisitorOption.Skip;
            } else if (node.type === 'BlockStatement' && node.recurBlock) {
                hasRecurForm = true;
                var body = node.body;

                // get rid of return statement
                var lastStmt = body.length > 0 ? body[body.length-1] : null;
                if (lastStmt && lastStmt.type === 'ReturnStatement') {
                    lastStmt.type = 'ExpressionStatement';
                    lastStmt.expression = lastStmt.argument;
                    delete lastStmt.argument;
                }

                estraverse.traverse(node, {
                    enter: function (innerNode) {
                        if (innerNode.type === 'Identifier' && innerNode.recurArg) {
                            var actualArg = actualArgs[innerNode.recurArgIdx];
                            body.push(wrapInExpressionStatement(yy.Node('AssignmentExpression', '=', actualArg, innerNode, innerNode.loc), yy));
                            delete innerNode.recurArg;
                            delete innerNode.recurArgIdx;
                        }
                    }
                });

                var lastLoc = (body.length > 0) ? (body[body.length-1].loc) : body.loc;
                body.push(yy.Node('ContinueStatement', null, lastLoc));
                delete node.recurBlock;
            }
        }
    });
    return hasRecurForm;
}

// wrap the given array of statements in an IIFE (Immediately-Invoked Function Expression)
function wrapInIIFE(body, yyloc, yy) {
    var thisExp = yy.Node('ThisExpression', yyloc);
    return yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('FunctionExpression',
                null, [], null,
                createReturnStatementIfPossible(yy.Node('BlockStatement', body, yyloc), yy),
                false, false, yyloc),
            yy.Node('Identifier', 'call', yyloc), false, yyloc),
        [yy.Node('ConditionalExpression',
            yy.Node('BinaryExpression', '!==',
                yy.Node('UnaryExpression', 'typeof', thisExp, true, yyloc),
                yy.Node('Literal', 'undefined', yyloc), yyloc),
            thisExp,
            yy.Node('Literal', null, yyloc), yyloc)],
        yyloc);
}

function wrapInExpressionStatement(expr, yy) {
    if (expressionTypes.indexOf(expr.type) !== -1) {
        return yy.Node('ExpressionStatement', expr, expr.loc);
    }
    return expr;
}

function createArityCheckStmt(minArity, hasRestArgs, yyloc, yy) {
    var arityCheckArgs = [yy.Node('Literal', minArity, yyloc)];
    if (hasRestArgs) {
        arityCheckArgs.push(yy.Node('Identifier', 'Infinity', yyloc));
    }
    arityCheckArgs.push(yy.Node('MemberExpression',
        yy.Node('Identifier', 'arguments', yyloc),
        yy.Node('Identifier', 'length', yyloc), false, yyloc));
    var arityCheck = yy.Node('CallExpression',
        yy.Node('MemberExpression',
            yy.Node('Identifier', 'assertions', yyloc),
            yy.Node('Identifier', 'arity', yyloc),
            false, yyloc),
        arityCheckArgs, yyloc);
    return wrapInExpressionStatement(arityCheck, yy);
}

function createReturnStatementIfPossible(stmt, yy) {
    if (stmt === undefined || stmt === null || ! stmt.type)
        return stmt;
    var lastStmts = [], lastStmt;
    if (stmt.type === 'BlockStatement') {
        lastStmts.push(stmt.body[stmt.body.length - 1]);
    } else if (stmt.type === 'IfStatement') {
        lastStmts.push(stmt.consequent);
        if (stmt.alternate === null) {
            stmt.alternate = wrapInExpressionStatement(yy.Node('Literal', null, stmt.consequent.loc), yy);
        }
        lastStmts.push(stmt.alternate);
    } else {
        return stmt;
    }
    for (var i = 0; i < lastStmts.length; ++i) {
        lastStmt = lastStmts[i];
        if (! lastStmt) continue;
        if (lastStmt.type === 'ExpressionStatement') {
            lastStmt.type = 'ReturnStatement';
            lastStmt.argument = lastStmt.expression;
            delete lastStmt.expression;
        } else {
            createReturnStatementIfPossible(lastStmt, yy);
        }
    }
    return stmt;
}

function createRestArgsDecl(id, argsId, offset, yyloc, yy) {
    var restInit;
    if (! argsId) {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'seq', yyloc),
            [yy.Node('CallExpression',
                yy.Node('MemberExpression',
                    yy.Node('MemberExpression',
                        yy.Node('MemberExpression',
                            yy.Node('Identifier', 'Array', yyloc),
                            yy.Node('Identifier', 'prototype', yyloc), false, yyloc),
                        yy.Node('Identifier', 'slice', yyloc), false, yyloc),
                    yy.Node('Identifier', 'call', yyloc), false, yyloc),
                [yy.Node('Identifier', 'arguments', yyloc),
                 yy.Node('Literal', offset, yyloc)])],
            yyloc);
    } else {
        restInit = yy.Node('CallExpression', yy.Node('Identifier', 'drop', yyloc),
            [yy.Node('Literal', offset, yyloc), argsId]);
    }
    return parseVarDecl(id, restInit, yyloc, yy);
}

function parseLogicalExpr(op, exprs, yyloc, yy) {
    var logicalExpr = exprs[0];
    for (var i = 1, len = exprs.length; i < len; ++i) {
        logicalExpr = yy.Node('LogicalExpression', op, logicalExpr, exprs[i], yyloc);
    }
    return logicalExpr;
}

function parseVarDecl(id, init, yyloc, yy) {
    var stmt = yy.Node('VariableDeclaration', 'var', [], yyloc);
    return addVarDecl(stmt, id, init, yyloc, yy);
}

function addVarDecl(stmt, id, init, yyloc, yy) {
    var decl = yy.Node('VariableDeclarator', id, getValueIfUndefined(init, null), yyloc);
    stmt.declarations.push(decl);
    return stmt;
}

function parseNumLiteral(type, token, yyloc, yy, yytext) {
    var node;
    if (token[0] === '-') {
        node = parseLiteral(type, -Number(token), yyloc, yytext, yy);
        node = yy.Node('UnaryExpression', '-', node, true, yyloc);
    } else {
        node = parseLiteral(type, Number(token), yyloc, yytext, yy);
    }
    return node;
}

function parseLiteral(type, value, yyloc, raw, yy) {
    return yy.Node('Literal', value, yyloc, raw);
}

function parseCollectionLiteral(type, items, yyloc, yy) {
    return yy.Node('CallExpression', yy.Node('Identifier', parseIdentifierName(type), yyloc), items, yyloc);
}

var charMap = {
    '-': '_$_',
    '+': '_$PLUS_',
    '>': '_$GT_',
    '<': '_$LT_',
    '=': '_$EQ_',
    '!': '_$BANG_',
    '*': '_$STAR_',
    '/': '_$SLASH_',
    '?': '_$QMARK_'
};
function parseIdentifierName(name) {
    var charsToReplace = new RegExp('[' + Object.keys(charMap).join('') + ']', 'g');
    return name.replace(charsToReplace, function (c) { return charMap[c]; });
}

function parseString(str) {
    return str
        .replace(/\\(u[a-fA-F0-9]{4}|x[a-fA-F0-9]{2})/g, function (match, hex) {
            return String.fromCharCode(parseInt(hex.slice(1), 16));
        })
        .replace(/\\([0-3]?[0-7]{1,2})/g, function (match, oct) {
            return String.fromCharCode(parseInt(oct, 8));
        })
        .replace(/\\0[^0-9]?/g,'\u0000')
        .replace(/\\(?:\r\n?|\n)/g,'')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r')
        .replace(/\\t/g,'\t')
        .replace(/\\v/g,'\v')
        .replace(/\\f/g,'\f')
        .replace(/\\b/g,'\b')
        .replace(/\\(.)/g, '$1');
}

function processLocsAndRanges(prog, locs, ranges) {
    // this cannot be done 1 pass over all the nodes
    // because some of the loc / range objects point to the same instance in memory
    // so deleting one deletes the other as well
    estraverse.replace(prog, {
        leave: function (node) {
            if (ranges) node.range = node.loc.range || [0, 0];
            return node;
        }
    });

    estraverse.replace(prog, {
        leave: function (node) {
            if (node.loc && typeof node.loc.range !== 'undefined')
                delete node.loc.range;
            if (! locs && typeof node.loc !== 'undefined')
                delete node.loc;
            return node;
        }
    });
}

function getValueIfUndefined(variable, valueIfUndefined) {
    return (typeof variable === 'undefined') ? valueIfUndefined : variable;
}
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* whitespace */;
break;
case 1:
    return 11;

break;
case 2:
    return 12;

break;
case 3:
    yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2);
    return 13;

break;
case 4:
    return 9;

break;
case 5: /* ignore */ 
break;
case 6:return 35;
break;
case 7:return 22;
break;
case 8:return 23;
break;
case 9:return 18;
break;
case 10:return 20;
break;
case 11:return 24;
break;
case 12:return 26;
break;
case 13:return 27;
break;
case 14:return 21;
break;
case 15:return 7;
break;
case 16:return 71;
break;
case 17:return 62;
break;
case 18:return 46;
break;
case 19:return 47;
break;
case 20:return 49;
break;
case 21:return 53;
break;
case 22:return 54;
break;
case 23:return 56;
break;
case 24:return 91;
break;
case 25:return 67;
break;
case 26:return 76;
break;
case 27:return 79;
break;
case 28:return 58;
break;
case 29:return 60;
break;
case 30:return 70;
break;
case 31:return 82;
break;
case 32:return 84;
break;
case 33:return 86;
break;
case 34:return 89;
break;
case 35:return 37;
break;
case 36:return 39;
break;
case 37:return 40;
break;
case 38:return 14;
break;
case 39:return 15;
break;
case 40:return 16;
break;
case 41:
    return 4;

break;
case 42:return 'ILLEGAL-TOKEN';
break;
case 43: return 97; 
break;
case 44:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:([\s,]+))/,/^(?:([-+]?([1-9][0-9]+|[0-9])))/,/^(?:([-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))))/,/^(?:("([^\"\\]|\\[\'\"\\bfnrt])*"))/,/^(?:(%(&|[1-9]|[0-9]|)?))/,/^(?:(;[^\r\n]*))/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:#)/,/^(?:')/,/^(?::)/,/^(?:\.)/,/^(?:def)/,/^(?:fn)/,/^(?:defn)/,/^(?:if)/,/^(?:if-not)/,/^(?:when)/,/^(?:when-not)/,/^(?:do)/,/^(?:let)/,/^(?:loop)/,/^(?:recur)/,/^(?:and)/,/^(?:or)/,/^(?:set!)/,/^(?:dotimes)/,/^(?:doseq)/,/^(?:while)/,/^(?:new)/,/^(?::as)/,/^(?::keys)/,/^(?::strs)/,/^(?:true)/,/^(?:false)/,/^(?:nil)/,/^(?:([a-zA-Z*+!\-_=<>?/][0-9a-zA-Z*+!\-_=<>?/]*))/,/^(?:.)/,/^(?:$)/,/^(?:.)/],
conditions: {"regex":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require("JkpR2F"))
},{"JkpR2F":11,"estraverse":6,"fs":7,"path":10}],6:[function(require,module,exports){
/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*jslint vars:false, bitwise:true*/
/*jshint indent:4*/
/*global exports:true, define:true*/
(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // and plain browser loading,
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.estraverse = {}));
    }
}(this, function (exports) {
    'use strict';

    var Syntax,
        isArray,
        VisitorOption,
        VisitorKeys,
        BREAK,
        SKIP;

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    function ignoreJSHintError() { }

    isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }

    function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                } else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }

    function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    ignoreJSHintError(shallowCopy);

    // based on LLVM libc++ upper_bound / lower_bound
    // MIT License

    function upperBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                len = diff;
            } else {
                i = current + 1;
                len -= diff + 1;
            }
        }
        return i;
    }

    function lowerBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                i = current + 1;
                len -= diff + 1;
            } else {
                len = diff;
            }
        }
        return i;
    }
    ignoreJSHintError(lowerBound);

    VisitorKeys = {
        AssignmentExpression: ['left', 'right'],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: ['params', 'defaults', 'rest', 'body'],
        BlockStatement: ['body'],
        BinaryExpression: ['left', 'right'],
        BreakStatement: ['label'],
        CallExpression: ['callee', 'arguments'],
        CatchClause: ['param', 'body'],
        ClassBody: ['body'],
        ClassDeclaration: ['id', 'body', 'superClass'],
        ClassExpression: ['id', 'body', 'superClass'],
        ConditionalExpression: ['test', 'consequent', 'alternate'],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ['body', 'test'],
        EmptyStatement: [],
        ExpressionStatement: ['expression'],
        ForStatement: ['init', 'test', 'update', 'body'],
        ForInStatement: ['left', 'right', 'body'],
        ForOfStatement: ['left', 'right', 'body'],
        FunctionDeclaration: ['id', 'params', 'defaults', 'rest', 'body'],
        FunctionExpression: ['id', 'params', 'defaults', 'rest', 'body'],
        Identifier: [],
        IfStatement: ['test', 'consequent', 'alternate'],
        Literal: [],
        LabeledStatement: ['label', 'body'],
        LogicalExpression: ['left', 'right'],
        MemberExpression: ['object', 'property'],
        MethodDefinition: ['key', 'value'],
        NewExpression: ['callee', 'arguments'],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: ['key', 'value'],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SwitchStatement: ['discriminant', 'cases'],
        SwitchCase: ['test', 'consequent'],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: ['id', 'init'],
        WhileStatement: ['test', 'body'],
        WithStatement: ['object', 'body'],
        YieldExpression: ['argument']
    };

    // unique id
    BREAK = {};
    SKIP = {};

    VisitorOption = {
        Break: BREAK,
        Skip: SKIP
    };

    function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
    }

    Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
    };

    function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
    }

    function Controller() { }

    // API:
    // return property path array from root to current node
    Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;

        function addToPath(result, path) {
            if (isArray(path)) {
                for (j = 0, jz = path.length; j < jz; ++j) {
                    result.push(path[j]);
                }
            } else {
                result.push(path);
            }
        }

        // root node
        if (!this.__current.path) {
            return null;
        }

        // first node is sentinel, second node is root element
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
            element = this.__leavelist[i];
            addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
    };

    // API:
    // return array of parent elements
    Controller.prototype.parents = function parents() {
        var i, iz, result;

        // first node is sentinel
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
            result.push(this.__leavelist[i].node);
        }

        return result;
    };

    // API:
    // return current node
    Controller.prototype.current = function current() {
        return this.__current.node;
    };

    Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;

        result = undefined;

        previous  = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;

        return result;
    };

    // API:
    // notify control skip / break
    Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
    };

    // API:
    // skip child nodes of current node
    Controller.prototype.skip = function () {
        this.notify(SKIP);
    };

    // API:
    // break traversals
    Controller.prototype['break'] = function () {
        this.notify(BREAK);
    };

    Controller.prototype.__initialize = function(root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
    };

    Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist,
            leavelist,
            element,
            node,
            nodeType,
            ret,
            key,
            current,
            current2,
            candidates,
            candidate,
            sentinel;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                ret = this.__execute(visitor.leave, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }
                continue;
            }

            if (element.node) {

                ret = this.__execute(visitor.enter, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }

                worklist.push(sentinel);
                leavelist.push(element);

                if (this.__state === SKIP || ret === SKIP) {
                    continue;
                }

                node = element.node;
                nodeType = element.wrap || node.type;
                candidates = VisitorKeys[nodeType];

                current = candidates.length;
                while ((current -= 1) >= 0) {
                    key = candidates[current];
                    candidate = node[key];
                    if (!candidate) {
                        continue;
                    }

                    if (!isArray(candidate)) {
                        worklist.push(new Element(candidate, key, null, null));
                        continue;
                    }

                    current2 = candidate.length;
                    while ((current2 -= 1) >= 0) {
                        if (!candidate[current2]) {
                            continue;
                        }
                        if ((nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === candidates[current]) {
                            element = new Element(candidate[current2], [key, current2], 'Property', null);
                        } else {
                            element = new Element(candidate[current2], [key, current2], null, null);
                        }
                        worklist.push(element);
                    }
                }
            }
        }
    };

    Controller.prototype.replace = function replace(root, visitor) {
        var worklist,
            leavelist,
            node,
            nodeType,
            target,
            element,
            current,
            current2,
            candidates,
            candidate,
            sentinel,
            outer,
            key;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        outer = {
            root: root
        };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                target = this.__execute(visitor.leave, element);

                // node may be replaced with null,
                // so distinguish between undefined and null in this place
                if (target !== undefined && target !== BREAK && target !== SKIP) {
                    // replace
                    element.ref.replace(target);
                }

                if (this.__state === BREAK || target === BREAK) {
                    return outer.root;
                }
                continue;
            }

            target = this.__execute(visitor.enter, element);

            // node may be replaced with null,
            // so distinguish between undefined and null in this place
            if (target !== undefined && target !== BREAK && target !== SKIP) {
                // replace
                element.ref.replace(target);
                element.node = target;
            }

            if (this.__state === BREAK || target === BREAK) {
                return outer.root;
            }

            // node may be null
            node = element.node;
            if (!node) {
                continue;
            }

            worklist.push(sentinel);
            leavelist.push(element);

            if (this.__state === SKIP || target === SKIP) {
                continue;
            }

            nodeType = element.wrap || node.type;
            candidates = VisitorKeys[nodeType];

            current = candidates.length;
            while ((current -= 1) >= 0) {
                key = candidates[current];
                candidate = node[key];
                if (!candidate) {
                    continue;
                }

                if (!isArray(candidate)) {
                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                    continue;
                }

                current2 = candidate.length;
                while ((current2 -= 1) >= 0) {
                    if (!candidate[current2]) {
                        continue;
                    }
                    if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
                        element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                    } else {
                        element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                    }
                    worklist.push(element);
                }
            }
        }

        return outer.root;
    };

    function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
    }

    function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
    }

    function extendCommentRange(comment, tokens) {
        var target;

        target = upperBound(tokens, function search(token) {
            return token.range[0] > comment.range[0];
        });

        comment.extendedRange = [comment.range[0], comment.range[1]];

        if (target !== tokens.length) {
            comment.extendedRange[1] = tokens[target].range[0];
        }

        target -= 1;
        if (target >= 0) {
            comment.extendedRange[0] = tokens[target].range[1];
        }

        return comment;
    }

    function attachComments(tree, providedComments, tokens) {
        // At first, we should calculate extended comment ranges.
        var comments = [], comment, len, i, cursor;

        if (!tree.range) {
            throw new Error('attachComments needs range information');
        }

        // tokens array is empty, we attach comments to tree as 'leadingComments'
        if (!tokens.length) {
            if (providedComments.length) {
                for (i = 0, len = providedComments.length; i < len; i += 1) {
                    comment = deepCopy(providedComments[i]);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                }
                tree.leadingComments = comments;
            }
            return tree;
        }

        for (i = 0, len = providedComments.length; i < len; i += 1) {
            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }

        // This is based on John Freeman's implementation.
        cursor = 0;
        traverse(tree, {
            enter: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                        break;
                    }

                    if (comment.extendedRange[1] === node.range[0]) {
                        if (!node.leadingComments) {
                            node.leadingComments = [];
                        }
                        node.leadingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        cursor = 0;
        traverse(tree, {
            leave: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        break;
                    }

                    if (node.range[1] === comment.extendedRange[0]) {
                        if (!node.trailingComments) {
                            node.trailingComments = [];
                        }
                        node.trailingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        return tree;
    }

    exports.version = '1.5.1-dev';
    exports.Syntax = Syntax;
    exports.traverse = traverse;
    exports.replace = replace;
    exports.attachComments = attachComments;
    exports.VisitorKeys = VisitorKeys;
    exports.VisitorOption = VisitorOption;
    exports.Controller = Controller;
}));
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],7:[function(require,module,exports){

},{}],8:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":13}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require("JkpR2F"))
},{"JkpR2F":11}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],12:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],13:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("JkpR2F"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":12,"JkpR2F":11,"inherits":9}],14:[function(require,module,exports){
// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var Theme, color, colorize, colorizeToArray, colorizeToCallback, extendedTypeOf, subcolorizeToCallback,
    __hasProp = {}.hasOwnProperty;

  color = require('cli-color');

  extendedTypeOf = require('./util').extendedTypeOf;

  Theme = {
    ' ': function(s) {
      return s;
    },
    '+': color.green,
    '-': color.red
  };

  subcolorizeToCallback = function(key, diff, output, color, indent) {
    var item, looksLikeDiff, m, op, prefix, subindent, subkey, subvalue, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    prefix = key ? "" + key + ": " : '';
    subindent = indent + '  ';
    switch (extendedTypeOf(diff)) {
      case 'object':
        if (('__old' in diff) && ('__new' in diff) && (Object.keys(diff).length === 2)) {
          subcolorizeToCallback(key, diff.__old, output, '-', indent);
          return subcolorizeToCallback(key, diff.__new, output, '+', indent);
        } else {
          output(color, "" + indent + prefix + "{");
          for (subkey in diff) {
            if (!__hasProp.call(diff, subkey)) continue;
            subvalue = diff[subkey];
            if (m = subkey.match(/^(.*)__deleted$/)) {
              subcolorizeToCallback(m[1], subvalue, output, '-', subindent);
            } else if (m = subkey.match(/^(.*)__added$/)) {
              subcolorizeToCallback(m[1], subvalue, output, '+', subindent);
            } else {
              subcolorizeToCallback(subkey, subvalue, output, color, subindent);
            }
          }
          return output(color, "" + indent + "}");
        }
        break;
      case 'array':
        output(color, "" + indent + prefix + "[");
        looksLikeDiff = true;
        for (_i = 0, _len = diff.length; _i < _len; _i++) {
          item = diff[_i];
          if ((extendedTypeOf(item) !== 'array') || !((item.length === 2) || ((item.length === 1) && (item[0] === ' '))) || !(typeof item[0] === 'string') || item[0].length !== 1 || !((_ref = item[0]) === ' ' || _ref === '-' || _ref === '+' || _ref === '~')) {
            looksLikeDiff = false;
          }
        }
        if (looksLikeDiff) {
          for (_j = 0, _len1 = diff.length; _j < _len1; _j++) {
            _ref1 = diff[_j], op = _ref1[0], subvalue = _ref1[1];
            if (op === ' ' && !(subvalue != null)) {
              output(' ', subindent + '...');
            } else {
              if (op !== ' ' && op !== '~' && op !== '+' && op !== '-') {
                throw new Error("Unexpected op '" + op + "' in " + (JSON.stringify(diff, null, 2)));
              }
              if (op === '~') op = ' ';
              subcolorizeToCallback('', subvalue, output, op, subindent);
            }
          }
        } else {
          for (_k = 0, _len2 = diff.length; _k < _len2; _k++) {
            subvalue = diff[_k];
            subcolorizeToCallback('', subvalue, output, color, subindent);
          }
        }
        return output(color, "" + indent + "]");
      default:
        return output(color, indent + prefix + JSON.stringify(diff));
    }
  };

  colorizeToCallback = function(diff, output) {
    return subcolorizeToCallback('', diff, output, ' ', '');
  };

  colorizeToArray = function(diff) {
    var output;
    output = [];
    colorizeToCallback(diff, function(color, line) {
      return output.push("" + color + line);
    });
    return output;
  };

  colorize = function(diff, options) {
    var output;
    if (options == null) options = {};
    output = [];
    colorizeToCallback(diff, function(color, line) {
      var _ref, _ref1, _ref2;
      if ((_ref = options.color) != null ? _ref : true) {
        return output.push(((_ref1 = (_ref2 = options.theme) != null ? _ref2[color] : void 0) != null ? _ref1 : Theme[color])("" + color + line) + "\n");
      } else {
        return output.push("" + color + line + "\n");
      }
    });
    return output.join('');
  };

  module.exports = {
    colorize: colorize,
    colorizeToArray: colorizeToArray,
    colorizeToCallback: colorizeToCallback
  };

}).call(this);

},{"./util":16,"cli-color":17}],15:[function(require,module,exports){
// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var SequenceMatcher, arrayDiff, colorize, descalarize, diff, diffScore, diffString, diffWithScore, extendedTypeOf, findMatchingObject, isScalar, isScalarized, objectDiff, scalarize,
    __hasProp = {}.hasOwnProperty;

  SequenceMatcher = require('difflib').SequenceMatcher;

  extendedTypeOf = require('./util').extendedTypeOf;

  colorize = require('./colorize').colorize;

  isScalar = function(obj) {
    return typeof obj !== 'object';
  };

  objectDiff = function(obj1, obj2) {
    var change, key, keys1, keys2, result, score, subscore, value1, value2, _ref, _ref1;
    result = {};
    score = 0;
    keys1 = Object.keys(obj1);
    keys2 = Object.keys(obj2);
    for (key in obj1) {
      if (!__hasProp.call(obj1, key)) continue;
      value1 = obj1[key];
      if (!(!(key in obj2))) continue;
      result["" + key + "__deleted"] = value1;
      score -= 30;
    }
    for (key in obj2) {
      if (!__hasProp.call(obj2, key)) continue;
      value2 = obj2[key];
      if (!(!(key in obj1))) continue;
      result["" + key + "__added"] = value2;
      score -= 30;
    }
    for (key in obj1) {
      if (!__hasProp.call(obj1, key)) continue;
      value1 = obj1[key];
      if (!(key in obj2)) continue;
      score += 20;
      value2 = obj2[key];
      _ref = diffWithScore(value1, value2), subscore = _ref[0], change = _ref[1];
      if (change) result[key] = change;
      score += Math.min(20, Math.max(-10, subscore / 5));
    }
    if (Object.keys(result).length === 0) {
      _ref1 = [100 * Object.keys(obj1).length, void 0], score = _ref1[0], result = _ref1[1];
    } else {
      score = Math.max(0, score);
    }
    return [score, result];
  };

  findMatchingObject = function(item, fuzzyOriginals) {
    var bestMatch, candidate, key, score;
    bestMatch = null;
    for (key in fuzzyOriginals) {
      if (!__hasProp.call(fuzzyOriginals, key)) continue;
      candidate = fuzzyOriginals[key];
      if (key !== '__next') {
        if (extendedTypeOf(item) === extendedTypeOf(candidate)) {
          score = diffScore(item, candidate);
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = {
              score: score,
              key: key
            };
          }
        }
      }
    }
    return bestMatch;
  };

  scalarize = function(array, originals, fuzzyOriginals) {
    var bestMatch, item, proxy, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (isScalar(item)) {
        _results.push(item);
      } else if (fuzzyOriginals && (bestMatch = findMatchingObject(item, fuzzyOriginals)) && bestMatch.score > 40) {
        originals[bestMatch.key] = item;
        _results.push(bestMatch.key);
      } else {
        proxy = "__$!SCALAR" + originals.__next++;
        originals[proxy] = item;
        _results.push(proxy);
      }
    }
    return _results;
  };

  isScalarized = function(item, originals) {
    return (typeof item === 'string') && (item in originals);
  };

  descalarize = function(item, originals) {
    if (isScalarized(item, originals)) {
      return originals[item];
    } else {
      return item;
    }
  };

  arrayDiff = function(obj1, obj2, stats) {
    var allEqual, change, i, i1, i2, item, item1, item2, j, j1, j2, op, opcodes, originals1, originals2, result, score, seq1, seq2, _i, _j, _k, _l, _len, _m, _n, _ref;
    originals1 = {
      __next: 1
    };
    seq1 = scalarize(obj1, originals1);
    originals2 = {
      __next: originals1.__next
    };
    seq2 = scalarize(obj2, originals2, originals1);
    opcodes = new SequenceMatcher(null, seq1, seq2).getOpcodes();
    result = [];
    score = 0;
    allEqual = true;
    for (_i = 0, _len = opcodes.length; _i < _len; _i++) {
      _ref = opcodes[_i], op = _ref[0], i1 = _ref[1], i2 = _ref[2], j1 = _ref[3], j2 = _ref[4];
      if (op !== 'equal') allEqual = false;
      switch (op) {
        case 'equal':
          for (i = _j = i1; i1 <= i2 ? _j < i2 : _j > i2; i = i1 <= i2 ? ++_j : --_j) {
            item = seq1[i];
            if (isScalarized(item, originals1)) {
              if (!isScalarized(item, originals2)) {
                throw new AssertionError("internal bug: isScalarized(item, originals1) != isScalarized(item, originals2) for item " + (JSON.stringify(item)));
              }
              item1 = descalarize(item, originals1);
              item2 = descalarize(item, originals2);
              change = diff(item1, item2);
              if (change) {
                result.push(['~', change]);
                allEqual = false;
              } else {
                result.push([' ']);
              }
            } else {
              result.push([' ', item]);
            }
            score += 10;
          }
          break;
        case 'delete':
          for (i = _k = i1; i1 <= i2 ? _k < i2 : _k > i2; i = i1 <= i2 ? ++_k : --_k) {
            result.push(['-', descalarize(seq1[i], originals1)]);
            score -= 5;
          }
          break;
        case 'insert':
          for (j = _l = j1; j1 <= j2 ? _l < j2 : _l > j2; j = j1 <= j2 ? ++_l : --_l) {
            result.push(['+', descalarize(seq2[j], originals2)]);
            score -= 5;
          }
          break;
        case 'replace':
          for (i = _m = i1; i1 <= i2 ? _m < i2 : _m > i2; i = i1 <= i2 ? ++_m : --_m) {
            result.push(['-', descalarize(seq1[i], originals1)]);
            score -= 5;
          }
          for (j = _n = j1; j1 <= j2 ? _n < j2 : _n > j2; j = j1 <= j2 ? ++_n : --_n) {
            result.push(['+', descalarize(seq2[j], originals2)]);
            score -= 5;
          }
      }
    }
    if (allEqual || (opcodes.length === 0)) {
      result = void 0;
      score = 100;
    } else {
      score = Math.max(0, score);
    }
    return [score, result];
  };

  diffWithScore = function(obj1, obj2) {
    var type1, type2;
    type1 = extendedTypeOf(obj1);
    type2 = extendedTypeOf(obj2);
    if (type1 === type2) {
      switch (type1) {
        case 'object':
          return objectDiff(obj1, obj2);
        case 'array':
          return arrayDiff(obj1, obj2);
      }
    }
    if (obj1 !== obj2) {
      return [
        0, {
          __old: obj1,
          __new: obj2
        }
      ];
    } else {
      return [100, void 0];
    }
  };

  diff = function(obj1, obj2) {
    var change, score, _ref;
    _ref = diffWithScore(obj1, obj2), score = _ref[0], change = _ref[1];
    return change;
  };

  diffScore = function(obj1, obj2) {
    var change, score, _ref;
    _ref = diffWithScore(obj1, obj2), score = _ref[0], change = _ref[1];
    return score;
  };

  diffString = function(obj1, obj2, options) {
    return colorize(diff(obj1, obj2), options);
  };

  module.exports = {
    diff: diff,
    diffString: diffString
  };

}).call(this);

},{"./colorize":14,"./util":16,"difflib":24}],16:[function(require,module,exports){
// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var extendedTypeOf;

  extendedTypeOf = function(obj) {
    var result;
    result = typeof obj;
    if (!(obj != null)) {
      return 'null';
    } else if (result === 'object' && obj.constructor === Array) {
      return 'array';
    } else {
      return result;
    }
  };

  module.exports = {
    extendedTypeOf: extendedTypeOf
  };

}).call(this);

},{}],17:[function(require,module,exports){
'use strict';

var defineProperties = Object.defineProperties
  , map              = require('es5-ext/lib/Object/map')

  , toString, codes, properties, init;

toString = function (code, str) {
	return '\x1b[' + code[0] + 'm' + (str || "") + '\x1b[' + code[1] + 'm';
};

codes = {
	// styles
	bold:      [1, 22],
	italic:    [3, 23],
	underline: [4, 24],
	inverse:   [7, 27],
	strike:    [9, 29]
};

['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'].forEach(
	function (color, index) {
		// foreground
		codes[color] = [30 + index, 39];
		// background
		codes['bg' + color[0].toUpperCase() + color.slice(1)] = [40 + index, 49];
	}
);
codes.gray = [90, 39];

properties = map(codes, function (code) {
	return {
		get: function () {
			this.style.push(code);
			return this;
		},
		enumerable: true
	};
});
properties.bright = {
	get: function () {
		this._bright = true;
		return this;
	},
	enumerable: true
};
properties.bgBright = {
	get: function () {
		this._bgBright = true;
		return this;
	},
	enumerable: true
};

init = function () {
	var o = defineProperties(function self(msg) {
		return self.style.reduce(function (msg, code) {
			if ((self._bright && (code[0] >= 30) && (code[0] < 38)) ||
					(self._bgBright && (code[0] >= 40) && (code[0] < 48))) {
				code = [code[0] + 60, code[1]];
			}
			return toString(code, msg);
		}, msg);
	}, properties);
	o.style = [];
	return o[this];
};

module.exports = defineProperties(function (msg) {
	return msg;
}, map(properties, function (code, name) {
	return {
		get: init.bind(name),
		enumerable: true
	};
}));

},{"es5-ext/lib/Object/map":21}],18:[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

'use strict';

var call       = Function.prototype.call
  , keys       = Object.keys
  , isCallable = require('./is-callable')
  , callable   = require('./valid-callable')
  , value      = require('./valid-value');

module.exports = function (method) {
	return function (obj, cb) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		value(obj);
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(isCallable(compareFn) ? compareFn : undefined);
		}
		return list[method](function (key, index) {
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./is-callable":20,"./valid-callable":22,"./valid-value":23}],19:[function(require,module,exports){
'use strict';

module.exports = require('./_iterate')('forEach');

},{"./_iterate":18}],20:[function(require,module,exports){
// Inspired by: http://www.davidflanagan.com/2009/08/typeof-isfuncti.html

'use strict';

var forEach = Array.prototype.forEach.bind([]);

module.exports = function (obj) {
	var type;
	if (!obj) {
		return false;
	}
	type = typeof obj;
	if (type === 'function') {
		return true;
	}
	if (type !== 'object') {
		return false;
	}

	try {
		forEach(obj);
		return true;
	} catch (e) {
		if (e instanceof TypeError) {
			return false;
		}
		throw e;
	}
};

},{}],21:[function(require,module,exports){
'use strict';

var forEach = require('./for-each');

module.exports = function (obj, cb) {
	var o = {};
	forEach(obj, function (value, key) {
		o[key] = cb.call(this, value, key, obj);
	}, arguments[2]);
	return o;
};

},{"./for-each":19}],22:[function(require,module,exports){
'use strict';

var isCallable = require('./is-callable');

module.exports = function (fn) {
	if (!isCallable(fn)) {
		throw new TypeError(fn + " is not a function");
	}
	return fn;
};

},{"./is-callable":20}],23:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) {
		throw new TypeError("Cannot use null or undefined");
	}
	return value;
};

},{}],24:[function(require,module,exports){
module.exports = require('./lib/difflib');

},{"./lib/difflib":25}],25:[function(require,module,exports){
// Generated by CoffeeScript 1.3.1

/*
Module difflib -- helpers for computing deltas between objects.

Function getCloseMatches(word, possibilities, n=3, cutoff=0.6):
    Use SequenceMatcher to return list of the best "good enough" matches.

Function contextDiff(a, b):
    For two lists of strings, return a delta in context diff format.

Function ndiff(a, b):
    Return a delta: the difference between `a` and `b` (lists of strings).

Function restore(delta, which):
    Return one of the two sequences that generated an ndiff delta.

Function unifiedDiff(a, b):
    For two lists of strings, return a delta in unified diff format.

Class SequenceMatcher:
    A flexible class for comparing pairs of sequences of any type.

Class Differ:
    For producing human-readable deltas from sequences of lines of text.
*/


(function() {
  var Differ, Heap, IS_CHARACTER_JUNK, IS_LINE_JUNK, SequenceMatcher, assert, contextDiff, floor, getCloseMatches, max, min, ndiff, restore, unifiedDiff, _any, _arrayCmp, _calculateRatio, _countLeading, _formatRangeContext, _formatRangeUnified, _has,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  floor = Math.floor, max = Math.max, min = Math.min;

  Heap = require('heap');

  assert = require('assert');

  _calculateRatio = function(matches, length) {
    if (length) {
      return 2.0 * matches / length;
    } else {
      return 1.0;
    }
  };

  _arrayCmp = function(a, b) {
    var i, la, lb, _i, _ref, _ref1;
    _ref = [a.length, b.length], la = _ref[0], lb = _ref[1];
    for (i = _i = 0, _ref1 = min(la, lb); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
      if (a[i] < b[i]) {
        return -1;
      }
      if (a[i] > b[i]) {
        return 1;
      }
    }
    return la - lb;
  };

  _has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  _any = function(items) {
    var item, _i, _len;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (item) {
        return true;
      }
    }
    return false;
  };

  SequenceMatcher = (function() {

    SequenceMatcher.name = 'SequenceMatcher';

    /*
      SequenceMatcher is a flexible class for comparing pairs of sequences of
      any type, so long as the sequence elements are hashable.  The basic
      algorithm predates, and is a little fancier than, an algorithm
      published in the late 1980's by Ratcliff and Obershelp under the
      hyperbolic name "gestalt pattern matching".  The basic idea is to find
      the longest contiguous matching subsequence that contains no "junk"
      elements (R-O doesn't address junk).  The same idea is then applied
      recursively to the pieces of the sequences to the left and to the right
      of the matching subsequence.  This does not yield minimal edit
      sequences, but does tend to yield matches that "look right" to people.
    
      SequenceMatcher tries to compute a "human-friendly diff" between two
      sequences.  Unlike e.g. UNIX(tm) diff, the fundamental notion is the
      longest *contiguous* & junk-free matching subsequence.  That's what
      catches peoples' eyes.  The Windows(tm) windiff has another interesting
      notion, pairing up elements that appear uniquely in each sequence.
      That, and the method here, appear to yield more intuitive difference
      reports than does diff.  This method appears to be the least vulnerable
      to synching up on blocks of "junk lines", though (like blank lines in
      ordinary text files, or maybe "<P>" lines in HTML files).  That may be
      because this is the only method of the 3 that has a *concept* of
      "junk" <wink>.
    
      Example, comparing two strings, and considering blanks to be "junk":
    
      >>> isjunk = (c) -> c is ' '
      >>> s = new SequenceMatcher(isjunk,
                                  'private Thread currentThread;',
                                  'private volatile Thread currentThread;')
    
      .ratio() returns a float in [0, 1], measuring the "similarity" of the
      sequences.  As a rule of thumb, a .ratio() value over 0.6 means the
      sequences are close matches:
    
      >>> s.ratio().toPrecision(3)
      '0.866'
    
      If you're only interested in where the sequences match,
      .getMatchingBlocks() is handy:
    
      >>> for [a, b, size] in s.getMatchingBlocks()
      ...   console.log("a[#{a}] and b[#{b}] match for #{size} elements");
      a[0] and b[0] match for 8 elements
      a[8] and b[17] match for 21 elements
      a[29] and b[38] match for 0 elements
    
      Note that the last tuple returned by .get_matching_blocks() is always a
      dummy, (len(a), len(b), 0), and this is the only case in which the last
      tuple element (number of elements matched) is 0.
    
      If you want to know how to change the first sequence into the second,
      use .get_opcodes():
    
      >>> for [op, a1, a2, b1, b2] in s.getOpcodes()
      ...   console.log "#{op} a[#{a1}:#{a2}] b[#{b1}:#{b2}]"
      equal a[0:8] b[0:8]
      insert a[8:8] b[8:17]
      equal a[8:29] b[17:38]
    
      See the Differ class for a fancy human-friendly file differencer, which
      uses SequenceMatcher both to compare sequences of lines, and to compare
      sequences of characters within similar (near-matching) lines.
    
      See also function getCloseMatches() in this module, which shows how
      simple code building on SequenceMatcher can be used to do useful work.
    
      Timing:  Basic R-O is cubic time worst case and quadratic time expected
      case.  SequenceMatcher is quadratic time for the worst case and has
      expected-case behavior dependent in a complicated way on how many
      elements the sequences have in common; best case time is linear.
    
      Methods:
    
      constructor(isjunk=null, a='', b='')
          Construct a SequenceMatcher.
    
      setSeqs(a, b)
          Set the two sequences to be compared.
    
      setSeq1(a)
          Set the first sequence to be compared.
    
      setSeq2(b)
          Set the second sequence to be compared.
    
      findLongestMatch(alo, ahi, blo, bhi)
          Find longest matching block in a[alo:ahi] and b[blo:bhi].
    
      getMatchingBlocks()
          Return list of triples describing matching subsequences.
    
      getOpcodes()
          Return list of 5-tuples describing how to turn a into b.
    
      ratio()
          Return a measure of the sequences' similarity (float in [0,1]).
    
      quickRatio()
          Return an upper bound on .ratio() relatively quickly.
    
      realQuickRatio()
          Return an upper bound on ratio() very quickly.
    */


    function SequenceMatcher(isjunk, a, b, autojunk) {
      this.isjunk = isjunk;
      if (a == null) {
        a = '';
      }
      if (b == null) {
        b = '';
      }
      this.autojunk = autojunk != null ? autojunk : true;
      /*
          Construct a SequenceMatcher.
      
          Optional arg isjunk is null (the default), or a one-argument
          function that takes a sequence element and returns true iff the
          element is junk.  Null is equivalent to passing "(x) -> 0", i.e.
          no elements are considered to be junk.  For example, pass
              (x) -> x in ' \t'
          if you're comparing lines as sequences of characters, and don't
          want to synch up on blanks or hard tabs.
      
          Optional arg a is the first of two sequences to be compared.  By
          default, an empty string.  The elements of a must be hashable.  See
          also .setSeqs() and .setSeq1().
      
          Optional arg b is the second of two sequences to be compared.  By
          default, an empty string.  The elements of b must be hashable. See
          also .setSeqs() and .setSeq2().
      
          Optional arg autojunk should be set to false to disable the
          "automatic junk heuristic" that treats popular elements as junk
          (see module documentation for more information).
      */

      this.a = this.b = null;
      this.setSeqs(a, b);
    }

    SequenceMatcher.prototype.setSeqs = function(a, b) {
      /* 
      Set the two sequences to be compared. 
      
      >>> s = new SequenceMatcher()
      >>> s.setSeqs('abcd', 'bcde')
      >>> s.ratio()
      0.75
      */
      this.setSeq1(a);
      return this.setSeq2(b);
    };

    SequenceMatcher.prototype.setSeq1 = function(a) {
      /* 
      Set the first sequence to be compared. 
      
      The second sequence to be compared is not changed.
      
      >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
      >>> s.ratio()
      0.75
      >>> s.setSeq1('bcde')
      >>> s.ratio()
      1.0
      
      SequenceMatcher computes and caches detailed information about the
      second sequence, so if you want to compare one sequence S against
      many sequences, use .setSeq2(S) once and call .setSeq1(x)
      repeatedly for each of the other sequences.
      
      See also setSeqs() and setSeq2().
      */
      if (a === this.a) {
        return;
      }
      this.a = a;
      return this.matchingBlocks = this.opcodes = null;
    };

    SequenceMatcher.prototype.setSeq2 = function(b) {
      /*
          Set the second sequence to be compared. 
      
          The first sequence to be compared is not changed.
      
          >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
          >>> s.ratio()
          0.75
          >>> s.setSeq2('abcd')
          >>> s.ratio()
          1.0
      
          SequenceMatcher computes and caches detailed information about the
          second sequence, so if you want to compare one sequence S against
          many sequences, use .setSeq2(S) once and call .setSeq1(x)
          repeatedly for each of the other sequences.
      
          See also setSeqs() and setSeq1().
      */
      if (b === this.b) {
        return;
      }
      this.b = b;
      this.matchingBlocks = this.opcodes = null;
      this.fullbcount = null;
      return this._chainB();
    };

    SequenceMatcher.prototype._chainB = function() {
      var b, b2j, elt, i, idxs, indices, isjunk, junk, n, ntest, popular, _i, _j, _len, _len1, _ref;
      b = this.b;
      this.b2j = b2j = {};
      for (i = _i = 0, _len = b.length; _i < _len; i = ++_i) {
        elt = b[i];
        indices = _has(b2j, elt) ? b2j[elt] : b2j[elt] = [];
        indices.push(i);
      }
      junk = {};
      isjunk = this.isjunk;
      if (isjunk) {
        _ref = Object.keys(b2j);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          elt = _ref[_j];
          if (isjunk(elt)) {
            junk[elt] = true;
            delete b2j[elt];
          }
        }
      }
      popular = {};
      n = b.length;
      if (this.autojunk && n >= 200) {
        ntest = floor(n / 100) + 1;
        for (elt in b2j) {
          idxs = b2j[elt];
          if (idxs.length > ntest) {
            popular[elt] = true;
            delete b2j[elt];
          }
        }
      }
      this.isbjunk = function(b) {
        return _has(junk, b);
      };
      return this.isbpopular = function(b) {
        return _has(popular, b);
      };
    };

    SequenceMatcher.prototype.findLongestMatch = function(alo, ahi, blo, bhi) {
      /* 
      Find longest matching block in a[alo...ahi] and b[blo...bhi].  
      
      If isjunk is not defined:
      
      Return [i,j,k] such that a[i...i+k] is equal to b[j...j+k], where
          alo <= i <= i+k <= ahi
          blo <= j <= j+k <= bhi
      and for all [i',j',k'] meeting those conditions,
          k >= k'
          i <= i'
          and if i == i', j <= j'
      
      In other words, of all maximal matching blocks, return one that
      starts earliest in a, and of all those maximal matching blocks that
      start earliest in a, return the one that starts earliest in b.
      
      >>> isjunk = (x) -> x is ' '
      >>> s = new SequenceMatcher(isjunk, ' abcd', 'abcd abcd')
      >>> s.findLongestMatch(0, 5, 0, 9)
      [1, 0, 4]
      
      >>> s = new SequenceMatcher(null, 'ab', 'c')
      >>> s.findLongestMatch(0, 2, 0, 1)
      [0, 0, 0]
      */

      var a, b, b2j, besti, bestj, bestsize, i, isbjunk, j, j2len, k, newj2len, _i, _j, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      _ref = [this.a, this.b, this.b2j, this.isbjunk], a = _ref[0], b = _ref[1], b2j = _ref[2], isbjunk = _ref[3];
      _ref1 = [alo, blo, 0], besti = _ref1[0], bestj = _ref1[1], bestsize = _ref1[2];
      j2len = {};
      for (i = _i = alo; alo <= ahi ? _i < ahi : _i > ahi; i = alo <= ahi ? ++_i : --_i) {
        newj2len = {};
        _ref2 = (_has(b2j, a[i]) ? b2j[a[i]] : []);
        for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
          j = _ref2[_j];
          if (j < blo) {
            continue;
          }
          if (j >= bhi) {
            break;
          }
          k = newj2len[j] = (j2len[j - 1] || 0) + 1;
          if (k > bestsize) {
            _ref3 = [i - k + 1, j - k + 1, k], besti = _ref3[0], bestj = _ref3[1], bestsize = _ref3[2];
          }
        }
        j2len = newj2len;
      }
      while (besti > alo && bestj > blo && !isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
        _ref4 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref4[0], bestj = _ref4[1], bestsize = _ref4[2];
      }
      while (besti + bestsize < ahi && bestj + bestsize < bhi && !isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
        bestsize++;
      }
      while (besti > alo && bestj > blo && isbjunk(b[bestj - 1]) && a[besti - 1] === b[bestj - 1]) {
        _ref5 = [besti - 1, bestj - 1, bestsize + 1], besti = _ref5[0], bestj = _ref5[1], bestsize = _ref5[2];
      }
      while (besti + bestsize < ahi && bestj + bestsize < bhi && isbjunk(b[bestj + bestsize]) && a[besti + bestsize] === b[bestj + bestsize]) {
        bestsize++;
      }
      return [besti, bestj, bestsize];
    };

    SequenceMatcher.prototype.getMatchingBlocks = function() {
      /*
          Return list of triples describing matching subsequences.
      
          Each triple is of the form [i, j, n], and means that
          a[i...i+n] == b[j...j+n].  The triples are monotonically increasing in
          i and in j.  it's also guaranteed that if
          [i, j, n] and [i', j', n'] are adjacent triples in the list, and
          the second is not the last triple in the list, then i+n != i' or
          j+n != j'.  IOW, adjacent triples never describe adjacent equal
          blocks.
      
          The last triple is a dummy, [a.length, b.length, 0], and is the only
          triple with n==0.
      
          >>> s = new SequenceMatcher(null, 'abxcd', 'abcd')
          >>> s.getMatchingBlocks()
          [[0, 0, 2], [3, 2, 2], [5, 4, 0]]
      */

      var ahi, alo, bhi, blo, i, i1, i2, j, j1, j2, k, k1, k2, la, lb, matchingBlocks, nonAdjacent, queue, x, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      if (this.matchingBlocks) {
        return this.matchingBlocks;
      }
      _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
      queue = [[0, la, 0, lb]];
      matchingBlocks = [];
      while (queue.length) {
        _ref1 = queue.pop(), alo = _ref1[0], ahi = _ref1[1], blo = _ref1[2], bhi = _ref1[3];
        _ref2 = x = this.findLongestMatch(alo, ahi, blo, bhi), i = _ref2[0], j = _ref2[1], k = _ref2[2];
        if (k) {
          matchingBlocks.push(x);
          if (alo < i && blo < j) {
            queue.push([alo, i, blo, j]);
          }
          if (i + k < ahi && j + k < bhi) {
            queue.push([i + k, ahi, j + k, bhi]);
          }
        }
      }
      matchingBlocks.sort(_arrayCmp);
      i1 = j1 = k1 = 0;
      nonAdjacent = [];
      for (_i = 0, _len = matchingBlocks.length; _i < _len; _i++) {
        _ref3 = matchingBlocks[_i], i2 = _ref3[0], j2 = _ref3[1], k2 = _ref3[2];
        if (i1 + k1 === i2 && j1 + k1 === j2) {
          k1 += k2;
        } else {
          if (k1) {
            nonAdjacent.push([i1, j1, k1]);
          }
          _ref4 = [i2, j2, k2], i1 = _ref4[0], j1 = _ref4[1], k1 = _ref4[2];
        }
      }
      if (k1) {
        nonAdjacent.push([i1, j1, k1]);
      }
      nonAdjacent.push([la, lb, 0]);
      return this.matchingBlocks = nonAdjacent;
    };

    SequenceMatcher.prototype.getOpcodes = function() {
      /* 
      Return list of 5-tuples describing how to turn a into b.
      
      Each tuple is of the form [tag, i1, i2, j1, j2].  The first tuple
      has i1 == j1 == 0, and remaining tuples have i1 == the i2 from the
      tuple preceding it, and likewise for j1 == the previous j2.
      
      The tags are strings, with these meanings:
      
      'replace':  a[i1...i2] should be replaced by b[j1...j2]
      'delete':   a[i1...i2] should be deleted.
                  Note that j1==j2 in this case.
      'insert':   b[j1...j2] should be inserted at a[i1...i1].
                  Note that i1==i2 in this case.
      'equal':    a[i1...i2] == b[j1...j2]
      
      >>> s = new SequenceMatcher(null, 'qabxcd', 'abycdf')
      >>> s.getOpcodes()
      [ [ 'delete'  , 0 , 1 , 0 , 0 ] ,
        [ 'equal'   , 1 , 3 , 0 , 2 ] ,
        [ 'replace' , 3 , 4 , 2 , 3 ] ,
        [ 'equal'   , 4 , 6 , 3 , 5 ] ,
        [ 'insert'  , 6 , 6 , 5 , 6 ] ]
      */

      var ai, answer, bj, i, j, size, tag, _i, _len, _ref, _ref1, _ref2;
      if (this.opcodes) {
        return this.opcodes;
      }
      i = j = 0;
      this.opcodes = answer = [];
      _ref = this.getMatchingBlocks();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], ai = _ref1[0], bj = _ref1[1], size = _ref1[2];
        tag = '';
        if (i < ai && j < bj) {
          tag = 'replace';
        } else if (i < ai) {
          tag = 'delete';
        } else if (j < bj) {
          tag = 'insert';
        }
        if (tag) {
          answer.push([tag, i, ai, j, bj]);
        }
        _ref2 = [ai + size, bj + size], i = _ref2[0], j = _ref2[1];
        if (size) {
          answer.push(['equal', ai, i, bj, j]);
        }
      }
      return answer;
    };

    SequenceMatcher.prototype.getGroupedOpcodes = function(n) {
      var codes, group, groups, i1, i2, j1, j2, nn, tag, _i, _len, _ref, _ref1, _ref2, _ref3;
      if (n == null) {
        n = 3;
      }
      /* 
      Isolate change clusters by eliminating ranges with no changes.
      
      Return a list groups with upto n lines of context.
      Each group is in the same format as returned by get_opcodes().
      
      >>> a = [1...40].map(String)
      >>> b = a.slice()
      >>> b[8...8] = 'i'
      >>> b[20] += 'x'
      >>> b[23...28] = []
      >>> b[30] += 'y'
      >>> s = new SequenceMatcher(null, a, b)
      >>> s.getGroupedOpcodes()
      [ [ [ 'equal'  , 5 , 8  , 5 , 8 ],
          [ 'insert' , 8 , 8  , 8 , 9 ],
          [ 'equal'  , 8 , 11 , 9 , 12 ] ],
        [ [ 'equal'   , 16 , 19 , 17 , 20 ],
          [ 'replace' , 19 , 20 , 20 , 21 ],
          [ 'equal'   , 20 , 22 , 21 , 23 ],
          [ 'delete'  , 22 , 27 , 23 , 23 ],
          [ 'equal'   , 27 , 30 , 23 , 26 ] ],
        [ [ 'equal'   , 31 , 34 , 27 , 30 ],
          [ 'replace' , 34 , 35 , 30 , 31 ],
          [ 'equal'   , 35 , 38 , 31 , 34 ] ] ]
      */

      codes = this.getOpcodes();
      if (!codes.length) {
        codes = [['equal', 0, 1, 0, 1]];
      }
      if (codes[0][0] === 'equal') {
        _ref = codes[0], tag = _ref[0], i1 = _ref[1], i2 = _ref[2], j1 = _ref[3], j2 = _ref[4];
        codes[0] = [tag, max(i1, i2 - n), i2, max(j1, j2 - n), j2];
      }
      if (codes[codes.length - 1][0] === 'equal') {
        _ref1 = codes[codes.length - 1], tag = _ref1[0], i1 = _ref1[1], i2 = _ref1[2], j1 = _ref1[3], j2 = _ref1[4];
        codes[codes.length - 1] = [tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)];
      }
      nn = n + n;
      groups = [];
      group = [];
      for (_i = 0, _len = codes.length; _i < _len; _i++) {
        _ref2 = codes[_i], tag = _ref2[0], i1 = _ref2[1], i2 = _ref2[2], j1 = _ref2[3], j2 = _ref2[4];
        if (tag === 'equal' && i2 - i1 > nn) {
          group.push([tag, i1, min(i2, i1 + n), j1, min(j2, j1 + n)]);
          groups.push(group);
          group = [];
          _ref3 = [max(i1, i2 - n), max(j1, j2 - n)], i1 = _ref3[0], j1 = _ref3[1];
        }
        group.push([tag, i1, i2, j1, j2]);
      }
      if (group.length && !(group.length === 1 && group[0][0] === 'equal')) {
        groups.push(group);
      }
      return groups;
    };

    SequenceMatcher.prototype.ratio = function() {
      /*
          Return a measure of the sequences' similarity (float in [0,1]).
      
          Where T is the total number of elements in both sequences, and
          M is the number of matches, this is 2.0*M / T.
          Note that this is 1 if the sequences are identical, and 0 if
          they have nothing in common.
      
          .ratio() is expensive to compute if you haven't already computed
          .getMatchingBlocks() or .getOpcodes(), in which case you may
          want to try .quickRatio() or .realQuickRatio() first to get an
          upper bound.
          
          >>> s = new SequenceMatcher(null, 'abcd', 'bcde')
          >>> s.ratio()
          0.75
          >>> s.quickRatio()
          0.75
          >>> s.realQuickRatio()
          1.0
      */

      var match, matches, _i, _len, _ref;
      matches = 0;
      _ref = this.getMatchingBlocks();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        match = _ref[_i];
        matches += match[2];
      }
      return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.quickRatio = function() {
      /*
          Return an upper bound on ratio() relatively quickly.
      
          This isn't defined beyond that it is an upper bound on .ratio(), and
          is faster to compute.
      */

      var avail, elt, fullbcount, matches, numb, _i, _j, _len, _len1, _ref, _ref1;
      if (!this.fullbcount) {
        this.fullbcount = fullbcount = {};
        _ref = this.b;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elt = _ref[_i];
          fullbcount[elt] = (fullbcount[elt] || 0) + 1;
        }
      }
      fullbcount = this.fullbcount;
      avail = {};
      matches = 0;
      _ref1 = this.a;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        elt = _ref1[_j];
        if (_has(avail, elt)) {
          numb = avail[elt];
        } else {
          numb = fullbcount[elt] || 0;
        }
        avail[elt] = numb - 1;
        if (numb > 0) {
          matches++;
        }
      }
      return _calculateRatio(matches, this.a.length + this.b.length);
    };

    SequenceMatcher.prototype.realQuickRatio = function() {
      /*
          Return an upper bound on ratio() very quickly.
      
          This isn't defined beyond that it is an upper bound on .ratio(), and
          is faster to compute than either .ratio() or .quickRatio().
      */

      var la, lb, _ref;
      _ref = [this.a.length, this.b.length], la = _ref[0], lb = _ref[1];
      return _calculateRatio(min(la, lb), la + lb);
    };

    return SequenceMatcher;

  })();

  getCloseMatches = function(word, possibilities, n, cutoff) {
    var result, s, score, x, _i, _j, _len, _len1, _ref, _results;
    if (n == null) {
      n = 3;
    }
    if (cutoff == null) {
      cutoff = 0.6;
    }
    /*
      Use SequenceMatcher to return list of the best "good enough" matches.
    
      word is a sequence for which close matches are desired (typically a
      string).
    
      possibilities is a list of sequences against which to match word
      (typically a list of strings).
    
      Optional arg n (default 3) is the maximum number of close matches to
      return.  n must be > 0.
    
      Optional arg cutoff (default 0.6) is a float in [0, 1].  Possibilities
      that don't score at least that similar to word are ignored.
    
      The best (no more than n) matches among the possibilities are returned
      in a list, sorted by similarity score, most similar first.
    
      >>> getCloseMatches('appel', ['ape', 'apple', 'peach', 'puppy'])
      ['apple', 'ape']
      >>> KEYWORDS = require('coffee-script').RESERVED
      >>> getCloseMatches('wheel', KEYWORDS)
      ['when', 'while']
      >>> getCloseMatches('accost', KEYWORDS)
      ['const']
    */

    if (!(n > 0)) {
      throw new Error("n must be > 0: (" + n + ")");
    }
    if (!((0.0 <= cutoff && cutoff <= 1.0))) {
      throw new Error("cutoff must be in [0.0, 1.0]: (" + cutoff + ")");
    }
    result = [];
    s = new SequenceMatcher();
    s.setSeq2(word);
    for (_i = 0, _len = possibilities.length; _i < _len; _i++) {
      x = possibilities[_i];
      s.setSeq1(x);
      if (s.realQuickRatio() >= cutoff && s.quickRatio() >= cutoff && s.ratio() >= cutoff) {
        result.push([s.ratio(), x]);
      }
    }
    result = Heap.nlargest(result, n, _arrayCmp);
    _results = [];
    for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
      _ref = result[_j], score = _ref[0], x = _ref[1];
      _results.push(x);
    }
    return _results;
  };

  _countLeading = function(line, ch) {
    /*
      Return number of `ch` characters at the start of `line`.
    
      >>> _countLeading('   abc', ' ')
      3
    */

    var i, n, _ref;
    _ref = [0, line.length], i = _ref[0], n = _ref[1];
    while (i < n && line[i] === ch) {
      i++;
    }
    return i;
  };

  Differ = (function() {

    Differ.name = 'Differ';

    /*
      Differ is a class for comparing sequences of lines of text, and
      producing human-readable differences or deltas.  Differ uses
      SequenceMatcher both to compare sequences of lines, and to compare
      sequences of characters within similar (near-matching) lines.
    
      Each line of a Differ delta begins with a two-letter code:
    
          '- '    line unique to sequence 1
          '+ '    line unique to sequence 2
          '  '    line common to both sequences
          '? '    line not present in either input sequence
    
      Lines beginning with '? ' attempt to guide the eye to intraline
      differences, and were not present in either input sequence.  These lines
      can be confusing if the sequences contain tab characters.
    
      Note that Differ makes no claim to produce a *minimal* diff.  To the
      contrary, minimal diffs are often counter-intuitive, because they synch
      up anywhere possible, sometimes accidental matches 100 pages apart.
      Restricting synch points to contiguous matches preserves some notion of
      locality, at the occasional cost of producing a longer diff.
    
      Example: Comparing two texts.
    
      >>> text1 = ['1. Beautiful is better than ugly.\n',
      ...   '2. Explicit is better than implicit.\n',
      ...   '3. Simple is better than complex.\n',
      ...   '4. Complex is better than complicated.\n']
      >>> text1.length
      4
      >>> text2 = ['1. Beautiful is better than ugly.\n',
      ...   '3.   Simple is better than complex.\n',
      ...   '4. Complicated is better than complex.\n',
      ...   '5. Flat is better than nested.\n']
    
      Next we instantiate a Differ object:
    
      >>> d = new Differ()
    
      Note that when instantiating a Differ object we may pass functions to
      filter out line and character 'junk'.
    
      Finally, we compare the two:
    
      >>> result = d.compare(text1, text2)
      [ '  1. Beautiful is better than ugly.\n',
        '- 2. Explicit is better than implicit.\n',
        '- 3. Simple is better than complex.\n',
        '+ 3.   Simple is better than complex.\n',
        '?   ++\n',
        '- 4. Complex is better than complicated.\n',
        '?          ^                     ---- ^\n',
        '+ 4. Complicated is better than complex.\n',
        '?         ++++ ^                      ^\n',
        '+ 5. Flat is better than nested.\n' ]
    
      Methods:
    
      constructor(linejunk=null, charjunk=null)
          Construct a text differencer, with optional filters.
      compare(a, b)
          Compare two sequences of lines; generate the resulting delta.
    */


    function Differ(linejunk, charjunk) {
      this.linejunk = linejunk;
      this.charjunk = charjunk;
      /*
          Construct a text differencer, with optional filters.
      
          The two optional keyword parameters are for filter functions:
      
          - `linejunk`: A function that should accept a single string argument,
            and return true iff the string is junk. The module-level function
            `IS_LINE_JUNK` may be used to filter out lines without visible
            characters, except for at most one splat ('#').  It is recommended
            to leave linejunk null. 
      
          - `charjunk`: A function that should accept a string of length 1. The
            module-level function `IS_CHARACTER_JUNK` may be used to filter out
            whitespace characters (a blank or tab; **note**: bad idea to include
            newline in this!).  Use of IS_CHARACTER_JUNK is recommended.
      */

    }

    Differ.prototype.compare = function(a, b) {
      /*
          Compare two sequences of lines; generate the resulting delta.
      
          Each sequence must contain individual single-line strings ending with
          newlines. Such sequences can be obtained from the `readlines()` method
          of file-like objects.  The delta generated also consists of newline-
          terminated strings, ready to be printed as-is via the writeline()
          method of a file-like object.
      
          Example:
      
          >>> d = new Differ
          >>> d.compare(['one\n', 'two\n', 'three\n'],
          ...           ['ore\n', 'tree\n', 'emu\n'])
          [ '- one\n',
            '?  ^\n',
            '+ ore\n',
            '?  ^\n',
            '- two\n',
            '- three\n',
            '?  -\n',
            '+ tree\n',
            '+ emu\n' ]
      */

      var ahi, alo, bhi, blo, cruncher, g, line, lines, tag, _i, _j, _len, _len1, _ref, _ref1;
      cruncher = new SequenceMatcher(this.linejunk, a, b);
      lines = [];
      _ref = cruncher.getOpcodes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], tag = _ref1[0], alo = _ref1[1], ahi = _ref1[2], blo = _ref1[3], bhi = _ref1[4];
        switch (tag) {
          case 'replace':
            g = this._fancyReplace(a, alo, ahi, b, blo, bhi);
            break;
          case 'delete':
            g = this._dump('-', a, alo, ahi);
            break;
          case 'insert':
            g = this._dump('+', b, blo, bhi);
            break;
          case 'equal':
            g = this._dump(' ', a, alo, ahi);
            break;
          default:
            throw new Error("unknow tag (" + tag + ")");
        }
        for (_j = 0, _len1 = g.length; _j < _len1; _j++) {
          line = g[_j];
          lines.push(line);
        }
      }
      return lines;
    };

    Differ.prototype._dump = function(tag, x, lo, hi) {
      /*
          Generate comparison results for a same-tagged range.
      */

      var i, _i, _results;
      _results = [];
      for (i = _i = lo; lo <= hi ? _i < hi : _i > hi; i = lo <= hi ? ++_i : --_i) {
        _results.push("" + tag + " " + x[i]);
      }
      return _results;
    };

    Differ.prototype._plainReplace = function(a, alo, ahi, b, blo, bhi) {
      var first, g, line, lines, second, _i, _j, _len, _len1, _ref;
      assert(alo < ahi && blo < bhi);
      if (bhi - blo < ahi - alo) {
        first = this._dump('+', b, blo, bhi);
        second = this._dump('-', a, alo, ahi);
      } else {
        first = this._dump('-', a, alo, ahi);
        second = this._dump('+', b, blo, bhi);
      }
      lines = [];
      _ref = [first, second];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        g = _ref[_i];
        for (_j = 0, _len1 = g.length; _j < _len1; _j++) {
          line = g[_j];
          lines.push(line);
        }
      }
      return lines;
    };

    Differ.prototype._fancyReplace = function(a, alo, ahi, b, blo, bhi) {
      /*
          When replacing one block of lines with another, search the blocks
          for *similar* lines; the best-matching pair (if any) is used as a
          synch point, and intraline difference marking is done on the
          similar pair. Lots of work, but often worth it.
      
          Example:
          >>> d = new Differ
          >>> d._fancyReplace(['abcDefghiJkl\n'], 0, 1,
          ...                 ['abcdefGhijkl\n'], 0, 1)
          [ '- abcDefghiJkl\n',
            '?    ^  ^  ^\n',
            '+ abcdefGhijkl\n',
            '?    ^  ^  ^\n' ]
      */

      var aelt, ai, ai1, ai2, atags, belt, bestRatio, besti, bestj, bj, bj1, bj2, btags, cruncher, cutoff, eqi, eqj, i, j, la, lb, line, lines, tag, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _n, _o, _ref, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      _ref = [0.74, 0.75], bestRatio = _ref[0], cutoff = _ref[1];
      cruncher = new SequenceMatcher(this.charjunk);
      _ref1 = [null, null], eqi = _ref1[0], eqj = _ref1[1];
      lines = [];
      for (j = _i = blo; blo <= bhi ? _i < bhi : _i > bhi; j = blo <= bhi ? ++_i : --_i) {
        bj = b[j];
        cruncher.setSeq2(bj);
        for (i = _j = alo; alo <= ahi ? _j < ahi : _j > ahi; i = alo <= ahi ? ++_j : --_j) {
          ai = a[i];
          if (ai === bj) {
            if (eqi === null) {
              _ref2 = [i, j], eqi = _ref2[0], eqj = _ref2[1];
            }
            continue;
          }
          cruncher.setSeq1(ai);
          if (cruncher.realQuickRatio() > bestRatio && cruncher.quickRatio() > bestRatio && cruncher.ratio() > bestRatio) {
            _ref3 = [cruncher.ratio(), i, j], bestRatio = _ref3[0], besti = _ref3[1], bestj = _ref3[2];
          }
        }
      }
      if (bestRatio < cutoff) {
        if (eqi === null) {
          _ref4 = this._plainReplace(a, alo, ahi, b, blo, bhi);
          for (_k = 0, _len = _ref4.length; _k < _len; _k++) {
            line = _ref4[_k];
            lines.push(line);
          }
          return lines;
        }
        _ref5 = [eqi, eqj, 1.0], besti = _ref5[0], bestj = _ref5[1], bestRatio = _ref5[2];
      } else {
        eqi = null;
      }
      _ref6 = this._fancyHelper(a, alo, besti, b, blo, bestj);
      for (_l = 0, _len1 = _ref6.length; _l < _len1; _l++) {
        line = _ref6[_l];
        lines.push(line);
      }
      _ref7 = [a[besti], b[bestj]], aelt = _ref7[0], belt = _ref7[1];
      if (eqi === null) {
        atags = btags = '';
        cruncher.setSeqs(aelt, belt);
        _ref8 = cruncher.getOpcodes();
        for (_m = 0, _len2 = _ref8.length; _m < _len2; _m++) {
          _ref9 = _ref8[_m], tag = _ref9[0], ai1 = _ref9[1], ai2 = _ref9[2], bj1 = _ref9[3], bj2 = _ref9[4];
          _ref10 = [ai2 - ai1, bj2 - bj1], la = _ref10[0], lb = _ref10[1];
          switch (tag) {
            case 'replace':
              atags += Array(la + 1).join('^');
              btags += Array(lb + 1).join('^');
              break;
            case 'delete':
              atags += Array(la + 1).join('-');
              break;
            case 'insert':
              btags += Array(lb + 1).join('+');
              break;
            case 'equal':
              atags += Array(la + 1).join(' ');
              btags += Array(lb + 1).join(' ');
              break;
            default:
              throw new Error("unknow tag (" + tag + ")");
          }
        }
        _ref11 = this._qformat(aelt, belt, atags, btags);
        for (_n = 0, _len3 = _ref11.length; _n < _len3; _n++) {
          line = _ref11[_n];
          lines.push(line);
        }
      } else {
        lines.push('  ' + aelt);
      }
      _ref12 = this._fancyHelper(a, besti + 1, ahi, b, bestj + 1, bhi);
      for (_o = 0, _len4 = _ref12.length; _o < _len4; _o++) {
        line = _ref12[_o];
        lines.push(line);
      }
      return lines;
    };

    Differ.prototype._fancyHelper = function(a, alo, ahi, b, blo, bhi) {
      var g;
      g = [];
      if (alo < ahi) {
        if (blo < bhi) {
          g = this._fancyReplace(a, alo, ahi, b, blo, bhi);
        } else {
          g = this._dump('-', a, alo, ahi);
        }
      } else if (blo < bhi) {
        g = this._dump('+', b, blo, bhi);
      }
      return g;
    };

    Differ.prototype._qformat = function(aline, bline, atags, btags) {
      /*
          Format "?" output and deal with leading tabs.
      
          Example:
      
          >>> d = new Differ
          >>> d._qformat('\tabcDefghiJkl\n', '\tabcdefGhijkl\n',
          [ '- \tabcDefghiJkl\n',
            '? \t ^ ^  ^\n',
            '+ \tabcdefGhijkl\n',
            '? \t ^ ^  ^\n' ]
      */

      var common, lines;
      lines = [];
      common = min(_countLeading(aline, '\t'), _countLeading(bline, '\t'));
      common = min(common, _countLeading(atags.slice(0, common), ' '));
      common = min(common, _countLeading(btags.slice(0, common), ' '));
      atags = atags.slice(common).replace(/\s+$/, '');
      btags = btags.slice(common).replace(/\s+$/, '');
      lines.push('- ' + aline);
      if (atags.length) {
        lines.push("? " + (Array(common + 1).join('\t')) + atags + "\n");
      }
      lines.push('+ ' + bline);
      if (btags.length) {
        lines.push("? " + (Array(common + 1).join('\t')) + btags + "\n");
      }
      return lines;
    };

    return Differ;

  })();

  IS_LINE_JUNK = function(line, pat) {
    if (pat == null) {
      pat = /^\s*#?\s*$/;
    }
    /*
      Return 1 for ignorable line: iff `line` is blank or contains a single '#'.
        
      Examples:
    
      >>> IS_LINE_JUNK('\n')
      true
      >>> IS_LINE_JUNK('  #   \n')
      true
      >>> IS_LINE_JUNK('hello\n')
      false
    */

    return pat.test(line);
  };

  IS_CHARACTER_JUNK = function(ch, ws) {
    if (ws == null) {
      ws = ' \t';
    }
    /*
      Return 1 for ignorable character: iff `ch` is a space or tab.
    
      Examples:
      >>> IS_CHARACTER_JUNK(' ').should.be.true
      true
      >>> IS_CHARACTER_JUNK('\t').should.be.true
      true
      >>> IS_CHARACTER_JUNK('\n').should.be.false
      false
      >>> IS_CHARACTER_JUNK('x').should.be.false
      false
    */

    return __indexOf.call(ws, ch) >= 0;
  };

  _formatRangeUnified = function(start, stop) {
    /*
      Convert range to the "ed" format'
    */

    var beginning, length;
    beginning = start + 1;
    length = stop - start;
    if (length === 1) {
      return "" + beginning;
    }
    if (!length) {
      beginning--;
    }
    return "" + beginning + "," + length;
  };

  unifiedDiff = function(a, b, _arg) {
    var file1Range, file2Range, first, fromdate, fromfile, fromfiledate, group, i1, i2, j1, j2, last, line, lines, lineterm, n, started, tag, todate, tofile, tofiledate, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    _ref = _arg != null ? _arg : {}, fromfile = _ref.fromfile, tofile = _ref.tofile, fromfiledate = _ref.fromfiledate, tofiledate = _ref.tofiledate, n = _ref.n, lineterm = _ref.lineterm;
    /*
      Compare two sequences of lines; generate the delta as a unified diff.
    
      Unified diffs are a compact way of showing line changes and a few
      lines of context.  The number of context lines is set by 'n' which
      defaults to three.
    
      By default, the diff control lines (those with ---, +++, or @@) are
      created with a trailing newline.  
    
      For inputs that do not have trailing newlines, set the lineterm
      argument to "" so that the output will be uniformly newline free.
    
      The unidiff format normally has a header for filenames and modification
      times.  Any or all of these may be specified using strings for
      'fromfile', 'tofile', 'fromfiledate', and 'tofiledate'.
      The modification times are normally expressed in the ISO 8601 format.
    
      Example:
    
      >>> unifiedDiff('one two three four'.split(' '),
      ...             'zero one tree four'.split(' '), {
      ...               fromfile: 'Original'
      ...               tofile: 'Current',
      ...               fromfiledate: '2005-01-26 23:30:50',
      ...               tofiledate: '2010-04-02 10:20:52',
      ...               lineterm: ''
      ...             })
      [ '--- Original\t2005-01-26 23:30:50',
        '+++ Current\t2010-04-02 10:20:52',
        '@@ -1,4 +1,4 @@',
        '+zero',
        ' one',
        '-two',
        '-three',
        '+tree',
        ' four' ]
    */

    if (fromfile == null) {
      fromfile = '';
    }
    if (tofile == null) {
      tofile = '';
    }
    if (fromfiledate == null) {
      fromfiledate = '';
    }
    if (tofiledate == null) {
      tofiledate = '';
    }
    if (n == null) {
      n = 3;
    }
    if (lineterm == null) {
      lineterm = '\n';
    }
    lines = [];
    started = false;
    _ref1 = (new SequenceMatcher(null, a, b)).getGroupedOpcodes();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      group = _ref1[_i];
      if (!started) {
        started = true;
        fromdate = fromfiledate ? "\t" + fromfiledate : '';
        todate = tofiledate ? "\t" + tofiledate : '';
        lines.push("--- " + fromfile + fromdate + lineterm);
        lines.push("+++ " + tofile + todate + lineterm);
      }
      _ref2 = [group[0], group[group.length - 1]], first = _ref2[0], last = _ref2[1];
      file1Range = _formatRangeUnified(first[1], last[2]);
      file2Range = _formatRangeUnified(first[3], last[4]);
      lines.push("@@ -" + file1Range + " +" + file2Range + " @@" + lineterm);
      for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
        _ref3 = group[_j], tag = _ref3[0], i1 = _ref3[1], i2 = _ref3[2], j1 = _ref3[3], j2 = _ref3[4];
        if (tag === 'equal') {
          _ref4 = a.slice(i1, i2);
          for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
            line = _ref4[_k];
            lines.push(' ' + line);
          }
          continue;
        }
        if (tag === 'replace' || tag === 'delete') {
          _ref5 = a.slice(i1, i2);
          for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
            line = _ref5[_l];
            lines.push('-' + line);
          }
        }
        if (tag === 'replace' || tag === 'insert') {
          _ref6 = b.slice(j1, j2);
          for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
            line = _ref6[_m];
            lines.push('+' + line);
          }
        }
      }
    }
    return lines;
  };

  _formatRangeContext = function(start, stop) {
    /*
      Convert range to the "ed" format'
    */

    var beginning, length;
    beginning = start + 1;
    length = stop - start;
    if (!length) {
      beginning--;
    }
    if (length <= 1) {
      return "" + beginning;
    }
    return "" + beginning + "," + (beginning + length - 1);
  };

  contextDiff = function(a, b, _arg) {
    var file1Range, file2Range, first, fromdate, fromfile, fromfiledate, group, i1, i2, j1, j2, last, line, lines, lineterm, n, prefix, started, tag, todate, tofile, tofiledate, _, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    _ref = _arg != null ? _arg : {}, fromfile = _ref.fromfile, tofile = _ref.tofile, fromfiledate = _ref.fromfiledate, tofiledate = _ref.tofiledate, n = _ref.n, lineterm = _ref.lineterm;
    /*
      Compare two sequences of lines; generate the delta as a context diff.
    
      Context diffs are a compact way of showing line changes and a few
      lines of context.  The number of context lines is set by 'n' which
      defaults to three.
    
      By default, the diff control lines (those with *** or ---) are
      created with a trailing newline.  This is helpful so that inputs
      created from file.readlines() result in diffs that are suitable for
      file.writelines() since both the inputs and outputs have trailing
      newlines.
    
      For inputs that do not have trailing newlines, set the lineterm
      argument to "" so that the output will be uniformly newline free.
    
      The context diff format normally has a header for filenames and
      modification times.  Any or all of these may be specified using
      strings for 'fromfile', 'tofile', 'fromfiledate', and 'tofiledate'.
      The modification times are normally expressed in the ISO 8601 format.
      If not specified, the strings default to blanks.
    
      Example:
      >>> a = ['one\n', 'two\n', 'three\n', 'four\n']
      >>> b = ['zero\n', 'one\n', 'tree\n', 'four\n']
      >>> contextDiff(a, b, {fromfile: 'Original', tofile: 'Current'})
      [ '*** Original\n',
        '--- Current\n',
        '***************\n',
        '*** 1,4 ****\n',
        '  one\n',
        '! two\n',
        '! three\n',
        '  four\n',
        '--- 1,4 ----\n',
        '+ zero\n',
        '  one\n',
        '! tree\n',
        '  four\n' ]
    */

    if (fromfile == null) {
      fromfile = '';
    }
    if (tofile == null) {
      tofile = '';
    }
    if (fromfiledate == null) {
      fromfiledate = '';
    }
    if (tofiledate == null) {
      tofiledate = '';
    }
    if (n == null) {
      n = 3;
    }
    if (lineterm == null) {
      lineterm = '\n';
    }
    prefix = {
      insert: '+ ',
      "delete": '- ',
      replace: '! ',
      equal: '  '
    };
    started = false;
    lines = [];
    _ref1 = (new SequenceMatcher(null, a, b)).getGroupedOpcodes();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      group = _ref1[_i];
      if (!started) {
        started = true;
        fromdate = fromfiledate ? "\t" + fromfiledate : '';
        todate = tofiledate ? "\t" + tofiledate : '';
        lines.push("*** " + fromfile + fromdate + lineterm);
        lines.push("--- " + tofile + todate + lineterm);
        _ref2 = [group[0], group[group.length - 1]], first = _ref2[0], last = _ref2[1];
        lines.push('***************' + lineterm);
        file1Range = _formatRangeContext(first[1], last[2]);
        lines.push("*** " + file1Range + " ****" + lineterm);
        if (_any((function() {
          var _j, _len1, _ref3, _results;
          _results = [];
          for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
            _ref3 = group[_j], tag = _ref3[0], _ = _ref3[1], _ = _ref3[2], _ = _ref3[3], _ = _ref3[4];
            _results.push(tag === 'replace' || tag === 'delete');
          }
          return _results;
        })())) {
          for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
            _ref3 = group[_j], tag = _ref3[0], i1 = _ref3[1], i2 = _ref3[2], _ = _ref3[3], _ = _ref3[4];
            if (tag !== 'insert') {
              _ref4 = a.slice(i1, i2);
              for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
                line = _ref4[_k];
                lines.push(prefix[tag] + line);
              }
            }
          }
        }
        file2Range = _formatRangeContext(first[3], last[4]);
        lines.push("--- " + file2Range + " ----" + lineterm);
        if (_any((function() {
          var _l, _len3, _ref5, _results;
          _results = [];
          for (_l = 0, _len3 = group.length; _l < _len3; _l++) {
            _ref5 = group[_l], tag = _ref5[0], _ = _ref5[1], _ = _ref5[2], _ = _ref5[3], _ = _ref5[4];
            _results.push(tag === 'replace' || tag === 'insert');
          }
          return _results;
        })())) {
          for (_l = 0, _len3 = group.length; _l < _len3; _l++) {
            _ref5 = group[_l], tag = _ref5[0], _ = _ref5[1], _ = _ref5[2], j1 = _ref5[3], j2 = _ref5[4];
            if (tag !== 'delete') {
              _ref6 = b.slice(j1, j2);
              for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
                line = _ref6[_m];
                lines.push(prefix[tag] + line);
              }
            }
          }
        }
      }
    }
    return lines;
  };

  ndiff = function(a, b, linejunk, charjunk) {
    if (charjunk == null) {
      charjunk = IS_CHARACTER_JUNK;
    }
    /*
      Compare `a` and `b` (lists of strings); return a `Differ`-style delta.
    
      Optional keyword parameters `linejunk` and `charjunk` are for filter
      functions (or None):
    
      - linejunk: A function that should accept a single string argument, and
        return true iff the string is junk.  The default is null, and is
        recommended; 
    
      - charjunk: A function that should accept a string of length 1. The
        default is module-level function IS_CHARACTER_JUNK, which filters out
        whitespace characters (a blank or tab; note: bad idea to include newline
        in this!).
    
      Example:
      >>> a = ['one\n', 'two\n', 'three\n']
      >>> b = ['ore\n', 'tree\n', 'emu\n']
      >>> ndiff(a, b)
      [ '- one\n',
        '?  ^\n',
        '+ ore\n',
        '?  ^\n',
        '- two\n',
        '- three\n',
        '?  -\n',
        '+ tree\n',
        '+ emu\n' ]
    */

    return (new Differ(linejunk, charjunk)).compare(a, b);
  };

  restore = function(delta, which) {
    /*
      Generate one of the two sequences that generated a delta.
    
      Given a `delta` produced by `Differ.compare()` or `ndiff()`, extract
      lines originating from file 1 or 2 (parameter `which`), stripping off line
      prefixes.
    
      Examples:
      >>> a = ['one\n', 'two\n', 'three\n']
      >>> b = ['ore\n', 'tree\n', 'emu\n']
      >>> diff = ndiff(a, b)
      >>> restore(diff, 1)
      [ 'one\n',
        'two\n',
        'three\n' ]
      >>> restore(diff, 2)
      [ 'ore\n',
        'tree\n',
        'emu\n' ]
    */

    var line, lines, prefixes, tag, _i, _len, _ref;
    tag = {
      1: '- ',
      2: '+ '
    }[which];
    if (!tag) {
      throw new Error("unknow delta choice (must be 1 or 2): " + which);
    }
    prefixes = ['  ', tag];
    lines = [];
    for (_i = 0, _len = delta.length; _i < _len; _i++) {
      line = delta[_i];
      if (_ref = line.slice(0, 2), __indexOf.call(prefixes, _ref) >= 0) {
        lines.push(line.slice(2));
      }
    }
    return lines;
  };

  exports._arrayCmp = _arrayCmp;

  exports.SequenceMatcher = SequenceMatcher;

  exports.getCloseMatches = getCloseMatches;

  exports._countLeading = _countLeading;

  exports.Differ = Differ;

  exports.IS_LINE_JUNK = IS_LINE_JUNK;

  exports.IS_CHARACTER_JUNK = IS_CHARACTER_JUNK;

  exports._formatRangeUnified = _formatRangeUnified;

  exports.unifiedDiff = unifiedDiff;

  exports._formatRangeContext = _formatRangeContext;

  exports.contextDiff = contextDiff;

  exports.ndiff = ndiff;

  exports.restore = restore;

}).call(this);

},{"assert":8,"heap":26}],26:[function(require,module,exports){
module.exports = require('./lib/heap');

},{"./lib/heap":27}],27:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = Heap;
  } else {
    window.Heap = Heap;
  }

}).call(this);

},{}]},{},[2]);