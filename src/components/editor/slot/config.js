import Tag from '../Tag1';
import File from '../File';

export const config = {
    '1': {
        name: '标签',
        component: Tag,
        icon: require('@/assets/comment/tag.png'),
        selectedIcon: require('@/assets/comment/selectedTag.png'),
    },
    '2': {
        name: '附件',
        component: File,
        componentAttr: {
            sortReverse: true
        },
        icon: require('@/assets/comment/file.png'),
        selectedIcon: require('@/assets/comment/selectedFile.png'),
    },
}
