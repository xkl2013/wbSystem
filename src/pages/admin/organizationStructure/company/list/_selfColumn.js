import styles from './index.less';
import {Typography} from 'antd';
import {getOptionName} from "@/utils/utils";
import {COMPANYS_TYPE, TAX_TYPE} from '@/utils/enum';
import AuthButton from '@/components/AuthButton'

const {Paragraph} = Typography;

// 获取table列表头
export function columnsFn(props) {
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      width: '30%',
      render: (text) => {
        return (
          <Paragraph ellipsis={{rows: 1, expandable: true}} style={{wordBreak: 'break-word', marginBottom: 0}}>
            {text}
          </Paragraph>
        )
      }
    },
    {
      title: '公司类型',
      dataIndex: 'companyType',
      render: (text) => {
        return getOptionName(COMPANYS_TYPE, text);
      }
    },
    {
      title: '税务资质',
      dataIndex: 'companyTaxType',
      render: (text) => {
        return getOptionName(TAX_TYPE, text);
      }
    },
    {
      title: '纳税人识别号',
      dataIndex: 'companyTaxpayerNumber',
    },
    {
      title: '员工数',
      dataIndex: 'companyUserTotal',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <>
          <AuthButton authority="/admin/orgStructure/company/detail"> <span className={styles.btnCls} onClick={() => props.checkData(record.companyId)}> 查看</span></AuthButton>
          <AuthButton authority="/admin/orgStructure/company/edit"> <span className={styles.btnCls} onClick={() => props.editData(record.companyId)}> 编辑</span></AuthButton>
          <AuthButton authority="/admin/orgStructure/company/delete"> <span className={styles.btnCls} onClick={() => props.delData(record)}> 删除</span></AuthButton>
          </>
        );
      },
    },
  ];
  return columns || [];
}
