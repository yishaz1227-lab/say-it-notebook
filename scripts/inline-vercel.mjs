import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const dir=resolve('dist/vercel');
let html=await readFile(resolve(dir,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*src="(\/assets\/[^"<>]+\.js)"[^>]*><\/script>/g)];
if(scripts.length!==1)throw new Error('Expected one self-contained app module');
const files=await readdir(resolve(dir,'assets'));
if(files.filter(f=>f.endsWith('.js')).length!==1)throw new Error('Unexpected split app modules');
for(const [tag,url] of scripts){
 const code=await readFile(resolve(dir,url.slice(1)),'utf8');
 html=html.replace(tag,()=>`<script type="module" data-sayit-app>${code.replace(/<\/script/gi,'<\\/script')}</script>`);
}
for(const [tag,url] of [...html.matchAll(/<link\b[^>]*href="(\/assets\/[^"<>]+\.css)"[^>]*>/g)]){
 const css=await readFile(resolve(dir,url.slice(1)),'utf8');
 html=html.replace(tag,()=>`<style data-sayit-styles>${css.replace(/<\/style/gi,'<\\/style')}</style>`);
}
await writeFile(resolve(dir,'index.html'),html);
console.log('Homepage includes app code and styles; no subsequent app JS/CSS requests.');
