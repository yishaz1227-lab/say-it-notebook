// Use the existing production PostHog client; no content capture or second visitor ID.
export const EVENT_NAMES=['home_viewed','daily_prompt_viewed','prompt_changed','prompt_record_clicked','free_record_clicked','record_started','record_completed','record_cancelled','record_save_failed','microphone_denied','mood_entry_clicked','mood_selected','mood_saved','text_saved','image_saved'] as const;
export type EventName=typeof EVENT_NAMES[number];
export function sanitizeProperties(input:Record<string,unknown>){const out:Record<string,string|number|boolean>={};for(const [k,v] of Object.entries(input)){if(k==='prompt_id'&&typeof v==='string'&&/^(today|recent|self|light|future)-([1-9]|10)$/.test(v))out[k]=v;
if(k==='prompt_category'&&['today','recent','self','light','future'].includes(String(v)))out[k]=String(v);
if(k==='entry_type'&&['free','prompt','text','image','mood'].includes(String(v)))out[k]=String(v);
if(k==='mood_type'&&['relaxed','good','quiet','low','overwhelmed'].includes(String(v)))out[k]=String(v);
if(['record_duration','days_since_last_entry'].includes(k)&&typeof v==='number'&&Number.isFinite(v)&&v>=0)out[k]=Math.round(v);
}return out}
export function track(event:EventName,input:Record<string,unknown>={}){
 try {
  if(typeof window==='undefined'||!EVENT_NAMES.includes(event))return;
  const client=(window as Window & {posthog?:{capture:(name:string,properties:Record<string,unknown>)=>void}}).posthog;
  client?.capture(event,{...sanitizeProperties(input),app_version:'v2.1',environment:'production'});
 }catch{/* Analytics must never interrupt recording or saving. */}
}
