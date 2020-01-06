import includes from 'lodash/includes';
import { ds as valueMap } from './dataSet';
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
   // condition1 = dealRelyFieldData(condition1);
   // condition2 = dealRelyFieldData(condition2);
   let standard = condition1.value && contains(condition1.value,condition2.value) && condition1.compareType === condition2.compareType 
  if(standard) {
    let { displayContent: displayContent1, hideContent: hideContent1,readonlyContent: readonlyContent1 } = condition1; 
    let { displayContent: displayContent2, hideContent: hideContent2, readonlyContent: readonlyContent2 } =  condition2;
    if(contains(displayContent1, hideContent2) || contains(displayContent2, hideContent1)) {
      tipsArr.push(`条件${index1 + 1 } 和 条件 ${index2 + 1}中显示(编辑)与隐藏重复\n`);
    }
    if(contains(displayContent1, readonlyContent2) || contains(displayContent2, readonlyContent1)) {
      tipsArr.push(`条件${index1 + 1} 和 条件 ${index2 + 1}中显示(编辑)与显示(只读)重复\n`);
    }
    if(contains(readonlyContent1, hideContent2) || contains(readonlyContent2, hideContent1)) {
      tipsArr.push(`条件${index1 + 1} 和 条件 ${index2 + 1}中显示(只读)与隐藏重复\n`);
    } 
    return tipsArr;
  }
}

// 同一规则内块校验
export const validateEachContent = (rules={}, index=0) => {
  let { displayContent, hideContent, readonlyContent, value} = rules;
  let tipsArr = [];
  const fieldLabel = valueMap[value].Name || '默认字段';
  if(contains(displayContent, hideContent)) tipsArr.push(`${fieldLabel} 在条件${index + 1}的显示(编辑)与隐藏中重复\n`) 
  if(contains(displayContent, readonlyContent)) tipsArr.push(`${fieldLabel} 在条件${index + 1}的显示(编辑)与显示(只读)中重复\n`) 
  return tipsArr;
}

//  同一规则条件匹配
export const matchSingleRule = (rules=[]) => {
  let str = [];
  // 不同条件下的校验提示语
  let conditionBlockTips = [];
  // 同一条件下的校验提示语
  let contentBlockTips = []
  for(let i = 0 ,len = rules.length; i < len -1; i++) {
    let rules1 = dealRelyFieldData(rules[i]);
    let blockTips =  validateEachContent(rules1, i);
    if(blockTips.length) contentBlockTips = contentBlockTips.concat(blockTips);
    for(let j = i + 1; j < len; j++) {
      let rules2 = dealRelyFieldData(rules[j])
      let tipArr = compareSameRule(rules1, rules2, i , j);
      if(tipArr.length) conditionBlockTips = conditionBlockTips.concat(tipArr);
    }
  } 
  str = str.concat(contentBlockTips,conditionBlockTips);
  return str;
}
