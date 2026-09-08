'use client';
import {useEffect,useRef,useState} from 'react';
import {allRecords,writeRecords,type RecordItem} from '@/lib/store';
export function ScriptEditor({record,readOnly,onSaved,flushRef}:{record:RecordItem;readOnly:boolean;onSaved:()=>Promise<void>;flushRef:{current:(()=>Promise<void>)|null}}){
const [value,setValue]=useState(record.script||''),[status,setStatus]=useState('已保存到此浏览器'),[error,setError]=useState('');const latest=useRef(record),queue=useRef(Promise.resolve()),timer=useRef<any>(null),text=useRef(value);latest.current=record;
useEffect(()=>{allRecords().then(rs=>{const d=rs.find(r=>r.id==='item-draft:'+record.id);if(d){text.current=d.text;setValue(d.text);setStatus('已恢复未提交草稿')}});return()=>clearTimeout(timer.current)},[record.id]);
async function save(v:string){await queue.current;const r=latest.current;await writeRecords([{...r,script:v,updated:Date.now()}],['item-draft:'+r.id],[r]);if(text.current===v)setStatus('已保存到此浏览器');await onSaved()}
flushRef.current=async()=>{clearTimeout(timer.current);await save(text.current)};
function change(v:string){setValue(v);text.current=v;setStatus('正在保存…');setError('');clearTimeout(timer.current);queue.current=queue.current.catch(()=>{}).then(()=>writeRecords([{id:'item-draft:'+record.id,kind:'draft',space:'item',text:v,updated:Date.now()}]));queue.current.catch(()=>setError('准备稿草稿保存失败，请重试。'));timer.current=setTimeout(()=>save(v).catch(e=>{setError(e.message);setStatus('准备稿未提交，草稿仍保留')}),600)}
return <><div className="section-title"><h2>准备稿</h2><small>{status}</small></div><textarea className="script-input" aria-label="准备稿" readOnly={readOnly} value={value} onChange={e=>change(e.target.value)} placeholder="写一段完整的稿子，或只是几个关键词。也可以直接开始说。"/>{error&&<div className="error">{error}<button className="outline" onClick={()=>save(text.current).catch(e=>setError(e.message))}>重试保存</button></div>}</>}
