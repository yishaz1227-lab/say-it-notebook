import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const js=ts.transpile(readFileSync(new URL('../lib/diary-dates.ts',import.meta.url),'utf8'),{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022});
const {dayKey,parseDay,validDiaryDay}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
test('calendar dates use local days and round-trip across month and year boundaries',()=>{for(const value of ['2024-02-29','2025-12-31','2026-01-01'])assert.equal(dayKey(parseDay(value)),value);assert.equal(dayKey(new Date(2026,8,15,0,1)),'2026-09-15')});
test('backfill accepts today and past days, rejects future and invalid calendar dates',()=>{const now=new Date(2026,8,15,8);for(const value of ['2026-09-15','2026-09-14','2024-02-29'])assert.equal(validDiaryDay(value,now),true);for(const value of ['2026-09-16','2025-02-29','2026-02-30','2026-13-01','2026-9-01',''])assert.equal(validDiaryDay(value,now),false)});
