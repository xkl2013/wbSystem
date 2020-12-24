
export const getParentKey = (key:any,tree:any):any => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item:any) => item.id === key)) {
        parentKey = node.id;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

let allNodes:any=[];
export const handleUserData=(data=[])=>{
    const users=getAllUaers(data);
    const orgData=formateAllData(data);
return {users,orgData,allNodes};
}
export const getAllUaers=(data=[])=>{
let users:any=[];
if(!data||data.length===0)return;
for(let i=0;i<data.length;i++){
    const obj:any=data[i];
    let newArr=Array.isArray(obj.userList)?obj.userList:[];
    newArr=newArr.map((item:any)=>({
       ...item,
       id:String(item.userId),
       name:item.userChsName||'',

    }));
    users=[...users,...newArr];
    if(obj.subDepartmentList&&obj.subDepartmentList.length>0){
        users=[...users,... getAllUaers(obj.subDepartmentList)];
    }
}
return users
}

export const formateAllData=(data:any)=>{
    let users:any=[];
if(!data||data.length===0)return;
for(let i=0;i<data.length;i++){
    const obj:any=data[i];
    obj.id='org-name'+obj.departmentId;
    obj.symbol='org';
    obj.name=obj.departmentName;
    let newArr=Array.isArray(obj.userList)?obj.userList:[];
    newArr=newArr.map((item:any)=>({
       ...item,
       id:String(item.userId),
       name:item.userChsName||'',
       children:[],
       symbol:'user',
    }));
obj.children=[...newArr];
allNodes=[...allNodes,...newArr];
    if(obj.subDepartmentList&&obj.subDepartmentList.length>0){
        obj.children=[...formateAllData(obj.subDepartmentList), ...obj.children];
        allNodes=[...allNodes,...obj.children];
    }
    users.push(obj);
}
return users
}
export const checkoutChildren=(data:any)=>{
    let users:any=[];
    if(!data||data.length===0)return;
    for(let i=0;i<data.length;i++){
        const obj:any=data[i];
        if(obj.symbol==='user'){
            users.push(obj)
        }
        if(obj.children&&obj.children.length>0){
            users=[...users,... checkoutChildren(obj.children)];
        }
    }
    return users
}
export const checkoutParentNode=(data=[])=>{
let returnData:any[]=[];
data.forEach((item:any)=>{
    const parent=item.parent||item;
    if(!returnData.some((ls:any)=>ls.id===parent.id)){
        const newArr=[...parent.children,parent];
        returnData=returnData.concat([],newArr);
    }
});
return returnData
}
