const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
process.chdir(require('node:path').join(__dirname,'..'));
const ctx={window:{},URL};vm.createContext(ctx);vm.runInContext(fs.readFileSync('cleaner.js','utf8'),ctx);const clean=ctx.window.__cleanCopy;
for(const [a,b] of [
['https://x.com/person/status/123?s=46&t=abc','https://x.com/person/status/123'],
['https://twitter.com/person/status/123?a=abc&s=46','https://twitter.com/person/status/123'],
['https://x.com/p/status/123/photo/1?s=20','https://x.com/p/status/123/photo/1'],
['Look: https://x.com/p/status/123?t=abc.','Look: https://x.com/p/status/123.'],
['https://example.com/?s=20','https://example.com/?s=20'],
['https://x.com.evil.com/p/status/123?t=abc','https://x.com.evil.com/p/status/123?t=abc'],
['https://x.com/search?q=cats&utm_source=test','https://x.com/search?q=cats'],
['https://x.com/search?q=cats','https://x.com/search?q=cats'],
['https://x.com/p/status/123?s=20#fragment','https://x.com/p/status/123#fragment'],
['https://x.com/p/status/123','https://x.com/p/status/123'],
['hello world','hello world']])assert.equal(clean(a),b);
(async()=>{
let written,fail=false;
const listeners={};
class Transfer{constructor(){this.data={}}setData(t,v){this.data[t]=v}getData(t){return this.data[t]||''}clearData(t){delete this.data[t]}}
Object.assign(ctx,{navigator:{clipboard:{writeText:async t=>{if(fail)throw Error('denied');written=t}}},DataTransfer:Transfer,document:{documentElement:null,addEventListener:(t,f)=>listeners.finish=f,activeElement:null},queueMicrotask,setTimeout,clearTimeout,requestAnimationFrame:f=>f()});ctx.window.addEventListener=(t,f)=>listeners[t]=f;ctx.window.getSelection=()=>({toString:()=> 'https://x.com/p/status/123?t=abc'});
vm.runInContext(fs.readFileSync('content.js','utf8'),ctx);
await ctx.navigator.clipboard.writeText('https://x.com/p/status/123?t=abc');assert.equal(written,'https://x.com/p/status/123');
fail=true;await assert.rejects(ctx.navigator.clipboard.writeText('https://x.com/p/status/123?t=abc'));
const e={clipboardData:new Transfer(),defaultPrevented:false,preventDefault(){this.defaultPrevented=true}};listeners.copy(e);listeners.finish(e);assert.equal(e.clipboardData.getData('text/plain'),'https://x.com/p/status/123');assert.equal(e.defaultPrevented,true);
const e2={clipboardData:new Transfer(),defaultPrevented:false,preventDefault(){this.defaultPrevented=true}};listeners.copy(e2);e2.clipboardData.setData('text/plain','https://x.com/p/status/456?s=20');e2.preventDefault();listeners.finish(e2);assert.equal(e2.clipboardData.getData('text/plain'),'https://x.com/p/status/456');
console.log('Passed: 11 URL cases, clipboard write success/failure, selected-text copy, site copy handler.');
})();
