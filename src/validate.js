import includes from 'lodash/includes';
import { ds as valueMap } from './dataSet';

export const objToArr = (obj) => {
  if (typeof obj !== Object) return obj;
  let keys = Object.keys(obj);
  let newArr = [];
  keys.forEach(item => {
    let testData = obj[item];
    if (Array.isArray(testData)) newArr = newArr.concat(testData);
  });
  return newArr;
}
export const dealRelyFieldData = (fieldData) => {
  // 全部处理为数组  
  let data = Object.assign({}, fieldData);
  let keys = Object.keys(data);
  keys.forEach(item => {
    let testData = data[item];
    if (Object.prototype.toString.call(testData) === '[object Null]') {
      data[item] = { fields: [], parts: [] }
    }
    if (Object.prototype.toString.call(testData) === '[object Object]') {
      let subKeys = Object.keys(testData);
      data[item] = []
      subKeys.forEach(key => data[item] = data[item].concat(testData[key]));
    }
  });
  return data;
}

export const contains = (arr1 = [], arr2 = []) => {
  if ((arr1 && !arr1.length) || (arr2 && !arr2.length) || arr1[0] === '') return false;
  let target = arr1.some(item => includes(arr2, item))
  return target;
}
// 将显示隐藏只读Obj 转为数组
const mapObjToArr = (obj) => {
  let newObj = Object.assign({}, obj);
  if (obj instanceof Object) {
    let keys = Object.keys(newObj);
    keys.forEach(key => newObj[key] = objToArr(obj[key]));
  }
  return newObj
}
const findCombineValue = (a,b,c,d,f) => {
  let combineValue = findRepeatData(a.concat(b,c, d));
  return combineValue.map(v => {
    return f.filter(item => item.id === v)[0] || {};
  });
}
// 同一规则不同条件的对比
const compareSameRule = (condition1, condition2, index1, index2, fieldVal) => {
  /*
   *  @params: condition: Object
   *           index:  Number
   * */
  const tipsArr = [];
  condition1 = dealRelyFieldData(condition1);
  condition2 = dealRelyFieldData(condition2);
  const { compareType: compareType1 } = condition1;
  const { compareType: compareType2 } = condition2;
  let standard = false;
  if (compareType1 === compareType2 && (compareType1 === 'notNullValue' || compareType1 === 'nullValue')) standard = true;
  else {
    standard = condition1.value && contains(condition1.value, condition2.value) && condition1.compareType === condition2.compareType;
  }
  if (!standard) return tipsArr;
  let { displayContent: displayContent1, hideContent: hideContent1, readOnly: readonlyContent1,
    requiredFields: requiredFields1, notRequiredFields: notRequiredFields1
  } = condition1;
  let { displayContent: displayContent2, hideContent: hideContent2, readOnly: readonlyContent2,
    requiredFields: requiredFields2, notRequiredFields: notRequiredFields2
  } = condition2;
  if (contains(displayContent1, hideContent2) || contains(displayContent2, hideContent1)) {
    let combineValue = findCombineValue(displayContent1,hideContent2,displayContent2,hideContent1,fieldVal);
    combineValue.forEach(v => tipsArr.push(`${v.label}在条件${index1 + 1} 和 条件 ${index2 + 1}的显示(编辑)与隐藏中重复\n`));
  }
  if (contains(displayContent1, readonlyContent2) || contains(displayContent2, readonlyContent1)) {
    let combineValue = findCombineValue(displayContent1,readonlyContent2,displayContent2, readonlyContent1,fieldVal);
    combineValue.forEach(v => tipsArr.push(`${v.label}在条件${index1 + 1} 和 条件 ${index2 + 1}的显示(编辑)与显示(只读)中重复\n`));
  }
  if (contains(readonlyContent1, hideContent2) || contains(readonlyContent2, hideContent1)) {
    let combineValue = findCombineValue(readonlyContent1,hideContent2,readonlyContent2, hideContent1,fieldVal);
    combineValue.forEach(v => tipsArr.push(`${v.label}在条件${index1 + 1} 和 条件 ${index2 + 1}的显示(只读)与隐藏中重复\n`));
    // tipsArr.push(`${fieldVal}在条件${index1 + 1} 和 条件 ${index2 + 1}的显示(只读)与隐藏重复\n`);
  }
  const matchBetweenTips = fieldVal => {
    if (contains(requiredFields1, notRequiredFields2) || contains(requiredFields2, notRequiredFields1)) {
      tipsArr.push(`${fieldVal}在条件${index1 + 1} 和 条件 ${index2 + 1}的必填与非必填重复\n`);
    }
  }
  //let combineValue1 = displayContent1.concat(displayContent2, hideContent1, hideContent2, readonlyContent1, readonlyContent2);
  // combineValue1 = findRepeatData(combineValue1);
  // combineValue1.forEach(v => {
  //   const fieldLabelArr = fieldVal.filter(item => item.id === v) || [];
  //   if (fieldLabelArr.length) fieldLabelArr.map(field => {
  //     matchTrippleTips(field.label, field.id);
  //   })
  // });

  let combineValue2 = findRepeatData(requiredFields1.concat(requiredFields2, notRequiredFields1, notRequiredFields2));
  combineValue2.forEach(v => {
    const fieldLabelArr = fieldVal.filter(item => item.id === v) || [];
    if (fieldLabelArr.length) fieldLabelArr.map(field => {
      matchBetweenTips(field.label);
    })
  });
  return tipsArr;
}
const concatAllData = (obj) => {
  let keys = Object.keys(obj);
  let concatResult = [];
  keys.map(key => {
    if (key === 'value' || key === 'compareType') return;
    if (Array.isArray(obj[key])) {
      if (obj[key].length) concatResult = concatResult.concat(obj[key]);
    }
    else concatResult.push(obj[key]);
  })
  return concatResult || [];
}
const tipsMap = {
  displayContent: '显示(编辑)',
  readOnly: '显示（只读）',
  hideContent: '隐藏',
}
// 同一规则内块校验
export const validateEachContent = (rules = {}, index = 0, aclField = '', fieldVal = []) => {
  let { displayContent, hideContent, readOnly, requiredFields, notRequiredFields, compareType, value } = rules;
  const contentMap = {
    displayContent: { hideContent: hideContent },
    readOnly: { displayContent: displayContent },
    hideContent: { readOnly: readOnly }
  };

  let tipsArr = [];
  let allStatusVal = concatAllData(rules);
  if (!(compareType === 'nullValue' || compareType === 'notNullValue') && !value.length) {
    tipsArr.push('条件' + (index + 1) + '中当字段值后的值不能为空\n');
  }
  if (compareType === '') {
    tipsArr.push('条件' + (index + 1) + '中当字段值后的操作类型不能为空\n');
  }
  if (allStatusVal.indexOf(aclField) > -1) {
    tipsArr.push('条件' + (index + 1) + '中联动字段和被联动字段不允许重复\n');
  }
  /* 验证显隐比非是否全部为空 */
  if (allStatusVal.length === 0)
    tipsArr.push('条件' + (index + 1) + '中显示、隐藏、必填、非必填字段值至少选择一个\n');

  const matchTrippleTips = (fieldLabel) => {
    const keys = Object.keys(contentMap);
    keys.forEach(key => {
      let subKey = Object.keys(contentMap[key])[0];
      if (contains(rules[key], rules[subKey])) tipsArr.push(`${fieldLabel} 在条件${index + 1}的${tipsMap[key]}与${tipsMap[subKey]}中重复\n`);
    })
    // if (contains(displayContent, hideContent)) tipsArr.push(`${fieldLabel} 在条件${index + 1}的显示(编辑)与隐藏中重复\n`);
    // if (contains(displayContent, readOnly)) tipsArr.push(`${fieldLabel} 在条件${index + 1}的显示(编辑)与显示(只读)中重复\n`);
    // if (contains(readOnly, hideContent)) tipsArr.push(`${fieldLabel} 在条件${index + 1}的显示(只读)与隐藏中重复\n`);
  }
  const matchBetweenTips = (fieldLabel) => {
    if (contains(requiredFields, notRequiredFields)) {
      tipsArr.push(`${fieldLabel}在条件${index + 1}的必填与非必填中中重复\n`);
    }
  }
  let combineValue1 = displayContent.concat(hideContent, readOnly);
  combineValue1 = findRepeatData(combineValue1);
  // 多个value逐条提示
  combineValue1.forEach(v => {
    const fieldLabelArr = fieldVal.filter(item => item.id === v) || [];
    if (fieldLabelArr.length) fieldLabelArr.map(field => {
      matchTrippleTips(field.label);
    });
  });
  let combineValue2 = findRepeatData(requiredFields.concat(notRequiredFields));
  combineValue2.forEach(v => {
    const fieldLabelArr = fieldVal.filter(item => item.id === v) || [];
    if (fieldLabelArr.length) fieldLabelArr.map(field => {
      matchBetweenTips(field.label);
    });
  })

  return tipsArr;
}
const findRepeatData = (arr) => {
  let repeatData = [];
  let Map = {};
  arr.map(i => {
    if (Map[i]) {
      Map[i]++;
      if (Map[i] === 2) repeatData.push(i);
    }
    else Map[i] = 1;
  });
  return repeatData;
}
//  同一规则条件匹配
export const matchSingleRule = (rules = [], aclField, fieldVal) => {
  let str = [];
  // 不同条件下的校验提示语
  let conditionBlockTips = [];
  // 同一条件下的校验提示语
  let contentBlockTips = []
  for (let i = 0, len = rules.length; i < len; i++) {
    let rules1 = dealRelyFieldData(rules[i]);
    let blockTips = validateEachContent(rules1, i, aclField, fieldVal);
    if (blockTips.length) contentBlockTips = contentBlockTips.concat(blockTips);
    for (let j = i + 1; j < len; j++) {
      let rules2 = dealRelyFieldData(rules[j])
      let tipArr = compareSameRule(rules1, rules2, i, j, fieldVal);
      if (tipArr.length) conditionBlockTips = conditionBlockTips.concat(tipArr);
    }
  }
  str = str.concat(contentBlockTips, conditionBlockTips);
  return str;
}
export const matchOuterRule = (data, fields) => {
  let tips = '';
  for (let i = 0, len = data.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const { aclField, aclType } = data[i];
      if (aclField === data[j].aclField && aclType === data[j].aclType) {
        let aclFieldLabel = fields.find(field => {
          return field.id === aclField;
        });
        tips = validateOuterRule(data[i].relyField, data[j].relyField, aclFieldLabel.label)
        if (tips) return tips;
      }
    }
  }
  return tips;
}
const checkRepeatRule = (condition1, condition2, aclField) => {
  condition1 = dealRelyFieldData(condition1);
  condition2 = dealRelyFieldData(condition2);
  const { compareType: compareType1 } = condition1;
  const { compareType: compareType2 } = condition2;
  let standard = false;
  if (compareType1 === compareType2 && (compareType1 === 'notNullValue' || compareType1 === 'nullValue')) standard = true;
  else {
    standard = condition1.value && contains(condition1.value, condition2.value) && condition1.compareType === condition2.compareType;
  }
  if (standard) {
    let { displayContent: displayContent1, hideContent: hideContent1, readOnly: readonlyContent1,
      requiredFields: requiredFields1, notRequiredFields: notRequiredFields1 } = condition1;
    let { displayContent: displayContent2, hideContent: hideContent2, readOnly: readonlyContent2,
      requiredFields: requiredFields2, notRequiredFields: notRequiredFields2
    } = condition2;
    if (contains(displayContent1, hideContent2) || contains(displayContent2, hideContent1)) {
      return true;
    }
    if (contains(displayContent1, readonlyContent2) || contains(displayContent2, readonlyContent1)) {
      return true;
    }
    if (contains(readonlyContent1, hideContent2) || contains(readonlyContent2, hideContent1)) {
      return true;
    }
    if(contains(requiredFields1, notRequiredFields2) || contains(requiredFields2, notRequiredFields1)) {
      return true;
    }
  }
  return false;
}
export const validateOuterRule = (rule1, rule2, aclField) => {
  let tips = '';
  for (let i = 0, len1 = rule1.length; i < len1; i++) {
    for (let j = 0, len2 = rule2.length; j < len2; j++) {
      if (checkRepeatRule(rule1[i], rule2[j])) {
        tips = `${aclField}绑定的联动规则有重复`;
        return tips;
      }
    }
  }
}
