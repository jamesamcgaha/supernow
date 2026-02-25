function switchTab(btn, panelId) {
    var tabs = btn.closest('.code-tabs');
    tabs.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    tabs.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById(panelId).classList.add('active');
}

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var panel = btn.closest('.tab-panel-code');
    var code = panel && panel.querySelector('pre code');
    if (!code) return;
    // Extract just the code lines, excluding the line number column
    var cells = code.querySelectorAll('.hljs-ln-code');
    var text = cells.length
        ? Array.from(cells).map(function(td) { return td.innerText; }).join('\n')
        : code.innerText;
    navigator.clipboard.writeText(text).then(function() {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(function() { btn.innerHTML = '<i class="fas fa-copy"></i>'; }, 1500);
    });
});
