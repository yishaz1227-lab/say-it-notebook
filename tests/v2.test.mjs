import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
async function load(name){const js=ts.transpile(readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022});return import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'))}
const {PROMPTS,nextPrompt,diaryDayKind,MOODS}=await load('prompts');
const {sanitizeProperties}=await load('analytics');
test('a question deck does not repeat until all 50 questions have appeared',()=>{let used=[];for(let i=0;i<50;i++){const p=nextPrompt(used,()=>0.3);assert.ok(!used.includes(p.id));used.push(p.id)}assert.equal(new Set(used).size,50);assert.notEqual(nextPrompt(used,()=>0).id,used.at(-1));assert.equal(PROMPTS.length,50);assert.equal(new Set(PROMPTS.map(p=>p.text)).size,50)});
test('calendar uses a hollow marker only when all records on the day are moods',()=>{assert.equal(MOODS.length,5);assert.equal(diaryDayKind([]),'empty');assert.equal(diaryDayKind([{type:'mood'},{type:'mood'}]),'mood');assert.equal(diaryDayKind([{type:'mood'},{type:'audio'}]),'entry');assert.equal(diaryDayKind([{type:'text'}]),'entry')});
test('analytics allowlist rejects diary content, URLs and arbitrary IDs',()=>{assert.deepEqual(sanitizeProperties({prompt_id:'recent-1',prompt_category:'recent',entry_type:'prompt',record_duration:43.2,text:'秘密日记',blob:'private audio',url:'https://private',mood_type:'quiet',email:'private@example.com'}),{prompt_id:'recent-1',prompt_category:'recent',entry_type:'prompt',record_duration:43,mood_type:'quiet'});assert.deepEqual(sanitizeProperties({prompt_id:'private-custom-question',record_duration:Infinity,mood_type:'私人文本',days_since_last_entry:-1}),{})});
test('old backup format can round-trip new mood and question metadata',async()=>{globalThis.FileReader=class{};const {encodeBackup,decodeBackup}=await load('store');const rows=[{id:'m',kind:'message',type:'mood',mood:'quiet',date:'2026-09-19',created:1,updated:1},{id:'t',kind:'message',type:'text',text:'回答',prompt:'今天想留什么？',promptId:'today-1',promptCategory:'today',date:'2026-09-19',created:2,updated:2}];assert.deepEqual(await decodeBackup(await encodeBackup(rows)),rows)});
test('production events reuse the existing PostHog client and do not include diary content',async()=>{
 const original=globalThis.window;const calls=[];
 try {globalThis.window={posthog:{capture:(...args)=>calls.push(args)}};const {track}=await load('analytics');track('text_saved',{entry_type:'text',text:'private diary'});assert.equal(calls.length,1);assert.deepEqual(calls[0],['text_saved',{entry_type:'text',app_version:'v2.1',environment:'production'}]);globalThis.window={};assert.doesNotThrow(()=>track('home_viewed'));globalThis.window={posthog:{capture(){throw Error('blocked')}}};assert.doesNotThrow(()=>track('home_viewed'));}finally{globalThis.window=original}
});
