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
  if(!Array.isArray(arr1)) arr1 = objToArr(arr1);
  if(!Array.isArray(arr2)) arr2 = objToArr(arr2);
  return arr1.some(item => includes(arr2, item))
}
