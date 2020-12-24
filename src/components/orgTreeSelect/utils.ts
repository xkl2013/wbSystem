export const getAllUaers=(data=[])=>{
    let users:any=[];
    if(!data||data.length===0)return;
    for(let i=0;i<data.length;i++){
        const obj:any=data[i];
        let newArr=Array.isArray(obj.userList)?obj.userList:[];
        newArr=newArr.map((item:any)=>({
           ...item,
           id:String(item.userId),
           name:item.userChsName,
    
        }));
        users=[...users,...newArr];
        if(obj.subDepartmentList&&obj.subDepartmentList.length>0){
            users=[...users,... getAllUaers(obj.subDepartmentList)];
        }
    }
    return users
    }
