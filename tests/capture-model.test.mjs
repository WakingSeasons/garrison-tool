import test from 'node:test';
import assert from 'node:assert/strict';
import {CORE,ADDON,mergeResults,assessResult,formatReport} from '../capture/model.mjs';
const alliances=[...CORE,...ADDON].map(name=>({name,state:'active'}));
test('暂停图不再报2/3，难度非必填',()=>{
  const r=mergeResults([{mode:null,difficulty:null,boss:'假想敌：茧',types:['持续','频次'],alliances}]);
  assert.ok(!r.missing.some(s=>s.includes('2/3')));assert.ok(!r.missing.some(s=>s==='模拟方式 / 难度'));assert.match(formatReport(r,1),/模式未指定/);
  const corrected=assessResult({...r,mode:'独立模拟'});assert.equal(corrected.complete,true);
});
test('字段冲突被结构化标记，可逐项确认',()=>{
  const r=mergeResults([{mode:'独立模拟',boss:'假想敌：茧',types:['持续','频次'],alliances:[{name:'炎',state:'active'}]},{mode:'同盟模拟',boss:'矩兽',types:['飞行','致命','元素'],alliances:[{name:'炎',state:'inactive'}]}]);
  assert.equal(r.conflictFields.mode,true);assert.equal(r.conflictFields.boss,true);assert.equal(r.conflictFields.types,true);assert.ok(r.conflictFields.alliances.includes('炎'));
});
