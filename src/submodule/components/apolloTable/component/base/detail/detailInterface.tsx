export interface CommonProps {
    value: any[] | undefined;
    placeholder?: string;
    formatter?: Function;
    componentAttr?: any;
    className?:string;
}
export interface InputProps extends CommonProps {
    maxLength: number;
}
export interface TextAreaProps extends InputProps {}
export interface SearchProps extends CommonProps {
    componentAttr?: {
        isMultiple?: boolean;
    };
}
export interface SelectProps extends CommonProps {
    componentAttr?: {
        isMultiple?: boolean;
        options?: any[];
    };
}
export interface TagProps extends CommonProps {
    maxTagCount?: number;
    options?: any[];
}
export interface RateProps extends CommonProps {}
export interface NumberProps extends CommonProps {}
export interface DateProps extends CommonProps {}
export interface LinkProps extends CommonProps {}
export interface PercentageProps extends CommonProps {}
export interface UploadProps extends CommonProps {
    width?: number;
}
