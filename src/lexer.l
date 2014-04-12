WHITESPACE      [\s]+
INTEGER         [-+]?([1-9][0-9]+|[0-9])
FLOAT           [-+]?[0-9]+((\.[0-9]*[eE][-+]?[0-9]+)|(\.[0-9]*)|([eE][-+]?[0-9]+))
STRING          \"([^\"\\]|\\[\'\"\\bfnrt])+\"
IDENTIFIER      [a-zA-Z*+!\-_=<>?/.][0-9a-zA-Z*+!\-_=<>?/.:]*
COMMENT         \;[^\r\n]*

%s regex

%options flex

%%

/* %options flex = match *longest* token instead of using the first matching rule */

{WHITESPACE}  /* whitespace */;

{INTEGER} %{
    return 'INTEGER';
%}

{FLOAT} %{
    return 'FLOAT';
%}

{STRING} %{
    yytext = yytext.substr(1, yyleng-2);
    return 'STRING';
%}

{COMMENT} %{ /* ignore */ %};
'&' return '&';
'(' return '(';
')' return ')';
'[' return '[';
']' return ']';

'def'   return 'DEF';
'fn'    return 'FN';
'defn'  return 'DEFN';
'if'    return 'IF';
'when'  return 'WHEN';
'do'    return 'DO';
'let'   return 'LET';

'true'  return 'true';
'false' return 'false';
'nil'   return 'nil';

{IDENTIFIER} %{
    return 'IDENTIFIER';
%}