export function dayKey(value:Date):string {return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`}
export function parseDay(value:string):Date|null {if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;const [y,m,d]=value.split('-').map(Number);const result=new Date(y,m-1,d,12);return dayKey(result)===value?result:null}
export function validDiaryDay(value:string,now=new Date()):boolean{return !!parseDay(value)&&value<=dayKey(now)}
