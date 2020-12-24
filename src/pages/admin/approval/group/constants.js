
/*
 * 新增/编辑分组表单
 * 
 */

export const formatCols = (obj, editType) => {
  return (
    [
      {
        columns: [
          [
            {
              label: '分组名称',
              key: 'name',
              checkOption: {
                rules: [{
                  required: true, whitespace: true,
                  message: '分组名称不能为空'
                }, {
                  max: 20,
                  message: '至多输入20个字'
                }]
              },
              placeholder: '请输入分组名称',
            },
          ],
          [
            {
              label: '分组描述',
              key: 'remark',
              placeholder: '请填写分组描述',
              type: 'textarea',
              componentAttr: {
                rows: 3,
              },
              checkOption: {
                rules: [{
                  required: true, whitespace: true,
                  message: '分组描述不能为空'
                }, {
                  max: 140,
                  message: '至多输入140个字'
                }]
              }
            },
          ],
        ]
      }
    ]
  )
}

export default {
  formatCols
};
