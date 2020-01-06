import includes from 'lodash/includes';
export const objToArr = (obj) => {
  let keys = Object.keys(obj);
  let newArr =  [];
  keys.forEach(item => {
    let testData = obj[item];
    if(Array.isArray(testData)) newArr = newArr.concat(testData);
  });
  return newArr;
}
export const dealRelyFieldData = (fieldData) => {
  // 全部处理为数组  
  let data = Object.assign({}, fieldData);
  let keys = Object.keys(data);
  keys.forEach(item => {
    let testData = data[item];
    if(Object.prototype.toString.call(testData) === '[object Object]') {
      data[item] = objToArr(testData)
    }
  });
  return data;
}

export const contains = (arr1 = [], arr2 = []) => {
  if(!arr1 || !arr2) return false;
  return arr1.some(item => includes(arr2, item))
}
// 将显示隐藏只读Obj 转为数组
const mapObjToArr = (obj) => {
  let newObj = Object.assign({}, obj);
  if(obj instanceof Object) {
    let keys = Object.keys(newObj);
    keys.forEach(key=> newObj[key] = objToArr(obj[key]));
  }
  return newObj
}
// 同一规则不同条件的对比
const compareSameRule = (condition1, condition2, index1, index2) => {
  /*
   *  @params: condition: Object
   *           index:  Number
   * */
  const tipsArr = [];
   condition1 = dealRelyFieldData(condition1);
   condition2 = dealRelyFieldData(condition2);
   let standard = condition1.value && contains(condition1.value,condition2.value) && condition1.compareType === condition2.compareType 
  if(standard) {
    let { displayContent: displayContent1, readonlyContent: readonlyContent1 } = condition1; 
    let { hideContent: hideContent2, readonlyContent: readonlyContent2 } =  condition2;
    if(contains(displayContent1, hideContent2)) {
      tipsArr.push(`条件${index1 + 1 } 和 条件 ${index2 + 1}中显示与隐藏重复`);
    }
    if(contains(displayContent1, readonlyContent2)) {
      tipsArr.push(`条件${index1 + 1} 和 条件 ${index2 + 1}中显示与只读重复`);
    }
    if(contains(readonlyContent1, hideContent2)) {
      tipsArr.push(`条件${index1} 和 条件 ${index2}中只读与隐藏重复`);
    } 
    return tipsArr;
  }
}
//  同一规则条件匹配
export const matchSingleRule = (rules=[]) => {
  let str = [];
  for(let i = 0 ; i < rules.length -1; i++) {
    for(let j = i + 1; j < rules.length; j++) {
      let tipArr = compareSameRule(rules[i], rules[j], i , j);
      if(tipArr) str.push(tipArr);
    }
  } 
  return str;
}
