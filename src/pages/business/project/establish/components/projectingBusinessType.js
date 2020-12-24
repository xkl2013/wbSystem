const renderProjectingBusinessType = (obj) => {
    const { projectingAppointmentDTOList } = obj.formData;
    return {
        label: '合作类型',
        key: 'projectingBusinessTypeName',
        placeholder: '请输入',
        disabled: true,
        type: 'textarea',
        componentAttr: {
            autoSize: true,
        },
        setFormat: () => {
            const arr = [];
            if (Array.isArray(projectingAppointmentDTOList)) {
                projectingAppointmentDTOList.map((item) => {
                    if (!arr.includes(item.projectingAppointmentName)) {
                        arr.push(item.projectingAppointmentName);
                    }
                });
            }
            return arr.join('，');
        },
    };
};
export default renderProjectingBusinessType;
