_ = window?._ ? self?._ ? global?._ ? require 'lodash-node'
repl = require '../src/repl'
closerCore = window?.closerCore ? self?.closerCore ? global?.closerCore ? require '../src/closer-core'
closerAssertions = window?.closerAssertions ? self?.closerAssertions ? global?.closerAssertions ? require '../src/assertions'

beforeEach ->
  @addMatchers
    # custom matcher to compare Clojure values
    toCljEqual: (expected) ->
      @message = ->
        "Expected #{@actual} to equal #{expected}"
      closerCore._$EQ_(@actual, expected)
    # custom matcher to compare JS objects / arrays
    toJSEqual: (expected) ->
      @message = ->
        "Expected #{@actual} to equal #{expected}"
      _.isEqual @actual, expected

parseOpts = { loc: false }
evaluate = (src) ->
  eval repl.generateJS src, parseOpts

eq = (src, expected) -> expect(evaluate src).toCljEqual expected
jseq = (src, expected) -> expect(evaluate src).toJSEqual expected
throws = (src) -> expect(-> evaluate src).toThrow()
truthy = (src) -> expect(evaluate src).toCljEqual true
falsy = (src) -> expect(evaluate src).toCljEqual false
nil = (src) -> expect(evaluate src).toCljEqual null

key = (x) -> closerCore.keyword x
seq = (seqable) -> closerCore.seq seqable
emptySeq = -> closerCore.empty closerCore.seq [1]
vec = (xs...) -> closerCore.vector.apply null, _.flatten xs
list = (xs...) -> closerCore.list.apply null, _.flatten xs
set = (xs...) -> closerCore.hash_$_set.apply null, _.flatten xs
map = (xs...) -> closerCore.hash_$_map.apply null, _.flatten xs

__$this = {}
obj = { 'a': 1 }  # simple object for use in some tests (like = and not=)

