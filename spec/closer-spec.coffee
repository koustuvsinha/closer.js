closer = require '../src/closer'
json_diff = require 'json-diff'

helpers = require './closer-helpers'
Integer = helpers.Literal
Float = helpers.Literal
String = helpers.Literal
Boolean = helpers.Literal
Nil = helpers.Literal
Keyword = helpers['keyword']
Vector = helpers['vector']
List = helpers['list']
HashSet = helpers['set']
HashMap = helpers['hash_map']
Identifier = helpers.Identifier
UnaryExpression = helpers.UnaryExpression
ArrayExpression = helpers.ArrayExpression
CallExpression = helpers.CallExpression
MemberExpression = helpers.MemberExpression
FunctionExpression = helpers.FunctionExpression
EmptyStatement = helpers.EmptyStatement
ExpressionStatement = helpers.ExpressionStatement
IfStatement = helpers.IfStatement
ReturnStatement = helpers.ReturnStatement
VariableDeclaration = helpers.VariableDeclaration
VariableDeclarator = helpers.VariableDeclarator
FunctionDeclaration = helpers.FunctionDeclaration
BlockStatement = helpers.BlockStatement
Program = helpers.Program

beforeEach ->
  @addMatchers toDeepEqual: helpers.toDeepEqual


describe 'Closer parser', ->

  # atoms
  it 'parses an empty program', ->
    expect(closer.parse('\n')).toDeepEqual Program()

  it 'parses an empty s-expression', ->
    expect(closer.parse('()\n')).toDeepEqual Program(
      EmptyStatement())

  it 'parses comments', ->
    expect(closer.parse('; Heading\n() ; trailing ()\r\n;\r;;;\n\r\r')).toDeepEqual Program(
      EmptyStatement())

  it 'parses an identifier', ->
    expect(closer.parse('x\n')).toDeepEqual Program(
      ExpressionStatement(Identifier('x')))

  it 'parses integer, float, string, boolean, and nil literals', ->
    expect(closer.parse('-24\n-23.67\n-22.45E-5\n""\n"string"\ntrue\nfalse\nnil\n')).toDeepEqual Program(
      ExpressionStatement(UnaryExpression('-', Integer(24))),
      ExpressionStatement(UnaryExpression('-', Float(23.67))),
      ExpressionStatement(UnaryExpression('-', Float(22.45e-5))),
      ExpressionStatement(String('')),
      ExpressionStatement(String('string')),
      ExpressionStatement(Boolean(true)),
      ExpressionStatement(Boolean(false)),
      ExpressionStatement(Nil()))

  it 'parses keywords', ->
    expect(closer.parse(':keyword')).toDeepEqual Program(
      ExpressionStatement(Keyword('keyword')))

  it 'parses vector and list literals', ->
    expect(closer.parse('[] ["string" true] \'() \'("string" true)')).toDeepEqual Program(
      ExpressionStatement(Vector()),
      ExpressionStatement(Vector(
        String('string'),
        Boolean(true))),
      ExpressionStatement(List()),
      ExpressionStatement(List(
        String('string'),
        Boolean(true))))

  it 'parses set and map literals', ->
    expect(closer.parse('#{} #{"string" true}')).toDeepEqual Program(
      ExpressionStatement(HashSet()),
      ExpressionStatement(HashSet(
        String('string'),
        Boolean(true))))
    expect(closer.parse('{} {"string" true}')).toDeepEqual Program(
      ExpressionStatement(HashMap()),
      ExpressionStatement(HashMap(
        String('string'),
        Boolean(true))))
    expect(-> closer.parse('{1 2 3}')).toThrow()

  it 'parses commas as whitespace', ->
    expect(closer.parse(',,, ,,,  ,,\n')).toDeepEqual Program()


  # functions
  it 'parses a function call with 0 arguments', ->
    expect(closer.parse('(fn-name)\n')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(Identifier('fn-name'), Identifier('call')),
        [Nil()])))

  it 'parses a function call with > 0 arguments', ->
    expect(closer.parse('(fn-name arg1 arg2)\n')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(Identifier('fn-name'), Identifier('call')),
        [Nil(), Identifier('arg1'), Identifier('arg2')])))

  it 'parses an anonymous function definition', ->
    expect(closer.parse('(fn [x] x)\n')).toDeepEqual Program(
      ExpressionStatement(
        FunctionExpression(
          null,
          [Identifier('x')],
          null,
          BlockStatement(
            ReturnStatement(Identifier('x'))))))

  it 'parses an anonymous function call', ->
    expect(closer.parse('((fn [x] x) 2)\n')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(
          FunctionExpression(
            null,
            [Identifier('x')],
            null,
            BlockStatement(
              ReturnStatement(Identifier('x')))),
          Identifier('call')),
        [Nil(), Integer(2)])))

  it 'parses anonymous function literals', ->
    expect(closer.parse('(#(+ % 2) 3)')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(
          FunctionExpression(
            null,
            [Identifier('__$1')],
            null,
            BlockStatement(
              ReturnStatement(CallExpression(
                MemberExpression(Identifier('+'), Identifier('call')),
                [Nil(), Identifier('__$1'), Integer(2)])))),
          Identifier('call')),
        [Nil(), Integer(3)])))
    expect(closer.parse('(map #(if (even? %) (- %) %) [1 2 3])')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(Identifier('map'), Identifier('call')),
        [Nil(),
        FunctionExpression(
          null,
          [Identifier('__$1')],
          null,
          BlockStatement(
            IfStatement(
              CallExpression(
                MemberExpression(Identifier('even?'), Identifier('call')),
                [Nil(), Identifier('__$1')]),
              ReturnStatement(CallExpression(
                MemberExpression(Identifier('-'), Identifier('call')),
                [Nil(), Identifier('__$1')])),
              ReturnStatement(Identifier('__$1'))))),
        CallExpression(
          Identifier('vector'),
          [Integer(1), Integer(2), Integer(3)])])))

  it 'parses a named function definition', ->
    expect(closer.parse('(defn fn-name [x] x)\n')).toDeepEqual Program(
      FunctionDeclaration(
        Identifier('fn-name'),
        [Identifier('x')],
        null,
        BlockStatement(
          ReturnStatement(Identifier('x')))))

  it 'parses rest arguments', ->
    expect(closer.parse('(defn avg [& rest] (/ (apply + rest) (count rest)))\n')).toDeepEqual Program(
      FunctionDeclaration(
        Identifier('avg'),
        [], Identifier('rest'),
        BlockStatement(ReturnStatement(
          CallExpression(
            MemberExpression(Identifier('/'), Identifier('call')),
            [Nil(),
            CallExpression(
              MemberExpression(Identifier('apply'), Identifier('call')),
              [Nil(), Identifier('+'), Identifier('rest')]),
            CallExpression(
              MemberExpression(Identifier('count'), Identifier('call')),
              [Nil(), Identifier('rest')])])))))

  it 'parses collections and keywords in function position', ->
    expect(closer.parse('([1 2 3 4] 1)')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(
          CallExpression(
            Identifier('vector'),
            [Integer(1), Integer(2), Integer(3), Integer(4)]),
          Identifier('call')),
        [Nil(), Integer(1)])))
    expect(closer.parse('({1 2 3 4} 1)')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(
          CallExpression(
            Identifier('hash_map'),
            [Integer(1), Integer(2), Integer(3), Integer(4)]),
          Identifier('call')),
        [Nil(), Integer(1)])))
    expect(closer.parse('(#{1 2 3 4} 1)')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(
          CallExpression(
            Identifier('set'),
            [ArrayExpression(
              [Integer(1), Integer(2), Integer(3), Integer(4)])]),
          Identifier('call')),
        [Nil(), Integer(1)])))
    expect(closer.parse('(:key {:key :val})')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        MemberExpression(Keyword('key'), Identifier('call')),
        [Nil(),
        CallExpression(
          Identifier('hash_map'),
          [Keyword('key'), Keyword('val')])])))


  # conditional statements
  it 'parses an if statement without else', ->
    expect(closer.parse('(if (>= x 0) x)\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(
          MemberExpression(Identifier('>='), Identifier('call')),
          [Nil(), Identifier('x'), Integer(0)]),
        ExpressionStatement(Identifier('x')),
        null))

  it 'parses an if-else statement', ->
    expect(closer.parse('(if (>= x 0) x (- x))\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(
          MemberExpression(Identifier('>='), Identifier('call')),
          [Nil(), Identifier('x'), Integer(0)]),
        ExpressionStatement(Identifier('x')),
        ExpressionStatement(
          CallExpression(
            MemberExpression(Identifier('-'), Identifier('call')),
            [Nil(), Identifier('x')]))))

  it 'parses a when form', ->
    expect(closer.parse('(when (condition?) (println \"hello\") true)\n')).toDeepEqual Program(
      IfStatement(
        CallExpression(
          MemberExpression(Identifier('condition?'), Identifier('call')),
          [Nil()]),
        BlockStatement(
          ExpressionStatement(CallExpression(
            MemberExpression(Identifier('println'), Identifier('call')),
            [Nil(), String('hello')])),
          ExpressionStatement(Boolean(true)))))


  # variables
  it 'parses an unbound var definition', ->
    expect(closer.parse('(def var-name)')).toDeepEqual Program(
      VariableDeclaration(
        VariableDeclarator(
          Identifier('var-name'),
          null)))

  it 'parses a var bound to a literal', ->
    expect(closer.parse('(def greeting \"Hello\")')).toDeepEqual Program(
      VariableDeclaration(
        VariableDeclarator(
          Identifier('greeting'),
          String('Hello'))))

  it 'parses a var bound to the result of an expression', ->
    expect(closer.parse('(def sum (+ 3 5))')).toDeepEqual Program(
      VariableDeclaration(
        VariableDeclarator(
          Identifier('sum'),
          CallExpression(
            MemberExpression(Identifier('+'), Identifier('call')),
            [Nil(), Integer(3), Integer(5)]))))

  it 'parses a var bound to an fn form', ->
    expect(closer.parse('(def add (fn [& numbers] (apply + numbers)))')).toDeepEqual Program(
      VariableDeclaration(
        VariableDeclarator(
          Identifier('add'),
          FunctionExpression(
            null,
            [],
            Identifier('numbers'),
            BlockStatement(
              ReturnStatement(CallExpression(
                MemberExpression(Identifier('apply'), Identifier('call')),
                [Nil(), Identifier('+'), Identifier('numbers')])))))))

  it 'parses a let form with no bindings and no body', ->
    expect(closer.parse('(let [])')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        FunctionExpression(
          null, [], null,
          BlockStatement(
            ReturnStatement(Nil()))))))

  it 'parses a let form with non-empty bindings and a non-empty body', ->
    expect(closer.parse('(let [x 3 y (- x)] (+ x y))')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        FunctionExpression(
          null, [], null,
          BlockStatement(VariableDeclaration(
            VariableDeclarator(
              Identifier('x'),
              Integer(3))),
            VariableDeclaration(
              VariableDeclarator(
                Identifier('y'),
                CallExpression(
                  MemberExpression(Identifier('-'), Identifier('call')),
                  [Nil(), Identifier('x')]))),
            ReturnStatement(CallExpression(
              MemberExpression(Identifier('+'), Identifier('call')),
              [Nil(), Identifier('x'), Identifier('y')])))))))


  # other special forms
  it 'parses an empty do form', ->
    expect(closer.parse('(do)')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        FunctionExpression(
          null, [], null,
          BlockStatement(ReturnStatement(Nil()))))))

  it 'parses a non-empty do form', ->
    expect(closer.parse('(do (+ 1 2) (+ 3 4))')).toDeepEqual Program(
      ExpressionStatement(CallExpression(
        FunctionExpression(
          null, [], null,
          BlockStatement(
            ExpressionStatement(CallExpression(
              MemberExpression(Identifier('+'), Identifier('call')),
              [Nil(), Integer(1), Integer(2)])),
            ReturnStatement(CallExpression(
              MemberExpression(Identifier('+'), Identifier('call')),
              [Nil(), Integer(3), Integer(4)])))))))


  # pending
  xit 'parses source locations'
