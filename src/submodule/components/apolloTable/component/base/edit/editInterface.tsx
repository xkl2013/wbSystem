import { TextAreaProps, InputProps } from 'antd/es/input';
import { InputNumberProps } from 'antd/es/input-number';
import { SelectProps } from 'antd/es/select';
import { CheckboxProps, CheckboxGroupProps } from 'antd/es/checkbox';
import { CascaderProps } from 'antd/es/cascader';
import { RateProps } from 'antd/es/rate';
import { UploadProps } from 'antd/es/upload';

export interface LinkData {
    text?: string;
    value: string;
}
export interface CommonProps {
    onEmitChange?: Function;
    isMobile?: boolean;
    origin?: string;
    tableId?: number;
    rowId?: number;
    onBlurFn?: Function;
    columnConfig?: any;
}
export interface ApolloInputProps extends InputProps, CommonProps {
    value: string | undefined;
}
export interface ApolloLinkProps extends CommonProps {
    value: LinkData[];
    onChange: Function;
}
export interface ApolloTextAreaProps extends TextAreaProps, CommonProps {
    value: string | undefined;
    getDetail?: Function;
    maxPopHeight?: number;
}
export interface ApolloSearchProps extends SelectProps<any>, CommonProps {
    type: string;
    request: Function;
    isMultiple?: boolean;
    maxCount?: number;
    maxPopHeight?: number;
}
export interface ApolloInputSearchProps extends SelectProps<any>, CommonProps {
    type: string;
    request: Function;
}
export interface ApolloSelectProps extends SelectProps<any>, CommonProps {
    isMultiple?: boolean;
    options?: any[];
    maxPopHeight?: number;
}
export interface ApolloNumberProps extends InputNumberProps, CommonProps {}
export interface ApolloCheckboxProps extends CheckboxProps, CommonProps {
    label: string;
}
export interface ApolloCheckboxGroupProps extends CheckboxGroupProps, CommonProps {}
export interface ApolloTreeSelectProps extends CommonProps {
    isMultiple?: boolean;
    onChange: Function;
    value: any;
    request: Function;
    list?: any[];
}
export interface ApolloCascaderProps extends CascaderProps, CommonProps {
    requestCode: number;
    request: Function;
}
export interface ApolloRateProps extends RateProps, CommonProps {}
export interface ApolloUploadProps extends UploadProps, CommonProps {
    isMultiple?: boolean;
    value: any;
}