describe 'Closer core library', ->

  # arithmetic
  describe '(+ x y & more)', ->
    it 'adds the given numbers', ->
      throws '(+ "string")'
      eq '(+)', 0
      eq '(+ 3.3 0 -6e2 2)', -594.7

  describe '(- x y & more)', ->
    it 'subtracts all but the first number from the first one', ->
      throws '(-)'
      throws '(- "string")'
      eq '(- -3.54)', 3.54
      eq '(- 10 3.5 -4)', 10.5

  describe '(* x y & more)', ->
    it 'multiplies the given numbers', ->
      throws '(* "string")'
      eq '(*)', 1
      eq '(* 3 -6)', -18

  describe '(/ x y & more)', ->
    it 'divides the first number by the rest', ->
      throws '(/)'
      throws '(/ "string")'
      eq '(/ -4)', -0.25
      eq '(/ 14 -2)', -7
      eq '(/ 14 -2.0)', -7
      eq '(/ 14 -2 -2)', 3.5

  describe '(inc x)', ->
    it 'increments x by 1', ->
      throws '(inc 2 3 4)'
      throws '(inc "string")'
      eq '(inc -2e-3)', 0.998

  describe '(dec x)', ->
    it 'decrements x by 1', ->
      throws '(dec 2 3 4)'
      throws '(dec "string")'
      eq '(dec -2e-3)', -1.002

  describe '(max x y & more)', ->
    it 'finds the maximum of the given numbers', ->
      throws '(max)'
      throws '(max "string" [1 2])'
      eq '(max -1e10 653.32 1.345e4)', 1.345e4

  describe '(min x y & more)', ->
    it 'finds the minimum of the given numbers', ->
      throws '(min)'
      throws '(min "string" [1 2])'
      eq '(min -1e10 653.32 1.345e4)', -1e10

  describe '(quot num div)', ->
    it 'computes the quotient of dividing num by div', ->
      throws '(quot 10)'
      throws '(quot [1 2] 3)'
      eq '(quot 10 3)', 3
      eq '(quot -5.9 3)', -1.0
      eq '(quot -10 -3)', 3
      eq '(quot 10 -3)', -3

  describe '(rem num div)', ->
    it 'computes the remainder of dividing num by div (same as % in other languages)', ->
      throws '(rem 10)'
      throws '(rem [1 2] 3)'
      eq '(rem 10.1 3)', 10.1 % 3
      eq '(rem -10.1 3)', -10.1 % 3
      eq '(rem -10.1 -3)', -10.1 % -3
      eq '(rem 10.1 -3)', 10.1 % -3

  describe '(mod num div)', ->
    it 'computes the modulus of num and div (NOT the same as % in other languages)', ->
      throws '(mod 10)'
      throws '(mod [1 2] 3)'
      eq '(mod 10.1 3)', 10.1 % 3
      eq '(mod -10.1 3)', 3 - 10.1 % 3
      eq '(mod -10.1 -3)', -10.1 % 3
      eq '(mod 10.1 -3)', 10.1 % 3 - 3

  describe '(rand), (rand n)', ->
    it 'returns a random floating-point number between 0 (inclusive) and n (default 1) (exclusive)', ->
      throws '(rand 3.4 7.9)'
      truthy '(every? #(and (>= % 0) (< % 1)) (repeatedly 50 rand))'
      truthy '(every? #(and (>= % 0) (< % 3)) (repeatedly 50 #(rand 3)))'

  describe '(rand-int n)', ->
    it 'returns a random integer between 0 (inclusive) and n (exclusive)', ->
      throws '(rand-int 3 8)'
      truthy '(every? #{0 1} (repeatedly 50 #(rand-int 2)))'
      truthy '(every? #{0 1} (repeatedly 50 #(rand-int 1.1)))'   # probability of 1 is very low
      truthy '(every? #{0 -1} (repeatedly 50 #(rand-int -1.1)))'   # probability of -1 is very low


  # comparison
  describe '(= x y & more)', ->
    it 'returns true if all its arguments are equal (by value, not identity)', ->
      throws '(=)'
      truthy '(= nil nil)'
      truthy '(= 1)'
      truthy '(= #(+ x y))'   # always returns true for 1 arg
      truthy '(let [a 1] (= a a 1))'
      falsy '(let [a 1] (= a a 2))'
      truthy '(= 1 1.0)'   # different from standard Clojure
      truthy '(= "hello" "hello")'
      truthy '(= true true)'
      falsy '(= true false)'
      truthy '(= :keyword :keyword)'
      falsy '(= :keyword "keyword")'
      falsy '(= 1 [1])'
      falsy '(= [3 4] [4 3])'
      truthy '(= [3 4] \'(3 4))'
      falsy '(= [3 4] \'(3 5))'
      truthy '(= #{1 2} #{2 1})'
      truthy '(= {#{1 2} 1 :keyword true} {:keyword true #{1 2} 1})'
      falsy '(= #{1 2} #{2 1 3})'
      falsy '(= #{1 2} [2 1])'
      truthy '(= (to-array [0 1 2 3]) (range 4))'
      truthy '(= obj {"a" 1})'  # obj is defined at the top
      falsy '(= obj {:a 1})'  # obj is defined at the top

  describe '(not= x y & more)', ->
    it 'returns true if some of its arguments are unequal (by value, not identity)', ->
      throws '(not=)'
      falsy '(not= nil nil)'
      falsy '(not= 1)'
      falsy '(not= #(+ x y))'   # always falsy for 1 arg
      falsy '(let [a 1] (not= a a 1))'
      truthy '(let [a 1] (not= a a 2))'
      falsy '(not= 1 1.0)'   # different from standard Clojure
      falsy '(not= "hello" "hello")'
      falsy '(not= true true)'
      truthy '(not= true false)'
      falsy '(not= :keyword :keyword)'
      truthy '(not= :keyword "keyword")'
      truthy '(not= 1 [1])'
      truthy '(not= [3 4] [4 3])'
      falsy '(not= [3 4] \'(3 4))'
      truthy '(not= [3 4] \'(3 5))'
      falsy '(not= #{1 2} #{2 1})'
      falsy '(not= {#{1 2} 1 :keyword true} {:keyword true #{1 2} 1})'
      truthy '(not= #{1 2} #{2 1 3})'
      truthy '(not= #{1 2} [2 1])'
      falsy '(not= (to-array [0 1 2 3]) (range 4))'
      falsy '(not= obj {"a" 1})'  # obj is defined at the top
      truthy '(not= obj {:a 1})'  # obj is defined at the top

  describe '(== x y & more)', ->
    it 'returns true if all its arguments are numeric and equal', ->
      throws '(==)'
      throws '(== "hello" "hello")'
      truthy '(== [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(let [a 2] (== a a 2.0 (/ 8 (+ 2 2.0))))'

  describe '(< x y & more)', ->
    it 'returns true if its arguments are in monotonically increasing order', ->
      throws '(<)'
      throws '(< "hello" "hello")'
      truthy '(< [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(< 0.76 3.45 (+ 2 2) 5)'
      falsy '(< 0.76 3.45 (+ 2 2) 3)'
      falsy '(< 0.76 3.45 (+ 2 2) 4)'
      throws '(< 0.76 3.45 (+ 2 2) nil)'

  describe '(> x y & more)', ->
    it 'returns true if its arguments are in monotonically decreasing order', ->
      throws '(>)'
      throws '(> "hello" "hello")'
      truthy '(> [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(> 5 (+ 2 2) 3.45 0.76)'
      falsy '(> 3 (+ 2 2) 3.45 0.76)'
      falsy '(> 4 (+ 2 2) 3.45 0.76)'
      throws '(> nil (+ 2 2) 3.45 0.76)'

  describe '(<= x y & more)', ->
    it 'returns true if its arguments are in monotonically non-decreasing order', ->
      throws '(<=)'
      throws '(<= "hello" "hello")'
      truthy '(<= [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(<= 0.76 3.45 (+ 2 2) 5)'
      falsy '(<= 0.76 3.45 (+ 2 2) 3)'
      truthy '(<= 0.76 3.45 (+ 2 2) 4)'
      throws '(<= 0.76 3.45 (+ 2 2) nil)'

  describe '(>= x y & more)', ->
    it 'returns true if its arguments are in monotonically non-increasing order', ->
      throws '(>=)'
      throws '(>= "hello" "hello")'
      truthy '(>= [1 2 3])'  # always truthy for 1 arg irrespective of type
      truthy '(>= 5 (+ 2 2) 3.45 0.76)'
      falsy '(>= 3 (+ 2 2) 3.45 0.76)'
      truthy '(>= 4 (+ 2 2) 3.45 0.76)'
      throws '(>= nil (+ 2 2) 3.45 0.76)'

  describe '(identical? x y)', ->
    it 'returns true if x and y are the same object', ->
      throws '(identical? 1 1 1)'
      truthy '(identical? 1 1)'
      truthy '(identical? 1.56 1.56)'   # different from standard Clojure
      truthy '(identical? true true)'
      truthy '(identical? nil nil)'
      falsy '(identical? :keyword :keyword)'   # different from standard Clojure
      falsy '(identical? #{1 2} #{1 2})'
      truthy '(let [a #{1 2}] (identical? a a))'
      truthy '(identical? "string" "string")'

  describe '(true? x)', ->
    it 'returns true if and only if x is the value true', ->
      throws '(true? nil false)'
      truthy '(true? true)'
      falsy '(true? "hello")'
      falsy '(true? #())'

  describe '(false? x)', ->
    it 'returns true if and only if x is the value false', ->
      throws '(false? nil false)'
      truthy '(false? false)'
      falsy '(false? nil)'
      falsy '(false? #())'

  describe '(nil? x)', ->
    it 'returns true if and only if x is the value nil', ->
      throws '(nil? nil false)'
      truthy '(nil? nil)'
      falsy '(nil? false)'
      falsy '(nil? #())'

  describe '(some? x)', ->
    it 'returns true if and only if x is NOT the value nil', ->
      throws '(some? nil false)'
      falsy '(some? nil)'
      truthy '(some? "hello")'
      truthy '(some? #())'

  describe '(number? x)', ->
    it 'returns true if and only if x is a number', ->
      truthy '(number? 0)'
      truthy '(number? 0.0)'
      falsy '(number? "0")'
      falsy '(number? [])'
      falsy '(number? nil)'

  describe '(integer? x)', ->
    it 'returns true if and only if x is an integer', ->
      truthy '(integer? 0)'
      truthy '(integer? 0.0)'   # different from standard Clojure
      falsy '(integer? 0.1)'
      falsy '(integer? "0")'
      falsy '(integer? [])'
      falsy '(integer? nil)'

  describe '(float? x)', ->
    it 'returns true if and only if x is a floating-point number', ->
      falsy '(float? 0)'
      falsy '(float? 0.0)'   # different from standard Clojure
      truthy '(float? 0.1)'
      falsy '(float? "0.0")'
      falsy '(float? [])'
      falsy '(float? nil)'

  describe '(zero? x)', ->
    it 'returns true if and only if x is numerically 0', ->
      truthy '(zero? 0)'
      truthy '(zero? 0.0)'
      throws '(zero? "0.0")'
      throws '(zero? [])'
      throws '(zero? nil)'

  describe '(pos? x)', ->
    it 'returns true if and only if x is a number > 0', ->
      truthy '(pos? 3)'
      truthy '(pos? 3.54)'
      falsy '(pos? 0)'
      falsy '(pos? -4.5)'
      throws '(pos? "0.0")'
      throws '(pos? [])'
      throws '(pos? nil)'

  describe '(neg? x)', ->
    it 'returns true if and only if x is a number < 0', ->
      truthy '(neg? -3)'
      truthy '(neg? -3.54)'
      falsy '(neg? 0)'
      falsy '(neg? 4.5)'
      throws '(neg? "0.0")'
      throws '(neg? [])'
      throws '(neg? nil)'

  describe '(even? x)', ->
    it 'returns true if and only if x is an even integer', ->
      truthy '(even? 0)'
      truthy '(even? 68)'
      falsy '(even? 69)'
      truthy '(even? 0.0)'    # different from standard Clojure
      throws '(even? "0.0")'

  describe '(odd? x)', ->
    it 'returns true if and only if x is an odd integer', ->
      falsy '(odd? 0)'
      falsy '(odd? 68)'
      truthy '(odd? 69)'
      truthy '(odd? 1.0)'    # different from standard Clojure
      throws '(odd? "1.0")'

  describe '(contains? coll key)', ->
    it 'returns true if the collection contains the given key', ->
      throws '(contains? #{nil 2} nil 2)'
      throws '(contains? "string" "str")'
      throws '(contains? \'(1 2) 2)'  # not supported for lists
      truthy '(contains? #{nil 2} nil)'
      falsy '(contains? #{1 2} 3)'
      truthy '(contains? #{{1 2}} {1 2})'
      falsy '(contains? #{{1 2}} {2 1})'
      truthy '(contains? {#{1 2} true} #{2 1})'
      truthy '(contains? #{[1 2]} \'(1 2))'
      falsy '(contains? #{[1 2]} \'(2 1))'
