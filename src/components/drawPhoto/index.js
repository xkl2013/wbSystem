import EXIF from 'exif-js';
/*
* 此方法用于获取图片旋转信息,使用exif插件
*/
function getPhotoOrientation(img) {
    var orient;
    EXIF.getData(img, function () {
        orient = EXIF.getTag(this, 'Orientation');
    });
    return orient;
}
/*
* 此方法用于处理ios相机拍摄方向错位造成的bug
*/
export const drawPhoto = (imgUrl, x, y, w, h) => {
    const img=new Image();
    img.src=imgUrl;
    img.onload=()=>{
        const origin=getPhotoOrientation(img);
        console.log(origin)
    }
    //获取照片的拍摄方向
   

}