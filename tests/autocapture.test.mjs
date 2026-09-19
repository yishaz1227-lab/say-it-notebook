import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{}};vm.runInNewContext(readFileSync(new URL('../public/posthog-options.js',import.meta.url),'utf8'),context);
const options=context.window.sayitPosthogOptions;
test('button clicks retain a fixed readable label but discard DOM content and attributes',()=>{
 const event={event:'$autocapture',properties:{$event_type:'click',$elements:[{tag_name:'button','attr__data-ph-label':'发送日记',$el_text:'秘密日记',attr__title:'秘密标题'},{tag_name:'div',$el_text:'私人正文'}],$elements_chain:'private ancestor content',attr__value:'private value',distinct_id:'existing-visitor'}};
 const result=options.before_send(event);assert.equal(result.properties.button_name,'发送日记');assert.equal(result.properties.distinct_id,'existing-visitor');assert.equal(result.properties.$elements_chain,'button:text="发送日记"');assert.ok(!JSON.stringify(result).includes('秘密'));assert.ok(!JSON.stringify(result).includes('私人'));assert.ok(!JSON.stringify(result).includes('private'));assert.equal(options.mask_all_text,true);assert.equal(options.disable_session_recording,true);
});
test('unapproved labels and nonclick events are dropped; custom events remain',()=>{
 assert.equal(options.before_send({event:'$autocapture',properties:{$event_type:'click',$elements:[{'attr__data-ph-label':'私人主题'}]}}),null);
 const event={event:'mood_saved',properties:{entry_type:'mood'}};assert.equal(options.before_send(event),event);
});

test('SDK chain-only payloads retain the button label',()=>{const result=options.before_send({event:'$autocapture',properties:{$event_type:'click',$elements_chain:'button:attr__data-ph-label="发送日记";div:text="private"'}});assert.equal(result.properties.button_name,'发送日记');assert.ok(!JSON.stringify(result).includes('private'));});
