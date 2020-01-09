const relyField = [{
    compareType: "eq",
    value: ["1"],
    displayContent: {
      fields: [],
      parts: ["9652bcfe-c6f7-4f9e-aa59-9d6af98e0b0c"]
    },
    readOnly: {
      fields: [],
      parts: ["9652bcfe-c6f7-4f9e-aa59-9d6af98e0b0c"]
    },
    hideContent: {
      fields: [],
      parts: ["Name", "Email" ,"9652bcfe-c6f7-4f9e-aa59-9d6af98e0b0c"]
    },
    requiredFields: ["Birthday"],
    notRequiredFields: ["HomePhone"]
  },
  {
    compareType: "eq",
    value: ["1"],
    displayContent: {
      fields: ["ProbationStartDate", "Probation", "IsHaveProbation"],
      parts: []
    },
    readOnly: {
      fields: [],
      parts: ["9652bcfe-c6f7-4f9e-aa59-9d6af98e0b0c"]
    },
    hideContent: {
      fields: [],
      parts: [] 
    },
    requiredFields: ["ProbationStopDate", "RegularizationDate", "Place"],
    notRequiredFields: [] 
  },
  {
    compareType: "eq",
    value: ["1"],
    displayContent: {
      fields: ["ProbationStartDate"],
      parts: []
    },
    readOnly: {
      fields: ["ProbationStartDate"],
      parts: ["9652bcfe-c6f7-4f9e-aa59-9d6af98e0b0c"]
    },
    hideContent: {
      fields: [],
      parts: [] 
    },
    requiredFields: [],
    notRequiredFields: ["Place", "OidJobGrade", "RegularizationDate"] 
  }
]
export default relyField; 
export const ds = [
  {Value: "1", Name: "选项A选项A选项A选项A选项A选项A"},
  {Value: "2", Name: "选项b"},
  {Value: "3", Name: "选项c"},
]
export const fieldValData = [
  {Value: "1", Name: "员工工号"},
  {Value: "2", Name: "组织编码"},
  {Value: "3", Name: "职务编码"},
  {Value: "4", Name: "职位编码"}
]
const relyField1 = [
  {
    compareType: "eq",
    value: ["1"],
    displayContent: {
      fields: [],
      parts: ["CreatedTime"]
    },
    readOnly: {
      fields: ["PreGenAmount"],
      parts: []
    },
    hideContent: {
      fields: [],
      parts: [] 
    },
    requiredFields: [],
    notRequiredFields: ["Place", "OidJobGrade", "RegularizationDate"] 
  }
]
const relyField2 = [
  {
    compareType: "eq",
    displayContent: {
      fields: [],
      parts: ["9d09e0f7-a70c-45f5-b3b6-00966021a1e8"]
    },
    hideContent: { fields: [],parts: []},
    notRequiredFields: [],
    readOnly: {
      fields: ["CreatedTime"],
      parts: []
    },
    requiredFields: [],
    value: ["1"]
  }, {
    compareType: "notEq",
    displayContent: {
      fields: [],
      parts: []
    },
    hideContent: { fields: [],parts: ["9d09e0f7-a70c-45f5-b3b6-00966021a1e8"]},
    notRequiredFields: [],
    readOnly: {
      fields: ["CreatedTime"],
      parts: []
    },
    requiredFields: [],
    value: ["2"]
  }]
export const rules=  [
  {
    aclField: "CodingItem",
    aclType: "setStatus",
    refreshFields: [],
    relyField: relyField1,
  },
  {
    aclField: "CodingItem",
    aclType: "setStatus",
    refreshFields: [],
    relyField: relyField2,
  },
]
export const data =  {
  formParts: [
    {id: "c415fa80-9977-43cb-a21c-5a7c9e328af2", label: "区块"},
    {id: "d4296895-53d6-416e-a104-0ab4c9dd37aa", label: "123(区块)"},
    {id: "9c87c74e-8891-4152-b3da-e650dbcdd301", label: "234(区块)"},
    {id: "b7eea8f9-67ab-47fa-911c-4677ef5967ce", label: "123(区块)"},
    {id: "27c7e067-f2c5-4bce-8323-b04c934e6ae5", label: "123(区块)"},
  ],
  fields: [
  {id: "Name",  label: "姓名", canRely: false, isMain: true},
  {id: "StaffEmail",  label: "邮箱", canRely: false, isMain: true},
  {id: "IDType",  label: "证件类型", canRely: true, isMain: true},
  {id: "IDNumber",  label: "证件号码", canRely: false, isMain: true},
  {id: "BlackAddReason",  label: "加黑原因", canRely: true, isMain: true},
  {id: "MobilePhone",  label: "手机号", canRely: false, isMain: true},
  {id: "CreatedTime",  label: "创建时间", canRely: false, isMain: true},
  {id: "ModifiedBy",  label: "修改人", canRely: false, isMain: true},
  {id: "Onwer",  label: "所有者", canRely: false, isMain: true},
  {id: "StdIsDeleted",  label: "删除状态", canRely: true, isMain: true},
    {
    id: "CreatedBy"
aclkey: undefined
label: "创建人"
canRely: false
isMain: true
isTriggerField: "false"
linkage_canrefresh: false
partId: "d4296895-53d6-416e-a104-0ab4c9dd37aa"
isRadio: false
    } ,
    {
    id: "ModifiedTime"
aclkey: undefined
label: "修改时间"
canRely: false
isMain: true
isTriggerField: "false"
linkage_canrefresh: false
partId: "d4296895-53d6-416e-a104-0ab4c9dd37aa"
isRadio: false
    } ,
    {
    id: "Birthday"
aclkey: undefined
label: "出生日期"
canRely: false
isMain: true
isTriggerField: "false"
linkage_canrefresh: false
partId: "d4296895-53d6-416e-a104-0ab4c9dd37aa"
isRadio: false
    },
 {
 id: "extfwbcgsj"
label: "富文本101115成功实践"
canRely: false
isMain: true
isTriggerField: "false"
linkage_canrefresh: false
partId: "d4296895-53d6-416e-a104-0ab4c9dd37aa"
isRadio: false
 },
  {
  id: "extgongshi0925"
  label: "公式101115创建0925"
  canRely: false
  isMain: true
  isTriggerField: "true"
  linkage_canrefresh: true
  partId: "d4296895-53d6-416e-a104-0ab4c9dd37aa"
  isRadio: false
  },
  {
  id: "WorkDate"
aclkey: undefined
label: "参加工作日期"
canRely: false
isMain: true
isTriggerField: "false"
linkage_canrefresh: false
partId: "9c87c74e-8891-4152-b3da-e650dbcdd301"
isRadio: false
  },
  {
    id: "BlackListSource"
    label: "黑名单来源"
    canRely: true
    isMain: true
    isTriggerField: "false"
    linkage_canrefresh: false
    partId: "b7eea8f9-67ab-47fa-911c-4677ef5967ce"
    isRadio: true
  },
  {
    id: "Gender",
    label: "性别0925",
    canRely: true,
    isMain: true,
    isTriggerField: "false",
    linkage_canrefresh: false,
    partId: "b7eea8f9-67ab-47fa-911c-4677ef5967ce",
    isRadio: false,
  },
  {
    id: "Nationality",
    label: "国籍",
    canRely: true,
    isMain: true,
    isTriggerField: "false",
    linkage_canrefresh: false,
    partId: "27c7e067-f2c5-4bce-8323-b04c934e6ae5",
    isRadio: false,
  },
  ]
}
