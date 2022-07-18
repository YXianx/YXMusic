/**
 * 字符串转为Nodes节点(富文本)
 * @param {string} keyword 
 * @param {string} value 
 */
export function stringToNodes(keyword,value){
  const nodes = []
  // 匹配到的开头关键字
  if(value.startsWith(keyword)){
    // 分离关键字和其他字
    const key1 = value.slice(0,keyword.length)
    const node1 = {
      name:"span",
      attrs:{style:"color:rgb(39, 209, 169)"},
      children:[{type:"text",text:key1}]
    }
    nodes.push(node1)

    const key2 = value.slice(keyword.length)
    const node2 = {
      name:"span",
      attrs:{style:"color:#333"},
      children:[{type:"text",text:key2}]
    }
    nodes.push(node2)
  }
  else{
    const node3 = {
      name:"span",
      attrs:{style:"color:#333"},
      children:[{type:"text",text:value}]
    }
    nodes.push(node3)
  }

  return nodes
}