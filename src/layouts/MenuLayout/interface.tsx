export interface State {
    marginLeft: number,
    openKeys: string[],
    collapse: boolean,
    menuOpenKeys: string[],
}
export interface Props {
    menuData: any,
    location?: any,
    breadcrumbNameMap: any,
    history: any,
    approvalMessage?: any,
    approvalCount?: { participate: number },
    messageCount?: any,
    settings?: any,
}
