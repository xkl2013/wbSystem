
/*
 * 新增/编辑分组表单
 * options:接口返回的话取接口值，没返回取本地枚举，正常情况下本地枚举和接口是一样的，本地枚举是为了容错处理
 */
import {FLOW_REPEAT,FLOW_COPY_WAY,FLOW_VACANCY,FLOW_APPROVER} from '@/utils/enum';

export const formatCols = (obj, flowOptions) => {
    return (
      [
        {
          columns: [
            [
              {
                label: '审批人去重',
                key: 'type1',
                allowClear:'false',
                checkOption: {
                  rules: [{
                    required: true,
                  }]
                },
                type: 'select',
                options: flowOptions.FLOW_TYPE_1||FLOW_APPROVER,
              },
            ],
            [
              {
                label: '审批人空缺时',
                key: 'type2',
                placeholder: '请填写分组描述',
                type: 'radio',
                options: flowOptions.FLOW_TYPE_2||FLOW_VACANCY,
                checkOption: {
                  rules: [{
                    required: true,
                  }]
                }
              },
            ],
            [
                {
                  label: '知会人抄送方式',
                  key: 'type3',
                  type: 'radio',
                  options: flowOptions.FLOW_TYPE_3||FLOW_COPY_WAY,
                  checkOption: {
                    rules: [{
                        required: true,
                      }]
                  }
                },
              ],
              [
                {
                  label: '审批人与发起人重复时',
                  key: 'type4',
                  type: 'radio',
                  options: flowOptions.FLOW_TYPE_4||FLOW_REPEAT,
                  checkOption: {
                    rules: [{
                      required: true,
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
  