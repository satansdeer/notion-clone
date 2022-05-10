export const SwitchNode = ({ type, children }: any) => {
  return children.find((child: any) => {
    return child.props.supportedTypes.includes(type);
  });
};