#      # when coll is a vector, contains? checks if key is a valid index into it
      truthy '(contains? [98 54] 0)'
      truthy '(contains? [98 54] 1)'
      falsy '(contains? [98 54] 2)'
      falsy '(contains? [98 54] 98)'

  describe '(empty? coll)', ->
    it 'returns true if coll has no items - same as (not (seq coll))', ->
      throws '(empty? 3)'
      throws '(empty? [] \'())'
      truthy '(empty? nil)'
      truthy '(empty? "")'
      falsy '(empty? "string")'
      falsy '(empty? [1 2 3])'
      truthy '(empty? [])'
      falsy '(empty? {:k1 "v1" :k2 "v2"})'
      truthy '(empty? #{})'

  describe '(keyword? x)', ->
    it 'returns true if x is a keyword', ->
      throws '(keyword? :k1 :k2)'
      truthy '(keyword? :key)'
      falsy '(keyword? ":key")'

  describe '(list? x)', ->
    it 'returns true if x is a list', ->
      throws '(list? \'() \'())'
      truthy '(list? \'())'
      falsy '(list? 3)'
      falsy '(list? [])'
      falsy '(list? (range))'

  describe '(seq? x)', ->
    it 'returns true if x is a seq', ->
      throws '(seq? (range) (range))'
      truthy '(seq? (range))'
      truthy '(seq? \'())'
      falsy '(seq? 3)'
      falsy '(seq? [])'

  describe '(vector? x)', ->
    it 'returns true if x is a vector', ->
      throws '(vector? [] [])'
      truthy '(vector? [])'
      truthy '(vector? (first (seq {1 2})))'
      falsy '(vector? 3)'
      falsy '(vector? \'())'

  describe '(map? x)', ->
    it 'returns true if x is a map', ->
      throws '(map? {} {})'
      truthy '(map? {})'
      falsy '(map? 3)'
      falsy '(map? #{})'

  describe '(set? x)', ->
    it 'returns true if x is a set', ->
      throws '(set? #{} #{})'
      truthy '(set? #{})'
      falsy '(set? 3)'
      falsy '(set? {})'
      falsy '(set? [])'

  describe '(coll? x)', ->
    it 'returns true if x is a collection', ->
      throws '(coll? [] #{})'
      truthy '(coll? [])'
      truthy '(coll? \'())'
      truthy '(coll? (range))'
      truthy '(coll? {})'
      truthy '(coll? #{})'
      falsy '(coll? 3)'
      falsy '(coll? "string")'
      falsy '(coll? (new Array))'
      falsy '(coll? (new Object))'

  describe '(sequential? coll)', ->
    it 'returns true if coll is a sequential collection', ->
      throws '(sequential? [] \'())'
      truthy '(sequential? [])'
      truthy '(sequential? \'())'
      truthy '(sequential? (range))'
      falsy '(sequential? #{})'
      falsy '(sequential? {})'
      falsy '(sequential? "string")'

  describe '(associative? coll)', ->
    it 'returns true if coll is an associative collection', ->
      throws '(associative? [] {})'
      truthy '(associative? [])'
      truthy '(associative? {})'
      falsy '(associative? \'())'
      falsy '(associative? (range))'
      falsy '(associative? #{})'
      falsy '(associative? "string")'

  describe '(counted? coll)', ->
    it 'returns true if coll can be counted in constant time', ->
      throws '(counted? [] \'())'
      truthy '(counted? [])'
      truthy '(counted? \'())'
      truthy '(counted? #{})'
      truthy '(counted? {})'
      truthy '(counted? (range))'   # different from Clojure; same as ClojureScript
      falsy '(counted? "string")'

  describe '(seqable? coll)', ->
    it 'returns true if coll can be converted into a seq', ->
      throws '(seqable? [] \'())'
      truthy '(seqable? [])'
      truthy '(seqable? \'())'
      truthy '(seqable? (range))'
      truthy '(seqable? #{})'
      truthy '(seqable? {})'
      falsy '(seqable? "string")'   # different from Clojure and ClojureScript
      falsy '(seqable? 3)'
      falsy '(seqable? nil)'

  describe '(reversible? coll)', ->
    it 'returns true if coll is a reversible collection', ->
      throws '(reversible? [] []])'
      truthy '(reversible? [])'
      falsy '(reversible? \'())'
      falsy '(reversible? (range))'
      falsy '(reversible? #{})'
      falsy '(reversible? {})'
      falsy '(reversible? "string")'


  # logic
  describe '(boolean x)', ->
    it 'coerces x into a boolean value (false for nil and false, else true)', ->
      throws '(boolean nil false)'
      falsy '(boolean nil)'
      falsy '(boolean false)'
      truthy '(boolean true)'
      truthy '(boolean 34.75)'
      truthy '(boolean "hello")'
      truthy '(boolean :keyword)'
      truthy '(boolean [1 2])'
      truthy '(boolean #(+ x y))'

  describe '(not x)', ->
    it 'returns the complement of (boolean x) (true for nil and false, else false)', ->
      throws '(not nil false)'
      truthy '(not nil)'
      truthy '(not false)'
      falsy '(not true)'
      falsy '(not 34.75)'
      falsy '(not "hello")'
      falsy '(not :keyword)'
      falsy '(not [1 2])'
      falsy '(not #(+ x y))'


  # string
  describe '(str x & ys)', ->
    it 'concatenates the string values of each of its arguments', ->
      eq '(str)', ''
      eq '(str nil)', ''
      eq '(str 34)', '34'
      eq '(str 34.45)', '34.45'
      eq '(str 3e3)', '3000'    # different from standard Clojure
      eq '(str 3e-4)', '0.0003'    # different from standard Clojure
      eq '(str 1 true "hello" :keyword)', '1truehello:keyword'
      eq '(str [1 2 :key])', '[1 2 :key]'
      eq '(str (seq [1 2 :key]))', '(1 2 :key)'
      eq '(str \'(1 2 3))', '(1 2 3)'
      eq '(str #{1 2 3})', '#{1 2 3}'
      eq '(str {1 2 3 4})', '{1 2, 3 4}'
      eq '(str (seq {1 2 3 4}))', '([1 2] [3 4])'
      eq '(str [1 2 \'(3 4 5)])', '[1 2 (3 4 5)]'

  describe '(println args)', ->
    it 'prints the given args separated by a single space and followed by a newline', ->
      oldLog = console.log
      console.log = (args...) -> args.join ' '
      eq '(println 1 2 [3 4])', '1 2 [3 4]'
      eq '(println #{1 2} {3 4})', '#{1 2} {3 4}'
      console.log = oldLog


  # collections
  describe '(keyword name)', ->
    it 'returns a keyword with the given name (do not use : in the name, it will be added automatically)', ->
      throws '(keyword "k1" "k2")'
      eq '(keyword "key")', key 'key'
      eq '(keyword :key)', key 'key'
      # eq '(keyword \'+)', key '+'
      nil '(keyword [])'
      nil '(keyword #())'
      nil '(keyword 3)'
      nil '(keyword true)'

  describe '(list items)', ->
    it 'creates a new list containing the given items', ->
      eq '(list)', list()
      eq '(list 1 2 3 1)', list 1, 2, 3, 1

  describe '(vector items)', ->
    it 'creates a new vector containing the given items', ->
      eq '(vector)', vec()
      eq '(vector 1 2 3 1)', vec 1, 2, 3, 1

  describe '(hash-map keyvals)', ->
    it 'creates a new hash-map containing the given key-value pairs', ->
      eq '(hash-map)', map()
      throws '(hash-map 1)'   # even number of args required
      truthy '(let [kv (first (hash-map \'() 1 [] 2))]
                (and (list? (first kv)))
                     (= (last kv) 1))'

  describe '(hash-set keys)', ->
    it 'creates a new hash-set containing the given keys', ->
      eq '(hash-set)', set()
      # for equal keys, the first instance wins
      truthy '(vector? (#{[] 1 2 \'()} []))'
      truthy '(list? (#{\'() 1 2 []} \'()))'

  describe '(count coll)', ->
    it 'returns the number of items the collection', ->
      throws '(count [1 2 3] "hello")'
      throws '(count 1)'
      throws '(count true)'
      eq '(count nil)', 0
      eq '(count "hello")', 5
      eq '(count [1 2 3])', 3
      eq '(count [1 2 #{3 4 5}])', 3
      eq '(count {:key1 "value1" :key2 "value2"})', 2

  describe '(empty coll)', ->
    it 'returns an empty collection of the same category as coll, or nil', ->
      throws '(empty)'
      nil '(empty 1)'
      nil '(empty "hello")'
      eq '(empty [1 2 #{3 4}])', vec()
      eq '(empty \'(1 2))', list()
      eq '(empty #{1 2})', set()
      eq '(empty {1 2})', map()
      eq '(empty (seq #{1 2}))', emptySeq()

  describe '(not-empty coll)', ->
    it 'if coll is empty, returns nil, else coll', ->
      throws '(not-empty)'
      throws '(not-empty 1)'
      nil '(not-empty nil)'
      nil '(not-empty #{})'
      eq '(not-empty #{1})', set 1
      nil '(not-empty "")'
      eq '(not-empty "hello")', 'hello'

  describe '(get coll key not-found)', ->
    it 'returns the value mapped to key if present, else not-found or nil', ->
      throws '(get [1 2 3])'
      nil '(get nil 2)'
      nil '(get 2 2)'
      nil '(get {:k1 "v1" :k2 "v2"} :k3)'
      eq '(get {:k1 "v1" :k2 "v2"} :k3 :not-found)', key 'not-found'
      eq '(get {:k1 "v1" :k2 "v2"} :k2 :not-found)', 'v2'
      eq '(get {#{35 49} true} #{49 35})', true
      nil '(get #{45 89 32} 1)'
      eq '(get #{45 89 32} 89)', 89
      eq '(get [45 89 32] 1)', 89
      nil '(get [45 89 32] 89)'
      nil '(get \'(45 89 32) 1)'
      nil '(get \'(45 89 32) 89)'
      nil '(get \'(45 89 32) 1)'
      eq '(get "qwerty" 2)', 'e'

  describe '(aget obj key & keys)', ->
    it 'returns the value corresponding to the given (nested) key in obj', ->
      obj = { a: 1, b: { c: [2, 3] } }
      throws '(aget obj)'
      throws '(aget obj nil nil)'
      eq '(aget obj "a")', 1
      eq '(aget obj "b" "c")', [2, 3]
      eq '(aget obj "b" "c" 1)', 3

  describe '(seq coll)', ->
    it 'returns a seq on the collection, or nil if it is empty or nil', ->
      throws '(seq [1 2 3] [4 5 6])'
      throws '(seq true)'
      nil '(seq nil)'
      nil '(seq "")'
      nil '(seq {})'
      eq '(seq "qwe")', seq 'qwe'
      eq '(seq [1 2 3])', seq vec 1, 2, 3
      eq '(seq \'(1 2 3))', seq list 1, 2, 3
      eq '(seq #{1 2 3})', seq set 1, 2, 3
      eq '(seq {1 2 3 4})', seq map 1, 2, 3, 4

  describe '(first coll)', ->
    it 'returns the first item in the collection, or nil if coll is nil', ->
      throws '(first [1 2 3] [4 5 6])'
      throws '(first 3)'
      nil '(first nil)'
      nil '(first [])'
      nil '(first "")'
      eq '(first "string")', 's'
      eq '(first \'(1 2 3))', 1
      eq '(first #{1 2 3})', 1
      eq '(first {1 2 3 4})', vec 1, 2

  describe '(rest coll)', ->
    it 'returns all but the first item in the collection, or an empty seq if there are no more', ->
      throws '(rest [1 2 3] [4 5 6])'
      throws '(rest 3)'
      eq '(rest nil)', emptySeq()
      eq '(rest [])', emptySeq()
      eq '(rest "s")', emptySeq()
      eq '(rest "string")', seq 'tring'
      eq '(rest \'(1 2 3))', seq [2, 3]
      eq '(rest #{1 2 3})', seq [2, 3]
      eq '(rest {1 2 3 4})', seq [vec 3, 4]

  describe '(next coll)', ->
    it 'returns all but the first item in the collection, or nil if there are no more', ->
      throws '(next [1 2 3] [4 5 6])'
      throws '(next 3)'
      nil '(next nil)'
      nil '(next [])'
      nil '(next "s")'
      eq '(next "string")', seq('tring')
      eq '(next \'(1 2 3))', seq([2, 3])
      eq '(next #{1 2 3})', seq [2, 3]
      eq '(next {1 2 3 4})', seq [vec 3, 4]

  describe '(last coll)', ->
    it 'returns the last item in coll, in linear time', ->
      throws '(last [1 2 3] [4 5 6])'
      throws '(last 3)'
      nil '(last nil)'
      nil '(last [])'
      nil '(last "")'
      eq '(last "string")', 'g'
      eq '(last \'(1 2 3))', 3
      eq '(last #{1 2 3})', 3
      eq '(last {1 2 3 4})', vec 3, 4

  describe '(nth coll index not-found)', ->
    it 'returns the value at index in coll, takes O(n) time on lists and seqs', ->
      throws '(nth [1 2] 0 0 0)'
      throws '(nth #{1 2} 0)'   # doesn't work with sets
      throws '(nth {1 2} 0)'   # doesn't work with maps
      nil '(nth nil 3)'
      eq '(nth [1 2] 0)', 1    # takes constant time
      eq '(nth [1 2] 0.45)', 1   # float truncated to int
      throws '(nth [1 2] nil)'   # index must be a number
      throws '(nth [1 2] nil "not-found")'   # index must be a number
      throws '(nth [1 2] 2)'   # index out of bounds
      eq '(nth [1 2] 2 "not-found")', 'not-found'
      eq '(nth "string" 0)', 's'   # works with strings
      throws '(nth "string" 6)'   # index out of bounds
      eq '(nth "string" 6 "not-found")', 'not-found'
      eq '(nth \'(1 2 3 4) 3)', 4   # takes O(n) time
      eq '(nth (seq #{1 2 3 4}) 3)', 4   # takes O(n) time

  describe '(second coll)', ->
    it 'is equivalent to (first (next x))', ->
      throws '(second [1 2 3] [4 5 6])'
      throws '(second 3)'
      eq '(second "string")', 't'
      eq '(second \'(1 2 3))', 2
      eq '(second {1 2 3 4})', vec 3, 4

  describe '(ffirst coll)', ->
    it 'is equivalent to (first (first x))', ->
      throws '(ffirst [[1]] [[2]])'
      throws '(ffirst [1 2])'
      eq '(ffirst \'([1 2] 3))', 1
      eq '(ffirst {1 2 3 4})', 1

  describe '(nfirst coll)', ->
    it 'is equivalent to (next (first x))', ->
      throws '(nfirst [[1 2]] [[3 4]])'
      throws '(nfirst [1 2])'
      eq '(nfirst \'([1 2] 3))', seq [2]
      eq '(nfirst {1 2 3 4})', seq [2]

  describe '(fnext coll)', ->
    it 'is equivalent to (first (next x))', ->
      throws '(fnext [1 2 3] [4 5 6])'
      throws '(fnext 3)'
      eq '(fnext "string")', 't'
      eq '(fnext \'(1 2 3))', 2
      eq '(fnext {1 2 3 4})', vec 3, 4

  describe '(nnext coll)', ->
    it 'is equivalent to (next (next x))', ->
      throws '(nnext [1 2] [3 4])'
      throws '(nnext 3)'
      nil '(nnext [1 2])'
      eq '(nnext \'(1 2 [3 4]))', seq [vec 3, 4]
      eq '(nnext {1 2 3 4 5 6})', seq [vec 5, 6]

  describe '(nthnext coll n)', ->
    it 'returns the nth next of coll, or (seq coll) when n is 0', ->
      throws '(nthnext [1 2 3])'
      throws '(nthnext 3)'
      eq '(nthnext (range 10) 0)', seq [0..9]
      eq '(nthnext (range 10) 5)', seq [5..9]
      nil '(nthnext (range 10) 10)'

  describe '(max-key k xs)', ->
    it 'returns the x for which (k x), a number, is greatest', ->
      throws '(max-key count)'
      throws '(max-key true 2 3 4)'
      eq '(max-key count "hello" "world!")', 'world!'
      eq '(max-key count "hello" "world")', 'world'
      eq '(apply max-key identity (range 10))', 9

  describe '(min-key k xs)', ->
    it 'returns the x for which (k x), a number, is least', ->
      throws '(min-key count)'
      throws '(min-key true 2 3 4)'
      eq '(min-key count "hello" "world!")', 'hello'
      eq '(min-key count "hello" "world")', 'world'
      eq '(apply min-key identity (range 10))', 0

  describe '(peek coll)', ->
    it 'returns the first item of a list or the last item of a vector', ->
      throws '(peek [1 2] [3 4])'   # wrong arity
      throws '(peek #{1 2})'   # doesn't work with sets
      throws '(peek {1 2})'   # doesn't work with maps
      throws '(peek (seq #{1 2}))'   # doesn't work with seqs
      throws '(peek "string")'   # doesn't work with strings
      nil '(peek nil)'
      nil '(peek [])'
      nil '(peek \'())'
      eq '(peek \'(1 2 3))', 1   # returns first item of list
      eq '(peek [1 2 3])', 3   # returns last item of vector

  describe '(pop coll)', ->
    it 'returns coll with (peek coll) removed, throws if coll is empty', ->
      throws '(pop [1 2] [3 4])'   # wrong arity
      throws '(pop #{1 2})'   # doesn't work with sets
      throws '(pop {1 2})'   # doesn't work with maps
      throws '(pop (seq #{1 2}))'   # doesn't work with seqs
      throws '(pop "string")'   # doesn't work with strings
      nil '(pop nil)'
      throws '(pop [])'
      throws '(pop \'())'
      eq '(pop \'(1 2 3))', list 2, 3   # returns all but first item of list
      eq '(pop [1 2 3])', vec 1, 2   # returns all but last item of vector

  describe '(cons x seq)', ->
    it 'returns a new seq of the form (x seq)', ->
      throws '(cons 1 2 [3 4 5])'
      eq '(cons 3 nil)', seq [3]   # creates empty seq from nil
      eq '(cons nil nil)', seq [null]
      throws '(cons nil 3)'   # can't create seq from integer
      eq '(cons true "string")', seq [true, 's', 't', 'r', 'i', 'n', 'g']
      eq '(cons 1 {1 2 3 4})', seq [1, vec(1, 2), vec(3, 4)]

  describe '(conj coll & xs)', ->
    it 'adds xs to coll in the most efficient way possible', ->
      throws '(conj [1 2 3])'
      throws '(conj "string" "s")'
      eq '(conj #{1 2 3} 4 true)', set 1, 2, 3, 4, true
      eq '(conj nil 1)', seq [1]   # creates empty seq from nil
      eq '(conj {1 2} [3 4])', map 1, 2, 3, 4
      throws '(conj {1 2} [3 4 5 6])'   # vector args must be pairs; no more, no less
      eq '(conj {1 2} [3 4] [5 6])', map 1, 2, 3, 4, 5, 6   # ... like this
      eq '(conj {1 2} {3 4 5 6})', map 1, 2, 3, 4, 5, 6
      throws '(conj {1 2} \'(3 4))'   # can't conj list on map
      throws '(conj {1 2} #{3 4})'   # can't conj set on map
      eq '(conj [1] 2 3)', vec 1, 2, 3   # appends to vectors
      eq '(conj (seq [1]) 2 3)', seq [3, 2, 1]   # prepends to seqs
      eq '(conj \'(1) 2 3)', list 3, 2, 1   # prepends to lists
      eq '(conj #{1 2} [3])', set 1, 2, vec(3)   # whole collection is inserted as is
      eq '(conj [1 2] [3])', vec 1, 2, vec(3)   # whole collection is inserted as is
      eq '(conj \'(1 2) [3])', list vec(3), 1, 2   # whole collection is inserted as is

  describe '(disj set), (disj set ks)', ->
    it 'returns a new set with the keys removed', ->
      throws '(disj)'
      eq '(disj #{1 2 3})', set 1, 2, 3
      throws '(disj 3)'
      eq '(disj #{1 2 3 []} 2 4 \'())', set 1, 3
      throws '(disj {1 2, 3 4} 1)'
      throws '(disj [1 2 3 4] 0 1)'

  describe '(into to from)', ->
    it 'conjs all items from the second collection into the first', ->
      throws '(into [])'
      nil '(into nil nil)'
      eq '(into :key nil)', key 'key'   # if from is nil, returns to as it is
      eq '(into :key [])', key 'key'   # if from is empty, returns to as it is
      throws '(into :key [1])'   # keyword is not a collection
      eq '(into [1 2] [3 4])', vec 1, 2, 3, 4
      eq '(into nil [3 4])', seq [4, 3]    # creates seq from nil
      eq '(into \'(1 2) [3 4])', list 4, 3, 1, 2    # prepends to lists
      eq '(into [1 2] \'(3 4))', list 1, 2, 3, 4
      eq '(into #{1 2} [3 4])', set 1, 2, 3, 4
      eq '(into {1 2} {3 4})', map 1, 2, 3, 4
      throws '(into {1 2} [3 4])'    # needs collection of vectors, or a map
      eq '(into {1 2} [[3 4]])', map 1, 2, 3, 4
      throws '(into {1 2} [[3]])'    # vector args to conj must be pairs
      throws '(into {1 2} [[3 4 5]])'    # vector args to conj must be pairs
      eq '(into {1 2} \'([3 4]))', map 1, 2, 3, 4
      eq '(into {1 2} #{[3 4]})', map 1, 2, 3, 4
      throws '(into {1 2} [\'(3 4)])'    # only vectors (pairs) can be conjed into maps

  describe '(concat seqs)', ->
    it 'concatenates the given seqables into one sequence', ->
      eq '(concat)', emptySeq()
      eq '(concat nil)', emptySeq()
      eq '(concat #{1} [2] \'(3) {4 5} "67")', seq [1, 2, 3, vec(4, 5), '6', '7']
      throws '(concat #{1} [2] \'(3) {4 5} "67" 3)'   # integer is not seqable
      throws '(concat #{1} [2] \'(3) {4 5} "67" true)'   # boolean is not seqable

  describe '(flatten coll)', ->
    it 'converts an arbitrarily-nested collection into a flat sequence', ->
      throws '(flatten)'
      eq '(flatten nil)', emptySeq()
      eq '(flatten 3)', emptySeq()    # doesn't throw
      eq '(flatten "string")', emptySeq()
      eq '(flatten [1 \'(2 [3])])', seq [1, 2, 3]
      eq '(flatten #{1 2 #{3}})', emptySeq()    # doesn't work with sets
      eq '(flatten {:a 1, :b 2})', emptySeq()    # doesn't work with maps
      eq '(flatten (seq {:a 1, :b 2}))', seq [key('b'), 2, key('a'), 1]

  describe '(reverse coll)', ->
    it 'reverses the collection', ->
      throws '(reverse)'
      eq '(reverse nil)', emptySeq()
      throws '(reverse 3)'
      eq '(reverse "")', emptySeq()
      eq '(reverse "string")', seq ['g', 'n', 'i', 'r', 't', 's']
      eq '(reverse [1 2 \'(3 4)])', seq [list(3, 4), 2, 1]
      eq '(reverse #{1 2 3})', seq [3, 2, 1]
      eq '(reverse {:a 1 :b 2})', seq [vec(key('a'), 1), vec(key('b'), 2)]

  describe '(assoc map & kvs)', ->
    it 'adds / updates the given key-value pairs in the given map / vector', ->
      throws '(assoc #{1 2} 3 3)'   # doesn't work with sets
      throws '(assoc \'(1 2) 3 3)'   # doesn't work with lists
      throws '(assoc "string" 1 "h")'   # doesn't work with strings
      eq '(assoc {1 2 3 4} 1 3 4 5)', map 1, 3, 3, 4, 4, 5   # replaces as well as adds pairs
      throws '(assoc {1 2} 3 4 5)'   # needs even number of rest args
      eq '(assoc [1 2 3] 3 4)', vec 1, 2, 3, 4
      throws '(assoc [1 2 3] 4 4)'   # index must be <= (count vector)
      throws '(assoc [1 2 3] 3)'   # needs even number of rest args
      eq '(assoc {1 2} nil 4)', map 1, 2, null, 4
      throws '(assoc [1 2] nil 4)'   # key must be integer in case of vector

  describe '(dissoc map & keys)', ->
    it 'removes entries corresponding to the given keys from map', ->
      throws '(dissoc #{1 2} 0)'   # doesn't work with sets
      throws '(dissoc \'(1 2) 0)'   # doesn't work with lists
      throws '(dissoc "string" 0)'   # doesn't work with strings
      throws '(dissoc [1 2] 0)'   # doesn't work with vectors
      eq '(dissoc {1 2})', map 1, 2
      eq '(dissoc [1 2])', vec 1, 2   # works with 1 arg irrespective of type
      eq '(dissoc {1 2, 3 4, 5 6} 3 5)', map 1, 2
      eq '(dissoc {1 2, 3 4, 5 6} 3 5 4 6 7)', map 1, 2
      nil '(dissoc nil #() true)'   # works with nil irrespective of rest args

  describe '(keys map)', ->
    it 'returns a seq of the map\'s keys', ->
      throws '(keys {:a 1, :b 2} {:c 3, :d 4})'
      throws '(keys [1 2 3 4])'
      throws '(keys \'(1 2 3 4))'
      throws '(keys #{1 2 3 4})'
      throws '(keys "string")'
      eq '(keys {:a 1, :b 2})', seq [key('b'), key('a')]

  describe '(vals map)', ->
    it 'returns a seq of the map\'s values', ->
      throws '(vals {:a 1, :b 2} {:c 3, :d 4})'
      throws '(vals [1 2 3 4])'
      throws '(vals \'(1 2 3 4))'
      throws '(vals #{1 2 3 4})'
      throws '(vals "string")'
      eq '(vals {:a 1, :b 2})', seq [2, 1]

  describe '(key e)', ->
    it 'returns the key of the given map entry', ->
      throws '(key (first {1 2}) (first {3 4}))'   # must give exactly 1 arg
      throws '(key nil)'
      throws '(key 3)'
      eq '(key (last {1 2, 3 4}))', 3
      throws '(key \'(3 4))'
      eq '(key [3 4])', 3   # different from Clojure, can't detect exact MapEntry type ...
      throws '(key [3 4 5 6])'   # ... but that only works with vectors of size 2

  describe '(val e)', ->
    it 'returns the value of the given map entry', ->
      throws '(val (first {1 2}) (first {3 4}))'   # must give exactly 1 arg
      throws '(val nil)'
      throws '(val 3)'
      eq '(val (last {1 2, 3 4}))', 4
      throws '(val \'(3 4))'
      eq '(val [3 4])', 4   # different from Clojure, can't detect exact MapEntry type ...
      throws '(val [3 4 5 6])'   # ... but that only works with vectors of size 2

  describe '(find map key)', ->
    it 'returns the map entry for a given key', ->
      throws '(find {:a 1 :b 2} :a :b)'
      nil '(find nil nil)'
      nil '(find nil 3)'
      eq '(find {:a 1 :b 2} :a)', vec key('a'), 1
      eq '(find [1 2 3 4] 2)', vec 2, 3
      throws '(find \'(1 2 3 4) 2)'
      throws '(find #{1 2 3 4} 2)'
      throws '(find "string" 2)'

  describe '(range), (range end), (range start end), (range start end step)', ->
    it 'returns a seq of numbers in the range [start, end), where start defaults to 0, step to 1, and end to infinity', ->
      throws '(range 1 10 2 2)'
      eq '(nth (range) 23)', 23
      eq '(range 5)', seq [0, 1, 2, 3, 4]
      eq '(range 2 5)', seq [2, 3, 4]
      eq '(range 1 10 2)', seq [1, 3, 5, 7, 9]
      eq '(range 10 2 2)', emptySeq()
      eq '(range 10 2 -2)', seq [10, 8, 6, 4]
      eq '(range 1.2 6.9 1.6)', seq [1.2, 2.8, 4.4, 6.0]
      throws '(range 1.2 6.9 "1.6")'

  describe '(to-array coll)', ->
    it 'converts coll to a javascript array', ->
      throws '(to-array [] [])'
      throws '(to-array 1)'
      eq '(to-array nil)', []
      eq '(to-array [1 [2]])', [1, vec 2]
      eq '(to-array \'(1 \'(2)))', [1, list 2]
      eq '(to-array #{1 #{2}})', [1, set 2]
      eq '(to-array {1 {2 3}})', [vec 1, map(2, 3)]
      eq '(to-array "string")', 'string'.split('')

  describe '(identity x)', ->
    it 'returns its argument', ->
      throws '(identity 34 45)'
      nil '(identity nil)'
      eq '(identity {:k1 "v1" :k2 #{1 2}})', map key('k1'), 'v1', key('k2'), set(1, 2)

  describe '(apply f x y z seq)', ->
    it 'applies the given function with arguments x, y, z and the elements of seq', ->
      throws '(apply +)'
      eq '(apply + [1 2 3 4])', 10
      eq '(apply + 1 2 [3 4])', 10
      throws '(apply + 1 [2 3] 4)'   # last arg must be seqable
      throws '(apply true 1 2 [3 4])'   # f must be a function
      eq '(apply concat {1 2, 3 4, 5 6})', seq [1, 2, 3, 4, 5, 6]

  describe '(map f colls)', ->
    it 'applies f sequentially to every item in the given collections', ->
      throws '(map +)'
      eq '(map inc [1 2 3])', seq [2, 3, 4]
      eq '(map + [1 2] \'(3 4) #{5 6})', seq [9, 12]
      eq '(map first {:a 1, :b 2})', seq [key('b'), key('a')]
      eq '(map #(if (even? %) (- %) %) [1 2 3 4])', vec 1, -2, 3, -4
      eq '(map #{1} [1 2 4 1])', seq [1, null, null, 1]
      eq '(map {1 2, 3 4, 5 6, 7 8} #{3 7})', seq [4, 8]
      eq '(map :name [{:name "name1"} {:name "name2"}])', seq ['name1', 'name2']

  describe '(mapcat f colls)', ->
    it 'applies concat to the result of applying map to f and colls', ->
      throws '(mapcat +)'
      # throws '(mapcat inc [1 2 3])'   # f must return a collection
      eq '(mapcat reverse {2 1, 4 3, 6 5})',
        seq [1, 2, 3, 4, 5, 6]

  describe '(filter pred coll)', ->
    it 'returns a seq of the items in coll for which (pred item) is true', ->
      throws '(filter even?)'
      throws '(filter true [1 2 3 4])'   # pred must be a function
      eq '(filter even? nil)', emptySeq()
      eq '(filter even? [1 2 3 4])', seq [2, 4]
      eq '(filter even? \'(1 2 3 4))', seq [2, 4]
      eq '(filter even? #{1 2 3 4})', seq [2, 4]
      eq '(filter (fn [[k v]] (< k v)) {1 2 4 3})', seq [vec(1, 2)]
      eq '(filter #{"s"} "strings")', seq ['s', 's']

  describe '(remove pred coll)', ->
    it 'returns a seq of the items in coll for which (pred item) is false', ->
      throws '(remove even?)'
      throws '(remove true [1 2 3 4])'   # pred must be a function
      eq '(remove even? nil)', emptySeq()
      eq '(remove even? [1 2 3 4])', seq [1, 3]
      eq '(remove even? \'(1 2 3 4))', seq [1, 3]
      eq '(remove even? #{1 2 3 4})', seq [1, 3]
      eq '(remove #{2 4} (range 1 5))', seq [1, 3]
      eq '(remove (fn [[k v]] (< k v)) {1 2 4 3})', seq [vec(4, 3)]
      eq '(remove #{"s"} "strings")', seq ['t', 'r', 'i', 'n', 'g']

  describe '(reduce f coll), (reduce f val coll)', ->
    it 'applies f to the first item in coll, then to that result and the second item, and so on', ->
      throws '(reduce +)'
      throws '(reduce + 2)'
      eq '(reduce + nil)', 0
      eq '(reduce + [1 2 3 4])', 10
      eq '(reduce + \'(1 2 3 4))', 10
      eq '(reduce + #{1 2 3 4})', 10
      eq '(reduce + 10 [1 2 3 4])', 20
      eq '(reduce concat {1 2 3 4})', seq [1, 2, 3, 4]
      throws '(reduce nil [1 2 3 4])'   # f must be a function

  describe '(reduce-kv f init coll)', ->
    it 'works like reduce, but f is given 3 arguments: result, key, and value', ->
      throws '(reduce-kv +)'
      throws '(reduce-kv + [1 2 3 4])'    # needs 3 args, unlike reduce
      eq '(reduce-kv + 0 [0 1 2 3])', 12
      eq '(reduce-kv + 0 {0 1 2 3})', 6
      eq '(reduce-kv + 4 {0 1 2 3})', 10
      throws '(reduce-kv + 0 #{0 1 2 3})'
      throws '(reduce-kv + 0 \'(0 1 2 3))'

  describe '(take n coll)', ->
    it 'returns a seq of the first n items of coll, or all items if there are fewer than n', ->
      throws '(take 10)'
      throws '(take 10 3)'    # coll must be seqable
      throws '(take "2" [1 2 3 4])'    # n must be a number
      eq '(take 3 (range))', seq [0, 1, 2]
      eq '(take 2 [1 2 3 4])', seq [1, 2]
      eq '(take 2 \'(1 2 3 4))', seq [1, 2]
      eq '(take 2 #{1 2 3 4})', seq [1, 2]
      eq '(take 2 {1 2 3 4 5 6})', seq [vec(1, 2), vec(3, 4)]
      eq '(take 2.1 [1 2 3 4])', seq [1, 2, 3]    # n is rounded up

  describe '(drop n coll)', ->
    it 'returns a seq of all but the first n items of coll, or an empty seq if there are fewer than n', ->
      throws '(drop 10)'
      throws '(drop 10 3)'    # coll must be seqable
      throws '(drop "2" [1 2 3 4])'    # n must be a number
      eq '(drop 3 (take 6 (range)))', seq [3, 4, 5]
      eq '(drop 2 [1 2 3 4])', seq [3, 4]
      eq '(drop 2 \'(1 2 3 4))', seq [3, 4]
      eq '(drop 2 #{1 2 3 4})', seq [3, 4]
      eq '(drop 2 {1 2 3 4 5 6})', seq [vec(5, 6)]
      eq '(drop 2.1 [1 2 3 4])', seq [4]    # n is rounded up

  describe '(some pred coll)', ->
    it 'returns the first logically true value of (pred x) for any x in coll, else nil', ->
      throws '(some even?)'
      throws '(some true [1 2 3])'
      throws '(some even? 1)'
      truthy '(some even? \'(1 2 3 4))'
      nil '(some even? \'(1 3 5 7))'
      eq '(some {2 "two" 3 "three"} [nil 4 3])', 'three'
      eq '(some #(if (even? %) %) [1 2 3 4])', 2    # substitute for (first (filter pred coll))
      eq '(some #{2} (range 10))', 2

  describe '(every? pred coll)', ->
    it 'returns true if (pred x) is true for every x in coll, else false', ->
      throws '(every? even?)'
      throws '(every? true [1 2 3])'
      throws '(every? even? 1)'
      truthy '(every? even? [2 4 6])'
      falsy '(every? even? [1 3 5])'
      falsy '(every? #{1 2} [1 2 3])'
      truthy '(every? #{1 2} [1 2 2 1])'
      # weird, but that's how Clojure behaves
      truthy '(every? true? [])'
      truthy '(every? false? [])'

  describe '(sort coll), (sort cmp coll)', ->
    it 'sorts the given collection, optionally using the given comparison function', ->
      throws '(sort > [3 1 2 4] [7 5 6 8])'   # wrong arity
      throws '(sort 3)'   # if given 1 arg, it must be seqable
      throws '(sort 3 [7 5 6 8])'   # if given 2 args, 1st must be a function
      throws '(sort > 3)'   # if given 2 args, 2nd must be seqable
      eq '(sort [3 1 2 4])', seq [1, 2, 3, 4]
      eq '(sort \'(3 1 2 4))', seq [1, 2, 3, 4]
      eq '(sort #{3 1 2 4})', seq [1, 2, 3, 4]
      eq '(sort {3 1, 2 4})', seq [vec(2, 4), vec(3, 1)]
      eq '(sort "string")', seq ["g", "i", "n", "r", "s", "t"]
      eq '(sort > [3 1 2 4])', seq [4, 3, 2, 1]
      throws '(sort > "string")'   # works in ClojureScript, but not in Clojure
      throws '(sort > {3 1, 2 4})'   # works in ClojureScript, but not in Clojure

  describe '(sort-by keyfn coll), (sort-by keyfn cmp coll)', ->
    it 'sorts the given collection, optionally using the given comparison function', ->
      throws '(sort-by [3 1 2 4])'   # wrong arity
      throws '(sort-by true [3 1 2 4])'   # if given 2 args, 1st must be a function
      throws '(sort-by - 3)'   # if given 2 args, 2nd must be seqable
      throws '(sort-by true > [3 1 2 4])'   # if given 3 args, 1st must be a function
      throws '(sort-by - true [3 1 2 4])'   # if given 3 args, 2nd must be a function
      throws '(sort-by - > 3)'   # if given 3 args, 3rd must be seqable
      eq '(sort-by - [3 1 2 4])', seq [4, 3, 2, 1]
      eq '(sort-by - \'(3 1 2 4))', seq [4, 3, 2, 1]
      eq '(sort-by - #{3 1 2 4})', seq [4, 3, 2, 1]
      eq '(sort-by #(apply + %) {3 1, 2 4, 6 5})', seq [vec(3, 1), vec(2, 4), vec(6, 5)]
      eq '(sort-by count ["aa" "a" "aaa"])', seq ["a", "aa", "aaa"]
      eq '(sort-by :age [{:age 29} {:age 16} {:age 32}])',
        seq [map(key('age'), 16), map(key('age'), 29), map(key('age'), 32)]
      eq '(sort-by - > [3 1 2 4])', seq [1, 2, 3, 4]

  describe '(partition n coll), (partition n step coll), (partition n step pad coll)', ->
    it 'partitions coll into groups of n items each', ->
      throws '(partition 2)'
      throws '(partition true [1 2 3 4])'   # n must be a number
      throws '(partition 2 true [1 2 3 4])'   # step must be a number
      throws '(partition 3 3 3 [1 2 3 4])'   # pad must be seqable
      throws '(partition 2 2)'   # coll must be seqable
      eq '(partition 4 (range 10))', seq [seq([0..3]), seq([4..7])]
      eq '(partition 4 4 (range 10))', seq [seq([0..3]), seq([4..7])]
      eq '(partition 4 4 [] (range 10))', seq [seq([0..3]), seq([4..7]), seq([8..9])]
      eq '(partition 4 4 [10 11] (range 10))', seq [seq([0..3]), seq([4..7]), seq([8..11])]
      eq '(partition 4 4 (range 10 20) (range 10))', seq [seq([0..3]), seq([4..7]), seq([8..11])]
      eq '(partition 5 3 (range 10))', seq [seq([0..4]), seq([3..7])]
      eq '(partition 2 \'(1 2 3 4))', seq [seq([1, 2]), seq([3, 4])]
      eq '(partition 2 #{1 2 3 4})', seq [seq([1, 2]), seq([3, 4])]
      eq '(partition 1 {1 2 3 4})', seq [seq([vec 1, 2]), seq([vec 3, 4])]
      eq '(partition 2 "string")', seq [seq(['s', 't']), seq(['r', 'i']), seq(['n', 'g'])]

  describe '(partition-by f coll)', ->
    it 'partitions coll with a new group being started whenever the value returned by f changes', ->
      throws '(partition-by #(nth % 0))'
      throws '(partition-by 2 [1 2 3 4])'
      throws '(partition-by #(nth % 0) 3)'
      eq '(partition-by #{3} [1 2 2.4 3 3 4 5 3])', seq [seq([1, 2, 2.4]), seq([3, 3]), seq([4, 5]), seq([3])]
      eq '(partition-by odd? \'(1 1 2 3 3))', seq [seq([1, 1]), seq([2]), seq([3, 3])]
      eq '(partition-by #(< % 3) #{1 2 3})', seq [seq([1, 2]), seq([3])]
      eq '(partition-by #(% 1) {1 1, 2 1, 3 4})', seq [seq([vec(1, 1), vec(2, 1)]), seq([vec(3, 4)])]
      eq '(partition-by identity "mummy")', seq [seq(['m']), seq(['u']), seq(['m', 'm']), seq(['y'])]

  describe '(group-by f coll)', ->
    it 'returns a map of items grouped by the result of applying f to each element', ->
      throws '(group-by even?)'
      throws '(group-by 3 [1 2 3 4])'
      throws '(group-by even? 2)'
      eq '(group-by even? [1 2 3 4])', map true, vec(2, 4), false, vec(1, 3)
      eq '(group-by even? \'(1 2 3 4))', map true, vec(2, 4), false, vec(1, 3)
      eq '(group-by even? #{1 2 3 4})', map true, vec(2, 4), false, vec(1, 3)
      eq '(group-by #(% 1) {1 1, 2 1, 3 4, 5 6})', map 1, vec(vec(1, 1), vec(2, 1)), 4, vec(vec(3, 4)), 6, vec(vec(5, 6))
      eq '(group-by #{"c"} "soccer")', map null, vec('s', 'o', 'e', 'r'), 'c', vec('c', 'c')

  describe '(zipmap keys vals)', ->
    it 'returns a map with the keys mapped to the corresponding vals', ->
      throws '(zipmap [1 2 3])'
      throws '(zipmap [1 2 3] 3)'   # keys must be seqable or nil
      throws '(zipmap 3 [1 2 3])'   # vals must be seqable or nil
      eq '(zipmap nil nil)', map()
      eq '(zipmap [1 2 3] nil)', map()
      eq '(zipmap nil [1 2 3])', map()
      eq '(zipmap [1 2 3 4] \'(5 6))', map 1, 5, 2, 6
      eq '(zipmap #{1 2 3} "string")', map 1, "s", 2, "t", 3, "r"
      eq '(zipmap {1 2, 3 4} [5])', map vec(1, 2), 5
      eq '(zipmap [1 2 [] 1 \'()] (range))', map 1, 3, 2, 1, vec(), 4

  describe '(iterate f x)', ->
    it 'creates a lazy sequence of x, f(x), f(f(x)), etc. f must be free of side-effects', ->
      throws '(iterate inc)'
      throws '(iterate true 1)'
      eq '(take 5 (iterate inc 5))', seq [5...10]
      eq '(nth (iterate #(* % 2) 1) 10)', 1024

  describe '(constantly x)', ->
    it 'returns a function which takes any number of arguments and returns x', ->
      throws '(constantly 2 3)'
      eq '(map (constantly 0) [1 2 3])', seq [0, 0, 0]

  describe '(repeat x), (repeat n x)', ->
    it 'returns a lazy sequence of (infinite, or n if given) xs', ->
      throws '(repeat 3 5 6)'
      throws '(repeat true? 3)'   # if given 2 args, 1st arg must be a number
      eq '(take 5 (repeat 3))', seq [3, 3, 3, 3, 3]
      eq '(repeat 5 3)', seq [3, 3, 3, 3, 3]

  describe '(repeatedly f), (repeatedly n f)', ->
    it 'returns a lazy sequence of (infinite, or n if given) calls to the zero-arg function f', ->
      throws '(repeatedly 3 rand rand)'
      throws '(repeat true? rand)'   # if given 2 args, 1st arg must be a number
      throws '(repeatedly 3 3)'   # if given 2 args, 2nd arg must be a function
      throws '(repeatedly 3)'   # if given 1 arg, it must be a function
      truthy '(every? #{0 1} (take 50 (repeatedly #(rand-int 2))))'
      truthy '(every? #{0 1} (repeatedly 50 #(rand-int 2)))'

  describe '(comp fs)', ->
    it 'returns the composition of the given functions (the returned function takes a variable number of arguments)', ->
      throws '(comp - 3)'   # all args must be functions
      eq '((comp) [1 2 3])', vec [1..3]
      eq '((comp - /) 8 3)', -8/3
      eq '((comp str +) 8 4 5)', '17'
      eq '(def count-if (comp count filter)) (count-if even? [2 3 1 5 4])', 2

  describe '(partial f args)', ->
    it 'partially applies f to the given args, returning a function that can be invoked with more args to f', ->
      throws '(partial)'
      throws '(partial true)'   # 1st arg must be a function
      throws '((partial identity))'   # wrong number of args passed to identity
      eq '((partial identity) 3)', 3
      eq '((partial identity 3))', 3
      eq '(def times-hundred (partial * 100)) (times-hundred 5)', 500

  describe '(clj->js x)', ->
    it 'recursively transforms maps to JS objects, collections to JS arrays, and keywords to JS strings', ->
      throws '(clj->js :key [])'
      jseq '(clj->js { :a [1 2] :b #{3 4} })', { a: [1, 2], b: [3, 4] }

  describe '(js->clj x)', ->
    it 'recursively transforms JS objects to maps, and JS arrays to vectors', ->
      throws '(js->clj :key [])'
      eq '(js->clj (clj->js { :a [1 2] :b #{3 4} }))', map 'a', vec(1, 2), 'b', vec(3, 4)
        
  describe '(rand-nth coll)', ->
    it 'returns a random item from list or vector', ->
      throws '(rand-nth [1 2] [3 4])'   # wrong arity
      throws '(rand-nth #{1 2})'   # doesn't work with sets
      throws '(rand-nth {1 2})'   # doesn't work with maps
      throws '(rand-nth [])'      #doesn't work with empty vectors
      throws '(rand-nth \'())'    #doesn't work with empty list
      nil '(rand-nth nil)'
      eq '(rand-nth \'(1 1 1))', 1   # returns random item of list
      eq '(rand-nth [1 1 1])', 1   # returns random item of vector