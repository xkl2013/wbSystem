/**
 * 新增/编辑form表单cols
 * */


export const FORMCOLS = [
    {
      columns: [
        [
          {
            label: '员工状态', key: 'employee',  placeholder: '正式员工',disabled: true
          },
        ],
        [
          {
            label: '实际转正日期', key: 'employeePromotionDate',type:'date', checkOption: {
                rules: [{
                  required: true,
                  message: '实际转正日期不能为空'
                }]
              },placeholder: '实际转正'
          },
        ],
      ]
    }
  ]
  
  export default {
    FORMCOLS
  };
  