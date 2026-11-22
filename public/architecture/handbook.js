// 独立的章节分页。正文数据由 handbook/*.js 注册，旧章节在完成替换前保留。
const HANDBOOK = {};
const handbookPosition = new Map();
{ const [id,section,rawPage]=location.hash.slice(1).split("/"); if(section==="seminar") handbookPosition.set(id,Math.max((Math.floor(Number(rawPage))||1)-1,0)); }
function handbookFlow(title, hops, note) {
 return `<figure class="book-flow"><figcaption>${title}</figcaption><ol>${hops.map(([from,to,payload,back])=>`<li><div><strong>${from}</strong><span class="book-arrow">→</span><strong>${to}</strong></div><p>${payload}</p><small>← 返回：${back}</small></li>`).join('')}</ol><p class="book-caption">${note}</p></figure>`;
}
function handbookBoundary(title, boxes, caption) {
 return `<figure class="book-boundary"><figcaption>${title}</figcaption><div class="book-boundary-grid">${boxes.map(([name,items])=>`<section><h4>${name}</h4>${items.map(x=>`<div class="book-contained">${x}</div>`).join('')}</section>`).join('')}</div><p class="book-caption">${caption}</p></figure>`;
}
function handbookSource(title,url){return `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`}
function handbookView(l){
 const book=HANDBOOK[l.id]; const page=Math.min(handbookPosition.get(l.id)||0,book.pages.length-1);
 handbookPosition.set(l.id,page);
 const p=book.pages[page];
 history.replaceState(null,"",`#${l.id}/seminar/${page+1}`);
 return `<section class="handbook"><header class="book-heading"><span>阶段 ${state.index+1} · 专题讲义</span><h2>${book.title}</h2><p>${book.intro}</p></header><p class="book-export-link"><a href="blog/index.html" target="_blank" rel="noopener noreferrer">打开完整讲义与打印版</a></p><nav class="book-toc" aria-label="专题课章节">${book.pages.map((p,i)=>`<button data-book-page="${i}" ${i===page?'aria-current="page"':''}><span>${i+1}</span>${p.title}</button>`).join('')}</nav><article class="book-page"><div class="book-page-label">第 ${page+1} / ${book.pages.length} 页</div><h3>${p.title}</h3>${p.html}</article><nav class="book-pager" aria-label="专题课翻页"><button class="secondary-button" data-book-page="${page-1}" ${page===0?'disabled':''}>上一节</button><span>${page+1} / ${book.pages.length}</span><button class="primary-button" data-book-page="${page+1}" ${page===book.pages.length-1?'disabled':''}>下一节</button></nav><details class="book-references"><summary>本章依据与阅读说明</summary><p>技术资料核对：${book.checked}。业务、故障现场与所有演示数字均为教学假设，不是实测或厂商承诺。</p>${book.sources.map(([name,url])=>handbookSource(name,url)).join(' · ')}</details></section>`;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-book-page]');if(!button)return;
 const book=HANDBOOK[lesson().id];const page=Number(button.dataset.bookPage);
 if(!book||!Number.isInteger(page)||page<0||page>=book.pages.length)return;
 handbookPosition.set(lesson().id,page);render(false);
 document.querySelector('.book-page')?.scrollIntoView({behavior:'auto',block:'start'});
});
