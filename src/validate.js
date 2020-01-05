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
export const contains = (arr1, arr2) => {
  // if(!arr1 || !arr2) return false;
  if(!Array.isArray(arr1)) arr1 = objToArr(arr1);
  if(!Array.isArray(arr2)) arr2 = objToArr(arr2);
  return arr1.some(item => includes(arr2, item))
}
// 将显示隐藏只读Obj 转为数组
const mapObjToArr = (obj) => {
  if(obj instanceOf Object) {
    let newObj = Object.assign({}, newObj);
    let keys = Object.keys(newObj);
    keys.map(key=> newObj[key] = objToArr(obj[key]));
  }
  return newObj
}
// 统一规则不同条件的对比
export const compareSameRule = (condition1, condition2, index1, index2) => {
  /*
   *  @params: condition: Object
   *           index:  Number
   * */
   condition1 = mapObjToArr(condition1);
   condition2 = mapObjToArr(condition2);
   let standard = contains(condition1.value,condition2.value) && condition1.value && condition1.compareType === condition2.compareType 
  if(standard) {
    let displayContent1 = condition1.displayContent;
    let displayContent2 = condition2.displayContent;
    let hideContent1 =  condition1.hideContent;
    let hideContent2 = condition2.hideContent;
    let readonlyContent1 = condition1.readOnlyContent;
    let readonlyContent2 = condition2.readOnlyContent;
    if(contains(displayContent1, hideContent2)) {
      this.tipsArr.push(`条件${index1} 和 条件 ${index2}中显示与隐藏重复`);
    }
    if(contains(displayContent1, readonlyContent2)) {
      this.tipsArr.push(`条件${index1} 和 条件 ${index2}中显示与只读重复`);
    }
    if(contains(readonlyContent1, hideContent2)) {
      this.tipsArr.push(`条件${index1} 和 条件 ${index2}中只读与隐藏重复`);
    } 
  }
}
//  同一规则条件匹配
export const matchSingleRule = (rules=[]) => {
  for(let i = 0 ; i < rules.length -1; i++) {
    for(let j = i + 1; j < rules.length; j++) {

    }
  } 
  return str;
}
