const relyField = [{
    compareType: "eq",
    value: ["1"],
    displayContent: {
      fields: [],
      parts: ["9652bcfe-c6f7-4f9e-aa59-9d6af98e0b0c"]
    },
    readonlyContent: {
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
    value: [],
    displayContent: {
      fields: ["ProbationStartDate", "Probation", "IsHaveProbation"],
      parts: []
    },
    readonlyContent: {
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
    readonlyContent: {
      fields: [],
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
