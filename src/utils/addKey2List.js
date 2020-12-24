export default function (data) {
    data.forEach((item, i) => {
        const itemData = item;
        itemData.key = `key${i}`;
        return itemData;
    });
    return data;
}
