const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

/**
 * 歌词字符串转换
 * @param {string} parseString 
 */
export function parseLyric(parseString){
  const lricResultArr = []
  const lrcStrings = parseString.split('\n')
  
  for(let i of lrcStrings){
    // 获取歌曲时间并转为毫秒
    const timeResult = timeRegExp.exec(i)
    if(!timeResult)continue
    const minute = timeResult[1] * 60 * 1000  // 时间转为毫秒
    const second = timeResult[2] * 1000
    const msTime = timeResult[3]
    const millsecond = msTime.length===3?msTime*1:msTime*10
    const time = minute + second + millsecond
    
    // 获取歌词 利用歌曲时间的正则表达式替换为空剩下的字符就是歌词
    const lyricText = i.replace(timeRegExp,"")

    // 合并为对象push进数组
    let item = {
      time,
      text:lyricText
    }
    lricResultArr.push(item)
  }

  return lricResultArr
}