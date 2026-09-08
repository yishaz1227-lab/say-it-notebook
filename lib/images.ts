export async function preparePhoto(file:File):Promise<Blob>{
 if(file.size>20*1024*1024)throw Error('单张图片请小于 20 MB。');
 if(file.type&&!file.type.startsWith('image/'))throw Error('请选择图片文件。');
 let source:CanvasImageSource,width:number,height:number,dispose=()=>{};
 try{const bitmap=await createImageBitmap(file);source=bitmap;width=bitmap.width;height=bitmap.height;dispose=()=>bitmap.close()}
 catch{const url=URL.createObjectURL(file);const img=new Image();try{await new Promise<void>((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('读取图片超时，请重新选择。')),15000);img.onload=()=>{clearTimeout(timeout);resolve()};img.onerror=()=>{clearTimeout(timeout);reject(Error('此浏览器无法读取这张图片，请尝试 JPG、PNG 或截图。'))};img.src=url});source=img;width=img.naturalWidth;height=img.naturalHeight;dispose=()=>URL.revokeObjectURL(url)}catch(e){URL.revokeObjectURL(url);throw e}}
 try{if(!width||!height)throw Error('图片内容为空，请重新选择。');const scale=Math.min(1,1600/Math.max(width,height)),canvas=document.createElement('canvas');canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);const context=canvas.getContext('2d');if(!context)throw Error('此浏览器无法处理图片，请换系统浏览器重试。');context.drawImage(source,0,0,canvas.width,canvas.height);return await new Promise<Blob>((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('图片压缩超时，请重新选择。')),15000);canvas.toBlob(blob=>{clearTimeout(timeout);if(blob?.size)resolve(blob);else reject(Error('图片压缩失败，请重新选择。'))},'image/jpeg',.82)})}finally{dispose()}
}
