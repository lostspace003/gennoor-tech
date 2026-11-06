/* Python highlighter modelled on VS Code's Dark+/Light+ scopes (subtle, semantic): works on partial lines too. */
(function () {
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function set(s) { var o = {}; s.split(' ').forEach(function (w) { o[w] = 1; }); return o; }
  var CTL = set('if elif else for while return yield try except finally raise with await import from as pass break continue assert del match case');
  var KW = set('def class async lambda global nonlocal and or not in is');
  var CONST = set('None True False self cls');
  var BUILTIN = set('print len isinstance str int float dict list set tuple range any all sum min max round open input enumerate zip type super sorted map filter repr bool bytes getattr hasattr');
  var RE = /(#[^\n]*)|((?:[fFrRbB]{1,2})?"""[\s\S]*?(?:"""|$))|((?:[fFrRbB]{1,2})?"(?:\\.|[^"\\\n])*"?|(?:[fFrRbB]{1,2})?'(?:\\.|[^'\\\n])*'?)|(@[A-Za-z_][\w.]*)|(\b\d[\d_]*\.?\d*(?:e[+-]?\d+)?\b)|([A-Za-z_]\w*)|([\s\S])/g;
  function sp(c, t) { return '<span class="t-' + c + '">' + esc(t) + '</span>'; }
  window.PyHL = function (src) {
    var out = '', m, prev = '', prevSig = '', last = 0;
    RE.lastIndex = 0;
    while ((m = RE.exec(src))) {
      if (m[1]) out += sp('com', m[1]);
      else if (m[2] || m[3]) out += sp('str', m[2] || m[3]);
      else if (m[4]) out += sp('dec', m[4]);
      else if (m[5]) out += sp('num', m[5]);
      else if (m[6]) {
        var w = m[6], next = src.charAt(RE.lastIndex), cls;
        if (prevSig === 'def') cls = 'fn';
        else if (prevSig === 'class') cls = 'cls';
        else if (CTL[w]) cls = 'ctl';
        else if (KW[w]) cls = 'kw';
        else if (CONST[w]) cls = 'const';
        else if (prevSig === '.') cls = next === '(' ? 'fn' : 'prop';
        else if (BUILTIN[w] && next === '(') cls = 'fn';
        else if (next === '(') cls = /^[A-Z]/.test(w) ? 'cls' : 'fn';
        else if (/^[A-Z][a-z]/.test(w)) cls = 'cls';
        else if (/^[A-Z_0-9]+$/.test(w) && w.length > 1) cls = 'const';
        else cls = 'var';
        out += sp(cls, w); prevSig = w;
      } else { out += esc(m[7]); if (!/\s/.test(m[7])) prevSig = m[7]; }
    }
    return out;
  };
})();
