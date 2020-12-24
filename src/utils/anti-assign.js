import _ from 'lodash';
export default function(src,deta){
    var result=_.assign({},src);
    if(src==null||typeof src!='object'){
        return result;
    }
    if(typeof deta=='string'){
        deta=deta.split(',');
    }
    if(Array.isArray(deta)){
        var temp={};
        deta.map(item=>{
            temp[item]=null;
        });
        deta=temp;
    }
    Object.keys(result).map(key=>{
        if(deta.hasOwnProperty(key)){
            delete result[key];
        }
    });
    return result;
};