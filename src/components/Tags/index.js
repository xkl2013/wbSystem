import React from 'react';
import { Tag, Input, Tooltip, Icon, message } from 'antd';

class EditableTagGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.value || [],
      inputVisible: false,
      inputValue: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.value!==nextProps.value&&nextProps.value){
      this.setState({
        tags: nextProps.value
      })
    }
    
  }
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.props.onChange(tags)
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    if (!inputValue || !inputValue.trim()) {
      this.setState({
        inputVisible: false,
        inputValue: '',
      });
      return
    }
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    const { onChange } = this.props;
    onChange(tags)
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div style={{ width: '1000px' }}>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}` : tag}
            </Tag>
          );
          return tagElem
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            maxLength={this.props.maxLength || 20}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
            <Icon type="plus" /> New Tag
          </Tag>
        )}
      </div>
    );
  }
}
export default EditableTagGroup;