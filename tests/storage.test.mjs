import {test} from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const js=ts.transpile(readFileSync(new URL('../lib/store.ts',import.meta.url),'utf8'),{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022});
const {database,writeRecords,allRecords,toStoredRecord}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const bytes=new Uint8Array([26,69,223,163,1,2,3]);
test('recorded composite Blob is serialized before transaction and restored byte-for-byte',async()=>{
 const blob=new Blob([new Blob([bytes.slice(0,3)]),new Blob([bytes.slice(3)])],{type:'audio/webm'});
 await writeRecords([{id:'voice',kind:'message',type:'audio',blob,updated:1}]);
 const db=await database();const stored=await new Promise((resolve,reject)=>{const r=db.transaction('records').objectStore('records').get('voice');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 assert.ok(stored.mediaBytes instanceof ArrayBuffer);assert.equal(stored.blob,undefined);
 const restored=(await allRecords()).find(r=>r.id==='voice');assert.equal(restored.blob.type,'audio/webm');assert.deepEqual(new Uint8Array(await restored.blob.arrayBuffer()),bytes);
});
test('photo media follows same durable byte storage path',async()=>{await writeRecords([{id:'photo',kind:'message',type:'image',updated:2,blob:new Blob([bytes],{type:'image/jpeg'})}]);const photo=(await allRecords()).find(r=>r.id==='photo');assert.equal(photo.blob.type,'image/jpeg');assert.equal(photo.blob.size,bytes.length)});
test('practice writes and safe scene replacement settle; conflicts reject without erasing previous audio',async()=>{const parent={id:'excerpt',kind:'excerpt',body:'原文',updated:1};await writeRecords([parent]);await writeRecords([{...parent,updated:2},{id:'practice',parent:'excerpt',kind:'practice',updated:2,blob:new Blob([bytes],{type:'audio/webm'})}],[],[parent]);await assert.rejects(writeRecords([{...parent,updated:3}],[],[parent]),/其他页面/);const rows=await allRecords();assert.equal(rows.find(r=>r.id==='excerpt').updated,2);assert.equal(rows.find(r=>r.id==='practice').blob.size,7)});
test('synchronous clone failure inside revision check rejects instead of hanging',async()=>{const current={id:'bad',kind:'item',updated:1};await writeRecords([current]);await assert.rejects(writeRecords([{...current,updated:2,badFunction:()=>{}}],[],[current]));assert.equal((await allRecords()).find(r=>r.id==='bad').updated,1)});
test('a stalled media conversion rejects after timeout and leaves original blob available',async(t)=>{t.mock.timers.enable({apis:['setTimeout']});class StalledBlob extends Blob{arrayBuffer(){return new Promise(()=>{})}}const blob=new StalledBlob([bytes],{type:'audio/webm'});const pending=toStoredRecord({id:'stalled',kind:'message',updated:1,blob});const assertion=assert.rejects(pending,/音频整理超时/);t.mock.timers.tick(15001);await assertion;assert.equal(blob.size,bytes.length)});
