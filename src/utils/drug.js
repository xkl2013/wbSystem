class Drug {
    constructor(props) {
        this.props = props;
        this.dom = props.dom;
        this.disX = 0;
        this.disY = 0;
        this.initEvent();
    }

    initEvent = () => {
        if (!this.dom) return;
        this.dom.onmousedown = this.mousedown;
        this.dom.oncontextmenu = this.oncontextmenu;
    };

    oncontextmenu = (e) => {
        const event = e || window.event;
        event.preventDefault();
    };

    mousedown = (e) => {
        const event = e || window.event;
        // 设置偏移量
        this.disX = event.clientX - this.dom.offsetLeft;
        this.disY = event.clientY - this.dom.offsetTop;
        event.preventDefault();
        if (this.props.mousedown) {
            this.props.mousedown(e);
        }
        document.onmousemove = this.mousemove;
        document.onmouseup = this.mouseup;
    };

    mousemove = (e) => {
        const evt = e || window.event;
        // 有滚动条的时候要把滚动距离算在内
        // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        // div跟着走的时候，需要把鼠标按下时的那个相对坐标计算在内
        let toLeft = evt.clientX - this.disX;
        let toTop = evt.clientY - this.disY;
        const maxLeft = window.innerWidth + scrollLeft - this.dom.offsetWidth;
        const maxTop = window.innerHeight - this.dom.offsetHeight;
        if (toLeft < 0) {
            // 如果left值小于0，则置为0，防止div从左侧被拖出
            toLeft = 0;
        } else if (toLeft > maxLeft) {
            // 如果left值大于极限，则置为极限，防止div从右侧被拖出
            toLeft = maxLeft;
        }
        if (toTop < 0) {
            // 如果top值小于0，则置为0，防止div从左侧被拖出
            toTop = 0;
        } else if (toTop > maxTop) {
            // 如果top值大于极限，则置为极限，防止div从右侧被拖出
            toTop = maxTop;
        }
        // 设置一下框的位置
        this.dom.style.left = `${toLeft}px`;
        this.dom.style.top = `${toTop}px`;
    };

    mouseup = (e) => {
        if (this.props.mouseup) {
            this.props.mouseup(e);
        }
        document.onmousemove = null;
        document.onmouseup = null;
    };

    onDestroy = () => {
        this.dom.onmousedown = null;
        this.dom.oncontextmenu = null;
    };
}
export default Drug;
