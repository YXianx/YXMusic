export function debounce(func,delay=500){
  let time = null
  return function(...args){
    return new Promise((resolve,reject)=>{
      if(time)clearTimeout(time)
      time = setTimeout(()=>{
        resolve(func.apply(this,args))
      },delay)
    })
  }
}