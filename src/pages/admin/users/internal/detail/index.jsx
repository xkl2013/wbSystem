import React, {Component} from 'react';
import FlexDetail from '@/components/flex-detail';
import styles from './index.less';
import {connect} from "dva";
import {getOptionName, birth2age} from '@/utils/utils';
import {
  CREDENTIAL_TYPE,
  SEX_TYPE,
  RESIDENCS_TYPE,
  MARRY_STATUES,
  BLOOD_TYPE,
  STAFF_STATUS,
  EMPLOY_TYPE,
  CLIENT_STATUS,
  JOB_POSITION
} from '@/utils/enum';
import {DATE_FORMAT} from '@/utils/constants';
import moment from 'moment';


const LabelWrap1 = [
  [
    {key: 'userRealName', label: '姓名'},
    {key: 'userChsName', label: '花名'},
    {
      key: 'userGender', label: '性别', render: (detail) => {
        return getOptionName(SEX_TYPE, detail.userGender);
      }
    },
    {
      key: 'employeeCredentialType', label: '证件类型', render: (detail) => {
        return getOptionName(CREDENTIAL_TYPE, detail.employeeCredentialType);
      }
    },
  ],
  [
    {key: 'employeeCredentialId', label: '证件号'},
    {key: 'userPhone', label: '手机号'},
    {
      key: 'userBirth', label: '出生日期', render: (detail) => {
        return detail.userBirth && moment(detail.userBirth).format(DATE_FORMAT);
      }
    },
    {key: 'employeeDomicilePlace', label: '户籍所在地'},
  ],
  [
    {
      key: 'employeeHouseholdType', label: '户口性质', render: (detail) => {
        return getOptionName(RESIDENCS_TYPE, detail.employeeHouseholdType);
      }
    },
    {key: 'employeeWorkFirst', label: '首次参加工作时间', render: (detail) => {
      return detail.employeeWorkFirst && moment(detail.employeeWorkFirst).format(DATE_FORMAT);
    }},
    {key: 'employeeCurrentAddress', label: '现居住地址'},
    {
      key: 'employeeMaritalStatus', label: '婚姻状况', render: (detail) => {
        return getOptionName(MARRY_STATUES, detail.employeeMaritalStatus);
      }
    },
  ],
  [
    {
      key: 'age', label: '年龄', render: (detail) => {
        return detail.userBirth && birth2age(detail.userBirth);
      }
    },
    {
      key: 'employeeBloodType', label: '血型', render: (detail) => {
        return getOptionName(BLOOD_TYPE, detail.employeeBloodType);
      }
    },
    {key: 'employeeNation', label: '民族'},
    {key: 'userEmail', label: '邮箱'},
  ],
  [ {key: 'userRoleList', label: '角色', render: (detail) => {
    const arr=[];
    detail.userRoleList&&detail.userRoleList.forEach((item)=>{
      arr.push(item.roleName)
    })
    return arr.join('，')
  }},{},{},{}],
]

const LabelWrap2 = [
  [
    {key: 'employeeBankName', label: '银行名称'},
    {key: 'employeeBankAddress', label: '开户行'},
    {key: 'employeeBankCard', label: '银行卡号'},
    {key: 'employeeBankRelate', label: '联行行号'},
  ],
]

const LabelWrap3 = [
  [
    {
      key: 'employeeEmploymentForm', label: '聘用形式', render: (detail) => {
        return getOptionName(EMPLOY_TYPE, detail.employeeEmploymentForm);
      }
    },
    {
      key: 'employeeEmploymentDate', label: '入职日期', render: (detail) => {
        return detail.employeeEmploymentDate && moment(detail.employeeEmploymentDate).format(DATE_FORMAT);
      }
    },
    {key: 'employeeCompanyName', label: '所属公司'},
    {key: 'employeeDepartmentName', label: '所属部门'},
  ],
  [
    {key: 'employeePosition', label: '岗位'},
    {
      key: 'employeeStatus', label: '员工状态', render: (detail) => {
        return getOptionName(STAFF_STATUS, detail.employeeStatus);
      }
    },
    {
      key: 'employeePromotionDate', label: '转正日期', render: (detail) => {
        return detail.employeePromotionDate && moment(detail.employeePromotionDate).format(DATE_FORMAT);
      }
    },
    {
      key: 'employeePositionLevel', label: '职级', render: (detail) => {
        return getOptionName(JOB_POSITION, detail.employeePositionLevel);
      }
    },
  ],
  [
    {
      key: 'employeeContractStart', label: '合同开始日期', render: (detail) => {
        return detail.employeeContractStart && moment(detail.employeeContractStart).format(DATE_FORMAT);
      }
    },
    {
      key: 'employeeContractEnd', label: '合同结束日期', render: (detail) => {
        return detail.employeeContractEnd && moment(detail.employeeContractEnd).format(DATE_FORMAT);
      }
    },
    {key: 'employeeProbationaryPeriod', label: '试用期限'},
    {key: 'employeeEmployTerm', label: '聘用期限'},
  ],
  [
    {
      key: 'employeePromotionDate', label: '实际转正日期', render: (detail) => {
        return detail.employeePromotionDate && moment(detail.employeePromotionDate).format(DATE_FORMAT);
      }
    },
    {
      key: 'employeeLeaveDate', label: '离职日期', render: (detail) => {
        return detail.employeeLeaveDate && moment(detail.employeeLeaveDate).format(DATE_FORMAT);
      }
    },
    {key: 'employeeLeaveReason', label: '离职原因'},
    {key: 'employeeLeaveRemark', label: '备注'},
  ],
  [
    {key: 'userTravelLevelName', label: '差旅标准'},
  ]
]

const LabelWrap4 = [
  [
    {
      key: 'visitType', label: '访问类别', render: (detail) => {
        return getOptionName(CLIENT_STATUS, detail.visitType);
      }
    },
  ],
]

@connect(({internal_user}) => ({
  formData: internal_user.formData
}))
class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detail: {}
    };
  }

  componentDidMount() {
    this.getData();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.props.dispatch({
      type: 'header/saveHeaderName',
      payload: { 
        title: '用户详情',
        subTitle: '员工编码' + nextProps.formData.userCode
      }
    })
  }
  getData = () => {
    const {query} = this.props.location;
    this.props.dispatch({
      type: 'internal_user/getUserDetail',
      payload: {
        id: query && query.id
      }
    })
  };

  render() {
    const {formData} = this.props;
    return (
      <div className={styles.detailPage}>
        <FlexDetail LabelWrap={LabelWrap1} detail={formData} title="基本信息"/>
        <FlexDetail LabelWrap={LabelWrap2} detail={formData} title="工资/社保帐号信息"/>
        <FlexDetail LabelWrap={LabelWrap3} detail={formData} title="岗位信息"/>
        <FlexDetail LabelWrap={LabelWrap4} detail={formData} title="访问权限"/>
      </div>
    )
  }
}

export default Detail;
