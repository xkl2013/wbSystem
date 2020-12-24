/**
 *@author   zhangwenshuai
 *@date     2019-07-05 13:47
 **/
import mockJs from 'mockjs';

export default {
  'POST /contract/companies/list': mockJs.mock({
    code: 200,
    message: '成功',
    data: {
      list: [
        {
          id: 1,
          companyId: 12,
          companyName: '太阳北京'
        },
        {
          id: 2,
          companyId: 10,
          companyName: '听雨北京'
        },
      ],
      total: 2,
      pageSize: 20,
      pageNum: 1
    },
    success: true
  }),
  'GET /contract/projects/': mockJs.mock({
    code: 200,
    message: '成功',
    data: {
      list: [
        {
          id: 1,
          projectingId: 100,
          projectingName: '泰阳禾川007计划',
          projectingCategory: 2,
          projectingHeaderId: 1,
          projectingHeaderName: '张雷',
          projectingHeaderDepartName: '研发管理部-后端',
          projectingCustomerId: 1,
          projectingCustomerName: '雪碧',
          projectingTalentList: [
            {
              talentId: 1,
              talentName: 'AB',
              talentType: 0
            },
            {
              talentId: 2,
              talentName: '张三',
              talentType: 1
            },
          ],
          projectingTalentBudgets: [
            {
              id: 1,
              talentId: 1,
              talentName: 'AB',
              talentType: 0,
              'makeupCost': 1,
              'makeupCostType': 1,
              'propagationCost': 1,
              'propagationCostType': 1,
              'intermediaryCost': 1,
              'intermediaryCostType': 1,
              'tripCost': 1,
              'tripCostType': 2,
              'channelCost': 1,
              'channelCostType': 2,
              'otherCost': 1,
              'otherCostType': 3
            }
          ]
        }
      ],
      total: 1,
      pageSize: 20,
      pageNum: 1
    },
    success: true
  }),
  'GET /contract/project/100': mockJs.mock({
    code: 200,
    message: '成功',
    data: {
      id: 1,
      projectingId: 100,
      projectingName: '泰阳禾川007计划',
      projectingCategory: 2,
      projectingHeaderId: 1,
      projectingHeaderName: '张雷',
      projectingHeaderDepartName: '研发管理部-后端',
      projectingCustomerId: 1,
      projectingCustomerName: '雪碧',
      projectingTalentList: [
        {
          talentId: 1,
          talentName: 'AB',
          talentType: 0
        },
        {
          talentId: 2,
          talentName: '张三',
          talentType: 1
        },
      ],
      projectingTalentBudgets: [
        {
          id: 1,
          talentId: 1,
          talentName: 'AB',
          talentType: 0,
          'makeupCost': 1,
          'makeupCostType': 1,
          'propagationCost': 1,
          'propagationCostType': 1,
          'intermediaryCost': 1,
          'intermediaryCostType': 1,
          'tripCost': 1,
          'tripCostType': 2,
          'channelCost': 1,
          'channelCostType': 2,
          'otherCost': 1,
          'otherCostType': 3
        }
      ]
    },
    success: true
  }),
  'GET /contract/customers/': mockJs.mock({
    code: 200,
    message: '成功',
    data: {
      list: [
        {
          id: 1,
          customerName: '雪碧'
        },
        {
          id: 2,
          customerName: '唯品会'
        },
        {
          id: 3,
          customerName: '学习强国'
        },
      ],
      total: 1,
      pageSize: 20,
      pageNum: 1
    },
    success: true
  }),
  'POST /contract/contracts/list': mockJs.mock({
    code: 200,
    message: '成功',
    data: {
      list: [
        {
          id: 1,
          contractType: 1,
          contractPriType: 1,
          contractProjectingName: '泰阳禾川007计划',
          contractProjectingCategory: 1,
          contractName: 'hhh',
          contractSignType: 1,
          contractCustomerId: 1,
          contractCustomerName: '雪碧',
          contractCompanyId: 12,
          contractCompanyName: '太阳北京',
          contractNum: 1,
          contractSignDate: '2019-7-3',
        },
      ],
      total: 1,
      pageSize: 20,
      pageNum: 1
    },
    success: true
  }),
  'POST /contract/contracts/': mockJs.mock({
    code: 200,
    message: '成功',
    data: 1,
    success: true
  }),
  'POST /contract/contracts/1': mockJs.mock({
    code: 200,
    message: '成功',
    data: 1,
    success: true
  }),
  'GET /contract/contracts/1': mockJs.mock({
    code: 200,
    message: '成功',
    data: {
      "contractObligation": [{
        "talentName": "AB",
        "obligation": "010101",
        "obligationInfo": "you",
        "progress": 1,
        "brand": 1,
        "talentId": 1,
        "talentType": 0,
        "obligationType1": "01",
        "obligationType2": "0101",
        "obligationType3": "010101",
        "obligationPath": "代言-授权代言人-授权",
        "obligationDateStart": "2019-07-07 20:46:54",
        "obligationDateEnd": "2019-07-28 20:46:54",
        "key": 0
      }],
      "contractBack": [{
        "backPeriods": "12",
        "backRatio": 10,
        "backAmount": 10000,
        "backTime": "2019-07-30",
        "key": 0
      }],
      "contractDivision": [{
        "talentId": 1,
        "talentName": "AB",
        "talentType": 0,
        "key": 0,
        "divisionRatio": 20,
        "divisionAmount": 20000,
        "separateRatio": {
          "min": 40,
          "max": 60
        },
        "talentRatio": 40,
        "companyRatio": 60
      }, {
        "talentId": 2,
        "talentName": "张三",
        "talentType": 1,
        "key": 1,
        "divisionRatio": 10,
        "divisionAmount": 10000,
        "separateRatio": {
          "min": 10,
          "max": 90
        },
        "talentRatio": 10,
        "companyRatio": 90
      }],
      "contractTalentBudgets": [{
        "id": 1,
        "talentId": 1,
        "talentName": "AB",
        "talentType": 0,
        "makeupCost": 1,
        "makeupCostType": 1,
        "propagationCost": 1,
        "propagationCostType": 1,
        "intermediaryCost": 1,
        "intermediaryCostType": 1,
        "tripCost": 1,
        "tripCostType": 2,
        "channelCost": 1,
        "channelCostType": 2,
        "otherCost": 1,
        "otherCostType": 3,
        'invitationCost': 1,
        'invitationCostType': 1,
        'makeCost': 1,
        'makeCostType': 1,
        "key": "1_0"
      }],
      "contractFileList": [{
        "name": "u41.png",
        "value": "2b8ccb7d-113d-4bc6-b89c-f304f5fc5160.png"
      }],
      "contract": {
        id: 1,
        "contractType": 1,
        "contractPriType": 1,
        "contractProjectingName": "泰阳禾川007计划",
        "contractProjectingCategory": 2,
        "contractName": "007",
        "contractSignType": 1,
        "contractCustomerId": 1,
        "contractTotalAmount": 100000,
        "contractCompanyAmount": 1000,
        "contractHeaderName": "张雷",
        "contractHeaderDepartName": "研发管理部-后端",
        "contractCompanyId": 12,
        "contractBackCompanyId": 12,
        "contractNum": "1",
        "contractSignDate": "2019-07-07 20:46:37",
        "contractInvoiceProject": "007",
        "contractInvoiceOrder": 1,
        "contractProjectingId": 100,
        "contractCustomerName": "雪碧",
        "contractHeaderId": 1,
        "contractCompanyName": "太阳北京",
        "contractBackCompanyName": "太阳北京",
        "contractDateStart": "2019-07-07 20:46:33",
        "contractDateEnd": "2019-07-28 20:46:33",
        contractTalentList: [
          {
            talentId: 1,
            talentName: 'AB',
            talentType: 0
          },
          {
            talentId: 2,
            talentName: '张三',
            talentType: 1
          },
        ],
      }
    },
    success: true
  }),
}
