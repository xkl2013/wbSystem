/**
 * 新增/编辑form表单cols
 * */


export const FORMCOLS = [
    {
      columns: [
        [
          {
            label: '员工状态', key: 'leave',  placeholder: '离职',disabled: true
          },
        ],
        [
          {
            label: '离职日期', key: 'employeeLeaveDate', type:'date',checkOption: {
                rules: [{
                  required: true,
                  message: '离职日期不能为空'
                }]
              },placeholder: '离职日期'
          },
        ],
        [
          {
            label: '离职原因', key: 'employeeLeaveReason',checkOption: {
                rules: [{
                  required: true,
                  message: '离职原因不能为空'
                }]
              }, placeholder: '请输入离职原因'
          },
        ],
        [
          {
            label: '备注', key: 'employeeLeaveRemark', placeholder: '备注内容'
          },
        ],
      ]
    }
  ]
  
  export default {
    FORMCOLS
  };
  