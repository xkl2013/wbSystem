import moment from 'moment';
export const config = {

    input: {
        getFormate: (val: string) => val,
    },
    date: {
        getFormate: (date: any) => {
            return date ? moment(date).format('YYYY-MM-DD') : date
        }
    },
    checkbox: {
        getFormate: (arr: any, options: any) => {
            const temp: any = [];
            arr.map((key: any) => {
                temp.push({
                    id: key,
                    name: (
                        options.find((item: any) => {
                            return String(item.id) === String(key);
                        }) || {}
                    ).name,
                });
            });
            return temp;
        }
    }

}