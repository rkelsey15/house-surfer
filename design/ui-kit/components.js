/* UI kit behavior. Add data attributes in HTML; no setup code needed. */
(function(){
  var $=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  // Tabs: <div data-tabs> with .tab buttons (aria-controls) and .tabpanel
  $('[data-tabs]').forEach(function(w){
    var tabs=$('.tab',w);
    tabs.forEach(function(t){t.addEventListener('click',function(){
      tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);
        var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});
    })});
  });
  // Before/after: <div class="cmp" data-compare> with an <input type=range>
  $('[data-compare]').forEach(function(w){
    var r=$('input',w)[0];
    var set=function(){w.style.setProperty('--pos',r.value+'%')};
    r.addEventListener('input',set);set();
  });
  // State toggle: <div data-states> buttons[data-state] and panes[data-pane]
  $('[data-states]').forEach(function(w){
    var b=$('button[data-state]',w),p=$('[data-pane]',w);
    var show=function(n){b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.state===n)});
      p.forEach(function(x){x.hidden=x.dataset.pane!==n})};
    b.forEach(function(x){x.addEventListener('click',function(){show(x.dataset.state)})});
    show(b[0].dataset.state);
  });
  // Clickable flow: <div data-flow> with .flow-screen items, [data-next], [data-back], .dots
  $('[data-flow]').forEach(function(w){
    var s=$('.flow-screen',w),d=$('.dot',w),i=0;
    var go=function(n){i=Math.max(0,Math.min(s.length-1,n));
      s.forEach(function(x,k){x.hidden=k!==i});d.forEach(function(x,k){x.classList.toggle('on',k===i)})};
    $('[data-next]',w).forEach(function(x){x.addEventListener('click',function(){go(i+1)})});
    $('[data-back]',w).forEach(function(x){x.addEventListener('click',function(){go(i-1)})});
    $('[data-restart]',w).forEach(function(x){x.addEventListener('click',function(){go(0)})});
    go(0);
  });
})();
