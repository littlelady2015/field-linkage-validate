import React, { Component } from 'react';
import Message from '@beisen-phoenix/message';
import { PopLayer, BaseButton } from '&/components/platform';
import RuleList from './ruleList';
import RuleSettingPage from './ruleSettingPage';
import './index.scss';
import * as param from './paramConfig';
import _ from 'lodash';

export default class LinkCmp extends Component {
  constructor(props) {
    super(props);
    // this.stopNextStepReq = false;
    this.initData();
    this.createRules = this.createRules.bind(this);
    this.editRules = this.editRules.bind(this);
    this.deleteRules = this.deleteRules.bind(this);
    this.backToPrevious = this.backToPrevious.bind(this);
    this.saveRuleData = this.saveRuleData.bind(this);
    this.hidePopLayer = this.hidePopLayer.bind(this);
    this.throwSaveData = this.throwSaveData.bind(this);
    this.validateRuleList = this.validateRuleList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.data) !== JSON.stringify(this.state.data)) {
      let rules = [];
      for (let i = 0; i < nextProps.data.rules.length; i++) {
        if (nextProps.data.fields.filter(field => field.id == nextProps.data.rules[i].aclField).length > 0) {
          rules.push(nextProps.data.rules[i]);
        }
      }
      nextProps.data.rules = rules;
      this.setState({ data: nextProps.data });
    }
  }

  initData() {
    const defaults = {
      showSettingPage: false,
      settingType: 'create',
      editRuleData: _.cloneDeep(param.initSetData),
      chosenFieldReq: false, //可选字段必填
      refreshFieldReq: false, //被刷新字段必填
      showPopTip: true,
      popTipContent: '',
      fieldValData: []
    };
    this.state = Object.assign({}, defaults, this.props);
  }

  createRules() {
    this.setState({
      showSettingPage: true,
      settingType: 'create',
      chosenFieldReq: false, //可选字段必填
      refreshFieldReq: false,
      ruleIndex: false
    });
    this.props.changeCancelText('返回');
  }

  editRules(index) {
    this.setState({
      showSettingPage: true,
      settingType: 'edit',
      editRuleData: this.state.data.rules[index],
      ruleIndex: index
    });
    this.props.changeCancelText('返回');
  }

  deleteRules(index) {
    this.state.data.rules.splice(index, 1);
    this.setState({
      data: this.state.data
    });
  }
  changeFieldStatus = (type, value) => {
    if(type === 'currentField') {
      this.setState({
        chosenFieldReq: value,
      });
    }
    else {
      this.setState({
        refreshFieldReq: value,
      });
    }
  }
  backToPrevious() {
    this.setState({ showSettingPage: false });
    this.props.changeCancelText('关闭');
  }

  saveRuleData(data, fieldVal) {
    this.validateSaveData(data, fieldVal.length);
    this.setState({});
    const { showPopTip , refreshFieldReq, chosenFieldReq } = this.state;
    if (!showPopTip || refreshFieldReq || chosenFieldReq) return;
    // if (!this.state.showPopTip || this.stopNextStepReq) return;
    if (data.aclType == 'setStatus') data.fieldsLength = fieldVal.length; //存储当字段值长度供大保存校验使用
    if (typeof this.state.ruleIndex == 'number') {
      this.state.data.rules[this.state.ruleIndex] = data;
      this.state.editRuleData = data;
    } else {
      this.state.data.rules.unshift(data);
    }
    // this.setState({
    //   data: this.state.data,
    //   editRuleData: this.state.editRuleData
    // })
    this.backToPrevious();
  }

  throwSaveData() {
    const { data } = this.state;
    this.validateRuleList(data);
    if (!this.state.showPopTip) return;
    // const tagId = this.props.tagId;
    let rules = _.cloneDeep(data.rules).map(item => {
      // item.aclType == 'setStatus' &&
      //   item.relyField.forEach(item => {
      //     item.value = item.value.map(val => {
      //       return val.value || val;
      //     });
      //   });
      if (item.fieldsLength !== undefined) delete item.fieldsLength;
      return item;
    });
    // const saveData = JSON.stringify({
    //   status: 'fieldLinkagePageSave',
    //   data: rules,
    //   tagId: tagId
    // });
    // window.parent.postMessage(saveData, '*');
    return rules;
  }

  //   closePop() {
  //     const tagId = this.props.tagId;
  //     window.parent.postMessage(JSON.stringify({ status: 'fieldLinkagePageClosed', tagId: tagId }), '*');
  //   }

  //验证不同规则间的条件
  validateRuleList(data) {
    let rules = _.cloneDeep(data.rules).filter(item => {
      return item.aclType == 'setStatus';
    });
    let cachFields = []; //已遍历过的暂存规则
    rules.forEach(r => {
      if (cachFields.indexOf(r.aclField) == -1) {
        let sameField = rules.filter(u => {
          return u.aclField == r.aclField;
        });
        this.diffRuleList(sameField);
        cachFields.push(r.aclField);
      }
    });
  }

  diffRuleList(rules) {
    if (rules.length <= 1 || rules[0].fieldsLength == undefined) return false;
    let currentField = rules[0].aclField;
    let fieldsLength = rules[0].fieldsLength || 0;
    let allRelyFields = [];
    let valiData = {};
    rules.forEach(r => {
      allRelyFields = allRelyFields.concat(r.relyField);
    });
    valiData = {
      aclField: currentField, // 'refresh' / 'setStatus'
      aclType: 'setStatus',
      relyField: allRelyFields
    };
    this.validateSaveData(valiData, fieldsLength, true);
    if (!this.state.showPopTip) {
      let fieldTxt = this.state.data.fields.filter(item => {
        return item.id == currentField;
      })[0].label;
      this.tipsArr = [fieldTxt + '绑定的联动规则有重复'];
      this.state.popTipContent = this.tipsArr;
      this.setState({});
    }
  }

  addPreNumber(arr) {
    return arr.map((item, index) => `${index+1}\u3001${item}`);
  }
  //验证同一规则内的条件
  validateSaveData(data, fieldsLength, isSaveValidate) {
    this.aclField = data.aclField; // 当字段 对应的value
    this.tipsArr = [];
    // notReqValue = [];
    if (data.aclType == 'refresh') {
      /* 刷新字段数据验证 */
      this.state.refreshFieldReq = data.refreshFields.length == 0;
      this.state.chosenFieldReq =  data.aclField.length === 0;
      // this.setState({
      //   refreshFieldReq: data.refreshFields.length == 0,
      //   chosenFieldReq: data.aclField.length === 0
      // });
      // this.stopNextStepReq = data.refreshFields.length === 0 || data.aclField.length === 0;
      if (this.twoArraySameData([data.aclField], data.refreshFields))
        this.tipsArr.push('字段所选的值和选择要刷新的字段值不允许重复\n');
    } else {
      this.typeValue = [];
      this.displayValue = [];
      this.hideValue = [];
      this.reqValue = [];
      this.notReqValue = [];
      /* 设置联动状态数据验证 */
      data.relyField.forEach((item, index) => {
        let displayFieldPart = item.displayContent.fields.concat(item.displayContent.parts);
        let hideFieldPart = item.hideContent.fields.concat(item.hideContent.parts);

        this.typeValue.push([item.compareType, item.value]);
        this.displayValue.push(displayFieldPart);
        this.hideValue.push(hideFieldPart);
        this.reqValue.push(item.requiredFields);
        this.notReqValue.push(item.notRequiredFields);

        if (isSaveValidate) return false;
        /* 验证字段值和所有条件中显隐必非是否重复 */
        let allStatusVal = [];
        for (let i in item) {
          if (i == 'displayContent' || i == 'hideContent') {
            allStatusVal = allStatusVal.concat(item[i].fields.concat(item[i].parts));
          } else if (i == 'requiredFields' || i == 'notRequiredFields') {
            allStatusVal = allStatusVal.concat(item[i]);
          }
        }
        if (allStatusVal.indexOf(this.aclField) > -1)
          this.tipsArr.push('条件' + (index + 1) + '中字段所选的值和显示、隐藏、必填、非必填中的字段值不允许重复\n');

        /* 验证显隐比非是否全部为空 */
        if (allStatusVal.length == 0)
          this.tipsArr.push('条件' + (index + 1) + '中显示、隐藏、必填、非必填字段值至少选择一个\n');

        /* 验证操作类型和操作值是否为空 */
        if (!(item.compareType == 'nullValue' || item.compareType == 'notNullValue') && item.value == '')
          this.tipsArr.push('条件' + (index + 1) + '中当字段值后的值不能为空\n');

        if (item.compareType == '') this.tipsArr.push('条件' + (index + 1) + '中当字段值后的操作类型不能为空\n');

        /* 验证同一条件中显示 隐藏是否重复 */
        if (this.twoArraySameData(displayFieldPart, hideFieldPart))
          this.tipsArr.push('条件' + (index + 1) + '中显示与隐藏中的选项不允许重复\n');

        /* 验证同一条件中必填 非必填是否重复 */
        if (this.twoArraySameData(item.requiredFields, item.notRequiredFields))
          this.tipsArr.push('条件' + (index + 1) + '中必填与非必填中的选项不允许重复\n');
      }, this);

      /* 验证不同条件间必填非必填是否重复 */
      for (let i = 0; i < this.reqValue.length; i++) {
        for (let j = 0; j < this.notReqValue.length; j++) {
          if (
            this.twoArraySameData(this.reqValue[i], this.notReqValue[j]) &&
            i !== j &&
            this.compareTypesValue(this.typeValue[i], this.typeValue[j], fieldsLength)
          ) {
            this.tipsArr.push(
              '条件' + (Math.min(i, j) + 1) + '和条件' + (Math.max(i, j) + 1) + '中必填与非必填中的选项不允许重复\n'
            );
          }
        }
      }

      /* 验证不同条件间显示隐藏是否重复 */
      for (let i = 0; i < this.displayValue.length; i++) {
        for (let j = 0; j < this.hideValue.length; j++) {
          if (
            this.twoArraySameData(this.displayValue[i], this.hideValue[j]) &&
            i !== j &&
            this.compareTypesValue(this.typeValue[i], this.typeValue[j], fieldsLength)
          ) {
            this.tipsArr.push(
              '条件' + (Math.min(i, j) + 1) + '和条件' + (Math.max(i, j) + 1) + '中显示与隐藏中的选项不允许重复\n'
            );
          }
        }
      }
    }
    // this.setState({
    //   chosenFieldReq: data.aclField == '',
    //   showPopTip: this.tipsArr.length == 0,
    //   popTipContent: this.tipsArr
    // })
    this.state.chosenFieldReq = data.aclField == '';  //refresh / setStatus
    this.state.showPopTip = this.tipsArr.length == 0;
    this.state.popTipContent = this.addPreNumber(this.tipsArr);
  }

  twoArraySameData(array1, array2) {
    if (array1[0] == '' || (array1.length == 0 && array2.length == 0)) return;
    //正则表达式，验证数据连续重复
    let reg = /,(.+)\1+/gim;
    //连接两数组中的元素
    let item = array1.concat(array2);
    //进行排序，使用系统的元素排列在一起
    item.sort();
    //存储两个数组相同元素的数组
    let sameDataArray = [];
    //从第二个元素开始遍历数组,与前者比较
    for (let i = 1; i < item.length; i++) {
      //判断与前面的元素是否相同，且是否已经保存到sameDataArray数组了
      if (item[i] == item[i - 1] && sameDataArray[sameDataArray.length - 1] != item[i]) {
        sameDataArray.push(item[i]); //添加两个数组相同的元素
      }
    }
    return sameDataArray.length > 0;
  }

  /* 比较两个规则的compareType和value是否存在相等情况 */
  compareTypesValue(value1, value2, fieldsLength) {
    let isEqual = false;
    if (value1[0] == value2[0]) {
      if (value1[0] == 'eq') {
        isEqual = this.twoArraySameData(value1[1], value2[1]);
      } else if (value1[0] == 'notEq') {
        isEqual = !(
          value1[1].length + value2[1].length == fieldsLength && !this.twoArraySameData(value1[1], value2[1])
        );
      }
    } else {
      if (value1[0].indexOf('q') == -1 || value2[0].indexOf('q') == -1) return false;
      isEqual = value1[0] == 'eq' ? this.isContained(value2[1], value1[1]) : this.isContained(value1[1], value2[1]);
    }
    return isEqual;
  }

  isContained(a, b) {
    if (!(a instanceof Array) || !(b instanceof Array)) return false;
    let isContain = false;
    if (a.length < b.length) {
      isContain = true;
    } else {
      let aStr = a.toString();
      for (let i = 0, len = b.length; i < len; i++) {
        if (aStr.indexOf(b[i]) == -1) isContain = true;
      }
    }
    return isContain;
  }

  hidePopLayer() {
    this.setState({ showPopTip: !this.state.showPopTip });
  }
  handleFieldValChange = (data) => {
    this.setState({
      fieldValData: data
    })
  }
  render() {
    const self = this;
    const {
      data,
      showSettingPage,
      settingType,
      editRuleData,
      refreshFieldReq,
      chosenFieldReq,
      showPopTip,
      popTipContent,
      fieldValData,
    } = this.state;
    let tipsCfg = {
      hidden: showPopTip, //是否使用组件
      popType: '0' /**共2种：为"0"时，是提示弹层；为"1"时，是确认弹层**/,
      infoType:
        '1' /**共6种：为"0"时，是“对号”图标；为"1"时，是“叉号”图标；为"2"时，是“感叹号”图标；为"3"时，是“问号”图标；为"4"时，是“提示i”图标；为"5"时，是“灯泡”图标**/,
      manualClose: true, //为true时手动关闭，false自动关闭，默认false自动关闭
      disappearTime: '10000', //自动消失时间，输入需要的毫秒数，如‘1000’
      title: '保存失败',
      maxHeight: '',
      showMask: true,
      content: popTipContent,
      left: 125
    };
    let messageCfg = {
      type: 'error',
      message: '保存失败！',
      description: popTipContent,
      onClose: this.hidePopLayer,
      container: document.querySelector('.rule-setting-page'),
      // top: containerDom ? containerDom.getBoundingClientRect().y - 20 : '68.1'
    };
    return (
      <div className="linkage-setting">
        {showSettingPage ? (
          <RuleSettingPage
            ref={ruleSettingPage => (this.ruleSettingPage = ruleSettingPage)}
            data={data}
            editData={editRuleData}
            type={settingType}
            showPopTip={showPopTip}
            backToPrevious={this.backToPrevious}
            saveRuleData={this.saveRuleData}
            chosenFieldReq={chosenFieldReq}
            refReqStatus={refreshFieldReq}
            metaObjName={this.props.metaObjName}
            app={this.props.app}
            handleFieldValChange={this.handleFieldValChange}
            changeFieldStatus={this.changeFieldStatus}
          />
        ) : (
          <div className="show-rule-page">
            <RuleList
              data={data}
              app={this.props.app}
              editRules={this.editRules}
              deleteRules={this.deleteRules}
              metaObjName={this.props.metaObjName}
              fieldValData={fieldValData}
              />
            <div className="create-button">
              <span onClick={this.createRules}>
                <i>+</i>新增联动规则
              </span>
            </div>
            {/* <div className="back-btn">
              <BaseButton {...closeBtnCfg} />
            </div>
            <div className="save-btn">
              <BaseButton {...saveBtnCfg} />
            </div> */}
          </div>
        )}
        {showPopTip ? null : <Message {...messageCfg} /> }
        {/* <PopLayer {...tipsCfg} showHide={this.hidePopLayer} /> */}
      </div>
    );
  }
}

