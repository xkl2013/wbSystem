/**
 * 新增/编辑form表单cols
 * */


export function FORMCOLS(options){
  return [
    {
      columns: [
        [
          {
            label: '选择分组', key: 'groupId',  placeholder: '选择分组',type: 'select', options
          },
        ],
      ]
    }
  ]
}
  
  export default {
    FORMCOLS
  };
  