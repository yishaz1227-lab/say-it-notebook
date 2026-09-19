export type Prompt = {id:string; category:string; text:string};
const groups:Record<string,string[]> = {
 today:['今天最想记住的一个瞬间是什么？','今天有什么事情没有按照你的预期发生？','今天有没有什么很小但让你开心的事情？','今天有没有一句话让你印象很深？','今天最想重新来一次的瞬间是什么？','今天有没有哪一刻，你希望可以停久一点？','今天你把时间花在了哪件喜欢的事上？','今天有没有一件事，比想象中顺利？','今天出门时，你注意到了什么？','如果给今天起一个名字，你会叫它什么？'],
 recent:['最近有什么事，一直在你脑子里？','最近有没有一件你很期待的事情？','最近有没有什么事情让你改变了想法？','最近有什么事情让你有一点犹豫？','最近最想完成的一件事情是什么？','最近一次笑出声，是因为什么？','最近有没有一次聊天，让你记到现在？','最近有没有什么事，你决定慢一点做？','最近有什么小习惯，让你舒服了一点？','最近你想把哪件事暂时放一放？'],
 self:['最近有没有发现自己一点新的变化？','最近有什么事情，你觉得自己其实做得不错？','如果不用证明给任何人看，你现在最想做什么？','最近有没有一个瞬间让你觉得自己成长了一点？','最近有什么事情，你想对自己说一句“辛苦了”？','今天你有没有照顾到自己的一个小需要？','最近哪一次，你勇敢地说出了自己的想法？','今天你想给自己一个怎样的小奖励？','最近你学会了哪件以前不会的小事？','现在的你，最想听到怎样的一句话？'],
 light:['最近吃到最好吃的东西是什么？','如果今晚不用考虑明天，你最想做什么？','最近有没有循环听的一首歌？','最近有没有看到一个很好看的地方？','最近有什么小东西让你很喜欢？','今天的天气，让你想起了什么？','如果现在能去散步，你想走到哪里？','最近看到的哪一段文字，你想记下来？','今天有没有一种声音，让你觉得安心？','如果给今天选一种颜色，会是什么？'],
 future:['现在的你，有什么想告诉一个月后的自己？','最近正在担心的事情，你希望最后变成什么样？','有什么事情，希望未来的自己不要忘记？','如果半年后的你听到这段录音，你希望 TA 知道什么？','现在最希望未来的自己已经解决什么问题？','下一次休息时，你想为自己安排什么？','有什么小愿望，你想从今天开始试一试？','如果明天只做一件让自己开心的事，会是什么？','你想把今天的哪个细节，留给以后的自己？','下次再听见自己的声音，你希望是什么心情？']
};
export const PROMPTS:Prompt[]=Object.entries(groups).flatMap(([category,texts])=>texts.map((text,i)=>({id:`${category}-${i+1}`,category,text})));
export function nextPrompt(used:string[],random=Math.random):Prompt {const available=PROMPTS.filter(p=>!used.includes(p.id));const pool=available.length?available:PROMPTS.filter(p=>p.id!==used.at(-1));return pool[Math.floor(random()*pool.length)]||pool[0]}
export const MOODS=[{id:'relaxed',emoji:'😌',label:'松了一口气'},{id:'good',emoji:'🙂',label:'有一点开心'},{id:'quiet',emoji:'😶',label:'说不上来'},{id:'low',emoji:'😞',label:'有一点低落'},{id:'overwhelmed',emoji:'😵‍💫',label:'有一点混乱'}] as const;
export function diaryDayKind(rows:{[key:string]:any;type?:string}[]):'entry'|'mood'|'empty'{return !rows.length?'empty':rows.some(r=>r.type!=='mood')?'entry':'mood'}
